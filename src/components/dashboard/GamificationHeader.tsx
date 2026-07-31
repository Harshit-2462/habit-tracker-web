import React, { useState } from 'react';
import { Sparkles, Trophy, Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { BATKITTY_QUOTES } from '../../utils/xpUtils';

export const GamificationHeader: React.FC = () => {
  const { profile } = useAuth();
  const { xp, coins, levelInfo } = useGamification();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = BATKITTY_QUOTES[quoteIndex];

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % BATKITTY_QUOTES.length);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border-[#FF69B4]/30 bg-gradient-to-r from-[#171324] via-[#121319] to-[#1a1326] relative overflow-hidden shadow-[0_0_25px_rgba(255,105,180,0.15)] mb-8">
      {/* Decorative Gotham Bat & Kitty watermark */}
      <div className="absolute top-2 right-4 text-7xl opacity-5 select-none font-black text-[#F4D03F]">
        🦇🎀
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* User Hero Greeting & Rank */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
              alt="Profile Avatar"
              className="w-16 h-16 rounded-2xl border-2 border-[#FF69B4] object-cover shadow-[0_0_15px_#FF69B4]"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#F4D03F] text-slate-950 text-[10px] font-black font-mono shadow-md">
              Lvl {levelInfo.level}
            </span>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Welcome back, {profile?.full_name || 'Gotham Hero'}!</span>
              <span className="animate-bounce text-lg">🎀</span>
            </h2>
            <span className="text-xs font-bold text-[#F4D03F] tracking-wide mt-0.5 flex items-center gap-1 font-mono">
              <Trophy className="w-3.5 h-3.5 text-[#FF69B4]" />
              {levelInfo.rankTitle}
            </span>
          </div>
        </div>

        {/* Dynamic BatKitty Quote Box */}
        <div className="flex-1 max-w-md bg-white/5 rounded-2xl p-3 border border-white/10 relative group">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <QuoteIcon className="w-4 h-4 text-[#FF69B4] shrink-0 mt-1" />
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "{currentQuote.quote}"
              </p>
            </div>
            <button
              onClick={cycleQuote}
              title="Next Motivational Quote"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-[#F4D03F] transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
            <span className="text-[#FFB6C1]">— {currentQuote.author}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#9B51E0]/20 text-[#9B51E0] border border-[#9B51E0]/30">
              {currentQuote.badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
