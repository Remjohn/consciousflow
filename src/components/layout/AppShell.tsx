import { useEffect, type ComponentType } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CircleDollarSign, Clapperboard, Home, Shield, Trophy, User, Wifi, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUserStore } from '../../store/useUserStore';
import { useFortressOSStore } from '../../store/useFortressOSStore';

const pageSubtitles: Array<{ match: string; subtitle: string }> = [
  { match: '/revenue', subtitle: 'Studio Operations & Wealth' },
  { match: '/finance', subtitle: 'Studio Operations & Wealth' },
  { match: '/studio', subtitle: 'Studio Operations' },
  { match: '/operator', subtitle: 'Operator' },
  { match: '/challenge', subtitle: 'Challenge Command' },
  { match: '/challenges', subtitle: 'Challenge Command' },
  { match: '/dashboard', subtitle: 'CMF Studio + Operator OS' },
];

const navItems = [
  { to: '/dashboard', label: 'Today', icon: Home },
  { to: '/revenue', label: 'Revenue', icon: CircleDollarSign, aliases: ['/finance', '/investments'] },
  { to: '/studio', label: 'Studio', icon: Clapperboard, aliases: ['/stats'] },
  { to: '/operator', label: 'Operator', icon: User, aliases: ['/fitness'] },
  { to: '/challenge', label: 'Challenges', icon: Trophy, aliases: ['/challenges'] },
];

export const AppShell = () => {
  const location = useLocation();
  const { checkDailyReset, fetchFromBackend } = useUserStore();
  const { ensureCurrentDay } = useFortressOSStore();

  useEffect(() => {
    checkDailyReset();
    ensureCurrentDay();
    fetchFromBackend().catch(() => undefined);
  }, [checkDailyReset, ensureCurrentDay, fetchFromBackend]);

  const subtitle = pageSubtitles.find((item) => location.pathname.startsWith(item.match))?.subtitle ?? 'CMF Studio + Operator OS';

  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-concrete">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div className="absolute left-1/2 top-[-10rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[18rem] w-[18rem] rounded-full bg-hologram/5 blur-3xl" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-5 pb-3 pt-6 md:px-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/60 bg-gold/10 text-gold shadow-glow-gold">
            <Shield className="h-8 w-8" strokeWidth={1.8} />
            <span className="absolute text-sm font-black text-gold">F</span>
          </div>
          <div>
            <h1 className="font-sans text-3xl font-black leading-none tracking-[-0.04em] text-concrete md:text-4xl">Fortress</h1>
            <p className="mt-1 text-sm font-medium text-muted md:text-base">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.16em] text-muted md:flex">
            <Wifi className="h-3.5 w-3.5 text-success" /> Synced
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/70 text-muted transition hover:border-gold/30 hover:text-gold" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-gold" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/70 bg-panel text-sm font-black text-concrete" aria-label="Profile">
            K
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl pb-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line/70 bg-void/85 px-2 pb-2 pt-2 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-5xl grid-cols-5 gap-1 rounded-2xl border border-line/80 bg-panel/80 p-1 shadow-card">
          {navItems.map((item) => (
            <NavButton key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({
  to,
  label,
  icon: Icon,
  aliases = [],
  locked = false,
}: {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  aliases?: string[];
  locked?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(to) || aliases.some((alias) => location.pathname.startsWith(alias));

  return (
    <button
      onClick={() => !locked && navigate(to)}
      className={cn(
        'relative flex h-full flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-mono uppercase tracking-[0.12em] transition',
        isActive ? 'bg-gold/12 text-gold shadow-glow-gold' : 'text-muted/65 hover:bg-white/5 hover:text-concrete',
        locked && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted/65'
      )}
    >
      {isActive && <span className="absolute top-0 h-[2px] w-10 rounded-full bg-gold" />}
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      <span className="hidden sm:block">{label}</span>
      <span className="sm:hidden">{label.slice(0, 3)}</span>
      {locked && <Lock className="absolute right-2 top-2 h-3 w-3" />}
    </button>
  );
};
