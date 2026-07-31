import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glowColor?: 'pink' | 'yellow' | 'purple' | 'cyan' | 'none';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = true,
  glowColor = 'none',
  className,
  ...props
}) => {
  const glowStyles = {
    none: '',
    pink: 'border-[#FF69B4]/30 shadow-[0_0_20px_rgba(255,105,180,0.15)]',
    yellow: 'border-[#F4D03F]/30 shadow-[0_0_20px_rgba(244,208,63,0.15)]',
    purple: 'border-[#9B51E0]/30 shadow-[0_0_20px_rgba(155,81,224,0.15)]',
    cyan: 'border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.15)]',
  };

  return (
    <div
      className={twMerge(
        'glass-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden',
        hoverable && 'glass-card-hover',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
