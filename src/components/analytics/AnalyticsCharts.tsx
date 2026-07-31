import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Habit, HabitLog } from '../../types/habit';
import { GlassCard } from '../common/GlassCard';

interface AnalyticsChartsProps {
  habits: Habit[];
  logs: HabitLog[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ habits, logs }) => {
  // Weekly trend data
  const weeklyData = [
    { day: 'Mon', completed: 4, missed: 1 },
    { day: 'Tue', completed: 3, missed: 0 },
    { day: 'Wed', completed: 5, missed: 1 },
    { day: 'Thu', completed: 4, missed: 2 },
    { day: 'Fri', completed: 6, missed: 0 },
    { day: 'Sat', completed: 5, missed: 1 },
    { day: 'Sun', completed: 7, missed: 0 },
  ];

  // Category distribution
  const categoryData = [
    { name: 'Fitness', value: 35, color: '#FF69B4' },
    { name: 'Mindset', value: 25, color: '#9B51E0' },
    { name: 'Nutrition', value: 20, color: '#F4D03F' },
    { name: 'Productivity', value: 20, color: '#00E5FF' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glowColor="pink">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Completion Rate
          </span>
          <span className="text-3xl font-extrabold text-[#FF69B4] font-mono">87.5%</span>
          <span className="text-[10px] text-emerald-400 block mt-1">↑ +4.2% from last week</span>
        </GlassCard>

        <GlassCard glowColor="yellow">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Best Heroic Day
          </span>
          <span className="text-3xl font-extrabold text-[#F4D03F] font-mono">Sunday</span>
          <span className="text-[10px] text-slate-400 block mt-1">100% completion record</span>
        </GlassCard>

        <GlassCard glowColor="purple">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Total Completions
          </span>
          <span className="text-3xl font-extrabold text-[#9B51E0] font-mono">142</span>
          <span className="text-[10px] text-[#FFB6C1] block mt-1">Bat-Belt items logged</span>
        </GlassCard>

        <GlassCard glowColor="cyan">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Miss Rate
          </span>
          <span className="text-3xl font-extrabold text-[#00E5FF] font-mono">5.2%</span>
          <span className="text-[10px] text-emerald-400 block mt-1">↓ Extremely low miss rate</span>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Weekly Trends */}
        <GlassCard glowColor="pink">
          <h3 className="text-base font-extrabold text-white mb-4 font-mono">
            📈 Weekly Completion Velocity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF69B4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121319', borderColor: '#FF69B4', borderRadius: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#FF69B4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pie Chart: Category Distribution */}
        <GlassCard glowColor="purple">
          <h3 className="text-base font-extrabold text-white mb-4 font-mono">
            🎀 Category Focus Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#121319', borderColor: '#9B51E0', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
