import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Trophy, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { label: 'Dash', path: '/', icon: LayoutDashboard },
    { label: 'Habits', path: '/habits', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Stats', path: '/analytics', icon: BarChart3 },
    { label: 'Badges', path: '/gamification', icon: Trophy },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
              isActive
                ? 'text-[#FF69B4] drop-shadow-[0_0_8px_#FF69B4]'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
