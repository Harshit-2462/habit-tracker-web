import React from 'react';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakFlame: React.FC<StreakFlameProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#FF69B4]/15 via-[#F4D03F]/10 to-transparent border border-[#FF69B4]/30 shadow-[0_0_20px_rgba(255,105,180,0.15)]">
      <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#FF69B4] to-[#F4D03F] text-slate-950 shadow-[0_0_15px_rgba(255,105,180,0.5)] animate-pulse">
        <Flame className="w-6 h-6 fill-current text-[#F4D03F]" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-white font-mono">{currentStreak} Days</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF69B4]/20 border border-[#FF69B4]/40 text-[#FF69B4] font-bold">
            🔥 STREAK
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Personal Record: <strong className="text-[#F4D03F]">{longestStreak} Days</strong>
        </span>
      </div>
    </div>
  );
};
