import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

// Shared field styling — shadcn/ui aesthetic on a deep dark base.
const fieldBase = cn(
  'w-full rounded-lg border text-sm text-slate-50 transition-colors duration-150',
  'bg-slate-950 border-slate-800',
  'placeholder:text-slate-500',
  'focus:outline-none focus-visible:outline-none',
  'focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

const fieldError = 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/30';

export const Input = forwardRef(({ className, label, error, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          fieldBase,
          'h-11 px-3.5 leading-none',
          error && fieldError,
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ className, label, error, options = [], placeholder, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            fieldBase,
            'h-11 pl-3.5 pr-10 appearance-none cursor-pointer',
            error && fieldError,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-950 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export const Textarea = forwardRef(({ className, label, error, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          fieldBase,
          'px-3.5 py-3 resize-none',
          error && fieldError,
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
