import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'pink' | 'yellow' | 'purple' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'pink',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    pink: 'neon-btn-pink text-white font-bold',
    yellow: 'neon-btn-yellow font-bold text-slate-950',
    purple: 'neon-btn-purple text-white font-bold',
    ghost: 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 hover:border-white/20',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
