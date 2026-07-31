import React from 'react';

interface ProgressRingProps {
  percentage: number;
  completedCount: number;
  totalCount: number;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  completedCount,
  totalCount,
  size = 140,
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Outer Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e202e"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Gradient Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#batkittyGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="batkittyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4D03F" />
            <stop offset="50%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#9B51E0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] font-mono">
          {percentage}%
        </span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          {completedCount} of {totalCount} Done
        </span>
      </div>
    </div>
  );
};
