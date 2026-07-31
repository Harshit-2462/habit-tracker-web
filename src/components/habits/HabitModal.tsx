import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { NeonButton } from '../common/NeonButton';
import { Habit, Category, HabitFrequency, HabitPriority } from '../../types/habit';

const habitSchema = z.object({
  title: z.string().min(2, 'Habit title must be at least 2 characters'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Please select a category'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  priority: z.enum(['low', 'medium', 'high']),
  target_count: z.number().min(1, 'Target count must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  reminder_time: z.string().optional(),
  color: z.string(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitHabit: (data: HabitFormData) => void;
  categories: Category[];
  initialHabit?: Habit | null;
}

const COLOR_OPTIONS = ['#FF69B4', '#F4D03F', '#9B51E0', '#FFB6C1', '#00E5FF', '#10B981', '#F97316'];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSubmitHabit,
  categories,
  initialHabit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: categories[0]?.id || 'cat-1',
      frequency: 'daily',
      priority: 'medium',
      target_count: 1,
      unit: 'times',
      reminder_time: '09:00',
      color: '#FF69B4',
    },
  });

  useEffect(() => {
    if (initialHabit) {
      reset({
        title: initialHabit.title,
        description: initialHabit.description || '',
        category_id: initialHabit.category_id || categories[0]?.id || '',
        frequency: initialHabit.frequency,
        priority: initialHabit.priority,
        target_count: initialHabit.target_count || 1,
        unit: initialHabit.unit || 'times',
        reminder_time: initialHabit.reminder_time || '09:00',
        color: initialHabit.color || '#FF69B4',
      });
    } else {
      reset({
        title: '',
        description: '',
        category_id: categories[0]?.id || '',
        frequency: 'daily',
        priority: 'medium',
        target_count: 1,
        unit: 'times',
        reminder_time: '09:00',
        color: '#FF69B4',
      });
    }
  }, [initialHabit, categories, reset]);

  const selectedColor = watch('color');

  const onFormSubmit = (data: HabitFormData) => {
    onSubmitHabit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialHabit ? '🦇 Edit Habit Lore' : '🎀 Create New BatKitty Habit'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Habit Title *
          </label>
          <input
            {...register('title')}
            placeholder="e.g. 50 Gotham Pushups, Drink Water"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#FF69B4] text-sm"
          />
          {errors.title && (
            <span className="text-xs text-red-400 mt-1 block">{errors.title.message}</span>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Description / Hero Notes
          </label>
          <textarea
            {...register('description')}
            placeholder="Why is this habit critical for your Bat-Belt mission?"
            rows={2}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#FF69B4] text-sm resize-none"
          />
        </div>

        {/* Grid: Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              {...register('category_id')}
              className="w-full px-4 py-2.5 bg-[#121319] border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-2.5 bg-[#121319] border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority (Bat-Signal)</option>
            </select>
          </div>
        </div>

        {/* Grid: Frequency, Target Count & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Frequency
            </label>
            <select
              {...register('frequency')}
              className="w-full px-4 py-2.5 bg-[#121319] border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Target Count
            </label>
            <input
              type="number"
              {...register('target_count', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Unit
            </label>
            <input
              {...register('unit')}
              placeholder="e.g. mins, reps, ml"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
            />
          </div>
        </div>

        {/* Reminder Time */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Reminder Time
          </label>
          <input
            type="time"
            {...register('reminder_time')}
            className="w-full px-4 py-2.5 bg-[#121319] border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:border-[#FF69B4] text-sm"
          />
        </div>

        {/* Color Palette Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Aesthetic Glow Color
          </label>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map(c => (
              <button
                type="button"
                key={c}
                onClick={() => setValue('color', c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColor === c
                    ? 'border-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <NeonButton type="submit" variant="pink" size="md">
            {initialHabit ? 'Save Changes' : 'Light Bat Signal'}
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};
