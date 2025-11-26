import { GoogleGenAI, Type } from "@google/genai";
import { OccasionData } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

/**
 * Step 1: Identify the occasion for a given date.
 * Uses a Flash model for fast reasoning and JSON output.
 */
export const identifyOccasion = async (date: string): Promise<OccasionData> => {
  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are a sophisticated historian and cultural expert with an eye for artistic visual themes. 
    Your goal is to identify the single most significant, visually evocative occasion, holiday, historical event, or observance for a specific date provided by the user.
    
    If the date has a major global holiday (e.g., Christmas, New Year, Halloween), use that.
    If not, look for significant historical events.
    If the date is relatively quiet, identify a minor observance, an astrological event, or invent a "Day of [Season/Nature]" theme that captures the feeling of that time of year (e.g., "The First Frost", "Midsummer Bloom").
    
    You must return a JSON object containing:
    - title: The name of the occasion.
    - description: A poetic, 2-sentence description of the significance.
    - imagePrompt: A highly detailed, artistic image generation prompt describing a decorative, symbolic illustration for this occasion. Focus on lighting, composition, style (e.g., Art Nouveau, Surrealism, Digital Oil Painting), and mood. Do not include text in the image prompt.
    - significanceLevel: 'High', 'Medium', or 'Low'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `The date is: ${date}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            significanceLevel: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          },
          required: ["title", "description", "imagePrompt", "significanceLevel"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(response.text) as OccasionData;
  } catch (error) {
    console.error("Error identifying occasion:", error);
    throw new Error("Failed to interpret the stars for this date.");
  }
};

/**
 * Step 2: Generate an image for the identified occasion.
 * Uses the Image generation model.
 */
export const generateOccasionImage = async (prompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image for standard decorative generation.
  // Can upgrade to 'gemini-3-pro-image-preview' if higher fidelity is needed, 
  // but flash-image is usually sufficient for stylized art.
  const modelId = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: prompt + ", masterpiece, high resolution, 8k, centered composition, no text, decorative border style" }
        ]
      },
      config: {
        // Image generation parameters are often implicit in the prompt for this model,
        // but we can set aspect ratio if using tools, though here we just want the raw generation.
        // For gemini-2.5-flash-image, we just call generateContent.
      }
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image candidate generated.");
    }

    const parts = candidates[0].content.parts;
    let base64Image = "";

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        // Depending on the model, the mimetype might be image/png or image/jpeg
        const mimeType = part.inlineData.mimeType || "image/png";
        return `data:${mimeType};base64,${base64Image}`;
      }
    }

    if (!base64Image) {
        // Fallback or check text if refusal
        const textPart = parts.find(p => p.text);
        if (textPart) {
            console.warn("Model returned text instead of image:", textPart.text);
            throw new Error("The oracle refused to paint this request (Safety/Policy).");
        }
        throw new Error("Failed to retrieve image data.");
    }
    
    return base64Image;

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("The canvas remained blank. Please try again.");
  }
};