import { useState, useEffect } from 'react';
import { Target, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Dumbbell, Play } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface Challenge {
    id: number;
    name: string;
    dayNumber: number;
    totalDays: number;
    videosProduced: number; // Stored as videos in DB, represented as Packages in UI
    videosTarget: number; // Represents Target Packages
    dailyPushupsRequired: number;
    dailyAbsRequired: number;
    startTimeDeadline: string;
    minVideosPerTwoDays: number; // Represents Min Packages Per 2 Days
    status: string;
    startDate: string;
    winDays: number;
    failDays: number;
    paceRequired: number;
    historyGrid?: Record<string, boolean>;
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
    const [isBuilding, setIsBuilding] = useState(false);

    // Builder State
    const [buildForm, setBuildForm] = useState({
        name: 'Era 3 Weekly Package Protocol',
        targetVideos: 50, // UI maps this to Target Packages
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyPushups: 250,
        dailyAbs: 250,
        startTimeDeadline: '05:45',
        minVideosPerTwoDays: 2 // UI maps this to Min Packages
    });

    const fetchChallenge = async () => {
        try {
            const res = await fetch(`${API_URL}/api/challenge/active`);
            const data = await res.json();
            setChallenge(data.challenge);
        } catch (error) {
            console.error('Failed to fetch challenge:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/challenge/history`);
            const data = await res.json();
            setHistory(data.challenges || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const createChallenge = async () => {
        setIsCreating(true);
        try {
            const endpoint = challenge ? '/api/challenge/update' : '/api/challenge/create';
            const method = challenge ? 'PUT' : 'POST';
            
            const res = await fetch(`${API_URL}${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...buildForm
                })
            });
            await res.json();
            await fetchChallenge();
            await fetchHistory();
            setIsBuilding(false);
        } catch (error) {
            console.error('Failed to save challenge:', error);
        }
        setIsCreating(false);
    };

    const openEditor = () => {
        if (challenge) {
            const start = challenge.startDate || new Date().toISOString().split('T')[0];
            const end = new Date(new Date(start).getTime() + (challenge.totalDays - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            setBuildForm({
                name: challenge.name,
                targetVideos: challenge.videosTarget,
                startDate: start,
                endDate: end,
                dailyPushups: challenge.dailyPushupsRequired,
                dailyAbs: challenge.dailyAbsRequired,
                startTimeDeadline: challenge.startTimeDeadline,
                minVideosPerTwoDays: challenge.minVideosPerTwoDays
            });
        } else {
            setBuildForm({
                ...buildForm,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
        }
        setIsBuilding(true);
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
                <div className="text-gold animate-pulse font-mono text-sm">LOADING CAMPAIGN DATA...</div>
            </div>
        );
    }

    const progressPercent = challenge ? Math.round((challenge.videosProduced / Math.max(1, challenge.videosTarget)) * 100) : 0;
    const isAhead = challenge ? challenge.videosProduced >= (challenge.dayNumber * (challenge.videosTarget / challenge.totalDays)) : false;

    return (
        <div className="flex flex-col p-4 gap-4 overflow-y-auto pb-28 scrollbar-hide min-h-full">

            {/* HEADER */}
            <div className="text-center">
                <h1 className="font-display font-black text-2xl text-concrete uppercase tracking-widest">THE CAMPAIGN</h1>
                <p className="text-[10px] font-mono text-concrete/40 uppercase tracking-widest">Active Era 3 Protocol</p>
            </div>

            {/* BUILDER MODAL */}
            {isBuilding ? (
                <div className="border border-steel/30 bg-void p-4">
                    <div className="font-display font-black text-lg text-concrete uppercase tracking-widest mb-4 border-b border-steel/20 pb-2 flex items-center gap-2">
                        <Target className="w-5 h-5 text-gold" /> {challenge ? 'EDIT CAMPAIGN PARAMETERS' : 'CONFIGURING NEW CAMPAIGN'}
                    </div>
                    
                    <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Campaign Title</label>
                                <input 
                                    type="text" 
                                    value={buildForm.name} 
                                    onChange={e => setBuildForm({...buildForm, name: e.target.value})}
                                    className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Target Client Packages</label>
                                    <input 
                                        type="number" 
                                        value={buildForm.targetVideos} 
                                        onChange={e => setBuildForm({...buildForm, targetVideos: parseInt(e.target.value) || 0})}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Min Packages / 2 Days</label>
                                    <input 
                                        type="number" 
                                        value={buildForm.minVideosPerTwoDays} 
                                        onChange={e => setBuildForm({...buildForm, minVideosPerTwoDays: parseInt(e.target.value) || 0})}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        value={buildForm.startDate} 
                                        onChange={e => {
                                            const newStart = e.target.value;
                                            const d = new Date(newStart);
                                            d.setDate(d.getDate() + 39); // 40 days inclusive
                                            setBuildForm({...buildForm, startDate: newStart, endDate: d.toISOString().split('T')[0]});
                                        }}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">End Date</label>
                                    <input 
                                        type="date" 
                                        value={buildForm.endDate} 
                                        onChange={e => setBuildForm({...buildForm, endDate: e.target.value})}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Daily Pushups</label>
                                    <input 
                                        type="number" 
                                        value={buildForm.dailyPushups} 
                                        onChange={e => setBuildForm({...buildForm, dailyPushups: parseInt(e.target.value) || 0})}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Daily Abs</label>
                                    <input 
                                        type="number" 
                                        value={buildForm.dailyAbs} 
                                        onChange={e => setBuildForm({...buildForm, dailyAbs: parseInt(e.target.value) || 0})}
                                        className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-mono text-concrete/40 uppercase block mb-1">Start Time Deadline</label>
                                <input 
                                    type="time" 
                                    value={buildForm.startTimeDeadline} 
                                    onChange={e => setBuildForm({...buildForm, startTimeDeadline: e.target.value})}
                                    className="w-full bg-steel/10 border border-steel/30 text-concrete px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold/50"
                                />
                            </div>

                        <div className="flex gap-2 pt-4 border-t border-steel/20">
                            <button 
                                onClick={() => setIsBuilding(false)}
                                className="flex-1 bg-void border border-steel/30 text-concrete/70 hover:text-concrete hover:bg-steel/10 px-4 py-3 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={createChallenge}
                                disabled={isCreating}
                                className="flex-[2] bg-gold hover:bg-gold/80 text-void font-black px-4 py-3 text-xs uppercase tracking-widest clip-path-polygon transition-colors disabled:opacity-50"
                            >
                                {isCreating ? 'SAVING...' : (challenge ? 'SAVE CHANGES' : 'LAUNCH PROTOCOL')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : !challenge ? (
                /* NO ACTIVE CHALLENGE */
                <div className="border-2 border-dashed border-steel/30 p-8 flex flex-col items-center gap-4">
                    <Target className="w-16 h-16 text-steel/30" />
                    <div className="text-center">
                        <div className="font-display font-black text-lg text-concrete uppercase">No Active Campaign</div>
                        <div className="text-[10px] font-mono text-concrete/50 mt-1">Start a new campaign to begin tracking packages</div>
                    </div>
                    <button
                        onClick={openEditor}
                        className="bg-gold hover:bg-gold/80 text-void font-display font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 transition-all"
                    >
                        <Play className="w-4 h-4" /> BUILD CAMPAIGN
                    </button>
                </div>
            ) : (
                /* ACTIVE CHALLENGE */
                <>
                    {/* DAY COUNTER */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="text-[10px] font-mono text-concrete/40 uppercase">Campaign Day</div>
                                <div className="font-display font-black text-4xl text-concrete leading-none">
                                    {challenge.dayNumber} <span className="text-lg text-concrete/40">/ {challenge.totalDays}</span>
                                </div>
                            </div>
                            <button
                                onClick={openEditor}
                                className="text-[10px] font-bold font-mono text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold/10 uppercase tracking-widest transition-colors"
                            >
                                Edit Parameters
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-steel/20">
                            <div className="text-[10px] font-mono text-concrete/40 uppercase">Days Remaining</div>
                            <div className="font-display font-black text-xl text-gold">{Math.max(0, challenge.totalDays - challenge.dayNumber)}</div>
                        </div>
                    </div>

                    {/* DOTTED CALENDAR GRAPH */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] font-mono text-concrete/40 uppercase">Campaign Tracker</div>
                            <div className="text-[9px] font-mono text-concrete/30">{challenge.totalDays} Days</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: challenge.totalDays }).map((_, i) => {
                                const d = new Date(challenge.startDate);
                                d.setDate(d.getDate() + i + 1); // fix offset if needed
                                const dateStr = d.toISOString().split('T')[0];
                                
                                const isWin = challenge.historyGrid?.[dateStr];
                                const isFuture = i + 1 > challenge.dayNumber;
                                const isToday = i + 1 === challenge.dayNumber;
                                
                                let dotColor = 'bg-steel/10 border border-steel/20'; // empty/future
                                if (isWin === true) dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                                else if (isWin === false) dotColor = 'bg-blood shadow-[0_0_8px_rgba(220,38,38,0.5)]';
                                else if (isToday) dotColor = 'bg-gold/50 border border-gold animate-pulse';

                                return (
                                    <div 
                                        key={i} 
                                        className={`w-3.5 h-3.5 rounded-full ${dotColor}`}
                                        title={`${dateStr}: ${isFuture ? 'Pending' : (isWin === true ? 'Win' : (isWin === false ? 'Fail' : (isToday ? 'Today' : 'No Log')))}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-[10px] font-mono text-concrete/40 uppercase">Package Progress</div>
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
                                {challenge.videosProduced} <span className="text-concrete/40 text-sm">packages</span>
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
                            color={challenge.paceRequired <= 1 ? 'text-emerald-500' : 'text-gold'}
                        />
                        <StatCard
                            icon={<Clock className="w-4 h-4" />}
                            label="Start Deadline"
                            value={challenge.startTimeDeadline}
                            color="text-concrete"
                        />
                        <StatCard
                            icon={<CheckCircle className="w-4 h-4" />}
                            label="Win Days"
                            value={String(challenge.winDays || 0)}
                            color="text-emerald-500"
                        />
                        <StatCard
                            icon={<XCircle className="w-4 h-4" />}
                            label="Fail Days"
                            value={String(challenge.failDays || 0)}
                            color="text-blood"
                        />
                    </div>

                    {/* FITNESS REQUIREMENTS */}
                    <div className="bg-steel/5 border border-steel/20 p-4">
                        <div className="text-[10px] font-mono text-concrete/40 uppercase mb-3">Daily Fitness Protocol</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-concrete/70" />
                                <span className="font-mono text-sm text-concrete">{challenge.dailyPushupsRequired} Pushups</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-concrete/70" />
                                <span className="font-mono text-sm text-concrete">{challenge.dailyAbsRequired} Abs</span>
                            </div>
                        </div>
                    </div>

                    {/* THE 3 SACRIFICES */}
                    <div className="bg-void border border-emerald-500/30 p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="text-[10px] font-mono text-emerald-500 uppercase mb-3 flex items-center gap-2 tracking-widest font-bold">
                            <AlertTriangle className="w-3 h-3" /> The 3 Sacrifices
                        </div>
                        <div className="space-y-3">
                            <SacrificeItem 
                                label="No Social Media" 
                                description="Zero doomscrolling. Total disconnect."
                                onFail={() => {
                                    if(confirm("Are you sure? Failing a sacrifice will instantly kill this campaign and force a restart to Day 1.")) {
                                        fetch(`${API_URL}/api/challenge/fail`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ reason: 'Failed Sacrifice: No Social Media' })
                                        }).then(fetchChallenge).then(fetchHistory);
                                    }
                                }} 
                            />
                            <SacrificeItem 
                                label="No YouTube (Entertainment)" 
                                description="Only educational or pipeline-related content."
                                onFail={() => {
                                    if(confirm("Are you sure? Failing a sacrifice will instantly kill this campaign and force a restart to Day 1.")) {
                                        fetch(`${API_URL}/api/challenge/fail`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ reason: 'Failed Sacrifice: No YouTube' })
                                        }).then(fetchChallenge).then(fetchHistory);
                                    }
                                }} 
                            />
                            <SacrificeItem 
                                label="Eating Only After 4 Deep Work Sessions" 
                                description="No food until the work is done. Fasting for focus."
                                onFail={() => {
                                    if(confirm("Are you sure? Failing a sacrifice will instantly kill this campaign and force a restart to Day 1.")) {
                                        fetch(`${API_URL}/api/challenge/fail`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ reason: 'Failed Sacrifice: Ate early' })
                                        }).then(fetchChallenge).then(fetchHistory);
                                    }
                                }} 
                            />
                        </div>
                    </div>

                    {/* FAILURE CONDITIONS */}
                    <div className="bg-blood/10 border border-blood/30 p-4">
                        <div className="text-[10px] font-mono text-blood uppercase mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> AUTO-FAIL CONDITIONS
                        </div>
                        <ul className="text-[11px] font-mono text-concrete/70 space-y-1">
                            <li>• Less than {challenge.minVideosPerTwoDays} packages in any 2-day window</li>
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
                        <Calendar className="w-3 h-3 text-concrete/70" /> Campaign History
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

const SacrificeItem = ({ label, description, onFail }: { label: string, description: string, onFail: () => void }) => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="flex items-start justify-between border-b border-emerald-500/10 pb-3 last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => setChecked(!checked)}
                    className={`mt-0.5 w-4 h-4 border flex items-center justify-center transition-colors ${checked ? 'bg-emerald-500 border-emerald-500' : 'bg-void border-emerald-500/50 hover:bg-emerald-500/20'}`}
                >
                    {checked && <CheckCircle className="w-3 h-3 text-void" />}
                </button>
                <div>
                    <div className={`font-bold text-sm transition-colors ${checked ? 'text-emerald-500 line-through opacity-70' : 'text-concrete'}`}>{label}</div>
                    <div className="text-[9px] font-mono text-concrete/40 mt-0.5">{description}</div>
                </div>
            </div>
            <button 
                onClick={onFail}
                className="bg-blood/10 hover:bg-blood/30 text-blood border border-blood/20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors"
            >
                FAIL
            </button>
        </div>
    );
};
