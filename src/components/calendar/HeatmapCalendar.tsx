import React, { useState } from 'react';
import { getPastYearDays, formatDateDisplay } from '../../utils/dateUtils';
import { HabitLog, Habit } from '../../types/habit';
import { Modal } from '../common/Modal';
import { CheckCircle2, Circle, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { habitService } from '../../services/habitService';

interface HeatmapCalendarProps {
  logs: HabitLog[];
  habits?: Habit[];
  userId?: string;
  onLogsUpdated?: () => void;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  logs,
  habits = [],
  userId,
  onLogsUpdated,
}) => {
  const days = getPastYearDays();
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Map dates to log count
  const logMap = new Map<string, number>();
  logs.forEach(l => {
    if (l.status === 'completed') {
      logMap.set(l.completed_at, (logMap.get(l.completed_at) || 0) + 1);
    }
  });

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-[#181a24] border-white/5 hover:border-[#FF69B4]/50';
    if (count === 1) return 'bg-[#9B51E0]/40 border-[#9B51E0]/50 shadow-[0_0_5px_rgba(155,81,224,0.3)]';
    if (count === 2) return 'bg-[#FF69B4]/60 border-[#FF69B4]/70 shadow-[0_0_8px_rgba(255,105,180,0.5)]';
    if (count >= 3) return 'bg-gradient-to-br from-[#F4D03F] to-[#FF69B4] border-[#F4D03F] shadow-[0_0_12px_rgba(244,208,63,0.8)] animate-pulse';
    return 'bg-[#181a24] border-white/5';
  };

  const handleTileClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
  };

  const handleToggleLogForDate = async (habitId: string) => {
    if (!selectedDateStr) return;
    await habitService.toggleHabitLog(
      habitId,
      userId || 'demo-user-123',
      selectedDateStr,
      'completed'
    );
    if (onLogsUpdated) {
      onLogsUpdated();
    }
  };

  // Get completed log statuses for selected date
  const selectedDateLogs = selectedDateStr
    ? logs.filter(l => l.completed_at === selectedDateStr && l.status === 'completed')
    : [];
  const completedHabitIds = new Set(selectedDateLogs.map(l => l.habit_id));

  return (
    <>
      <div className="glass-card rounded-3xl p-6 border-[#FF69B4]/30 shadow-[0_0_25px_rgba(255,105,180,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
              <span>🦇 365-Day Gotham Heatmap Contribution Grid</span>
              <span className="text-[#FF69B4] text-sm">🎀</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any tile in the 365-day grid to inspect or check off habit completions for that date
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0">
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
            {days.map((day) => {
              const count = logMap.get(day.dateStr) || 0;
              return (
                <button
                  key={day.dateStr}
                  onClick={() => handleTileClick(day.dateStr)}
                  title={`${day.dateStr}: ${count} habits completed (Click to view)`}
                  className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 hover:scale-125 cursor-pointer ${getIntensityColor(
                    count
                  )}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Date Detail & Checkbox Modal */}
      <Modal
        isOpen={Boolean(selectedDateStr)}
        onClose={() => setSelectedDateStr(null)}
        title={`📅 Missions Log: ${selectedDateStr ? formatDateDisplay(selectedDateStr) : ''}`}
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono pb-2 border-b border-white/10">
            <span>Date: <strong>{selectedDateStr}</strong></span>
            <span className="text-[#F4D03F] font-bold">
              {selectedDateLogs.length} Task(s) Completed
            </span>
          </div>

          {habits.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">
              No active habits configured. Create your first habit on the Dashboard!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {habits.map(h => {
                const isDone = completedHabitIds.has(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => handleToggleLogForDate(h.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isDone
                        ? 'bg-[#FF69B4]/10 border-[#FF69B4]/40 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#FF69B4] shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-bold font-mono block">{h.title}</span>
                        <span className="text-[10px] text-slate-400">Target: {h.target_count} {h.unit}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#F4D03F]">
                      +10 Credits
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
