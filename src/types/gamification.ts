export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  xp_reward: number;
  coin_reward: number;
  created_at?: string;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'avatar' | 'theme' | 'sound' | 'badge';
  icon: string;
  unlocked?: boolean;
}

export interface Quote {
  quote: string;
  author: string;
  badge: 'Batman' | 'Hello Kitty' | 'BatKitty Fusion';
}
