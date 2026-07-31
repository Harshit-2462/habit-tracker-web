import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (
  onOpenNewHabit: () => void,
  onOpenShortcuts: () => void
) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'n') {
        e.preventDefault();
        onOpenNewHabit();
      } else if (key === 'd') {
        navigate('/');
      } else if (key === 'h') {
        navigate('/habits');
      } else if (key === 'c') {
        navigate('/calendar');
      } else if (key === 'a') {
        navigate('/analytics');
      } else if (key === 's') {
        navigate('/settings');
      } else if (key === '?') {
        e.preventDefault();
        onOpenShortcuts();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onOpenNewHabit, onOpenShortcuts]);
};
