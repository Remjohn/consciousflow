import { useState, useEffect } from 'react';
import { Target, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Dumbbell, Play, RotateCcw } from 'lucide-react';

interface Challenge {
    id: number;
    name: string;
    dayNumber: number;
    totalDays: number;
    videosProduced: number;
    videosTarget: number;
    dailyPushupsRequired: number;
    dailyAbsRequired: number;
    startTimeDeadline: string;
    minVideosPerTwoDays: number;
    status: string;
    startDate: string;
    winDays: number;
    failDays: number;
    paceRequired: number;
}

interface ChallengeHistory {
    id: number;
    name: string;
    status: string;
    failureReason: string | null;
    startDate: string;
    failedAt: string | null;
    completedAt: string | null;
}

export const ChallengeDashboard = () => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [history, setHistory] = useState<ChallengeHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchChallenge = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/challenge/active');
            const data = await res.json();
            setChallenge(data.challenge);
        } catch (error) {
            console.error('Failed to fetch challenge:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/challenge/history');
            const data = await res.json();
            setHistory(data.challenges || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const createChallenge = async () => {
        setIsCreating(true);
        try {
            const res = await fetch('http://localhost:3000/api/challenge/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: '150 Videos in 40 Days',
                    targetVideos: 150,
                    targetDays: 40,
                    dailyPushups: 250,
                    dailyAbs: 250,
                    startTimeDeadline: '05:45',
                    minVideosPerTwoDays: 10,
                    startDate: new Date().toISOString().split('T')[0]
                })
            });
            await res.json();
            await fetchChallenge();
            await fetchHistory();
        } catch (error) {
            console.error('Failed to create challenge:', error);
        }
        setIsCreating(false);
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchChallenge();
            await fetchHistory();
            setIsLoading(false);
        };
        load();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-gold animate-pulse font-mono text-sm">LOADING MISSION DATA...</div>
            </div>
        );
    }

    const progressPercent = challenge ? Math.round((challenge.videosProduced / challenge.videosTarget) * 100) : 0;
    const isAhead = challenge ? challenge.videosProduced >= (challenge.dayNumber * 5) : false;

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto max-w-lg mx-auto pb-24 scrollbar-hide">

            {/* HEADER */}
            <div className="text-center">
                <h1 className="font-display font-black text-2xl text-concrete uppercase tracking-widest">THE MISSION</h1>
                <p className="text-[10px] font-mono text-concrete/40 uppercase tracking-widest">150 Videos in 40 Days Challenge</p>
            </div>

            {!challenge ? (
                /* NO ACTIVE CHALLENGE */
                <div className="border-2 border-dashed border-steel/30 p-8 flex flex-col items-center gap-4">
                    <Target className="w-16 h-16 text-steel/30" />
                    <div className="text-center">
                        <div className="font-display font-black text-lg text-concrete uppercase">No Active Mission</div>
                        <div className="text-[10px] font-mono text-concrete/50 mt-1">Start the 150 in 40 Challenge to begin tracking</div>
                    </div>
                    <button
                        onClick={createChallenge}
                        disabled={isCreating}
                        className="bg-blood hover:bg-blood/80 text-white font-display font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 transition-all"
                    >
                        {isCreating ? (
                            <><RotateCcw className="w-4 h-4 animate-spin" /> INITIALIZING...</>
                        ) : (
                            <><Play className="w-4 h-4" /> LAUNCH MISSION</>
                        )}
                    </button>
                </div>
            ) : (
                /* ACTIVE CHALLENGE */
                <>
                    {/* DAY COUNTER */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-[10px] font-mono text-concrete/40 uppercase">Campaign Day</div>
                                <div className="font-display font-black text-4xl text-concrete">
                                    {challenge.dayNumber} <span className="text-lg text-concrete/40">/ {challenge.totalDays}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-mono text-concrete/40 uppercase">Days Remaining</div>
                                <div className="font-display font-black text-2xl text-gold">{challenge.totalDays - challenge.dayNumber}</div>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-[10px] font-mono text-concrete/40 uppercase">Video Progress</div>
                            <div className={`text-[10px] font-mono font-bold ${isAhead ? 'text-emerald-500' : 'text-blood'}`}>
                                {isAhead ? 'AHEAD OF PACE' : 'BEHIND PACE'}
                            </div>
                        </div>
                        <div className="h-4 bg-void border border-steel/30 relative overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isAhead ? 'bg-emerald-500' : 'bg-blood'}`}
                                style={{ width: `${Math.min(100, progressPercent)}%` }}
                            />
                            {/* Expected pace marker */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-gold"
                                style={{ left: `${(challenge.dayNumber / challenge.totalDays) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="text-lg font-display font-black text-concrete">
                                {challenge.videosProduced} <span className="text-concrete/40 text-sm">videos</span>
                            </div>
                            <div className="text-lg font-display font-black text-concrete/40">
                                {challenge.videosTarget}
                            </div>
                        </div>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-2 gap-2">
                        <StatCard
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Required Pace"
                            value={`${challenge.paceRequired}/day`}
                            color={challenge.paceRequired <= 5 ? 'text-emerald-500' : 'text-blood'}
                        />
                        <StatCard
                            icon={<Clock className="w-4 h-4" />}
                            label="Start Deadline"
                            value={challenge.startTimeDeadline}
                            color="text-gold"
                        />
                        <StatCard
                            icon={<CheckCircle className="w-4 h-4" />}
                            label="Win Days"
                            value={String(challenge.winDays)}
                            color="text-emerald-500"
                        />
                        <StatCard
                            icon={<XCircle className="w-4 h-4" />}
                            label="Fail Days"
                            value={String(challenge.failDays)}
                            color="text-blood"
                        />
                    </div>

                    {/* FITNESS REQUIREMENTS */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="text-[10px] font-mono text-concrete/40 uppercase mb-3">Daily Fitness Protocol</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-blood" />
                                <span className="font-mono text-sm text-concrete">{challenge.dailyPushupsRequired} Pushups</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-blood" />
                                <span className="font-mono text-sm text-concrete">{challenge.dailyAbsRequired} Abs</span>
                            </div>
                        </div>
                    </div>

                    {/* FAILURE CONDITIONS */}
                    <div className="bg-blood/10 border border-blood/30 p-4">
                        <div className="text-[10px] font-mono text-blood uppercase mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> AUTO-FAIL CONDITIONS
                        </div>
                        <ul className="text-[11px] font-mono text-concrete/70 space-y-1">
                            <li>• Less than 10 videos in any 2-day window</li>
                            <li>• 3 consecutive days starting after {challenge.startTimeDeadline}</li>
                            <li>• Pushups &lt; {challenge.dailyPushupsRequired} OR Abs &lt; {challenge.dailyAbsRequired} any day</li>
                        </ul>
                    </div>
                </>
            )}

            {/* CHALLENGE HISTORY */}
            {history.length > 0 && (
                <div className="mt-4">
                    <div className="text-[10px] font-mono text-concrete/40 uppercase mb-2 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Challenge History
                    </div>
                    <div className="space-y-2">
                        {history.filter(h => h.status !== 'ACTIVE').slice(0, 5).map(h => (
                            <div key={h.id} className={`border p-3 text-xs font-mono ${h.status === 'COMPLETED' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-blood/30 bg-blood/5'
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span className="text-concrete">{h.name}</span>
                                    <span className={h.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blood'}>
                                        {h.status}
                                    </span>
                                </div>
                                {h.failureReason && (
                                    <div className="text-blood/70 text-[10px] mt-1">{h.failureReason}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
    <div className="bg-steel/5 border border-steel/20 p-3">
        <div className="flex items-center gap-2 text-concrete/40 mb-1">
            {icon}
            <span className="text-[9px] font-mono uppercase">{label}</span>
        </div>
        <div className={`font-display font-black text-lg ${color}`}>{value}</div>
    </div>
);
