export interface OccasionData {
  title: string;
  description: string;
  imagePrompt: string;
  significanceLevel: 'High' | 'Medium' | 'Low';
  themeColor?: string;
}

export interface GeminiError {
  message: string;
}