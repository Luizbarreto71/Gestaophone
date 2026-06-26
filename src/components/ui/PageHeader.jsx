import { cn } from '../../lib/utils';

/**
 * Consistent page header — small muted eyebrow (category) on top,
 * a bold high-contrast title below, and an optional actions slot on the right.
 */
export function PageHeader({ eyebrow, title, subtitle, actions, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 flex-wrap', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
