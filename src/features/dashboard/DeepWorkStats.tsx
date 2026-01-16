import { useState, useEffect } from 'react';
import { Crown, Zap, Target, Focus, Repeat, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface DeepWorkStatsData {
    period: string;
    sessionCount: number;
    totalMinutes: number;
    totalScore: number;
    averageSessionScore: number;
    perfectSessions: number;
    failedSessions: number;
    pillarAverages: {
        speed: number;
        focus: number;
        flow: number;
        priority: number;
        context: number;
    };
    performanceTier: 'LEGENDARY' | 'ELITE' | 'STRONG' | 'DECENT' | 'WEAK' | 'FAILED' | 'NONE';
}

interface SessionData {
    id: number;
    date: string;
    taskDescription: string;
    taskCategory: string | null;
    accomplishmentNotes: string | null;
    totalScore: number;
    scoreSpeed: number;
    scoreFocus: number;
    scoreFlow: number;
    scorePriority: number;
    scoreContext: number;
    durationMinutes: number;
    startedAt: string;
}

interface RecordsData {
    bestDay: { date: string; score: number };
    totalSessions: number;
    perfectSessions: number;
    longestPositiveStreak: number;
    allTimeScore: number;
    averageScore: number;
}

const TIER_CONFIG = {
    LEGENDARY: { color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/30', emoji: '🏆' },
    ELITE: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '⭐' },
    STRONG: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', emoji: '💪' },
    DECENT: { color: 'text-concrete', bg: 'bg-steel/10', border: 'border-steel/30', emoji: '✓' },
    WEAK: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', emoji: '⚠' },
    FAILED: { color: 'text-blood', bg: 'bg-blood/10', border: 'border-blood/30', emoji: '💀' },
    NONE: { color: 'text-concrete/50', bg: 'bg-steel/5', border: 'border-steel/20', emoji: '—' }
};

const PILLARS = [
    { key: 'speed', icon: Zap, label: 'Speed' },
    { key: 'focus', icon: Focus, label: 'Focus' },
    { key: 'flow', icon: Repeat, label: 'Flow' },
    { key: 'priority', icon: Target, label: 'Priority' },
    { key: 'context', icon: Star, label: 'Context' },
];

export const DeepWorkStats = () => {
    const [todayStats, setTodayStats] = useState<DeepWorkStatsData | null>(null);
    const [yesterdayStats, setYesterdayStats] = useState<DeepWorkStatsData | null>(null);
    const [weekStats, setWeekStats] = useState<DeepWorkStatsData | null>(null);
    const [monthStats, setMonthStats] = useState<DeepWorkStatsData | null>(null);
    const [allTimeStats, setAllTimeStats] = useState<DeepWorkStatsData | null>(null);
    const [records, setRecords] = useState<RecordsData | null>(null);
    const [todaySessions, setTodaySessions] = useState<SessionData[]>([]);
    const [expandedSession, setExpandedSession] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            const [today, yesterday, week, month, alltime, recs] = await Promise.all([
                fetch(`${API_URL}/api/deepwork/stats/today`).then(r => r.json()),
                fetch(`${API_URL}/api/deepwork/stats/yesterday`).then(r => r.json()),
                fetch(`${API_URL}/api/deepwork/stats/week`).then(r => r.json()),
                fetch(`${API_URL}/api/deepwork/stats/month`).then(r => r.json()),
                fetch(`${API_URL}/api/deepwork/stats/alltime`).then(r => r.json()),
                fetch(`${API_URL}/api/deepwork/stats/records`).then(r => r.json()),
            ]);

            setTodayStats(today.stats);
            setTodaySessions(today.sessions || []);
            setYesterdayStats(yesterday.stats);
            setWeekStats(week.stats);
            setMonthStats(month.stats);
            setAllTimeStats(alltime.stats);
            setRecords(recs);
        } catch (error) {
            console.error('Failed to fetch deep work stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatScore = (score: number) => {
        return score > 0 ? `+${score}` : String(score);
    };

    const getScoreColor = (score: number) => {
        if (score >= 3) return 'text-gold';
        if (score >= 1) return 'text-emerald-500';
        if (score >= 0) return 'text-concrete';
        if (score >= -3) return 'text-orange-500';
        return 'text-blood';
    };

    if (loading) {
        return (
            <div className="bg-void border border-steel/20 p-6 text-center">
                <p className="text-concrete/50 animate-pulse">Loading Deep Work stats...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* TODAY'S WAR REPORT */}
            {todayStats && (
                <div className={`border rounded-lg p-4 ${TIER_CONFIG[todayStats.performanceTier].border} ${TIER_CONFIG[todayStats.performanceTier].bg}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-concrete/50 mb-1">Today's War Report</p>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">{TIER_CONFIG[todayStats.performanceTier].emoji}</span>
                                <span className={`text-4xl font-mono font-black ${TIER_CONFIG[todayStats.performanceTier].color}`}>
                                    {formatScore(todayStats.totalScore)} pts
                                </span>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${TIER_CONFIG[todayStats.performanceTier].bg} ${TIER_CONFIG[todayStats.performanceTier].color}`}>
                            {todayStats.performanceTier} DAY
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-concrete">{todayStats.sessionCount}</p>
                            <p className="text-[10px] text-concrete/50 uppercase">Sessions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-concrete">{todayStats.totalMinutes}m</p>
                            <p className="text-[10px] text-concrete/50 uppercase">Focus Time</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gold">{todayStats.perfectSessions}</p>
                            <p className="text-[10px] text-concrete/50 uppercase">Perfect</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blood">{todayStats.failedSessions}</p>
                            <p className="text-[10px] text-concrete/50 uppercase">Failed</p>
                        </div>
                    </div>

                    {/* Pillar Breakdown */}
                    <div className="flex gap-1">
                        {PILLARS.map(pillar => {
                            const avg = todayStats.pillarAverages[pillar.key as keyof typeof todayStats.pillarAverages];
                            return (
                                <div
                                    key={pillar.key}
                                    className={`flex-1 text-center py-2 rounded ${avg >= 0.5 ? 'bg-gold/20 text-gold' :
                                        avg >= 0 ? 'bg-steel/20 text-concrete' :
                                            'bg-blood/20 text-blood'
                                        }`}
                                >
                                    <pillar.icon size={14} className="mx-auto mb-1" />
                                    <p className="text-xs font-bold">{formatScore(avg)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* COMPARISON STRIP */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: 'Yesterday', stats: yesterdayStats },
                    { label: 'This Week', stats: weekStats },
                    { label: 'This Month', stats: monthStats },
                    { label: 'All Time', stats: allTimeStats },
                ].map(({ label, stats }) => (
                    <div key={label} className="bg-steel/5 border border-steel/20 rounded-lg p-3 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete/40 mb-1">{label}</p>
                        <p className={`text-xl font-mono font-bold ${stats ? getScoreColor(stats.totalScore) : 'text-concrete/30'}`}>
                            {stats ? formatScore(stats.totalScore) : '—'}
                        </p>
                        <p className="text-[10px] text-concrete/50">
                            {stats ? `${stats.sessionCount} sessions` : 'No data'}
                        </p>
                    </div>
                ))}
            </div>

            {/* RECORDS */}
            {records && (
                <div className="bg-steel/5 border border-steel/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Crown size={16} className="text-gold" />
                        <p className="text-xs uppercase tracking-widest text-concrete/50">Personal Records</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-xl font-bold text-gold">{formatScore(records.bestDay.score)}</p>
                            <p className="text-[10px] text-concrete/50">Best Day</p>
                            <p className="text-[9px] text-concrete/30">{records.bestDay.date || 'N/A'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-emerald-500">{records.perfectSessions}</p>
                            <p className="text-[10px] text-concrete/50">Perfect Sessions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-blue-400">{records.longestPositiveStreak}</p>
                            <p className="text-[10px] text-concrete/50">Longest Streak</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-steel/20 flex justify-between text-sm">
                        <span className="text-concrete/50">All-Time Score:</span>
                        <span className={`font-bold ${getScoreColor(records.allTimeScore)}`}>
                            {formatScore(records.allTimeScore)} pts ({records.totalSessions} sessions)
                        </span>
                    </div>
                </div>
            )}

            {/* TODAY'S SESSION LOG */}
            {todaySessions.length > 0 && (
                <div className="bg-steel/5 border border-steel/20 rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-steel/20">
                        <p className="text-xs uppercase tracking-widest text-concrete/50">Today's Sessions</p>
                    </div>
                    <div className="divide-y divide-steel/10">
                        {todaySessions.map((session) => (
                            <div key={session.id}>
                                <button
                                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                                    className="w-full p-3 flex items-center justify-between hover:bg-steel/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xl font-mono font-bold ${getScoreColor(session.totalScore)}`}>
                                            {formatScore(session.totalScore)}
                                        </span>
                                        <div className="text-left">
                                            <p className="text-sm text-concrete font-medium truncate max-w-[200px]">
                                                {session.taskDescription}
                                            </p>
                                            <p className="text-[10px] text-concrete/40">
                                                {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.durationMinutes}m
                                            </p>
                                        </div>
                                    </div>
                                    {expandedSession === session.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {expandedSession === session.id && (
                                    <div className="px-3 pb-3 bg-steel/5">
                                        {/* Pillar scores */}
                                        <div className="flex gap-1 mb-2">
                                            {PILLARS.map(pillar => {
                                                const score = session[`score${pillar.key.charAt(0).toUpperCase() + pillar.key.slice(1)}` as keyof SessionData] as number;
                                                return (
                                                    <div
                                                        key={pillar.key}
                                                        className={`flex-1 text-center py-1 rounded text-xs ${score === 1 ? 'bg-gold/20 text-gold' :
                                                            score === 0 ? 'bg-steel/20 text-concrete' :
                                                                'bg-blood/20 text-blood'
                                                            }`}
                                                    >
                                                        {score === 1 ? '+1' : score === 0 ? '0' : '-2'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* Accomplishment */}
                                        {session.accomplishmentNotes && (
                                            <p className="text-xs text-concrete/70 italic">
                                                "{session.accomplishmentNotes}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {todaySessions.length === 0 && (
                <div className="bg-steel/5 border border-steel/20 rounded-lg p-6 text-center">
                    <p className="text-concrete/50">No deep work sessions today.</p>
                    <p className="text-xs text-concrete/30 mt-1">Start a session to begin tracking.</p>
                </div>
            )}
        </div>
    );
};

export default DeepWorkStats;
