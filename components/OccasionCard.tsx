import React, { useState } from 'react';
import { OccasionData } from '../types';

interface OccasionCardProps {
  date: string;
  occasion: OccasionData;
  image: string | null;
  onReset: () => void;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({ date, occasion, image, onReset }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center w-full">
      
      {/* Image Container */}
      <div className="lg:w-1/2 flex-shrink-0 animate-fade-in-right delay-100">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-800 aspect-[1/1] group">
          {!isImageLoaded && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
               <span className="text-gold-500 animate-pulse">Unveiling...</span>
             </div>
          )}
          {image && (
            <img 
              src={image} 
              alt={occasion.title}
              className={`w-full h-full object-cover transition-all duration-1000 ease-out transform hover:scale-105 ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
          {/* Overlay Gradient for Text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>

      {/* Text Content */}
      <div className="lg:w-1/2 flex flex-col justify-center animate-fade-in-left delay-200">
        <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-xl h-full flex flex-col items-start text-left border-t border-white/10">
          
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-gold-400 uppercase border border-gold-400/30 rounded-full mb-4">
              {date}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            {occasion.title}
          </h2>

          <div className="w-16 h-1 bg-gold-500 mb-6"></div>

          <p className="text-lg text-slate-300 leading-relaxed font-light mb-8 italic">
            "{occasion.description}"
          </p>

          <div className="mt-auto pt-6 w-full border-t border-white/5 flex justify-between items-center">
             <span className="text-xs text-slate-500 uppercase tracking-widest">
               Significance: {occasion.significanceLevel}
             </span>
             
             <button 
                onClick={onReset}
                className="text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-2 group"
             >
                <span>Select Another Date</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};