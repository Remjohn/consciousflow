import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../../store/useUserStore';
import type { CandidateStage, Candidate } from '../../store/useUserStore';
import { Plus, User, Trophy, X, ChevronRight, ChevronLeft, RefreshCw, LayoutGrid, Kanban, Upload, Loader } from 'lucide-react';
import { ScoringModal } from './ScoringModal';

const STAGES: CandidateStage[] = ['POOL', 'GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINALS', 'CHAMPION'];

export const Dating = () => {
    const { candidates, addCandidate, moveCandidate, removeCandidate, fetchCandidates } = useUserStore();
    const [viewMode, setViewMode] = useState<'PIPELINE' | 'GALLERY'>('GALLERY');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Scoring Modal State
    const [scoringCandidate, setScoringCandidate] = useState<Candidate | null>(null);

    // Initial Load
    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        dob: '',
        photoUrl: '',
        notes: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        setPreviewUrl(URL.createObjectURL(file));
        setIsUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('photo', file);

            const res = await fetch('http://localhost:3000/api/upload/photo', {
                method: 'POST',
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, photoUrl: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name) return;
        await addCandidate({
            name: formData.name,
            nickname: formData.nickname,
            dob: formData.dob || undefined,
            photoUrl: formData.photoUrl || undefined,
            notes: formData.notes
        });
        setFormData({ name: '', nickname: '', dob: '', photoUrl: '', notes: '' });
        setPreviewUrl(null);
        setIsAddModalOpen(false);
    };

    const handleMove = (id: number, currentStage: CandidateStage, direction: 'next' | 'prev') => {
        const currentIndex = STAGES.indexOf(currentStage);
        if (currentIndex === -1) return;

        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < STAGES.length) {
            moveCandidate(id, STAGES[newIndex]);
        }
    };

    return (
        <div className="h-full flex flex-col bg-void text-concrete overflow-hidden relative">

            {/* Scoring Modal */}
            {scoringCandidate && (
                <ScoringModal
                    candidate={scoringCandidate}
                    onClose={() => setScoringCandidate(null)}
                    onRefresh={fetchCandidates}
                />
            )}

            {/* Header */}
            <div className="p-6 border-b border-steel/30 flex justify-between items-center bg-void/80 backdrop-blur z-10 shrink-0">
                <div>
                    <h1 className="text-2xl font-display font-black text-gold uppercase tracking-wider flex items-center gap-3">
                        <Trophy className="w-6 h-6" />
                        THE CHAMPIONSHIP
                    </h1>
                    <p className="text-concrete/50 text-xs font-mono mt-1 uppercase tracking-widest">
                        Ethical Discernment Framework • Active: {candidates.filter(c => !c.isArchived).length}
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    {/* Auto-Advance Button */}
                    <button
                        onClick={async () => {
                            const confirmed = window.confirm('⚡ AUTO-ADVANCE\n\nThis will:\n• Disqualify candidates with age > 24, beauty < 14, or 3+ red flags\n• Rank all candidates by total score\n• Assign stages based on ranking\n\nProceed?');
                            if (!confirmed) return;
                            try {
                                const res = await fetch('http://localhost:3000/api/championship/auto-advance', { method: 'POST' });
                                const data = await res.json();
                                alert(`✅ Auto-Advance Complete!\n\n• Disqualified: ${data.autoDisqualified}\n• Stage Changes: ${data.stageAdvances?.length || 0}`);
                                fetchCandidates();
                            } catch (e) {
                                alert('❌ Auto-advance failed');
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-2 border border-gold/50 text-gold hover:bg-gold hover:text-void transition-colors text-xs font-bold uppercase"
                        title="Automatically rank and advance candidates"
                    >
                        ⚡ AUTO-ADVANCE
                    </button>
                    <div className="flex border border-steel/30 p-0.5 bg-void">
                        <button onClick={() => setViewMode('GALLERY')} className={`p-2 ${viewMode === 'GALLERY' ? 'bg-steel/30 text-concrete' : 'text-concrete/30'}`}><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('PIPELINE')} className={`p-2 ${viewMode === 'PIPELINE' ? 'bg-steel/30 text-concrete' : 'text-concrete/30'}`}><Kanban size={16} /></button>
                    </div>
                    <button
                        onClick={() => fetchCandidates()}
                        className="p-2 border border-steel/30 hover:bg-steel/20 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4 text-concrete/50" />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gold text-void font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        NEW TARGET
                    </button>
                </div>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'PIPELINE' ? (
                    // KANBAN VIEW
                    <div className="flex gap-4 h-full p-6 overflow-x-auto">
                        {STAGES.map(stage => {
                            const stageCandidates = candidates.filter(c => c.stage === stage && !c.isArchived);
                            return (
                                <div key={stage} className="w-72 flex flex-col h-full bg-steel/5 border border-steel/20">
                                    <div className="p-3 border-b border-steel/20 bg-steel/10 flex justify-between items-center">
                                        <span className="text-[10px] font-mono font-bold text-concrete/70 uppercase tracking-widest">{stage.replace(/_/g, ' ')}</span>
                                        <span className="text-[10px] font-mono text-concrete/30">{stageCandidates.length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-hide">
                                        {stageCandidates.map(candidate => (
                                            <div key={candidate.id} className="bg-void border border-steel/20 p-3 group hover:border-gold/30 transition-colors relative">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-8 h-8 bg-steel/20 flex items-center justify-center overflow-hidden cursor-pointer border border-steel/30"
                                                            onClick={() => setScoringCandidate(candidate)}
                                                        >
                                                            {candidate.photoUrl ? (
                                                                <img src={`http://localhost:3000${candidate.photoUrl}`} alt={candidate.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-4 h-4 text-concrete/30" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-concrete text-sm cursor-pointer hover:text-gold" onClick={() => setScoringCandidate(candidate)}>{candidate.name}</div>
                                                            <div className="text-[10px] font-mono text-concrete/40">{candidate.age || '?'} Y/O</div>
                                                        </div>
                                                    </div>
                                                    <div className={`font-mono font-bold text-xs ${candidate.totalChampionshipScore > 50 ? 'text-gold' : 'text-blood'}`}>
                                                        {candidate.totalChampionshipScore} PTS
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleMove(candidate.id, stage, 'prev')}
                                                        disabled={stage === 'POOL'}
                                                        className="p-1 hover:text-white disabled:opacity-0 text-concrete/50"
                                                    >
                                                        <ChevronLeft size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setScoringCandidate(candidate)}
                                                        className="text-[9px] bg-steel/20 hover:bg-gold hover:text-void px-2 py-1 uppercase text-concrete/50 transition-colors"
                                                    >
                                                        EVAL
                                                    </button>
                                                    <button
                                                        onClick={() => handleMove(candidate.id, stage, 'next')}
                                                        disabled={stage === 'CHAMPION'}
                                                        className="p-1 hover:text-gold disabled:opacity-0 text-concrete/50"
                                                    >
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // GALLERY VIEW
                    <div className="p-6 overflow-y-auto h-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {candidates.filter(c => !c.isArchived).map(candidate => (
                            <div key={candidate.id} className="aspect-[3/4] bg-steel/10 border border-steel/20 relative group overflow-hidden hover:border-gold/50 transition-all">
                                {candidate.photoUrl ? (
                                    <img
                                        src={`http://localhost:3000${candidate.photoUrl}`}
                                        alt={candidate.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-concrete/10"><User size={48} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent flex flex-col justify-end p-3">
                                    <div className="flex justify-between items-end mb-1">
                                        <div>
                                            <h3 className="text-white font-display font-bold uppercase leading-tight">{candidate.name}</h3>
                                            <div className="text-[10px] text-gold/70 font-mono">{candidate.age || '?'}y • {candidate.stage.replace(/_/g, ' ')}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-gold leading-none">{candidate.totalChampionshipScore}</div>
                                            <div className="text-[8px] text-gold/50 uppercase tracking-widest">PTS</div>
                                        </div>
                                    </div>
                                    <div className="h-0 group-hover:h-8 transition-all overflow-hidden flex items-end">
                                        <button
                                            onClick={() => setScoringCandidate(candidate)}
                                            className="w-full bg-gold text-void text-[10px] font-bold py-1.5 uppercase tracking-widest hover:bg-white"
                                        >
                                            EVALUATE
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-void/80 backdrop-blur border border-steel/30 text-[8px] text-concrete/50 font-mono uppercase">{candidate.stage.replace(/_/g, ' ')}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Candidate Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-void/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-void border border-steel/30 w-full max-w-md shadow-2xl">
                        <div className="p-4 border-b border-steel/20 flex justify-between items-center">
                            <h2 className="font-display font-black text-lg text-gold uppercase tracking-wider">
                                NEW TARGET
                            </h2>
                            <button onClick={() => { setIsAddModalOpen(false); setPreviewUrl(null); }} className="text-concrete/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 border-2 border-dashed border-steel/30 hover:border-gold/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-steel/10 relative"
                                >
                                    {isUploading ? (
                                        <Loader className="w-6 h-6 text-gold animate-spin" />
                                    ) : previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-concrete/30">
                                            <Upload className="w-6 h-6" />
                                            <span className="text-[9px] font-mono mt-1">PHOTO</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <span className="text-[10px] text-concrete/30 font-mono mt-2">Click to upload</span>
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono"
                                    placeholder="Target Name"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Nickname</label>
                                    <input
                                        type="text"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono"
                                        placeholder="Codename"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">DOB</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Intel</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono min-h-[80px] resize-none"
                                    placeholder="Initial intel..."
                                />
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={!formData.name || isUploading}
                                className="w-full bg-gold text-void py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ENTER DATABASE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
