import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { calculateLevel, XP_PER_HABIT, COINS_PER_HABIT } from '../utils/xpUtils';
import { triggerHabitConfetti, triggerLevelUpConfetti } from '../utils/confetti';

interface GamificationContextType {
  xp: number;
  levelInfo: ReturnType<typeof calculateLevel>;
  coins: number;
  awardHabitCompletion: () => void;
  awardCustomXp: (xpAmount: number, coinAmount: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateProfile } = useAuth();

  const xp = profile?.xp ?? 450;
  const coins = profile?.coins ?? 180;
  const levelInfo = calculateLevel(xp);

  const awardHabitCompletion = () => {
    triggerHabitConfetti();
    const newXp = xp + XP_PER_HABIT;
    const newCoins = coins + COINS_PER_HABIT;
    const newLevelInfo = calculateLevel(newXp);

    if (newLevelInfo.level > levelInfo.level) {
      triggerLevelUpConfetti();
    }

    updateProfile({
      xp: newXp,
      coins: newCoins,
      level: newLevelInfo.level,
      total_completions: (profile?.total_completions ?? 0) + 1,
    });
  };

  const awardCustomXp = (xpAmount: number, coinAmount: number) => {
    triggerHabitConfetti();
    const newXp = xp + xpAmount;
    const newCoins = coins + coinAmount;
    const newLevelInfo = calculateLevel(newXp);

    if (newLevelInfo.level > levelInfo.level) {
      triggerLevelUpConfetti();
    }

    updateProfile({
      xp: newXp,
      coins: newCoins,
      level: newLevelInfo.level,
    });
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        levelInfo,
        coins,
        awardHabitCompletion,
        awardCustomXp,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
