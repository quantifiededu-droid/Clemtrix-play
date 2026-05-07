import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm", className)} {...props} />
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'blue' | 'amber' | 'red' | 'green' | 'gray', className?: string }> = ({ 
  children, 
  variant = 'blue',
  className
}) => {
  const variants = {
    blue: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-400/20 text-amber-400 border-amber-400/20',
    red: 'bg-rose-500/20 text-rose-400 border-rose-500/20',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    gray: 'bg-slate-800 text-slate-400 border-white/10',
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", variants[variant], className)}>
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number, max: number, className?: string }> = ({ value, max, className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn("h-2 w-full bg-slate-800 rounded-full overflow-hidden", className)}>
      <div 
        className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
