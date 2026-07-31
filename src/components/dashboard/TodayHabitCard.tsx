import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Flame, MoreVertical, SkipForward, AlertCircle } from 'lucide-react';
import { Habit } from '../../types/habit';

interface TodayHabitCardProps {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onSkip?: (habit: Habit) => void;
  onMiss?: (habit: Habit) => void;
}

export const TodayHabitCard: React.FC<TodayHabitCardProps> = ({
  habit,
  onToggleComplete,
  onSkip,
  onMiss,
}) => {
  const priorityColors = {
    low: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    medium: 'bg-[#F4D03F]/10 border-[#F4D03F]/30 text-[#F4D03F]',
    high: 'bg-[#FF69B4]/10 border-[#FF69B4]/30 text-[#FF69B4]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-4 rounded-2xl border transition-all duration-300 ${
        habit.completed_today
          ? 'border-emerald-500/40 bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
          : 'border-white/10 hover:border-[#FF69B4]/30'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Checkbox Button */}
        <button
          onClick={() => onToggleComplete(habit)}
          className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border ${
            habit.completed_today
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.6)] scale-105'
              : 'bg-white/5 border-white/20 hover:border-[#FF69B4] text-transparent hover:text-white/40'
          }`}
        >
          <Check className={`w-5 h-5 stroke-[3] ${habit.completed_today ? 'opacity-100' : 'opacity-0 hover:opacity-50'}`} />
        </button>

        {/* Title & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`text-sm font-bold truncate transition-colors ${
                habit.completed_today ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {habit.title}
            </h4>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-mono font-bold ${
                priorityColors[habit.priority]
              }`}
            >
              {habit.priority}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            {habit.category && (
              <span className="flex items-center gap-1 text-[#FFB6C1]">
                ● {habit.category.name}
              </span>
            )}
            {habit.reminder_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#F4D03F]" />
                {habit.reminder_time}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-[#F4D03F]">
              <Flame className="w-3 h-3 text-[#FF69B4]" />
              {habit.current_streak || 3}d streak
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onSkip && !habit.completed_today && (
            <button
              onClick={() => onSkip(habit)}
              title="Skip Habit for Today"
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}
          {onMiss && !habit.completed_today && (
            <button
              onClick={() => onMiss(habit)}
              title="Mark as Missed"
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
