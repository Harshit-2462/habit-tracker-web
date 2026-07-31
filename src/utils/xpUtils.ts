export const XP_PER_HABIT = 25;
export const COINS_PER_HABIT = 10;
export const XP_BONUS_STREAK_7 = 100;

export const calculateLevel = (xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number; rankTitle: string } => {
  // Level formula: level = Math.floor(sqrt(xp / 50)) + 1
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const prevLevelXp = Math.pow(level - 1, 2) * 50;
  const nextLevelXp = Math.pow(level, 2) * 50;
  
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpRequiredForNext = nextLevelXp - prevLevelXp;
  const progressPercent = Math.min(100, Math.max(0, Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100)));

  const getRankTitle = (lvl: number): string => {
    if (lvl >= 25) return '🦇 Kitty Bat Overseer (Max Rank)';
    if (lvl >= 20) return '🐱 Gotham Guardian Kitty';
    if (lvl >= 15) return '🦇 Dark Knight Meow';
    if (lvl >= 10) return '🌸 Bat-Belt Crusader';
    if (lvl >= 5) return '🎀 Vigilante Kitty';
    return '🐾 Rookie Gotham Paws';
  };

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpRequiredForNext,
    progressPercent,
    rankTitle: getRankTitle(level),
  };
};

export const BATKITTY_QUOTES = [
  { quote: "It's not who I am underneath, but what cute habits I stick to that define me.", author: "BatKitty", badge: "BatKitty Fusion" as const },
  { quote: "Gotham needs heroes who drink water and finish their daily tasks!", author: "Dark Knight Kitty", badge: "Batman" as const },
  { quote: "With great cute bows comes great daily discipline.", author: "Hello Kitty Wayne", badge: "Hello Kitty" as const },
  { quote: "I wear a black cowl so my pink bows shine even brighter in the night.", author: "BatKitty", badge: "BatKitty Fusion" as const },
  { quote: "The night is darkest just before you complete your habit streak!", author: "Bat Signal Paws", badge: "Batman" as const },
];
