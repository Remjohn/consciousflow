import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Plus, PiggyBank, ArrowUp, ArrowDown, Wallet, TrendingUp, ChevronRight } from 'lucide-react';
import { API_URL } from '../../lib/api';
import { Investments } from '../investments/Investments';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Bucket { capacity: number; allocated: number; spent: number; }
interface FinanceSummary {
    weeklyEarnings: number;
    monthlyEarnings: number;
    maxMonthlyCapacity: number;
    monthlySavings: number;
    totalSpent: number;
    buckets: Record<string, Bucket>;
}
interface HistoryMonth { month: string; earned: number; spent: number; saved: number; }

const BUCKET_META: Record<string, { icon: string; label: string; color: string }> = {
    WIFE:      { icon: '❤️',  label: 'Wife',          color: 'from-rose-500/20 to-rose-600/5 border-rose-500/30' },
    DAUGHTER:  { icon: '👧',  label: 'Daughter',      color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30' },
    ME:        { icon: '🧍‍♂️', label: 'Me',           color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30' },
    RENT:      { icon: '🏠',  label: 'Rent',          color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30' },
    CAR:       { icon: '🏎️',  label: 'Car / Emergency', color: 'from-orange-500/20 to-orange-600/5 border-orange-500/30' },
    WEDDING:   { icon: '💍',  label: 'Wedding',       color: 'from-pink-500/20 to-pink-600/5 border-pink-500/30' },
    GROCERIES: { icon: '🛒',  label: 'Groceries',     color: 'from-teal-500/20 to-teal-600/5 border-teal-500/30' },
};

const SOURCES = ['PACKAGE', 'FREELANCE', 'BONUS', 'GIFT', 'OTHER'];

export const FinanceTracker = () => {
    const [tab, setTab] = useState<'OVERVIEW' | 'EXPENSES' | 'HISTORY'>('OVERVIEW');
    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [history, setHistory] = useState<HistoryMonth[]>([]);
    const [showEarnings, setShowEarnings] = useState(false);

    const [earningsDate, setEarningsDate] = useState(new Date().toISOString().split('T')[0]);
    const [earningsAmount, setEarningsAmount] = useState('');
    const [earningsSource, setEarningsSource] = useState('PACKAGE');
    const [earningsNotes, setEarningsNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchSummary = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/finance/summary`);
            const data = await res.json();
            setSummary(data);
        } catch (e) { console.error(e); }
    }, []);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/finance/history`);
            const data = await res.json();
            setHistory(data.history || []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchSummary(); fetchHistory(); }, [fetchSummary, fetchHistory]);

    const logEarnings = async () => {
        if (!earningsAmount || parseFloat(earningsAmount) <= 0) return;
        setSubmitting(true);
        try {
            await fetch(`${API_URL}/api/finance/earnings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: earningsDate, amount: earningsAmount, source: earningsSource, notes: earningsNotes })
            });
            setSuccessMsg(`+$${parseFloat(earningsAmount).toFixed(2)} logged ✓`);
            setEarningsAmount('');
            setEarningsNotes('');
            setShowEarnings(false);
            setTimeout(() => setSuccessMsg(''), 4000);
            fetchSummary();
            fetchHistory();
        } finally {
            setSubmitting(false);
        }
    };

    const totalBucketCapacity = 3300;
    const spentPct = summary ? Math.min(100, ((summary.totalSpent || 0) / totalBucketCapacity) * 100) : 0;
    const savedPct = summary ? Math.min(100, (summary.monthlySavings / Math.max(summary.monthlyEarnings, 1)) * 100) : 0;

    return (
        <div className="h-full flex flex-col pb-24 bg-void scrollbar-hide">

            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-b border-steel/20 px-5 pt-5 pb-4">
                {/* subtle glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center">
                            <DollarSign size={16} className="text-gold" />
                        </div>
                        <div>
                            <h1 className="font-display font-black text-lg text-concrete uppercase tracking-widest leading-none">Fortress Finance</h1>
                            <div className="text-[9px] font-mono text-concrete/30 uppercase">Era 3 · Budget Command</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEarnings(!showEarnings)}
                        className="flex items-center gap-1.5 bg-gold text-void px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-gold/80 transition-colors"
                    >
                        <Plus size={12} /> Log Income
                    </button>
                </div>

                {/* Top KPIs */}
                {summary && (
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/3 border border-steel/15 p-3 rounded-sm">
                            <div className="text-[8px] font-mono text-concrete/40 uppercase mb-1">Monthly Earned</div>
                            <div className="text-xl font-black text-concrete">${summary.monthlyEarnings.toFixed(0)}</div>
                        </div>
                        <div className="bg-blood/5 border border-blood/20 p-3 rounded-sm">
                            <div className="text-[8px] font-mono text-blood/60 uppercase mb-1">Spent</div>
                            <div className="text-xl font-black text-blood">${(summary.totalSpent || 0).toFixed(0)}</div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-sm">
                            <div className="text-[8px] font-mono text-emerald-400/60 uppercase mb-1">🔒 Saved</div>
                            <div className="text-xl font-black text-emerald-400">${summary.monthlySavings.toFixed(0)}</div>
                        </div>
                    </div>
                )}

                {/* Spending bar */}
                {summary && (
                    <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-concrete/30 uppercase">
                            <span>Spent vs $3,300 cap</span>
                            <span>{spentPct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-steel/15 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-gold to-blood transition-all duration-700"
                                style={{ width: `${spentPct}%` }} />
                        </div>
                    </div>
                )}

                {/* Success toast */}
                {successMsg && (
                    <div className="mt-3 py-2 px-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center rounded-sm animate-pulse">
                        {successMsg}
                    </div>
                )}
            </div>

            {/* ── EARNINGS ENTRY PANEL ── */}
            {showEarnings && (
                <div className="border-b border-gold/20 bg-[#0d0d0d] px-5 py-4 space-y-3">
                    <div className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">Log Daily Income</div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={earningsDate} onChange={e => setEarningsDate(e.target.value)}
                            className="bg-steel/10 border border-steel/20 px-3 py-2.5 text-sm font-mono text-concrete focus:border-gold/50 outline-none" />
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-bold text-sm">$</span>
                            <input type="number" placeholder="0.00" value={earningsAmount}
                                onChange={e => setEarningsAmount(e.target.value)}
                                className="w-full bg-steel/10 border border-steel/20 pl-7 pr-3 py-2.5 text-sm font-mono text-concrete focus:border-gold/50 outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <select value={earningsSource} onChange={e => setEarningsSource(e.target.value)}
                            className="bg-steel/10 border border-steel/20 px-3 py-2.5 text-sm font-mono text-concrete focus:border-gold/50 outline-none">
                            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input type="text" placeholder="Note (optional)" value={earningsNotes}
                            onChange={e => setEarningsNotes(e.target.value)}
                            className="bg-steel/10 border border-steel/20 px-3 py-2.5 text-sm font-mono text-concrete focus:border-gold/50 outline-none" />
                    </div>
                    <button onClick={logEarnings} disabled={submitting || !earningsAmount}
                        className="w-full py-3 bg-gold text-void font-black text-sm uppercase tracking-widest disabled:opacity-40 hover:bg-gold/80 transition-colors">
                        {submitting ? 'LOGGING...' : 'CONFIRM EARNINGS'}
                    </button>
                </div>
            )}

            {/* ── TAB BAR ── */}
            <div className="flex border-b border-steel/20 bg-[#0a0a0a]">
                {(['OVERVIEW', 'EXPENSES', 'HISTORY'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${tab === t ? 'text-gold border-b-2 border-gold bg-gold/5' : 'text-concrete/30 hover:text-concrete/60'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* ── CONTENT ── */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

                {/* OVERVIEW TAB */}
                {tab === 'OVERVIEW' && summary && (
                    <div className="px-4 py-4 space-y-5">

                        {/* Savings Lock Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/60 to-void border border-emerald-500/20 p-5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-3 mb-3">
                                <PiggyBank className="w-5 h-5 text-emerald-400" />
                                <div className="text-[9px] font-mono text-emerald-400/70 uppercase tracking-widest">Savings This Month</div>
                            </div>
                            <div className="text-4xl font-black text-emerald-400 mb-1">${summary.monthlySavings.toFixed(2)}</div>
                            <div className="text-[8px] font-mono text-emerald-400/40 uppercase">
                                {savedPct.toFixed(0)}% of income secured · Earned ${summary.monthlyEarnings} · Spent ${(summary.totalSpent || 0).toFixed(0)}
                            </div>
                        </div>

                        {/* Bucket Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[9px] font-mono text-concrete/30 uppercase tracking-widest">Baseline Allocation</div>
                                <div className="text-[9px] font-mono text-concrete/30">$3,300 / mo cap</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                {Object.entries(summary.buckets).map(([key, bucket]) => {
                                    const remaining = bucket.capacity - bucket.spent;
                                    const pct = Math.min(100, (bucket.spent / bucket.capacity) * 100);
                                    const isFull = remaining <= 0;
                                    const meta = BUCKET_META[key] || { icon: '📦', label: key, color: 'from-steel/20 to-void border-steel/20' };

                                    return (
                                        <div key={key} className={`bg-gradient-to-br ${meta.color} border p-3 rounded-sm space-y-2.5`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm">{meta.icon}</span>
                                                    <span className="text-[9px] font-mono text-concrete/60 uppercase">{meta.label}</span>
                                                </div>
                                                <span className="text-[8px] font-mono text-concrete/30">${bucket.capacity}</span>
                                            </div>

                                            <div className={`text-xl font-black ${isFull ? 'text-blood' : 'text-concrete'}`}>
                                                ${remaining.toFixed(0)}
                                                <span className="text-[9px] font-mono text-concrete/30 ml-1">left</span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-blood' : 'bg-gold/70'}`}
                                                        style={{ width: `${pct}%` }} />
                                                </div>
                                                <div className="text-[7px] font-mono text-concrete/25">${bucket.spent.toFixed(0)} spent</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Weekly Pulse */}
                        <div className="bg-steel/5 border border-steel/15 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={18} className="text-gold/60" />
                                <div>
                                    <div className="text-[8px] font-mono text-concrete/30 uppercase">This Week's Earnings</div>
                                    <div className="text-lg font-black text-concrete">${summary.weeklyEarnings.toFixed(0)}</div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-concrete/20" />
                        </div>
                    </div>
                )}

                {/* EXPENSES TAB */}
                {tab === 'EXPENSES' && (
                    <div className="-mt-0">
                        <Investments />
                    </div>
                )}

                {/* HISTORY TAB */}
                {tab === 'HISTORY' && (
                    <div className="px-4 py-4 space-y-3">
                        <div className="text-[9px] font-mono text-concrete/30 uppercase tracking-widest mb-2">Earnings vs Spending</div>
                        
                        {history.length > 0 ? (
                            <>
                                {/* THE GRAPH */}
                                <div className="h-48 w-full bg-steel/5 border border-steel/15 p-2 rounded-sm mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[...history].reverse()} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373', fontFamily: 'monospace' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373', fontFamily: 'monospace' }} tickFormatter={(v) => `$${v}`} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px' }}
                                                itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                                                labelStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#737373', marginBottom: '4px' }}
                                            />
                                            <Area type="monotone" dataKey="earned" name="Earned" stroke="#10b981" fillOpacity={1} fill="url(#colorEarned)" />
                                            <Area type="monotone" dataKey="spent" name="Spent" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpent)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="text-[9px] font-mono text-concrete/30 uppercase tracking-widest mb-2 mt-4">Monthly Ledger</div>
                                {history.map((m, i) => {
                            const spentRatio = Math.min(100, (m.spent / Math.max(m.earned, 1)) * 100);
                            const savedRatio = Math.min(100, (m.saved / Math.max(m.earned, 1)) * 100);
                            return (
                                <div key={i} className="bg-steel/5 border border-steel/15 p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="font-mono font-bold text-sm text-concrete uppercase tracking-wide">{m.month}</div>
                                        <div className="text-[9px] font-mono text-emerald-400/70">+${m.saved} saved</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <div className="text-[7px] font-mono text-concrete/30 uppercase mb-0.5">Earned</div>
                                            <div className="text-sm font-bold text-concrete">${m.earned}</div>
                                        </div>
                                        <div>
                                            <div className="text-[7px] font-mono text-blood/50 uppercase mb-0.5">Spent</div>
                                            <div className="text-sm font-bold text-blood">${m.spent}</div>
                                        </div>
                                        <div>
                                            <div className="text-[7px] font-mono text-emerald-400/50 uppercase mb-0.5">Saved</div>
                                            <div className="text-sm font-bold text-emerald-400">${m.saved}</div>
                                        </div>
                                    </div>

                                    {/* Stacked bar */}
                                    <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blood/70 transition-all" style={{ width: `${spentRatio}%` }} />
                                        <div className="h-full bg-emerald-500/60 transition-all" style={{ width: `${savedRatio}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        </>
                        ) : (
                            <div className="text-center py-12 text-concrete/20 font-mono text-sm">
                                No history yet. Start logging earnings.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


