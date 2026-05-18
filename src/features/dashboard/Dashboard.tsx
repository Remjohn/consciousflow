import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Monitor, Zap, Moon, Smartphone, AlertTriangle, TrendingUp, TrendingDown, Minus, Edit2 } from 'lucide-react';
import { ProtocolTimer } from './ProtocolTimer';
import { ScrollingQuotes } from '../../components/ScrollingQuotes';
import { usePunishment } from '../../hooks/usePunishment';
import { API_URL } from '../../lib/api';
import { KegelsProtocol } from '../kegels/KegelsProtocol';

type TimeScope = 'day' | 'week' | 'month';

export const Dashboard = () => {
    const {
        today,
        currentDate,

        goalStatus,
        getStats,
        incrementMetric,
        setMetric,
        checkDailyReset,
        getRigourState,
        fetchFromBackend,
        isLoading,
        lastFetch
    } = useUserStore();

    const { isPunished } = usePunishment();
    const [scope, setScope] = useState<TimeScope>('day');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchFromBackend();
    }, [fetchFromBackend]);

    // Ensure daily reset
    useEffect(() => {
        checkDailyReset();
    }, [checkDailyReset]);

    const lifestyle = today.lifestyle || {
        sleep: 0, noSocial: false, noYouTube: false,
        phoneHours: 0, phonePickups: 0,
        coldShower: false, kegels: false
    };

    // Kegels modal state
    const [showKegelsModal, setShowKegelsModal] = useState(false);

    // Goal Logic (360/84/12) based on 12 packages/day
    const monthVideos = goalStatus?.monthVideos || 0;
    const monthTarget = 360; // 12 packages * 30 days
    const dayVideos = today.production.videos;
    const dayTarget = 12;

    // Weekly (Aggregated from history)
    const weeklyVideos = getStats('week', 'production', 'videos');
    const weeklyTarget = 84;

    return (
        <>
        <div className="flex flex-col p-4 gap-4">

                {/* COVER IMAGE GALLERY */}
                <CoverImageGallery />

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

                {/* 0. PROTOCOL STATUS WIDGET (360/84/12) */}
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



                {/* REMOVED DAILY EVIDENCE UPLOAD TO SUPPORT INVISIBLE APP DOCTRINE */}

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

                    <div className="p-4 flex flex-col gap-6">
                        <div className="grid grid-cols-3 gap-2">
                            {/* Client Packages */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl font-black text-concrete tabular-nums leading-none">
                                    {getStats(scope, 'production', 'videos')}
                                </div>
                                <span className="text-[8px] font-mono text-concrete/40 mt-1 uppercase text-center leading-tight">Client<br/>Packages</span>
                                <span className="text-[7px] font-mono text-concrete/20 uppercase mt-1">Target 12</span>
                            </div>

                            {/* Deep Work Sessions */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl font-black text-gold tabular-nums leading-none">
                                    {getStats(scope, 'production', 'pomodoros')}
                                </div>
                                <span className="text-[8px] font-mono text-concrete/40 mt-1 uppercase text-center leading-tight">Deep Work<br/>(90m)</span>
                                <span className="text-[7px] font-mono text-concrete/20 uppercase mt-1">Target 4</span>
                            </div>

                            {/* Management Sessions */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl font-black text-blue-400 tabular-nums leading-none">
                                    {getStats(scope, 'production', 'managementSessions')}
                                </div>
                                <span className="text-[8px] font-mono text-concrete/40 mt-1 uppercase text-center leading-tight">Management<br/>(60m)</span>
                                <span className="text-[7px] font-mono text-concrete/20 uppercase mt-1">Target 4</span>
                            </div>
                        </div>

                        {/* Action Layer */}
                        {scope === 'day' && (
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => incrementMetric('production', 'videos')} 
                                    className="w-full py-2 bg-blood text-white font-black uppercase tracking-widest hover:bg-red-600 transition-all clip-path-polygon text-[10px]"
                                >
                                    Log Client Package
                                </button>

                                {editMode && (
                                    <div className="flex justify-around border-t border-steel/10 pt-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[7px] font-mono text-gold/50 uppercase">DW Adjust</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => setMetric('production', 'pomodoros', Math.max(0, today.production.pomodoros - 1))} className="text-[10px] bg-steel/20 hover:bg-blood/20 text-concrete px-2 py-0.5 font-bold">-</button>
                                                <button onClick={() => incrementMetric('production', 'pomodoros')} className="text-[10px] bg-steel/20 hover:bg-gold/20 text-concrete px-2 py-0.5 font-bold">+</button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[7px] font-mono text-blue-400/50 uppercase">MGT Adjust</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => setMetric('production', 'managementSessions', Math.max(0, today.production.managementSessions - 1))} className="text-[10px] bg-steel/20 hover:bg-blood/20 text-concrete px-2 py-0.5 font-bold">-</button>
                                                <button onClick={() => incrementMetric('production', 'managementSessions')} className="text-[10px] bg-steel/20 hover:bg-blue-400/20 text-concrete px-2 py-0.5 font-bold">+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>



                {/* LIFESTYLE */}
                <div className="bg-void border border-emerald-500/20 relative">
                    <div className="bg-emerald-500/5 px-3 py-2 flex justify-between items-center border-b border-emerald-500/10">
                        <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-widest flex items-center gap-2">
                            <Zap size={12} /> LIFESTYLE PROTOCOLS
                        </span>
                    </div>
                    <div className="p-4 space-y-4">

                        {/* PHONE USAGE - PRIORITY #1 */}
                        <div className="bg-blood/10 border border-blood/30 p-3 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-mono text-blood uppercase flex items-center gap-1">📱 Phone Hours</span>
                                <span className="text-[9px] font-mono text-blood/50">TARGET: &lt;2h</span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={() => setMetric('lifestyle', 'phoneHours', Math.max(0, (lifestyle.phoneHours || 0) - 0.5))} className="w-8 h-8 bg-blood/20 hover:bg-blood/30 text-blood rounded font-bold">-</button>
                                <div className="text-center">
                                    <span className={`text-3xl font-display font-black tabular-nums ${(lifestyle.phoneHours || 0) <= 2 ? 'text-emerald-500' : 'text-blood'}`}>{lifestyle.phoneHours || 0}</span>
                                    <span className="text-sm text-concrete/50 ml-1">hours</span>
                                </div>
                                <button onClick={() => setMetric('lifestyle', 'phoneHours', (lifestyle.phoneHours || 0) + 0.5)} className="w-8 h-8 bg-blood/20 hover:bg-blood/30 text-blood rounded font-bold">+</button>
                            </div>
                            {(lifestyle.phoneHours || 0) > 2 && (
                                <div className="mt-2 text-center text-[9px] font-mono text-blood">⚠️ OVER TARGET - DIGITAL SIRENS WINNING</div>
                            )}
                        </div>

                        {/* Core Protocols Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <LifestyleToggle label="No Social Media" active={lifestyle.noSocial} onClick={() => setMetric('lifestyle', 'noSocial', !lifestyle.noSocial)} icon={<Smartphone size={10} />} />
                                <LifestyleToggle label="No YouTube" active={lifestyle.noYouTube} onClick={() => setMetric('lifestyle', 'noYouTube', !lifestyle.noYouTube)} icon={<Monitor size={10} />} />
                                <LifestyleToggle label="Cold Shower" active={lifestyle.coldShower} onClick={() => setMetric('lifestyle', 'coldShower', !lifestyle.coldShower)} icon={<Zap size={10} />} />
                            </div>
                            <div className="flex flex-col gap-3">
                                {/* Kegels with START button */}
                                <div className="flex items-center gap-2">
                                    <LifestyleToggle label="Kegels" active={lifestyle.kegels} onClick={() => setMetric('lifestyle', 'kegels', !lifestyle.kegels)} icon={<Zap size={10} />} />
                                    <button
                                        onClick={() => setShowKegelsModal(true)}
                                        className="text-[9px] bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 px-2 py-0.5 rounded font-bold uppercase"
                                    >
                                        ▶ START
                                    </button>
                                </div>
                                {/* Sleep */}
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-emerald-500/50 uppercase mb-1 flex items-center gap-1"><Moon size={10} /> Sleep</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setMetric('lifestyle', 'sleep', Math.max(0, lifestyle.sleep - 0.5))} className="p-1 bg-steel/10 hover:bg-emerald-500/20 text-emerald-500 rounded">-</button>
                                        <span className="text-lg font-bold text-concrete tabular-nums">{lifestyle.sleep}h</span>
                                        <button onClick={() => setMetric('lifestyle', 'sleep', lifestyle.sleep + 0.5)} className="p-1 bg-steel/10 hover:bg-emerald-500/20 text-emerald-500 rounded">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End of main content */}
            </div>

            {/* Kegels Protocol Modal */}
            {showKegelsModal && (
                <KegelsProtocol
                    onClose={() => setShowKegelsModal(false)}
                    onComplete={() => {
                        setShowKegelsModal(false);
                        setMetric('lifestyle', 'kegels', true);
                    }}
                />
            )}
        </>
    );
};

// Cover Image Gallery Component
const CoverImageGallery = () => {
    const [images, setImages] = useState<string[]>([]);
    
    useEffect(() => {
        fetch(`${API_URL}/api/covers`)
            .then(res => res.json())
            .then(data => {
                if (data.images && data.images.length > 0) {
                    setImages(data.images);
                }
            })
            .catch(console.error);
    }, []);

    if (images.length === 0) return null;

    // Pick image based on current hour
    const hour = new Date().getHours();
    const currentImage = images[hour % images.length];

    return (
        <div className="w-full aspect-[4/1] max-w-[1200px] mx-auto border-2 border-steel/20 relative overflow-hidden bg-void flex items-center justify-center">
            <img 
                src={`/covers/${currentImage}`} 
                alt="Cover" 
                className="w-full h-full object-cover object-center animate-in fade-in duration-1000"
            />
            <div className="absolute bottom-2 right-2 bg-void/80 px-2 py-1 text-[8px] font-mono text-concrete/50 border border-steel/20">
                GALLERY ({hour % images.length + 1}/{images.length})
            </div>
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
        fetch(`${API_URL}/api/challenge/active`)
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
    // Dynamic pacing derived from 12-package SLA target instead of hardcoded 5
    const isAhead = challenge.videosProduced >= (challenge.dayNumber * 12);

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

            <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-steel/10">
                <div>
                    <span className="text-[8px] font-mono text-concrete/40 uppercase block mb-1">Target Pace</span>
                    <span className={`${isAhead ? 'text-emerald-500' : 'text-blood'} font-bold text-xs`}>{challenge.paceRequired} pkgs/day</span>
                </div>
                <div>
                    <span className="text-[8px] font-mono text-concrete/40 uppercase block mb-1">Pipeline Engine</span>
                    <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                        <Zap size={10} /> Automated
                    </span>
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
