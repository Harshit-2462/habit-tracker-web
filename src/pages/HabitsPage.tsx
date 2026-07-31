import React, { useState, useEffect } from 'react';
import { Plus, Search, Archive, Copy, Trash2, Edit3, Flame, Clock } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { NeonButton } from '../components/common/NeonButton';
import type { Habit, Category } from '../types/habit';
import { habitService } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';
import { HabitModal } from '../components/habits/HabitModal';

export const HabitsPage: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    loadData();

    const handleHabitsUpdated = () => {
      loadData();
    };

    window.addEventListener('batkitty_habits_updated', handleHabitsUpdated);
    return () => window.removeEventListener('batkitty_habits_updated', handleHabitsUpdated);
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [habitsData, catData] = await Promise.all([
      habitService.getHabits(user?.id),
      habitService.getCategories(user?.id),
    ]);
    setHabits(habitsData);
    setCategories(catData);
    setLoading(false);
  };

  const handleCreateOrUpdate = async (formData: any) => {
    if (editingHabit) {
      await habitService.updateHabit(editingHabit.id, formData);
      setHabits(prev =>
        prev.map(h => (h.id === editingHabit.id ? { ...h, ...formData } : h))
      );
    } else {
      const created = await habitService.createHabit({
        ...formData,
        user_id: user?.id || 'demo-user-123',
      });
      setHabits(prev => [created, ...prev]);
    }
    window.dispatchEvent(new Event('batkitty_habits_updated'));
    setEditingHabit(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this habit from your Bat-Belt?')) {
      await habitService.deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));
      window.dispatchEvent(new Event('batkitty_habits_updated'));
    }
  };

  const handleDuplicate = async (habit: Habit) => {
    const duplicated = await habitService.createHabit({
      ...habit,
      title: `${habit.title} (Copy)`,
      id: undefined,
    });
    setHabits(prev => [duplicated, ...prev]);
    window.dispatchEvent(new Event('batkitty_habits_updated'));
  };

  const handleArchiveToggle = async (habit: Habit) => {
    await habitService.updateHabit(habit.id, { is_archived: !habit.is_archived });
    setHabits(prev =>
      prev.map(h => (h.id === habit.id ? { ...h, is_archived: !h.is_archived } : h))
    );
    window.dispatchEvent(new Event('batkitty_habits_updated'));
  };

  const filteredHabits = habits.filter(h => {
    const matchesArchived = showArchived ? h.is_archived : !h.is_archived;
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || h.category_id === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || h.priority === selectedPriority;
    return matchesArchived && matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
            <span>🦇 Habit Protocol Management</span>
            <span className="text-[#FF69B4] text-base">🎀</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure target frequencies, priorities, reminders & categories
          </p>
        </div>

        <NeonButton
          variant="pink"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
        >
          Create New Habit
        </NeonButton>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-[#FF69B4]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-[#121319] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-[#FF69B4]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs bg-[#121319] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-[#FF69B4]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 ${
              showArchived
                ? 'bg-[#FF69B4]/20 border-[#FF69B4] text-[#FF69B4]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archived ({habits.filter(h => h.is_archived).length})</span>
          </button>
        </div>
      </GlassCard>

      {/* Habits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredHabits.length === 0 ? (
        <GlassCard className="text-center py-12">
          <span className="text-4xl mb-2 block">🦇</span>
          <p className="text-sm text-slate-300 font-bold">No Habits Found Matching Criteria</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map(habit => (
            <GlassCard key={habit.id} glowColor="pink" className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                    <span style={{ color: habit.color }}>●</span>
                    <span>{habit.title}</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#F4D03F] font-mono uppercase font-bold">
                    {habit.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {habit.description || 'No lore description specified.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 font-mono text-[#FFB6C1]">
                    {habit.frequency}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[#F4D03F]">
                    <Flame className="w-3 h-3 text-[#FF69B4]" />
                    Target: {habit.target_count} {habit.unit}
                  </span>
                  {habit.reminder_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {habit.reminder_time}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Created {new Date(habit.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingHabit(habit);
                      setIsModalOpen(true);
                    }}
                    title="Edit Habit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(habit)}
                    title="Duplicate Habit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#F4D03F] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleArchiveToggle(habit)}
                    title={habit.is_archived ? 'Unarchive' : 'Archive'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF69B4] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    title="Delete Habit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSubmitHabit={handleCreateOrUpdate}
        categories={categories}
        initialHabit={editingHabit}
      />
    </div>
  );
};
