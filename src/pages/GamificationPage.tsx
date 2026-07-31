import React, { useState } from 'react';
import { BadgeGrid } from '../components/gamification/BadgeGrid';
import { GlassCard } from '../components/common/GlassCard';
import { NeonButton } from '../components/common/NeonButton';
import { useGamification } from '../contexts/GamificationContext';
import { Trophy, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { DailyRewardModal } from '../components/gamification/DailyRewardModal';

export const GamificationPage: React.FC = () => {
  const { xp, coins, levelInfo } = useGamification();
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
            <span>🏆 Hero Ranks & Badges Roadmap</span>
            <span className="text-[#FF69B4] text-base">🎀</span>
          </h2>
          <p className="text-xs text-slate-400">
            Level up from Rookie Gotham Paws to Kitty Bat Overseer
          </p>
        </div>

        <NeonButton
          variant="yellow"
          size="md"
          icon={<Gift className="w-4 h-4" />}
          onClick={() => setIsRewardOpen(true)}
        >
          Daily Reward Crate
        </NeonButton>
      </div>

      {/* Hero Rank Roadmap Banner */}
      <GlassCard glowColor="pink" className="p-6 bg-gradient-to-r from-[#1b1428] via-[#121319] to-[#1c152a]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF69B4]/20 border-2 border-[#FF69B4] flex items-center justify-center text-3xl shadow-[0_0_20px_#FF69B4]">
              🦇🎀
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#FF69B4] uppercase tracking-widest">
                Current Hero Level {levelInfo.level}
              </span>
              <h3 className="text-2xl font-extrabold text-white font-mono">{levelInfo.rankTitle}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP to next level
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-mono">Total XP</span>
              <span className="text-xl font-extrabold text-[#F4D03F] font-mono">{xp}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block font-mono">Bat Coins</span>
              <span className="text-xl font-extrabold text-[#FF69B4] font-mono">🪙 {coins}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3 mt-6 overflow-hidden border border-white/10 p-0.5">
          <div
            className="bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_#FF69B4]"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </GlassCard>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F4D03F]" />
          Gotham Hero Trophies & Achievement Badges
        </h3>
        <BadgeGrid userLevel={levelInfo.level} />
      </div>

      <DailyRewardModal isOpen={isRewardOpen} onClose={() => setIsRewardOpen(false)} />
    </div>
  );
};
