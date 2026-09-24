import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveClockProps {
  className?: string;
  showSeconds?: boolean;
  showIcon?: boolean;
  horizontal?: boolean;
}

export const LiveClock = ({
  className,
  showSeconds = true,
  showIcon = true,
  horizontal = false
}: LiveClockProps) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: true,
  });

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (horizontal) {
    return (
      <div className={cn("flex items-center gap-2 font-mono text-xs", className)}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />}
        <span className="font-bold text-gold tracking-wide">{timeStr}</span>
        <span className="text-line">•</span>
        <span className="text-muted uppercase tracking-wider">{dateStr}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col font-mono text-right", className)}>
      <div className="text-xs sm:text-sm font-bold tracking-wider text-gold flex items-center justify-end gap-1.5">
        {showIcon && <Clock className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />}
        <span>{timeStr}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted font-medium whitespace-nowrap">
        {dateStr}
      </div>
    </div>
  );
};
