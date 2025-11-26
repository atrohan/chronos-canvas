import React from 'react';

interface LoaderProps {
  step: 'identifying' | 'painting';
}

export const Loader: React.FC<LoaderProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-t-gold-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Inner Pulse */}
        <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-gold-200 animate-pulse">
          {step === 'identifying' ? 'Consulting the Archives...' : 'Weaving the Tapestry...'}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          {step === 'identifying' 
            ? 'Our AI is searching history and culture for the perfect match.' 
            : 'Generating a unique, artistic representation of this day.'}
        </p>
      </div>
    </div>
  );
};