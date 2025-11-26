import React, { useState } from 'react';
import { DateSelector } from './components/DateSelector';
import { OccasionCard } from './components/OccasionCard';
import { identifyOccasion, generateOccasionImage } from './services/geminiService';
import { OccasionData } from './types';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState<'idle' | 'identifying' | 'painting' | 'complete'>('idle');
  const [occasionData, setOccasionData] = useState<OccasionData | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDateSubmit = async (date: string) => {
    try {
      setLoadingStep('identifying');
      setError(null);
      setOccasionData(null);
      setImageData(null);
      setSelectedDate(date);

      // Step 1: Identify the occasion
      const occasion = await identifyOccasion(date);
      setOccasionData(occasion);

      // Step 2: Generate the image
      setLoadingStep('painting');
      const imageBase64 = await generateOccasionImage(occasion.imagePrompt);
      setImageData(imageBase64);
      
      setLoadingStep('complete');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while consulting the archives.');
      setLoadingStep('idle');
    }
  };

  const handleReset = () => {
    setSelectedDate('');
    setLoadingStep('idle');
    setOccasionData(null);
    setImageData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-900/20 rounded-full blur-[128px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-500 mb-4 tracking-tight drop-shadow-sm">
            Chronos Canvas
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Every date holds a story. Enter a day to reveal its essence through AI-crafted art.
          </p>
        </header>

        {/* Input Section - Only show if not processing/complete */}
        {loadingStep === 'idle' && (
          <div className="w-full max-w-md animate-fade-in-up">
            <DateSelector onSubmit={handleDateSubmit} />
          </div>
        )}

        {/* Loading State */}
        {(loadingStep === 'identifying' || loadingStep === 'painting') && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center py-12 animate-pulse">
            <Loader step={loadingStep} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-l-4 border-red-500 my-8">
            <h3 className="text-xl font-serif text-red-200 mb-2">The Stars Are Clouded</h3>
            <p className="text-slate-300 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors border border-slate-600"
            >
              Try Another Date
            </button>
          </div>
        )}

        {/* Result Section */}
        {loadingStep === 'complete' && occasionData && (
          <div className="w-full animate-fade-in">
            <OccasionCard 
              date={selectedDate}
              occasion={occasionData}
              image={imageData}
              onReset={handleReset}
            />
          </div>
        )}

      </main>
      
      <footer className="relative z-10 py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;