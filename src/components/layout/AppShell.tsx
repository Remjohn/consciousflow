import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { cn } from '../../lib/utils';
import { Signal, WifiOff, Lock } from 'lucide-react';

export const AppShell = () => {
    const { today, location, history, checkDailyReset } = useUserStore();
    const isOffline = false;

    // CRITICAL: Force daily reset check on app mount to prevent stale data
    useEffect(() => {
        checkDailyReset();
    }, [checkDailyReset]);

    // Calculate Streak (Consecutive days with videos >= 5)
    // iterate backwards from yesterday.
    const streak = history.slice().reverse().findIndex(day => !day.isWin);
    const displayStreak = streak === -1 ? history.length : streak;

    return (
        <div className="flex flex-col min-h-screen bg-void text-concrete font-sans selection:bg-blood selection:text-white overflow-hidden">
            {/* Status Bar */}
            <header className="h-14 border-b border-steel/50 bg-void/80 backdrop-blur-md flex items-center justify-between px-4 text-[10px] font-mono uppercase tracking-widest fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-blood animate-pulse">
                        {isOffline ? <WifiOff size={12} /> : <Signal size={12} />}
                        <span>{location === 'DRC' ? 'SAT-LINK' : 'NET-OPS'}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-concrete/70">
                        <span>STREAK: {displayStreak}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-concrete/50 flex items-center gap-2">
                        <span>CLIENTS: <span className="text-concrete font-bold">{today.finance.activeClients}</span></span>
                    </div>
                    <div className="text-gold font-bold bg-gold/10 px-2 py-0.5 border border-gold/20 rounded-sm">
                        ${today.finance.total2026.toLocaleString()}
                    </div>
                </div>
            </header>

            {/* Main Content - Single scroll owner */}
            <main className="flex-1 overflow-y-auto pt-16 pb-24 scrollbar-hide">
                <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full h-20 bg-void/90 backdrop-blur-xl border-t border-steel/50 grid grid-cols-4 items-center gap-1 z-50 px-2 pb-2">
                <NavButton to="/dashboard" label="COMMAND" />
                <NavButton to="/stats" label="STATS" />
                <NavButton to="/finance" label="FINANCE" />
                <NavButton to="/challenge" label="CHALLENGE" />
            </nav>
        </div>
    );
};

const NavButton = ({ to, label, locked = false }: { to: string, label: string, locked?: boolean }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);

    return (
        <button
            onClick={() => !locked && navigate(to)}
            className={cn(
                "h-full flex flex-col items-center justify-center gap-1 transition-all duration-200 group relative",
                isActive ? "text-concrete" : "text-concrete/30 hover:text-concrete/60",
                locked && "opacity-50 cursor-not-allowed hover:text-concrete/30"
            )}
        >
            {/* Active Indicator Line */}
            {isActive && (
                <div className="absolute top-0 w-12 h-[2px] bg-blood shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            )}

            <span className={cn(
                "font-black text-xs tracking-[0.2em] group-hover:tracking-[0.25em] transition-all",
                isActive && "text-blood drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
            )}>
                {label}
            </span>

            {locked && <Lock size={10} className="absolute top-2 right-4 text-concrete/20" />}
        </button>
    );
};
