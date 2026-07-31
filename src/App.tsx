import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { ParticleBackground } from './components/common/ParticleBackground';
import { Dashboard } from './pages/Dashboard';
import { HabitsPage } from './pages/HabitsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GamificationPage } from './pages/GamificationPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HabitModal } from './components/habits/HabitModal';
import { KeyboardShortcutsModal } from './components/settings/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { Category } from './types/habit';
import { habitService } from './services/habitService';

interface ProtectedLayoutProps {
  children: (onOpenNewHabit: () => void) => React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (user) {
      habitService.getCategories(user.id).then(setCategories);
    }
  }, [user]);

  useKeyboardShortcuts(
    () => setIsNewHabitOpen(true),
    () => setIsShortcutsOpen(true)
  );

  const handleCreateHabit = async (formData: any) => {
    await habitService.createHabit({
      ...formData,
      user_id: user?.id || 'demo-user-123',
    });
    // Dispatch custom event to notify all components to re-fetch habits
    window.dispatchEvent(new Event('batkitty_habits_updated'));
    setIsNewHabitOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0d] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-6xl animate-bounce">🦇🎀</div>
          <p className="text-xs font-mono text-[#FF69B4] font-bold">
            Lighting Gotham Bat Signal...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to Auth page if user is not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const openNewHabitModal = () => setIsNewHabitOpen(true);

  return (
    <div className="min-h-screen bg-gotham-skyline flex text-slate-100 relative">
      <ParticleBackground />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar
          onOpenNewHabit={openNewHabitModal}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children(openNewHabitModal)}
        </main>

        <MobileNav />
      </div>

      <HabitModal
        isOpen={isNewHabitOpen}
        onClose={() => setIsNewHabitOpen(false)}
        onSubmitHabit={handleCreateHabit}
        categories={categories}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/"
              element={
                <ProtectedLayout>
                  {(onOpenNewHabit) => <Dashboard onOpenNewHabit={onOpenNewHabit} />}
                </ProtectedLayout>
              }
            />

            <Route
              path="/habits"
              element={
                <ProtectedLayout>
                  {() => <HabitsPage />}
                </ProtectedLayout>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedLayout>
                  {() => <CalendarPage />}
                </ProtectedLayout>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedLayout>
                  {() => <AnalyticsPage />}
                </ProtectedLayout>
              }
            />

            <Route
              path="/gamification"
              element={
                <ProtectedLayout>
                  {() => <GamificationPage />}
                </ProtectedLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedLayout>
                  {() => <SettingsPage />}
                </ProtectedLayout>
              }
            />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
