import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Trophy, Settings, LogOut, Sparkles } from 'lucide-react';
import { BatKittyLogo } from '../common/BatKittyLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';

export const Sidebar: React.FC = () => {
  const { signOut, profile } = useAuth();
  const { xp, coins, levelInfo } = useGamification();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Habits', path: '/habits', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Gamification', path: '/gamification', icon: Trophy },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0c0d12]/90 backdrop-blur-xl border-r border-white/10 p-5 z-30">
      {/* Brand Header */}
      <div className="mb-8 px-2 pt-2">
        <BatKittyLogo size="md" />
      </div>

      {/* Hero Level & XP Mini Banner */}
      <div className="glass-card rounded-2xl p-3.5 mb-6 border-[#FF69B4]/30 bg-gradient-to-br from-[#1a1326]/80 to-[#121319]/80 shadow-[0_0_15px_rgba(255,105,180,0.15)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#F4D03F] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF69B4]" />
            Lvl {levelInfo.level} Hero
          </span>
          <span className="text-xs font-bold text-[#FF69B4] flex items-center gap-1">
            🪙 {coins}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] h-full rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 text-right mt-1 font-mono">
          {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF69B4]/20 via-[#9B51E0]/20 to-transparent text-[#FF69B4] border-l-4 border-[#FF69B4] shadow-[0_0_15px_rgba(255,105,180,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-[#FF69B4] object-cover"
          />
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-slate-200 truncate">
              {profile?.full_name || 'BatKitty Hero'}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              🔥 {profile?.current_streak || 5} Day Streak
            </span>
          </div>
        </div>
        <button
          onClick={signOut}
          title="Sign Out"
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
