import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Loader, RefreshCw, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isFuture } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';
import { API_URL } from '../../lib/api';

interface MonthDay {
    videos: number;
    status: 'WIN' | 'ACCEPTABLE' | 'FAIL';
}

interface StatsSummary {
    today: { videos: number; isWin: boolean };
    thisWeek: { videos: number; target: number; daysWon: number; daysFailed: number };
    thisMonth: { videos: number; revenue: number; winRate: number };
    streak: number;
}

export const Journal = () => {
    const { currentDate } = useUserStore();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [viewDate, setViewDate] = useState(new Date(currentDate));

    // Editor State
    const [entry, setEntry] = useState('');
    const [stats, setStats] = useState<{ videos: number | null, isWin: boolean | null }>({ videos: null, isWin: null });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Calendar History State
    const [monthHistory, setMonthHistory] = useState<Record<string, MonthDay>>({});

    // Progress Summary State
    const [summary, setSummary] = useState<StatsSummary | null>(null);

    // Fetch Month History when viewDate changes
    useEffect(() => {
        const fetchMonthHistory = async () => {
            try {
                const yearMonth = format(viewDate, 'yyyy-MM');
                const res = await fetch(`${API_URL}/api/journal/month/${yearMonth}`);
                const data = await res.json();
                setMonthHistory(data.days || {});
            } catch (error) {
                console.error("Failed to load month history", error);
            }
        };
        fetchMonthHistory();
    }, [viewDate]);

    // Fetch Stats Summary on mount
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stats/summary`);
                const data = await res.json();
                setSummary(data);
            } catch (error) {
                console.error("Failed to load summary", error);
            }
        };
        fetchSummary();
    }, []);

    // Fetch Entry when selectedDate changes
    useEffect(() => {
        const fetchEntry = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/journal/${selectedDate}`);
                const data = await res.json();
                setEntry(data.entry || '');
                setStats(data.stats || { videos: null, isWin: null });
            } catch (error) {
                console.error("Failed to load journal", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntry();
    }, [selectedDate]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch(`${API_URL}/api/dashboard/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    field: 'journalEntry',
                    value: entry
                })
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Calendar Generation
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(viewDate),
        end: endOfMonth(viewDate)
    });

    const activeDateObj = new Date(selectedDate);

    // Get day status color
    const getDayColor = (dateStr: string, isToday: boolean) => {
        const dayData = monthHistory[dateStr];
        if (!dayData) return isToday ? 'bg-concrete text-void' : '';

        if (dayData.status === 'WIN') return 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50';
        if (dayData.status === 'ACCEPTABLE') return 'bg-gold/20 text-gold border border-gold/30';
        if (dayData.status === 'FAIL') return 'bg-blood/20 text-blood border border-blood/30';
        return '';
    };

    return (
        <div className="flex flex-col bg-void overflow-hidden">
            {/* Progress Summary Bar */}
            {summary && (
                <div className="p-3 border-b border-steel/20 bg-steel/5 flex items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={12} className="text-gold" />
                            <span className="text-concrete/50">This Week:</span>
                            <span className={summary.thisWeek.videos >= summary.thisWeek.target ? 'text-emerald-400' : 'text-gold'}>
                                {summary.thisWeek.videos}/{summary.thisWeek.target}
                            </span>
                        </div>
                        <div>
                            <span className="text-concrete/50">Month:</span>
                            <span className="text-concrete ml-1">{summary.thisMonth.videos} videos</span>
                            <span className="text-gold ml-1">(${summary.thisMonth.revenue})</span>
                        </div>
                        <div>
                            <span className="text-concrete/50">Win Rate:</span>
                            <span className={`ml-1 ${summary.thisMonth.winRate >= 0.7 ? 'text-emerald-400' : summary.thisMonth.winRate >= 0.5 ? 'text-gold' : 'text-blood'}`}>
                                {Math.round(summary.thisMonth.winRate * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-concrete/50">Streak:</span>
                        <span className={`font-bold ${summary.streak >= 3 ? 'text-gold' : 'text-concrete'}`}>
                            {summary.streak} 🔥
                        </span>
                    </div>
                </div>
            )}

            {/* Calendar Header */}
            <div className="p-4 border-b border-steel/20 bg-void shrink-0 flex items-center justify-between">
                <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-2 hover:text-white text-concrete"><ChevronLeft size={16} /></button>
                <div className="font-display font-black text-lg text-concrete uppercase tracking-wider">
                    {format(viewDate, 'MMMM yyyy')}
                </div>
                <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-2 hover:text-white text-concrete"><ChevronRight size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* CALENDAR GRID */}
                <div className="p-4 bg-steel/5 border-r border-steel/20 md:w-80 shrink-0 overflow-y-auto">
                    {/* Legend */}
                    <div className="flex gap-3 mb-4 text-[9px] font-mono">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500/30 border border-emerald-500/50"></div><span className="text-concrete/50">WIN (5+)</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gold/20 border border-gold/30"></div><span className="text-concrete/50">OK (3-4)</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blood/20 border border-blood/30"></div><span className="text-concrete/50">FAIL (&lt;3)</span></div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={`${d}-${i}`} className="text-center text-[10px] font-mono text-concrete/30 font-bold">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startOfMonth(viewDate).getDay() }).map((_, i) => (
                            <div key={`pad-${i}`} />
                        ))}

                        {daysInMonth.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isSelected = isSameDay(day, activeDateObj);
                            const isToday = isSameDay(day, new Date(currentDate));
                            const future = isFuture(day);
                            const dayColor = getDayColor(dateStr, isToday);

                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => setSelectedDate(dateStr)}
                                    disabled={future}
                                    className={`
                                        aspect-square flex items-center justify-center text-xs font-mono transition-all
                                        ${isSelected ? 'ring-2 ring-gold ring-offset-1 ring-offset-void z-10' : ''}
                                        ${dayColor}
                                        ${!dayColor && !isToday ? 'hover:bg-steel/20 text-concrete' : ''}
                                        ${future ? 'opacity-20 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* EDITOR */}
                <div className="flex-1 flex flex-col bg-void overflow-hidden relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gold"><Loader className="animate-spin" /></div>
                    ) : (
                        <>
                            {/* Entry Header */}
                            <div className="p-4 border-b border-steel/10 flex justify-between items-center bg-void/50 backdrop-blur">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-concrete/40 uppercase tracking-widest">Mission Debrief</span>
                                    <span className="text-xl font-display font-black text-concrete uppercase">{format(activeDateObj, 'EEEE, MMM do')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {stats.videos !== null && (
                                        <div className={`text-right px-3 py-1 border ${stats.isWin ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : stats.videos !== null && stats.videos >= 3 ? 'border-gold/30 bg-gold/10 text-gold' : 'border-blood/30 bg-blood/10 text-blood'}`}>
                                            <div className="text-[10px] font-mono font-bold uppercase">{stats.isWin ? 'WIN DAY' : stats.videos !== null && stats.videos >= 3 ? 'ACCEPTABLE' : 'FAIL DAY'}</div>
                                            <div className="text-xs">{stats.videos} Videos</div>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-steel/20 border border-steel/30 text-concrete px-4 py-2 font-bold uppercase tracking-wider text-xs hover:bg-steel/30 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                                <textarea
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                    placeholder="Debrief your mission parameters here. What did you accomplish? What obstacles arose? What is your plan for tomorrow?"
                                    className="w-full h-full bg-transparent border border-steel/10 p-4 outline-none text-concrete font-mono text-sm resize-none placeholder:text-concrete/20 leading-relaxed focus:border-gold/30 transition-colors"
                                    spellCheck={false}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
