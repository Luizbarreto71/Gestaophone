import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  secondary: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  info: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className 
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}