import React, { useState, useEffect } from 'react';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { Habit, HabitLog } from '../types/habit';
import { habitService } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const [h, l] = await Promise.all([
      habitService.getHabits(user?.id),
      habitService.getAllLogs(user?.id),
    ]);
    setHabits(h);
    setLogs(l);
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
          <span>📊 Gotham Habit Intelligence & Analytics</span>
          <span className="text-[#FF69B4] text-base">🎀</span>
        </h2>
        <p className="text-xs text-slate-400">
          In-depth data charts, completion velocity, and category statistics
        </p>
      </div>

      <AnalyticsCharts habits={habits} logs={logs} />
    </div>
  );
};
