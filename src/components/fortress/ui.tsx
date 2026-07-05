import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Card = ({
  children,
  className,
  gold = false,
}: {
  children: ReactNode;
  className?: string;
  gold?: boolean;
}) => (
  <section className={cn(gold ? 'fortress-card-gold' : 'fortress-card', className)}>
    {children}
  </section>
);

export const SectionHeader = ({
  icon,
  title,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={cn('mb-4 flex items-center justify-between gap-3', className)}>
    <div className="flex items-center gap-3">
      {icon && <div className="text-gold">{icon}</div>}
      <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-concrete md:text-base">{title}</h2>
    </div>
    {action}
  </div>
);

export const SelectPill = ({ children }: { children: ReactNode }) => (
  <button className="rounded-xl border border-line bg-void/50 px-3 py-2 text-xs font-medium text-concrete/80 transition hover:border-gold/30 hover:text-gold">
    {children}
  </button>
);

export const ProgressBar = ({
  value,
  max = 100,
  color = 'gold',
  className,
}: {
  value: number;
  max?: number;
  color?: 'gold' | 'green' | 'red' | 'orange' | 'purple' | 'cyan';
  className?: string;
}) => {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const colors = {
    gold: 'bg-gold',
    green: 'bg-success',
    red: 'bg-blood',
    orange: 'bg-warning',
    purple: 'bg-purplepulse',
    cyan: 'bg-hologram',
  };

  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-steel/60', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', colors[color])} style={{ width: `${pct}%` }} />
    </div>
  );
};

export const MetricTile = ({
  icon,
  label,
  value,
  detail,
  trend,
  danger = false,
  className,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  trend?: ReactNode;
  danger?: boolean;
  className?: string;
}) => (
  <div className={cn('rounded-xl border border-line bg-void/35 p-4', danger && 'border-blood/35 bg-blood/5', className)}>
    <div className="mb-3 flex items-center justify-between gap-2">
      {icon && <div className={cn('text-gold', danger && 'text-blood')}>{icon}</div>}
      {trend && <div className="text-xs font-semibold text-success">{trend}</div>}
    </div>
    <div className="fortress-number text-3xl md:text-4xl">{value}</div>
    <div className="mt-1 fortress-label leading-snug">{label}</div>
    {detail && <div className="mt-2 text-sm text-muted">{detail}</div>}
  </div>
);

export const MiniStat = ({
  icon,
  value,
  label,
  detail,
  danger = false,
  progress,
  color = 'gold',
}: {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  detail?: ReactNode;
  danger?: boolean;
  progress?: { value: number; max: number };
  color?: 'gold' | 'green' | 'red' | 'orange' | 'purple' | 'cyan';
}) => (
  <div className="min-w-0 flex-1 border-r border-line/70 px-3 last:border-r-0 md:px-4">
    <div className={cn('mb-2 text-muted', danger && 'text-blood')}>{icon}</div>
    <div className={cn('text-3xl font-black tracking-[-0.06em] text-concrete', danger && 'text-blood')}>{value}</div>
    <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.12em] text-muted">{label}</div>
    {detail && <div className="mt-1 text-sm text-muted/90">{detail}</div>}
    {progress && <ProgressBar value={progress.value} max={progress.max} color={danger ? 'red' : color} className="mt-4 h-1.5" />}
  </div>
);

export const Ring = ({
  value,
  size = 96,
  color = '#F4B930',
  children,
}: {
  value: number;
  size?: number;
  color?: string;
  children?: ReactNode;
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const dash = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="rgba(141,150,165,.16)" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dash}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const RadarMark = () => (
  <div className="relative hidden h-36 w-36 shrink-0 items-center justify-center md:flex">
    <div className="absolute inset-0 rounded-full border border-gold/10" />
    <div className="absolute inset-5 rounded-full border border-gold/20" />
    <div className="absolute inset-10 rounded-full border border-gold/30" />
    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold/10" />
    <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold/10" />
    <div className="absolute h-3 w-3 rounded-full bg-gold shadow-[0_0_40px_rgba(244,185,48,.95)]" />
    <div className="absolute left-1/2 top-1/2 h-px w-16 origin-left -translate-y-1/2 rotate-[-28deg] bg-gold/50" />
  </div>
);

export const RowButton = ({
  icon,
  title,
  subtitle,
  right,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center gap-4 border-b border-line/60 px-1 py-4 text-left last:border-b-0"
  >
    {icon && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-void/60 text-gold">{icon}</div>}
    <div className="min-w-0 flex-1">
      <div className="truncate text-base font-bold text-concrete md:text-lg">{title}</div>
      {subtitle && <div className="mt-1 truncate text-sm text-muted">{subtitle}</div>}
    </div>
    {right && <div className="shrink-0 text-right">{right}</div>}
    <ChevronRight className="h-5 w-5 shrink-0 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-gold" />
  </button>
);

export const StatusPill = ({
  children,
  tone = 'gold',
}: {
  children: ReactNode;
  tone?: 'gold' | 'green' | 'red' | 'purple' | 'cyan' | 'gray';
}) => {
  const tones = {
    gold: 'border-gold/40 bg-gold/10 text-gold',
    green: 'border-success/40 bg-success/10 text-success',
    red: 'border-blood/40 bg-blood/10 text-blood',
    purple: 'border-purplepulse/40 bg-purplepulse/10 text-purplepulse',
    cyan: 'border-hologram/40 bg-hologram/10 text-hologram',
    gray: 'border-line bg-steel/20 text-muted',
  };

  return <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em]', tones[tone])}>{children}</span>;
};
