import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { DollarSign, Dumbbell, Zap, Mic, Music, Activity } from 'lucide-react';
import { DeepWorkStats } from '../dashboard/DeepWorkStats';
import { FitnessProtocol } from '../fitness/FitnessProtocol';

export const StatsDashboard = () => {
    const { today, setMetric, getStats } = useUserStore();
    const [timeScope, setTimeScope] = useState<'day' | 'week' | 'month'>('day');

    const drillTarget = timeScope === 'day' ? 15 : timeScope === 'week' ? 105 : 450;
    const isEditable = timeScope === 'day';

    return (
        <div className="flex flex-col p-4 gap-6">
            <div className="text-center mb-2">
                <h1 className="font-display font-black text-2xl text-concrete tracking-widest uppercase">Master Stats</h1>
                <p className="text-xs font-mono text-concrete/50">OMNISCIENT TELEMETRY VIEW</p>
            </div>

            {/* Time Scope Toggle */}
            <div className="grid grid-cols-3 gap-1 bg-steel/10 p-1 rounded-sm border border-steel/20">
                {(['day', 'week', 'month'] as const).map((s) => (
                    <button 
                        key={s} 
                        onClick={() => setTimeScope(s)} 
                        className={`text-[10px] font-mono uppercase tracking-widest py-2 transition-all ${timeScope === s ? 'bg-concrete text-void font-bold shadow-sm' : 'text-concrete/40 hover:text-concrete'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* PRODUCTIVITY HUB */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-steel/20 pb-2">
                    <Zap className="text-gold" size={16} />
                    <h2 className="text-sm font-bold tracking-widest text-gold uppercase">Productivity Engine</h2>
                </div>
                <DeepWorkStats />
            </section>

            {/* FINANCE HUB */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-steel/20 pb-2">
                    <DollarSign className="text-emerald-500" size={16} />
                    <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">Treasury</h2>
                </div>
                
                <div className="bg-void border border-emerald-500/20 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-emerald-500/50 uppercase">Earnings ({timeScope})</span>
                            <div className="text-3xl font-black text-emerald-500 tabular-nums tracking-tight">
                                ${getStats(timeScope, 'finance', 'revenue').toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-emerald-500/50 uppercase">Cumulative 2026</span>
                            <div className="text-xl font-bold text-emerald-500/70 tabular-nums tracking-tight mt-1">
                                ${today.finance.total2026.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col col-span-2 pt-3 border-t border-emerald-500/10">
                            <span className="text-[9px] font-mono text-emerald-500/50 uppercase">Active Clients</span>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-emerald-500 tabular-nums tracking-tight">
                                    {today.finance.activeClients}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMetric('finance', 'activeClients', Math.max(0, today.finance.activeClients - 1))} className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 font-bold">-</button>
                                    <button onClick={() => setMetric('finance', 'activeClients', today.finance.activeClients + 1)} className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 font-bold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BIOLOGICAL & DRILLS HUB */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-steel/20 pb-2">
                    <Activity className="text-blood" size={16} />
                    <h2 className="text-sm font-bold tracking-widest text-blood uppercase">Biological & Skill Forge</h2>
                </div>

                {/* Legacy Workout Protocol */}
                <div className="bg-blood/5 border border-blood/20 p-4 rounded-lg">
                    <div className="mb-4">
                        <span className="text-[10px] font-mono text-blood/50 uppercase block mb-2">Core Workout</span>
                        <FitnessProtocol />
                    </div>

                    {/* New 15m Drills */}
                    <span className="text-[10px] font-mono text-blood/50 uppercase block mb-3 border-t border-blood/10 pt-4">Daily 15-Minute Protocols (Minutes Tracked)</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <DrillTracker 
                            label="Boxing Drills" 
                            icon={<Dumbbell size={14} />} 
                            value={getStats(timeScope, 'fitness', 'boxing') || 0}
                            target={drillTarget}
                            onUpdate={(val) => setMetric('fitness', 'boxing', val)}
                            editable={isEditable}
                        />
                        <DrillTracker 
                            label="Kegels" 
                            icon={<Activity size={14} />} 
                            value={getStats(timeScope, 'fitness', 'kegels') || 0}
                            target={drillTarget}
                            onUpdate={(val) => setMetric('fitness', 'kegels', val)}
                            editable={isEditable}
                        />
                        <DrillTracker 
                            label="Singing Drills" 
                            icon={<Mic size={14} />} 
                            value={getStats(timeScope, 'fitness', 'singing') || 0}
                            target={drillTarget}
                            onUpdate={(val) => setMetric('fitness', 'singing', val)}
                            editable={isEditable}
                        />
                        <DrillTracker 
                            label="Dancing" 
                            icon={<Music size={14} />} 
                            value={getStats(timeScope, 'fitness', 'dancing') || 0}
                            target={drillTarget}
                            onUpdate={(val) => setMetric('fitness', 'dancing', val)}
                            editable={isEditable}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const DrillTracker = ({ label, icon, value, target, onUpdate, editable }: { label: string, icon: any, value: number, target: number, onUpdate: (val: number) => void, editable: boolean }) => {
    const isComplete = value >= target;
    const progress = Math.min(100, (value / target) * 100);

    return (
        <div className={`p-3 rounded-lg border transition-all ${isComplete ? 'bg-blood/10 border-blood/30' : 'bg-void border-steel/20'}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={isComplete ? 'text-blood' : 'text-concrete/50'}>
                    {icon}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isComplete ? 'text-blood' : 'text-concrete/70'}`}>
                    {label}
                </span>
            </div>
            
            <div className="flex items-end justify-between mb-2">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black tabular-nums leading-none ${isComplete ? 'text-blood' : 'text-concrete'}`}>
                        {value}
                    </span>
                    <span className="text-[10px] font-mono text-concrete/40">/ {target}m</span>
                </div>
            </div>

            <div className="w-full h-1 bg-steel/10 rounded-full overflow-hidden mb-3">
                <div className={`h-full ${isComplete ? 'bg-blood' : 'bg-concrete/30'}`} style={{ width: `${progress}%` }} />
            </div>

            {editable && (
                <div className="flex gap-1">
                    <button onClick={() => onUpdate(Math.max(0, value - 5))} className="flex-1 py-1 bg-steel/10 hover:bg-blood/20 text-concrete/70 hover:text-blood rounded text-[10px] font-bold">-5</button>
                    <button onClick={() => onUpdate(value + 5)} className="flex-1 py-1 bg-steel/10 hover:bg-blood/20 text-concrete/70 hover:text-blood rounded text-[10px] font-bold">+5</button>
                </div>
            )}
        </div>
    );
};
