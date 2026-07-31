export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type HabitPriority = 'low' | 'medium' | 'high';
export type LogStatus = 'completed' | 'skipped' | 'missed';

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  color: string;
  icon: string;
  is_default?: boolean;
  created_at?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  category_id?: string | null;
  title: string;
  description?: string | null;
  frequency: HabitFrequency;
  target_days: number;
  target_count: number;
  unit: string;
  reminder_time?: string | null;
  priority: HabitPriority;
  color: string;
  icon: string;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  completed_today?: boolean;
  current_streak?: number;
  logs?: HabitLog[];
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string; // YYYY-MM-DD
  status: LogStatus;
  notes?: string | null;
  created_at: string;
}

export interface StreakInfo {
  id: string;
  user_id: string;
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string | null;
}
