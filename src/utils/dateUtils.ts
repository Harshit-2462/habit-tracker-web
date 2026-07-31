import { format, parseISO, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, formatDistanceToNow } from 'date-fns';

export const getTodayFormatted = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDateDisplay = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const getPastYearDays = () => {
  const today = new Date();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const day = subDays(today, i);
    days.push({
      dateStr: format(day, 'yyyy-MM-dd'),
      date: day,
    });
  }
  return days;
};

export const getCurrentWeekDays = () => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(today, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(d => ({
    dateStr: format(d, 'yyyy-MM-dd'),
    dayName: format(d, 'EEE'),
    dayNumber: format(d, 'd'),
    isToday: isSameDay(d, today),
  }));
};
