import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-sm shadow-black/20 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-slate-50 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function MetricCard({ icon: Icon, title, value, subtitle, trend, trendUp, className }) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/30',
        className
      )}
    >
      {/* Gradient background accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-400">{title}</span>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Icon className="w-4 h-4 text-blue-400" />
          </div>
        </div>
        
        <div className="text-2xl font-bold text-slate-50 mb-1 tabular-nums tracking-tight">
          {value}
        </div>
        
        {subtitle && (
          <p className="text-xs text-slate-500 mb-2">{subtitle}</p>
        )}
        
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trendUp ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {trendUp ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </Card>
  );
}