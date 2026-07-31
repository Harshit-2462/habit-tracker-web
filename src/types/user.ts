export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'gotham-dark' | 'kitty-neon' | 'gotham-pink';
  email_notifications: boolean;
  reminder_sound: boolean;
  sound_type: 'kitty-chime' | 'bat-signal' | 'retro-game';
  daily_reminder_time: string;
  created_at: string;
  updated_at: string;
}
