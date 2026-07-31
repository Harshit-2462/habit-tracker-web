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

const DEFAULT_GAMIFICATION: GamificationContextType = {
  xp: 0,
  levelInfo: calculateLevel(0),
  coins: 0,
  awardHabitCompletion: () => {},
  awardCustomXp: () => {},
};

const GamificationContext = createContext<GamificationContextType>(DEFAULT_GAMIFICATION);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const profile = auth?.profile;
  const updateProfile = auth?.updateProfile;

  const xp = profile?.xp ?? 0;
  const coins = profile?.coins ?? 0;
  const levelInfo = calculateLevel(xp);

  const awardHabitCompletion = () => {
    triggerHabitConfetti();
    const newXp = xp + XP_PER_HABIT;
    const newCoins = coins + COINS_PER_HABIT;
    const newLevelInfo = calculateLevel(newXp);

    if (newLevelInfo.level > levelInfo.level) {
      triggerLevelUpConfetti();
    }

    if (updateProfile) {
      updateProfile({
        xp: newXp,
        coins: newCoins,
        level: newLevelInfo.level,
        total_completions: (profile?.total_completions ?? 0) + 1,
      });
    }
  };

  const awardCustomXp = (xpAmount: number, coinAmount: number) => {
    triggerHabitConfetti();
    const newXp = xp + xpAmount;
    const newCoins = coins + coinAmount;
    const newLevelInfo = calculateLevel(newXp);

    if (newLevelInfo.level > levelInfo.level) {
      triggerLevelUpConfetti();
    }

    if (updateProfile) {
      updateProfile({
        xp: newXp,
        coins: newCoins,
        level: newLevelInfo.level,
      });
    }
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
  return context || DEFAULT_GAMIFICATION;
};
