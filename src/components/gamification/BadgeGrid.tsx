import React from 'react';
import { Flame, Zap, ShieldCheck, Crown, Award, Moon, Sun, Lock } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface BadgeGridProps {
  userLevel: number;
}

const BADGES = [
  { code: 'FIRST_HABIT', title: 'Bat Signal Lit', desc: 'Created your first habit!', icon: Flame, color: '#F4D03F', unlocked: true },
  { code: 'STREAK_3', title: 'Kitty Paw Sprint', desc: '3-day completion streak!', icon: Zap, color: '#FF69B4', unlocked: true },
  { code: 'STREAK_7', title: 'Gotham Guardian', desc: '7-day streak master!', icon: ShieldCheck, color: '#9B51E0', unlocked: true },
  { code: 'STREAK_30', title: 'Dark Knight Legend', desc: '30 consecutive days of habits!', icon: Crown, color: '#F4D03F', unlocked: false },
  { code: 'TOTAL_50', title: 'Bat-Belt Master', desc: '50 habit logs in total!', icon: Award, color: '#00E5FF', unlocked: true },
  { code: 'NIGHT_OWL', title: 'Midnight Meow', desc: 'Completed a habit after 10 PM!', icon: Moon, color: '#FFB6C1', unlocked: true },
  { code: 'EARLY_BIRD', title: 'Dawn Patrol', desc: 'Completed a habit before 7 AM!', icon: Sun, color: '#F4D03F', unlocked: false },
];

export const BadgeGrid: React.FC<BadgeGridProps> = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {BADGES.map(b => (
        <GlassCard
          key={b.code}
          glowColor={b.unlocked ? 'pink' : 'none'}
          className={`relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all ${
            b.unlocked
              ? 'border-[#FF69B4]/40 bg-gradient-to-b from-[#1c1428] to-[#121319]'
              : 'border-white/5 opacity-50 grayscale'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border ${
              b.unlocked
                ? 'border-white/20 shadow-[0_0_15px_rgba(255,105,180,0.4)]'
                : 'border-white/10 bg-white/5'
            }`}
            style={{ backgroundColor: b.unlocked ? `${b.color}20` : undefined }}
          >
            {b.unlocked ? (
              <b.icon className="w-7 h-7" style={{ color: b.color }} />
            ) : (
              <Lock className="w-6 h-6 text-slate-500" />
            )}
          </div>

          <h4 className="text-sm font-extrabold text-white font-mono mb-1">{b.title}</h4>
          <p className="text-xs text-slate-400">{b.desc}</p>

          {b.unlocked && (
            <span className="mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF69B4]/20 border border-[#FF69B4]/40 text-[#FF69B4]">
              UNLOCKED ✨
            </span>
          )}
        </GlassCard>
      ))}
    </div>
  );
};
