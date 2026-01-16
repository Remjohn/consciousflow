import { useState, useEffect } from 'react';
import { Camera, TrendingUp, Scale, Ruler, Dumbbell, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface BodyMetric {
    id: number;
    date: string;
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    bicepLeft?: number;
    bicepRight?: number;
    thighLeft?: number;
    thighRight?: number;
    maxPushups?: number;
    maxPlank?: number;
    maxJumpRope?: number;
    photoFront?: string;
    photoSide?: string;
    photoBack?: string;
}

export const FitnessProgress = () => {
    const [metrics, setMetrics] = useState<BodyMetric[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Partial<BodyMetric>>({});
    const [activeTab, setActiveTab] = useState<'log' | 'timeline' | 'charts'>('log');
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/body-metrics/history?days=365`);
            const data = await res.json();
            setMetrics(data.metrics || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            await fetch(`${API_URL}/api/body-metrics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEntry)
            });
            fetchHistory();
            setCurrentEntry({});
        } catch (err) {
            console.error(err);
        }
    };

    const handlePhotoUpload = async (type: 'front' | 'side' | 'back', file: File) => {
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentEntry(prev => ({
                    ...prev,
                    [`photo${type.charAt(0).toUpperCase() + type.slice(1)}`]: data.url
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const metricsWithPhotos = metrics.filter(m => m.photoFront || m.photoSide || m.photoBack);

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto max-w-4xl mx-auto pb-24 scrollbar-hide">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="font-display font-black text-2xl text-gold uppercase tracking-wider">
                    Body Progression
                </h1>
                <div className="flex gap-1">
                    {(['log', 'timeline', 'charts'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-[10px] font-mono uppercase ${activeTab === tab ? 'bg-gold text-void' : 'bg-steel/10 text-concrete/50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* LOG TAB */}
            {activeTab === 'log' && (
                <div className="space-y-4">
                    {/* Body Composition */}
                    <div className="border border-steel/30 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-gold text-sm font-bold">
                            <Scale size={16} /> Body Composition
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 block mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={currentEntry.weight || ''}
                                    onChange={e => setCurrentEntry({ ...currentEntry, weight: parseFloat(e.target.value) })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 block mb-1">Body Fat %</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={currentEntry.bodyFat || ''}
                                    onChange={e => setCurrentEntry({ ...currentEntry, bodyFat: parseFloat(e.target.value) })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="border border-steel/30 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-gold text-sm font-bold">
                            <Ruler size={16} /> Measurements (cm)
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { key: 'chest', label: 'Chest' },
                                { key: 'waist', label: 'Waist' },
                                { key: 'hips', label: 'Hips' },
                                { key: 'bicepLeft', label: 'L Bicep' },
                                { key: 'bicepRight', label: 'R Bicep' },
                                { key: 'thighLeft', label: 'L Thigh' },
                                { key: 'thighRight', label: 'R Thigh' }
                            ].map(({ key, label }) => (
                                <div key={key}>
                                    <label className="text-[9px] font-mono text-concrete/50 block mb-1">{label}</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={(currentEntry as any)[key] || ''}
                                        onChange={e => setCurrentEntry({ ...currentEntry, [key]: parseFloat(e.target.value) })}
                                        className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Benchmarks */}
                    <div className="border border-steel/30 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-gold text-sm font-bold">
                            <Dumbbell size={16} /> Performance Benchmarks
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-[9px] font-mono text-concrete/50 block mb-1">Max Pushups</label>
                                <input
                                    type="number"
                                    value={currentEntry.maxPushups || ''}
                                    onChange={e => setCurrentEntry({ ...currentEntry, maxPushups: parseInt(e.target.value) })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-mono text-concrete/50 block mb-1">Max Plank (sec)</label>
                                <input
                                    type="number"
                                    value={currentEntry.maxPlank || ''}
                                    onChange={e => setCurrentEntry({ ...currentEntry, maxPlank: parseInt(e.target.value) })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-mono text-concrete/50 block mb-1">Max Jump Rope</label>
                                <input
                                    type="number"
                                    value={currentEntry.maxJumpRope || ''}
                                    onChange={e => setCurrentEntry({ ...currentEntry, maxJumpRope: parseInt(e.target.value) })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress Photos */}
                    <div className="border border-steel/30 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-gold text-sm font-bold">
                            <Camera size={16} /> Progress Photos
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['front', 'side', 'back'] as const).map(angle => {
                                const photoKey = `photo${angle.charAt(0).toUpperCase() + angle.slice(1)}` as keyof BodyMetric;
                                const photo = currentEntry[photoKey] as string | undefined;

                                return (
                                    <div key={angle} className="space-y-2">
                                        <div className="aspect-[3/4] bg-steel/10 border border-steel/20 flex items-center justify-center overflow-hidden">
                                            {photo ? (
                                                <img src={photo} alt={angle} className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera size={24} className="text-concrete/30" />
                                            )}
                                        </div>
                                        <label className="block w-full bg-gold/20 hover:bg-gold/40 text-gold py-2 text-[10px] font-bold uppercase text-center cursor-pointer">
                                            {angle.toUpperCase()}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handlePhotoUpload(angle, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full bg-gold text-void py-3 font-bold text-sm uppercase flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Save Today's Entry
                    </button>
                </div>
            )}

            {/* TIMELINE TAB - Photo Comparison */}
            {activeTab === 'timeline' && (
                <div className="space-y-4">
                    {metricsWithPhotos.length === 0 ? (
                        <div className="text-center py-12 text-concrete/50">
                            <Camera size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-sm">No progress photos yet.</p>
                            <p className="text-xs">Log your first entry with photos!</p>
                        </div>
                    ) : (
                        <>
                            {/* Photo Slider */}
                            <div className="relative">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
                                        disabled={photoIndex === 0}
                                        className="p-2 bg-steel/10 hover:bg-steel/20 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        {metricsWithPhotos[photoIndex] && (
                                            <>
                                                {(['photoFront', 'photoSide', 'photoBack'] as const).map(key => (
                                                    <div key={key} className="aspect-[3/4] bg-steel/10 overflow-hidden">
                                                        {metricsWithPhotos[photoIndex][key] ? (
                                                            <img
                                                                src={metricsWithPhotos[photoIndex][key]}
                                                                alt={key}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-concrete/30">
                                                                No photo
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setPhotoIndex(Math.min(metricsWithPhotos.length - 1, photoIndex + 1))}
                                        disabled={photoIndex >= metricsWithPhotos.length - 1}
                                        className="p-2 bg-steel/10 hover:bg-steel/20 disabled:opacity-30"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                {/* Date Label */}
                                <div className="text-center mt-4">
                                    <span className="bg-gold/20 text-gold px-4 py-1 text-sm font-mono">
                                        {metricsWithPhotos[photoIndex]?.date || 'No date'}
                                    </span>
                                    <p className="text-[10px] text-concrete/50 mt-2">
                                        {photoIndex + 1} / {metricsWithPhotos.length}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline Dots */}
                            <div className="flex justify-center gap-1 flex-wrap">
                                {metricsWithPhotos.map((m, i) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPhotoIndex(i)}
                                        className={`w-3 h-3 rounded-full ${i === photoIndex ? 'bg-gold' : 'bg-steel/30'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* CHARTS TAB */}
            {activeTab === 'charts' && (
                <div className="space-y-4">
                    {metrics.length === 0 ? (
                        <div className="text-center py-12 text-concrete/50">
                            <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-sm">No data yet.</p>
                            <p className="text-xs">Log your first entry!</p>
                        </div>
                    ) : (
                        <>
                            {/* Weight Chart */}
                            <div className="border border-steel/30 p-4">
                                <h3 className="text-sm font-bold text-gold mb-3 flex items-center gap-2">
                                    <Scale size={14} /> Weight Progress
                                </h3>
                                <div className="h-32 flex items-end gap-1">
                                    {metrics.slice(0, 30).reverse().map((m, _i) => {
                                        const weight = m.weight || 0;
                                        const maxWeight = Math.max(...metrics.map(x => x.weight || 0));
                                        const minWeight = Math.min(...metrics.filter(x => x.weight).map(x => x.weight || 0));
                                        const range = maxWeight - minWeight || 1;
                                        const height = ((weight - minWeight) / range) * 100;

                                        return (
                                            <div
                                                key={m.id}
                                                className="flex-1 bg-gold/50 hover:bg-gold transition-all"
                                                style={{ height: `${Math.max(5, height)}%` }}
                                                title={`${m.date}: ${weight}kg`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between text-[9px] font-mono text-concrete/40 mt-2">
                                    <span>30 days ago</span>
                                    <span>Today</span>
                                </div>
                            </div>

                            {/* Benchmarks */}
                            <div className="border border-steel/30 p-4">
                                <h3 className="text-sm font-bold text-gold mb-3 flex items-center gap-2">
                                    <Dumbbell size={14} /> Performance Benchmarks
                                </h3>
                                <div className="space-y-3">
                                    {['maxPushups', 'maxPlank', 'maxJumpRope'].map(key => {
                                        const latest = metrics.find(m => (m as any)[key]);
                                        const oldest = [...metrics].reverse().find(m => (m as any)[key]);
                                        const currentVal = latest ? (latest as any)[key] : 0;
                                        const startVal = oldest ? (oldest as any)[key] : 0;
                                        const change = currentVal - startVal;

                                        return (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-xs font-mono text-concrete/70">
                                                    {key.replace('max', '').replace(/([A-Z])/g, ' $1')}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-concrete">{currentVal}</span>
                                                    {change !== 0 && (
                                                        <span className={`text-xs font-mono ${change > 0 ? 'text-emerald-500' : 'text-blood'}`}>
                                                            {change > 0 ? '+' : ''}{change}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="border border-steel/30 p-3 text-center">
                                    <div className="text-2xl font-black text-gold">{metrics.length}</div>
                                    <div className="text-[9px] font-mono text-concrete/50 uppercase">Entries</div>
                                </div>
                                <div className="border border-steel/30 p-3 text-center">
                                    <div className="text-2xl font-black text-gold">{metricsWithPhotos.length}</div>
                                    <div className="text-[9px] font-mono text-concrete/50 uppercase">W/ Photos</div>
                                </div>
                                <div className="border border-steel/30 p-3 text-center">
                                    <div className="text-2xl font-black text-gold">
                                        {metrics[0]?.weight ? `${metrics[0].weight}kg` : '-'}
                                    </div>
                                    <div className="text-[9px] font-mono text-concrete/50 uppercase">Current</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FitnessProgress;
