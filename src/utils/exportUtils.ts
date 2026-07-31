import { Habit, HabitLog } from '../types/habit';

export const exportToJSON = (habits: Habit[], logs: HabitLog[]) => {
  const data = {
    app: 'BatKitty Habit Tracker',
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    habits,
    logs,
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `batkitty_habits_export_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportToCSV = (habits: Habit[], logs: HabitLog[]) => {
  const headers = ['Habit Title', 'Category', 'Frequency', 'Priority', 'Logged Date', 'Status', 'Notes'];
  const rows = logs.map(log => {
    const habit = habits.find(h => h.id === log.habit_id);
    return [
      `"${habit?.title || 'Unknown'}"`,
      `"${habit?.category?.name || 'General'}"`,
      `"${habit?.frequency || 'daily'}"`,
      `"${habit?.priority || 'medium'}"`,
      `"${log.completed_at}"`,
      `"${log.status}"`,
      `"${log.notes || ''}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `batkitty_habits_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
