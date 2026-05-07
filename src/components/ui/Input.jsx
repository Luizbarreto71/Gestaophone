import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(({ className, type, error, label, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-3 py-2 bg-surface border rounded-lg text-navy-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-border',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const Select = forwardRef(({ className, error, label, options, placeholder, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-3 py-2 bg-surface border rounded-lg text-navy-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-border',
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

const Textarea = forwardRef(({ className, error, label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-navy-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2 bg-surface border rounded-lg text-navy-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-border',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Input, Select, Textarea };