import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Monitor, DollarSign, Dumbbell, Utensils, Zap, Moon, Smartphone, Brain, AlertTriangle, TrendingUp, TrendingDown, Minus, Camera, Check, Link as LinkIcon, Edit2 } from 'lucide-react';
import { ProtocolTimer } from './ProtocolTimer';
import { FitnessProtocol } from '../fitness/FitnessProtocol';
import { DisciplineCorrelation } from '../fitness/DisciplineCorrelation';
import { ScrollingQuotes } from '../../components/ScrollingQuotes';
import { usePunishment } from '../../hooks/usePunishment';

type TimeScope = 'day' | 'week' | 'month';

export const Dashboard = () => {
    const {
        today,
        currentDate,

        goalStatus,
        getStats,
        incrementMetric,
        setMetric,
        getHungerState,
        checkDailyReset,
        getRigourState,
        fetchFromBackend,
        isLoading,
        lastFetch
    } = useUserStore();

    const { isPunished } = usePunishment();
    const [scope, setScope] = useState<TimeScope>('day');
    const [editMode, setEditMode] = useState(false);
    const [evidenceUrl, setEvidenceUrl] = useState(today.production.proofPhotoUrl || '');

    useEffect(() => {
        fetchFromBackend();
    }, [fetchFromBackend]);

    useEffect(() => {
        checkDailyReset();
    }, [checkDailyReset]);

    // Update local state when store updates
    useEffect(() => {
        setEvidenceUrl(today.production.proofPhotoUrl || '');
    }, [today.production.proofPhotoUrl]);

    const handleEvidenceSubmit = () => {
        setMetric('production', 'proofPhotoUrl', evidenceUrl);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch('http://localhost:3000/api/upload/photo', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setEvidenceUrl(data.url);
                setMetric('production', 'proofPhotoUrl', data.url);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const hungerState = getHungerState();
    const hungerColor =
        hungerState === 'STARVATION' ? 'text-blood animate-pulse' :
            hungerState === 'SUSTENANCE' ? 'text-gold' : 'text-emerald-500';

    const lifestyle = today.lifestyle || { sleep: 0, meditation: false, noSocial: false, noYouTube: false };

    // Goal Logic (150/35/5)
    const monthVideos = goalStatus?.monthVideos || 0;
    const monthTarget = 150;
    const dayVideos = today.production.videos;
    const dayTarget = 5;

    // Weekly (Aggregated from history)
    const weeklyVideos = getStats('week', 'production', 'videos');
    const weeklyTarget = 35;

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto max-w-lg mx-auto pb-24 scrollbar-hide">

            {/* PUNISHMENT BANNER */}
            {isPunished && (
                <div className="bg-blood/20 border-2 border-blood text-blood p-4 flex items-center gap-3 animate-pulse">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                        <div className="font-display font-black uppercase tracking-wider">PUNISHMENT PROTOCOL ACTIVE</div>
                        <div className="text-[10px] font-mono opacity-70">TARGET MISSED — COLD SHOWER MANDATORY</div>
                    </div>
                </div>
            )}

            {/* SCROLLING KIMYA QUOTES */}
            <ScrollingQuotes />

            {/* 0. PROTOCOL STATUS WIDGET (150/35/5) */}
            <div className="grid grid-cols-3 gap-2">
                <StatusCard label="MONTHLY" value={monthVideos} target={monthTarget} />
                <StatusCard label="WEEKLY" value={weeklyVideos} target={weeklyTarget} />
                <StatusCard label="DAILY" value={dayVideos} target={dayTarget} urgent={dayVideos < dayTarget} />
            </div>

            {/* CHALLENGE MINI-WIDGET */}
            <ChallengeWidget />

            {/* DATE HEADER & EDIT TOGGLE */}
            <div className="flex justify-between items-center px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-concrete/40 uppercase tracking-widest">Active Operative Date</span>
                    <span className="text-xl font-display font-black text-concrete uppercase">
                        {new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setEditMode(!editMode)} className={`p-2 rounded border ${editMode ? 'bg-concrete text-void border-concrete' : 'text-concrete/30 border-steel/20'}`}>
                        <Edit2 size={12} />
                    </button>
                    <ConnectionStatus isLoading={isLoading} lastFetch={lastFetch} onRefresh={fetchFromBackend} />
                </div>
            </div>

            {/* TIME SCOPE */}
            <div className="grid grid-cols-3 gap-1 bg-steel/10 p-1 rounded-sm border border-steel/20">
                {(['day', 'week', 'month'] as TimeScope[]).map((s) => (
                    <button key={s} onClick={() => setScope(s)} className={`text-[10px] font-mono uppercase tracking-widest py-2 transition-all ${scope === s ? 'bg-concrete text-void font-bold shadow-sm' : 'text-concrete/40 hover:text-concrete'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* PROTOCOL TIMER */}
            <ProtocolTimer />

            {/* DAILY EVIDENCE */}
            {scope === 'day' && (
                <div className={`p-3 border flex flex-col gap-2 ${today.production.proofPhotoUrl ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-steel/30 bg-void'}`}>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-concrete">
                            <Camera size={12} className={today.production.proofPhotoUrl ? 'text-emerald-500' : 'text-concrete/50'} />
                            Daily Evidence
                        </span>
                        {today.production.proofPhotoUrl && <Check size={12} className="text-emerald-500" />}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-concrete/30">
                                <LinkIcon size={10} />
                            </div>
                            <input
                                type="text"
                                placeholder="Paste Photo URL or Upload..."
                                value={evidenceUrl}
                                onChange={(e) => setEvidenceUrl(e.target.value)}
                                className="w-full bg-steel/10 border border-steel/20 py-2 pl-8 pr-2 text-[10px] font-mono text-concrete focus:border-gold/50 outline-none"
                            />
                        </div>
                        <label className="bg-steel/20 hover:bg-concrete hover:text-void text-concrete border border-steel/20 px-4 py-2 text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center">
                            Upload
                            <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                        </label>
                        <button onClick={handleEvidenceSubmit} className="bg-gold hover:bg-gold/80 text-void border border-gold px-4 py-2 text-[10px] font-bold uppercase transition-colors">
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* RIGOUR STATE */}
            <RigourTracker getRigourState={getRigourState} />

            {/* PRODUCTION HUB */}
            <div className="bg-void border border-steel/30 relative group">
                <div className="bg-steel/10 px-3 py-2 flex justify-between items-center border-b border-steel/20">
                    <span className="text-[10px] font-mono font-bold text-concrete tracking-widest flex items-center gap-2">
                        <Monitor size={12} /> PRODUCTION
                    </span>
                    <div className="text-[10px] text-concrete/30 font-mono">{scope.toUpperCase()}</div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                    {/* Videos */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-black text-concrete tabular-nums leading-none">
                            {getStats(scope, 'production', 'videos')}
                        </div>
                        <span className="text-[9px] font-mono text-concrete/40 mt-1 uppercase">Videos</span>
                        {scope === 'day' && (
                            <div className="flex gap-1 mt-2">
                                {editMode && <button onClick={() => setMetric('production', 'videos', Math.max(0, today.production.videos - 1))} className="text-[10px] bg-steel/20 hover:bg-blood/20 text-concrete hover:text-blood px-2 py-1 font-bold">-</button>}
                                <button onClick={() => incrementMetric('production', 'videos')} className="text-[10px] bg-blood text-white px-3 py-1 font-bold uppercase tracking-wider hover:bg-red-600 transition-colors clip-path-polygon">Log Video</button>
                            </div>
                        )}
                    </div>

                    {/* Pomodoros */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-black text-concrete/70 tabular-nums leading-none">
                            {getStats(scope, 'production', 'pomodoros')}
                        </div>
                        <span className="text-[9px] font-mono text-concrete/40 mt-1 uppercase">Sessions</span>
                        {scope === 'day' && editMode && (
                            <div className="flex gap-1 mt-2">
                                <button onClick={() => setMetric('production', 'pomodoros', Math.max(0, today.production.pomodoros - 1))} className="text-[10px] bg-steel/20 hover:bg-blood/20 text-concrete hover:text-blood px-2 py-1 font-bold">-</button>
                                <button onClick={() => incrementMetric('production', 'pomodoros')} className="text-[10px] bg-steel/20 hover:bg-emerald-500/20 text-concrete hover:text-emerald-500 px-2 py-1 font-bold">+</button>
                            </div>
                        )}
                        {!editMode && <div className="mt-2 text-[8px] font-mono text-concrete/30 uppercase tracking-widest">Auto-Logged</div>}
                    </div>
                </div>
            </div>

            {/* FITNESS PROTOCOL */}
            <div className="bg-void border border-blood/20 relative">
                <div className="bg-blood/5 px-3 py-2 flex justify-between items-center border-b border-blood/10">
                    <span className="text-[10px] font-mono font-bold text-blood tracking-widest flex items-center gap-2">
                        <Dumbbell size={12} /> BIOLOGICAL
                    </span>
                    <div className="text-[10px] text-blood font-bold font-mono uppercase animate-pulse">
                        {hungerState}
                    </div>
                </div>

                <div className="p-4">
                    {/* NEW: 4×25 Fitness Protocol Widget */}
                    <FitnessProtocol />

                    {/* Discipline Correlation */}
                    <DisciplineCorrelation />
                </div>

                {/* Hunger Status Bar */}
                <div className="bg-void border border-steel/20 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Utensils className={`w-3 h-3 ${hungerColor}`} />
                        <span className={`text-[10px] font-mono font-bold ${hungerColor}`}>{hungerState}</span>
                    </div>
                    <div className="text-[9px] text-concrete/40 font-mono">
                        {today.production.videos}/5 TARGET
                    </div>
                </div>
            </div>

            {/* FINANCE HUB */}
            <div className="bg-void border border-gold/20 relative">
                <div className="bg-gold/5 px-3 py-2 flex justify-between items-center border-b border-gold/10">
                    <span className="text-[10px] font-mono font-bold text-gold tracking-widest flex items-center gap-2">
                        <DollarSign size={12} /> FINANCE
                    </span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-gold/50 uppercase">Earnings ({scope})</span>
                            <div className="text-2xl font-black text-gold tabular-nums tracking-tight">
                                ${getStats(scope, 'finance', 'revenue').toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-gold/50 uppercase">Active Clients</span>
                            <div className="flex items-center gap-3">
                                <div className="text-xl font-bold text-gold/70 tabular-nums tracking-tight">
                                    {today.finance.activeClients}
                                </div>
                                {scope === 'day' && editMode && (
                                    <div className="flex gap-1">
                                        <button onClick={() => setMetric('finance', 'activeClients', Math.max(0, today.finance.activeClients - 1))} className="text-[8px] bg-gold/10 hover:bg-gold/20 p-1 text-gold border border-gold/20">-</button>
                                        <button onClick={() => setMetric('finance', 'activeClients', today.finance.activeClients + 1)} className="text-[8px] bg-gold/10 hover:bg-gold/20 p-1 text-gold border border-gold/20">+</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIFESTYLE */}
            <div className="bg-void border border-emerald-500/20 relative">
                <div className="bg-emerald-500/5 px-3 py-2 flex justify-between items-center border-b border-emerald-500/10">
                    <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-widest flex items-center gap-2">
                        <Zap size={12} /> LIFESTYLE PROTOCOLS
                    </span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                        <LifestyleToggle label="No Social Media" active={lifestyle.noSocial} onClick={() => setMetric('lifestyle', 'noSocial', !lifestyle.noSocial)} icon={<Smartphone size={10} />} />
                        <LifestyleToggle label="No YouTube" active={lifestyle.noYouTube} onClick={() => setMetric('lifestyle', 'noYouTube', !lifestyle.noYouTube)} icon={<Monitor size={10} />} />
                        <LifestyleToggle label="Meditation" active={lifestyle.meditation} onClick={() => setMetric('lifestyle', 'meditation', !lifestyle.meditation)} icon={<Brain size={10} />} />
                    </div>
                    <div className="border-l border-steel/10 pl-4 flex flex-col justify-center">
                        <span className="text-[9px] font-mono text-emerald-500/50 uppercase mb-2 flex items-center gap-1"><Moon size={10} /> Sleep (Hours)</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setMetric('lifestyle', 'sleep', Math.max(0, lifestyle.sleep - 0.5))} className="p-1 bg-steel/10 hover:bg-emerald-500/20 text-emerald-500 rounded">-</button>
                            <span className="text-xl font-bold text-concrete tabular-nums">{lifestyle.sleep}</span>
                            <button onClick={() => setMetric('lifestyle', 'sleep', lifestyle.sleep + 0.5)} className="p-1 bg-steel/10 hover:bg-emerald-500/20 text-emerald-500 rounded">+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* End of main content */}
        </div>
    );
};

const StatusCard = ({ label, value, target, urgent }: { label: string, value: number, target: number, urgent?: boolean }) => {
    const progress = Math.min(100, (value / target) * 100);


    return (
        <div className="bg-void border border-steel/20 p-2 flex flex-col items-center">
            <span className="text-[8px] font-mono text-concrete/40 uppercase mb-1">{label}</span>
            <div className="flex items-end gap-1 mb-1">
                <span className={`text-xl font-black leading-none ${progress >= 100 ? 'text-gold' : 'text-concrete'}`}>{value}</span>
                <span className="text-[10px] text-concrete/30 leading-none">/{target}</span>
            </div>
            <div className="w-full h-1 bg-steel/10 rounded-full overflow-hidden">
                <div className={`h-full ${progress >= 100 ? 'bg-gold' : urgent ? 'bg-blood' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}

const _FitnessCounter = ({ label, value, onInc, scope }: { label: string, value: number, onInc: () => void, scope: TimeScope }) => (
    <div className="flex flex-col items-center gap-1">
        <div className="text-xl font-bold text-concrete tabular-nums">{value}</div>
        <span className="text-[7px] uppercase font-mono text-concrete/40">{label}</span>
        {scope === 'day' && (
            <button
                onClick={onInc}
                className="w-full bg-steel/10 hover:bg-steel/20 border border-steel/20 text-[8px] py-1 text-concrete"
            >
                +10
            </button>
        )}
    </div>
);

const LifestyleToggle = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: any }) => (
    <button onClick={onClick} className={`flex items-center justify-between p-2 rounded-sm border transition-all ${active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-void border-steel/20 text-concrete/30 hover:bg-steel/5'}`}>
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-steel/30'}`}></div>
    </button>
);

const ConnectionStatus = ({ isLoading, lastFetch, onRefresh }: { isLoading: boolean; lastFetch: string | null; onRefresh: () => void }) => {
    return (
        <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 border rounded-sm transition-all text-[9px] font-mono uppercase tracking-widest ${isLoading
                ? 'bg-gold/10 border-gold/30 text-gold'
                : lastFetch
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : 'bg-blood/10 border-blood/30 text-blood'
                }`}
        >
            {isLoading && <><div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping"></div> SYNCING...</>}
            {!isLoading && lastFetch && <><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> LIVE</>}
            {!isLoading && !lastFetch && <><div className="w-1.5 h-1.5 bg-blood rounded-full"></div> OFFLINE</>}
        </button>
    );
};

const RigourTracker = ({ getRigourState }: { getRigourState: () => { status: 'AHEAD' | 'ON_TRACK' | 'LAGGING'; expected: number; actual: number; diff: number } }) => {
    const rigour = getRigourState();

    const statusConfig = {
        AHEAD: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: TrendingUp },
        ON_TRACK: { color: 'text-concrete', bg: 'bg-steel/10', border: 'border-steel/30', icon: Minus },
        LAGGING: { color: 'text-blood', bg: 'bg-blood/10', border: 'border-blood/30', icon: TrendingDown }
    };

    const config = statusConfig[rigour.status];
    const Icon = config.icon;

    return (
        <div className={`border ${config.border} ${config.bg} p-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <div>
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${config.color}`}>
                        {rigour.status.replace('_', ' ')}
                    </div>
                    <div className="text-[9px] font-mono text-concrete/40">
                        SESSION PACING
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 text-right">
                <div>
                    <div className="text-lg font-black text-concrete tabular-nums">{rigour.actual}</div>
                    <div className="text-[8px] font-mono text-concrete/40 uppercase">Actual</div>
                </div>
                <div className="text-concrete/20">/</div>
                <div>
                    <div className="text-lg font-bold text-concrete/50 tabular-nums">{rigour.expected}</div>
                    <div className="text-[8px] font-mono text-concrete/40 uppercase">Expected</div>
                </div>
                <div className={`text-sm font-black ${config.color} tabular-nums min-w-[40px] text-center`}>
                    {rigour.diff >= 0 ? '+' : ''}{rigour.diff}
                </div>
            </div>
        </div>
    );
};

// Challenge Progress Mini-Widget
const ChallengeWidget = () => {
    const [challenge, setChallenge] = useState<{
        dayNumber: number;
        totalDays: number;
        videosProduced: number;
        videosTarget: number;
        paceRequired: number;
        name: string;
        dailyPushups: number;
        dailyAbs: number;
    } | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/challenge/active')
            .then(res => res.json())
            .then(data => setChallenge(data.challenge))
            .catch(() => setChallenge(null));
    }, []);

    if (!challenge) {
        return (
            <div className="border border-dashed border-steel/30 p-3 text-center">
                <div className="text-[10px] font-mono text-concrete/40 uppercase">No Active Mission</div>
                <a href="/challenge" className="text-[10px] font-mono text-blood hover:underline">Launch Challenge →</a>
            </div>
        );
    }

    const progress = Math.round((challenge.videosProduced / challenge.videosTarget) * 100);
    const isAhead = challenge.videosProduced >= (challenge.dayNumber * 5);

    return (
        <div className="border border-steel/30 bg-steel/5 p-3">
            <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] font-mono text-concrete/50 uppercase tracking-widest">{challenge.name}</div>
                <a href="/challenge" className="text-[9px] font-mono text-blood hover:underline transition-colors">Details →</a>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="h-2 bg-void border border-steel/30 overflow-hidden">
                        <div
                            className={`h-full transition-all ${isAhead ? 'bg-emerald-500' : 'bg-blood'}`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-display font-black text-lg text-concrete tabular-nums">
                        {challenge.videosProduced}<span className="text-concrete/40 text-sm">/{challenge.videosTarget}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-steel/10">
                <div>
                    <span className="text-[8px] font-mono text-concrete/40 uppercase block mb-1">Target Pace</span>
                    <span className={`${isAhead ? 'text-emerald-500' : 'text-blood'} font-bold text-xs`}>{challenge.paceRequired}/day</span>
                </div>
                <div>
                    <span className="text-[8px] font-mono text-concrete/40 uppercase block mb-1">Daily Pushups</span>
                    <span className="text-concrete font-bold text-xs">{challenge.dailyPushups}</span>
                </div>
                <div>
                    <span className="text-[8px] font-mono text-concrete/40 uppercase block mb-1">Daily Abs</span>
                    <span className="text-concrete font-bold text-xs">{challenge.dailyAbs}</span>
                </div>
            </div>

            <div className="flex justify-between mt-2 text-[9px] font-mono text-concrete/40">
                <span>Day {challenge.dayNumber} of {challenge.totalDays}</span>
                <span className={isAhead ? 'text-emerald-500' : 'text-blood'}>
                    {isAhead ? 'AHEAD OF SCHEDULE' : 'BEHIND SCHEDULE'}
                </span>
            </div>
        </div>
    );
};
