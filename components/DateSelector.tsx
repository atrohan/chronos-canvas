import React, { useState } from 'react';

interface DateSelectorProps {
  onSubmit: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ onSubmit }) => {
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
        // Format date to a readable string for the AI (e.g., "October 5")
        const dateObj = new Date(date);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        const readableDate = dateObj.toLocaleDateString('en-US', options);
        onSubmit(readableDate);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl text-center border border-white/10">
      <h2 className="text-2xl font-serif text-gold-200 mb-6">Choose a moment in time</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
            <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 text-white text-xl p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all placeholder-slate-400 text-center"
            />
        </div>
        
        <button
          type="submit"
          disabled={!date}
          className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-slate-900 font-bold text-lg py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
        >
          Reveal Occasion
        </button>
      </form>
    </div>
  );
};