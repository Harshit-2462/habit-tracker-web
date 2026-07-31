import React, { useState, useEffect } from 'react';
import { GamificationHeader } from '../components/dashboard/GamificationHeader';
import { ProgressRing } from '../components/dashboard/ProgressRing';
import { StreakFlame } from '../components/dashboard/StreakFlame';
import { TodayHabitCard } from '../components/dashboard/TodayHabitCard';
import { GlassCard } from '../components/common/GlassCard';
import { NeonButton } from '../components/common/NeonButton';
import type { Habit } from '../types/habit';
import { habitService } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { getTodayFormatted } from '../utils/dateUtils';
import { Gift, Plus } from 'lucide-react';
import { DailyRewardModal, isRewardClaimedToday } from '../components/gamification/DailyRewardModal';

interface DashboardProps {
  onOpenNewHabit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenNewHabit }) => {
  const { user, profile } = useAuth();
  const { awardHabitCompletion } = useGamification();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [crateClaimedToday, setCrateClaimedToday] = useState(false);

  const userId = user?.id || 'demo-user-123';

  useEffect(() => {
    loadHabits();
    checkCrateStatus();

    const handleHabitsUpdated = () => {
      loadHabits();
    };

    const handleCrateClaimed = () => {
      checkCrateStatus();
    };

    window.addEventListener('batkitty_habits_updated', handleHabitsUpdated);
    window.addEventListener('batkitty_crate_claimed', handleCrateClaimed);
    return () => {
      window.removeEventListener('batkitty_habits_updated', handleHabitsUpdated);
      window.removeEventListener('batkitty_crate_claimed', handleCrateClaimed);
    };
  }, [user]);

  const checkCrateStatus = () => {
    setCrateClaimedToday(isRewardClaimedToday(userId));
  };

  const loadHabits = async () => {
    setLoading(true);
    const data = await habitService.getHabits(user?.id);
    setHabits(data.filter(h => !h.is_archived));
    setLoading(false);
  };

  const handleToggleComplete = async (habit: Habit) => {
    const dateStr = getTodayFormatted();
    const isNowCompleted = await habitService.toggleHabitLog(
      habit.id,
      userId,
      dateStr,
      'completed'
    );

    if (isNowCompleted) {
      awardHabitCompletion();
    }

    setHabits(prev =>
      prev.map(h =>
        h.id === habit.id ? { ...h, completed_today: !h.completed_today } : h
      )
    );
  };

  const completedCount = habits.filter(h => h.completed_today).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <GamificationHeader />

      {/* Overview Row: Radial Ring + Streak Flame + Daily Reward Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Radial Progress */}
        <GlassCard glowColor="pink" className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Today's Mission Velocity
          </h3>
          <ProgressRing percentage={percentage} completedCount={completedCount} totalCount={totalCount} />
        </GlassCard>

        {/* Streak Flame */}
        <GlassCard glowColor="yellow" className="flex flex-col justify-between p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Active Hero Streak
          </h3>
          <StreakFlame
            currentStreak={profile?.current_streak ?? 0}
            longestStreak={profile?.longest_streak ?? 0}
          />
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Maintain your daily streak to unlock the <strong>Dark Knight Legend</strong> badge & bonus coins!
          </p>
        </GlassCard>

        {/* Daily Reward Crate */}
        <GlassCard glowColor="purple" className="flex flex-col justify-between p-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Daily Supply Crate
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              {crateClaimedToday
                ? 'You claimed today’s mystery crate! Next supply crate ready tomorrow.'
                : 'Log in daily to claim free XP & Bat-Belt coins!'}
            </p>
          </div>
          <NeonButton
            variant={crateClaimedToday ? 'pink' : 'purple'}
            size="md"
            icon={<Gift className="w-4 h-4" />}
            onClick={() => setIsRewardOpen(true)}
          >
            {crateClaimedToday ? '🎁 Claimed (Ready Tomorrow)' : 'Claim Daily Crate'}
          </NeonButton>
        </GlassCard>
      </div>

      {/* Today's Habits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
            <span>🦇 Today's Bat-Belt Habits</span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
              {completedCount} / {totalCount} Completed
            </span>
          </h3>

          <NeonButton variant="pink" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenNewHabit}>
            Add Habit
          </NeonButton>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <GlassCard className="text-center py-12">
            <span className="text-5xl mb-3 block">🦇🎀</span>
            <h4 className="text-lg font-bold text-white mb-1 font-mono">No Active Habits Found</h4>
            <p className="text-xs text-slate-400 mb-4">
              Light up the Bat Signal by creating your first hero habit!
            </p>
            <NeonButton variant="pink" size="md" onClick={onOpenNewHabit}>
              Create First Habit
            </NeonButton>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <TodayHabitCard key={habit.id} habit={habit} onToggleComplete={handleToggleComplete} />
            ))}
          </div>
        )}
      </div>

      <DailyRewardModal isOpen={isRewardOpen} onClose={() => setIsRewardOpen(false)} />
    </div>
  );
};
