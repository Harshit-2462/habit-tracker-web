import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Plus, HelpCircle, CheckCircle2, Award } from 'lucide-react';
import { NeonButton } from '../common/NeonButton';
import { useGamification } from '../../contexts/GamificationContext';
import { Modal } from '../common/Modal';

interface NavbarProps {
  onOpenNewHabit: () => void;
  onOpenShortcuts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewHabit, onOpenShortcuts }) => {
  const navigate = useNavigate();
  const { coins } = useGamification();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const NOTIFICATIONS = [
    { id: 1, title: '🦇 Bat Signal Lit', desc: 'Daily habits reset for Gotham hero mission!', time: '10m ago' },
    { id: 2, title: '🎀 Streak Bonus Ready', desc: 'Maintain your streak today for extra coins!', time: '1h ago' },
    { id: 3, title: '🏆 Daily Crate Unlocked', desc: 'Claim your daily mystery supply crate!', time: '3h ago' },
  ];

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-[#0a0a0d]/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search habits, categories... (Press '/' to focus)"
              className="w-full pl-10 pr-4 py-2 text-xs lg:text-sm bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#FF69B4]/50 focus:ring-1 focus:ring-[#FF69B4]/50 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Keyboard Shortcut Info button */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#F4D03F] border border-white/10 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            title="Notifications"
            className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#FF69B4] border border-white/10 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF69B4] animate-pulse" />
          </button>

          {/* Coins Badge -> Navigates to Gamification page */}
          <button
            onClick={() => navigate('/gamification')}
            title="Click to view Hero Badges & Coins Shop"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F4D03F]/10 hover:bg-[#F4D03F]/20 border border-[#F4D03F]/30 text-[#F4D03F] text-xs font-bold font-mono transition-all cursor-pointer"
          >
            <span>🪙</span>
            <span>{coins}</span>
          </button>

          {/* New Habit Neon Button */}
          <NeonButton
            variant="pink"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewHabit}
          >
            New Habit
          </NeonButton>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="🔔 Bat-Signal Notifications"
        maxWidth="sm"
      >
        <div className="space-y-3 py-2">
          {NOTIFICATIONS.map(n => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-[#FF69B4]/20 border border-[#FF69B4]/40 text-[#FF69B4] shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
