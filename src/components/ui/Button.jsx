import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50 disabled:bg-blue-600/50',
  secondary: 'bg-slate-700 text-slate-50 hover:bg-slate-600 focus:ring-slate-500/50 disabled:bg-slate-700/50',
  ghost: 'text-slate-400 hover:text-slate-50 hover:bg-slate-800 focus:ring-slate-500/50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500/50 disabled:bg-rose-600/50',
  outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800 focus:ring-slate-500/50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/50 disabled:bg-emerald-600/50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
};

export const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        isLoading && 'opacity-70 cursor-wait',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Carregando...
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';