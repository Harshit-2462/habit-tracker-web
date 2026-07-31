import React from 'react';
import { getPastYearDays } from '../../utils/dateUtils';
import { HabitLog } from '../../types/habit';

interface HeatmapCalendarProps {
  logs: HabitLog[];
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ logs }) => {
  const days = getPastYearDays();

  // Map dates to log count
  const logMap = new Map<string, number>();
  logs.forEach(l => {
    if (l.status === 'completed') {
      logMap.set(l.completed_at, (logMap.get(l.completed_at) || 0) + 1);
    }
  });

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-[#181a24] border-white/5';
    if (count === 1) return 'bg-[#9B51E0]/40 border-[#9B51E0]/50 shadow-[0_0_5px_rgba(155,81,224,0.3)]';
    if (count === 2) return 'bg-[#FF69B4]/60 border-[#FF69B4]/70 shadow-[0_0_8px_rgba(255,105,180,0.5)]';
    if (count >= 3) return 'bg-gradient-to-br from-[#F4D03F] to-[#FF69B4] border-[#F4D03F] shadow-[0_0_12px_rgba(244,208,63,0.8)] animate-pulse';
    return 'bg-[#181a24] border-white/5';
  };

  return (
    <div className="glass-card rounded-3xl p-6 border-[#FF69B4]/30 shadow-[0_0_25px_rgba(255,105,180,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
            <span>🦇 Gotham Heatmap Contribution Matrix</span>
            <span className="text-[#FF69B4] text-sm">🎀</span>
          </h3>
          <p className="text-xs text-slate-400">
            365-day habit completion velocity grid
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm bg-[#181a24] border border-white/5" />
          <span className="w-3 h-3 rounded-sm bg-[#9B51E0]/40 border border-[#9B51E0]/50" />
          <span className="w-3 h-3 rounded-sm bg-[#FF69B4]/60 border border-[#FF69B4]/70" />
          <span className="w-3 h-3 rounded-sm bg-[#F4D03F] border border-[#F4D03F]" />
          <span>Heroic</span>
        </div>
      </div>

      {/* Grid view */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[750px]">
          {days.map((day, idx) => {
            const count = logMap.get(day.dateStr) || 0;
            return (
              <div
                key={day.dateStr}
                title={`${day.dateStr}: ${count} habits completed`}
                className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 hover:scale-125 cursor-pointer ${getIntensityColor(
                  count
                )}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
