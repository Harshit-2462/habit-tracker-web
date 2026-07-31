import React from 'react';

interface BatKittyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BatKittyLogo: React.FC<BatKittyLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#121319] via-[#1a1c26] to-[#2d1b36] border border-[#FF69B4]/40 shadow-[0_0_15px_rgba(255,105,180,0.3)] ${sizeMap[size]}`}>
        {/* Bat Wings & Kitty Bow Icon */}
        <div className="relative text-[#F4D03F] animate-bat-pulse">
          <svg className="w-3/4 h-3/4 mx-auto" viewBox="0 0 24 24" fill="currentColor">
            {/* Batman Cowl with Hello Kitty Bow */}
            <path d="M12 2C6.48 2 2 6.48 2 12c0 3.69 2.01 6.91 5 8.65V21c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-.35c2.99-1.74 5-4.96 5-8.65 0-5.52-4.48-10-10-10zm-3 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
          </svg>
        </div>
        {/* Hello Kitty Pink Bow Accent */}
        <span className="absolute -top-1.5 -right-1.5 text-xs text-[#FF69B4] drop-shadow-[0_0_8px_#FF69B4] animate-kitty-bounce">
          🎀
        </span>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] font-mono">
            BAT<span className="text-[#FF69B4]">KITTY</span>
          </span>
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
            Gotham Habit Tracker
          </span>
        </div>
      )}
    </div>
  );
};
