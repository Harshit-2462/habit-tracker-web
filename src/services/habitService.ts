import { supabase } from '../lib/supabase';
import { Habit, HabitLog, Category } from '../types/habit';
import { getTodayFormatted } from '../utils/dateUtils';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Vigilante Fitness', color: '#FF69B4', icon: 'Dumbbell', is_default: true },
  { id: 'cat-2', name: 'Bat Cave Mindset', color: '#9B51E0', icon: 'Brain', is_default: true },
  { id: 'cat-3', name: 'Kitty Nutrition', color: '#F4D03F', icon: 'Apple', is_default: true },
  { id: 'cat-4', name: 'Gotham Productivity', color: '#FFB6C1', icon: 'CheckCircle2', is_default: true },
  { id: 'cat-5', name: 'Dark Knight Rest', color: '#00E5FF', icon: 'Moon', is_default: true },
];

const INITIAL_MOCK_HABITS: Habit[] = [
  {
    id: 'habit-1',
    user_id: 'demo-user-123',
    category_id: 'cat-1',
    title: '50 Gotham Pushups',
    description: 'Build superhero strength for fighting crime & keeping paws strong!',
    frequency: 'daily',
    target_days: 7,
    target_count: 50,
    unit: 'reps',
    reminder_time: '07:30',
    priority: 'high',
    color: '#FF69B4',
    icon: 'Flame',
    is_archived: false,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_today: true,
    current_streak: 5,
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'habit-2',
    user_id: 'demo-user-123',
    category_id: 'cat-2',
    title: 'Bat Cave Meditation',
    description: '10 minutes of deep breath visualization in Gotham sanctuary',
    frequency: 'daily',
    target_days: 7,
    target_count: 10,
    unit: 'mins',
    reminder_time: '08:00',
    priority: 'medium',
    color: '#9B51E0',
    icon: 'Brain',
    is_archived: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_today: false,
    current_streak: 3,
    category: MOCK_CATEGORIES[1],
  },
  {
    id: 'habit-3',
    user_id: 'demo-user-123',
    category_id: 'cat-3',
    title: 'Drink 2.5L Bat-Potion (Water)',
    description: 'Hydrate like a true BatKitty hero',
    frequency: 'daily',
    target_days: 7,
    target_count: 2500,
    unit: 'ml',
    reminder_time: '10:00',
    priority: 'high',
    color: '#F4D03F',
    icon: 'Zap',
    is_archived: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_today: true,
    current_streak: 7,
    category: MOCK_CATEGORIES[2],
  },
];

const INITIAL_MOCK_LOGS: HabitLog[] = [
  { id: 'log-1', habit_id: 'habit-1', user_id: 'demo-user-123', completed_at: getTodayFormatted(), status: 'completed', created_at: new Date().toISOString() },
  { id: 'log-2', habit_id: 'habit-3', user_id: 'demo-user-123', completed_at: getTodayFormatted(), status: 'completed', created_at: new Date().toISOString() },
];

const getLocalStorageHabits = (userId: string): Habit[] => {
  try {
    const raw = localStorage.getItem(`batkitty_habits_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalStorageHabit = (userId: string, habit: Habit) => {
  try {
    const existing = getLocalStorageHabits(userId);
    const updated = [habit, ...existing.filter(h => h.id !== habit.id)];
    localStorage.setItem(`batkitty_habits_${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

export const habitService = {
  // Categories
  async getCategories(userId?: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`is_default.eq.true${userId ? `,user_id.eq.${userId}` : ''}`);

      if (error || !data || data.length === 0) return MOCK_CATEGORIES;
      return data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  // Habits
  async getHabits(userId?: string): Promise<Habit[]> {
    const effectiveUserId = userId || 'demo-user-123';
    const localHabits = getLocalStorageHabits(effectiveUserId);

    let dbHabits: Habit[] = [];
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*, category:categories(*)')
        .eq('user_id', effectiveUserId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbHabits = data;
      }
    } catch (err) {
      console.warn('Supabase getHabits fallback:', err);
    }

    // If demo user and no db/local habits, include initial mocks
    if (effectiveUserId === 'demo-user-123' && dbHabits.length === 0 && localHabits.length === 0) {
      dbHabits = INITIAL_MOCK_HABITS;
    }

    // Combine dbHabits and localHabits without duplicates
    const habitMap = new Map<string, Habit>();
    [...localHabits, ...dbHabits].forEach(h => habitMap.set(h.id, h));
    const combined = Array.from(habitMap.values());

    // Check completion status for today
    const today = getTodayFormatted();
    const habitIds = combined.map(h => h.id);
    let completedMap = new Set<string>();

    if (habitIds.length > 0) {
      try {
        const { data: logs } = await supabase
          .from('habit_logs')
          .select('*')
          .in('habit_id', habitIds)
          .eq('completed_at', today)
          .eq('status', 'completed');

        completedMap = new Set(logs?.map(l => l.habit_id) || []);
      } catch {
        // Local completed check
        const localLogs = habitService.getLocalLogs(effectiveUserId);
        completedMap = new Set(localLogs.filter(l => l.completed_at === today && l.status === 'completed').map(l => l.habit_id));
      }
    }

    return combined.map(h => ({
      ...h,
      completed_today: completedMap.has(h.id),
    }));
  },

  async createHabit(habitData: Partial<Habit>): Promise<Habit> {
    const userId = habitData.user_id || 'demo-user-123';
    const categories = await habitService.getCategories(userId);
    const matchedCategory = categories.find(c => c.id === habitData.category_id) || categories[0];

    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      category_id: habitData.category_id || categories[0]?.id,
      title: habitData.title || 'New Hero Habit',
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily',
      target_days: habitData.target_days || 7,
      target_count: habitData.target_count || 1,
      unit: habitData.unit || 'times',
      reminder_time: habitData.reminder_time || '09:00',
      priority: habitData.priority || 'medium',
      color: habitData.color || '#FF69B4',
      icon: habitData.icon || 'Bat',
      is_archived: false,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_today: false,
      current_streak: 0,
      category: matchedCategory,
    };

    // Save to LocalStorage immediately so it NEVER disappears
    saveLocalStorageHabit(userId, newHabit);

    // Try saving to Supabase DB if user is authenticated
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: userId,
          category_id: habitData.category_id,
          title: habitData.title,
          description: habitData.description,
          frequency: habitData.frequency,
          target_days: habitData.target_days,
          target_count: habitData.target_count,
          unit: habitData.unit,
          reminder_time: habitData.reminder_time,
          priority: habitData.priority,
          color: habitData.color,
          icon: habitData.icon,
        }])
        .select('*, category:categories(*)')
        .single();

      if (!error && data) {
        saveLocalStorageHabit(userId, data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase habit creation error, saved to local storage:', err);
    }

    return newHabit;
  },

  async updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
    try {
      await supabase.from('habits').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Update habit fallback:', err);
    }
  },

  async deleteHabit(id: string): Promise<void> {
    try {
      await supabase.from('habits').delete().eq('id', id);
    } catch (err) {
      console.warn('Delete habit fallback:', err);
    }
  },

  getLocalLogs(userId: string): HabitLog[] {
    try {
      const raw = localStorage.getItem(`batkitty_logs_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async toggleHabitLog(habitId: string, userId: string, dateStr: string, status: 'completed' | 'skipped' | 'missed'): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .eq('completed_at', dateStr)
        .single();

      if (existing) {
        if (existing.status === status) {
          await supabase.from('habit_logs').delete().eq('id', existing.id);
          return false;
        } else {
          await supabase.from('habit_logs').update({ status }).eq('id', existing.id);
          return status === 'completed';
        }
      } else {
        await supabase.from('habit_logs').insert([{
          habit_id: habitId,
          user_id: userId,
          completed_at: dateStr,
          status,
        }]);
        return status === 'completed';
      }
    } catch {
      // Local storage fallback
      const localLogs = habitService.getLocalLogs(userId);
      const existingIdx = localLogs.findIndex(l => l.habit_id === habitId && l.completed_at === dateStr);

      if (existingIdx >= 0) {
        localLogs.splice(existingIdx, 1);
        localStorage.setItem(`batkitty_logs_${userId}`, JSON.stringify(localLogs));
        return false;
      } else {
        const newLog: HabitLog = {
          id: `log-${Date.now()}`,
          habit_id: habitId,
          user_id: userId,
          completed_at: dateStr,
          status,
          created_at: new Date().toISOString(),
        };
        localLogs.push(newLog);
        localStorage.setItem(`batkitty_logs_${userId}`, JSON.stringify(localLogs));
        return status === 'completed';
      }
    }
  },

  async getAllLogs(userId?: string): Promise<HabitLog[]> {
    const effectiveUserId = userId || 'demo-user-123';
    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', effectiveUserId);

      if (error || !data) return habitService.getLocalLogs(effectiveUserId);
      return data;
    } catch {
      return habitService.getLocalLogs(effectiveUserId);
    }
  }
};
