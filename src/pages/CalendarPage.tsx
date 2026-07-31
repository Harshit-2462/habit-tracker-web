import React, { useState, useEffect } from 'react';
import { HeatmapCalendar } from '../components/calendar/HeatmapCalendar';
import { GlassCard } from '../components/common/GlassCard';
import { HabitLog, Habit } from '../types/habit';
import { habitService } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [logsData, habitsData] = await Promise.all([
      habitService.getAllLogs(user?.id),
      habitService.getHabits(user?.id),
    ]);
    setLogs(logsData);
    setHabits(habitsData);
    setLoading(false);
  };

  const getHabitTitle = (habitId: string) => {
    const found = habits.find(h => h.id === habitId);
    return found?.title || 'Gotham Habit';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
          <span>🦇 Gotham Activity Heatmap & Logs</span>
          <span className="text-[#FF69B4] text-base">🎀</span>
        </h2>
        <p className="text-xs text-slate-400">
          Visualize year-long streak intensity and complete completion feed
        </p>
      </div>

      {/* Heatmap Contribution Matrix */}
      <HeatmapCalendar logs={logs} />

      {/* Activity Timeline Log Feed */}
      <GlassCard glowColor="purple" className="p-6">
        <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2 mb-6">
          <CalendarIcon className="w-5 h-5 text-[#FF69B4]" />
          Recent Bat-Belt Completion Feed
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">
            No activity logged yet. Check off habits on your Dashboard!
          </p>
        ) : (
          <div className="relative pl-6 space-y-4 border-l border-[#FF69B4]/30">
            {logs.slice(0, 10).map(log => (
              <div key={log.id} className="relative flex items-center justify-between text-xs">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] p-1 rounded-full bg-[#121319] border border-[#FF69B4] text-[#FF69B4]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div>
                  <span className="font-bold text-slate-100 font-mono">
                    {getHabitTitle(log.habit_id)}
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-[#F4D03F]" />
                  <span>{log.completed_at}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
