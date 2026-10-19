import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose'
  delay?: number
}

const colorMap = {
  blue: {
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600',
    accentBorder: 'border-l-sky-600',
    iconBg: 'bg-sky-100/70',
  },
  emerald: {
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
    accentBorder: 'border-l-emerald-600',
    iconBg: 'bg-emerald-100/70',
  },
  amber: {
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    accentBorder: 'border-l-amber-500',
    iconBg: 'bg-amber-100/70',
  },
  purple: {
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
    accentBorder: 'border-l-purple-600',
    iconBg: 'bg-purple-100/70',
  },
  rose: {
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600',
    accentBorder: 'border-l-rose-600',
    iconBg: 'bg-rose-100/70',
  },
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  delay = 0,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-sm border-l-4',
        c.accentBorder
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-slate-500 truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-current/10', c.iconBg)}>
          <Icon className={cn('w-5 h-5', c.iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
          <span
            className={cn(
              'font-semibold px-1.5 py-0.2 rounded text-[11px]',
              trend.value >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            )}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-slate-400 truncate">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
