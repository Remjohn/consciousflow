import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../../store/useUserStore';
import type { CandidateStage, Candidate } from '../../store/useUserStore';
import { Plus, Trophy, X, ChevronRight, ChevronLeft, RefreshCw, LayoutGrid, Kanban, Upload, Loader, Pencil, Trash2, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { ScoringModal } from './ScoringModal';
import { API_URL, assetUrl } from '../../lib/api';
import { getCandidateBadge } from '../../lib/championshipScoring';

const STAGES: CandidateStage[] = ['POOL', 'GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINALS', 'CHAMPION'];

export const Dating = () => {
    const { candidates, addCandidate, moveCandidate, fetchCandidates, updateCandidate, removeCandidate } = useUserStore();
    const [viewMode, setViewMode] = useState<'PIPELINE' | 'GALLERY'>('GALLERY');
    const [sortBy, setSortBy] = useState<'RANK' | 'DEFAULT'>('RANK');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Scoring Modal State
    const [scoringCandidate, setScoringCandidate] = useState<Candidate | null>(null);

    // Edit Candidate State
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [editFormData, setEditFormData] = useState<{
        name: string;
        nickname: string;
        dob: string;
        photoUrl: string;
        stage: CandidateStage;
        notes: string;
    }>({
        name: '',
        nickname: '',
        dob: '',
        photoUrl: '',
        stage: 'POOL',
        notes: ''
    });
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
    const [isEditUploading, setIsEditUploading] = useState(false);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Delete Candidate State
    const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

            const res = await fetch(`${API_URL}/api/upload/photo`, {
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

    const handleOpenEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate);
        setEditFormData({
            name: candidate.name || '',
            nickname: candidate.nickname || '',
            dob: candidate.dob ? String(candidate.dob).split('T')[0] : '',
            photoUrl: candidate.photoUrl || '',
            stage: candidate.stage || 'POOL',
            notes: candidate.notes || ''
        });
        setEditPreviewUrl(candidate.photoUrl ? (candidate.photoUrl.startsWith('http') ? candidate.photoUrl : `${API_URL}${candidate.photoUrl}`) : null);
    };

    const handlePhotoEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setEditPreviewUrl(URL.createObjectURL(file));
        setIsEditUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('photo', file);

            const res = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setEditFormData(prev => ({ ...prev, photoUrl: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsEditUploading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingCandidate || !editFormData.name.trim()) return;
        setIsEditUploading(true);
        try {
            await updateCandidate(editingCandidate.id, {
                name: editFormData.name.trim(),
                nickname: editFormData.nickname.trim(),
                dob: editFormData.dob || undefined,
                photoUrl: editFormData.photoUrl || undefined,
                stage: editFormData.stage,
                notes: editFormData.notes
            });
            setEditingCandidate(null);
            setEditPreviewUrl(null);
        } finally {
            setIsEditUploading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCandidate) return;
        setIsDeleting(true);
        try {
            await removeCandidate(deletingCandidate.id);
            if (scoringCandidate?.id === deletingCandidate.id) {
                setScoringCandidate(null);
            }
            setDeletingCandidate(null);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-void text-concrete overflow-hidden relative">

            {/* Scoring Modal */}
            {scoringCandidate && (
                <ScoringModal
                    candidate={candidates.find(c => c.id === scoringCandidate.id) || scoringCandidate}
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
                    {/* Sort Toggle (Gallery View) */}
                    {viewMode === 'GALLERY' && (
                        <button
                            onClick={() => setSortBy(prev => prev === 'RANK' ? 'DEFAULT' : 'RANK')}
                            className={`flex items-center gap-1.5 px-3 py-2 border text-xs font-mono uppercase transition-colors ${
                                sortBy === 'RANK'
                                    ? 'bg-gold/15 text-gold border-gold/60 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                    : 'bg-steel/10 text-concrete/60 border-steel/30 hover:text-concrete'
                            }`}
                            title="Toggle ranking sort order"
                        >
                            <ArrowUpDown size={13} />
                            <span>{sortBy === 'RANK' ? '👑 Ranked: Best → Worst' : 'Stage Order'}</span>
                        </button>
                    )}

                    {/* Auto-Advance Button */}
                    <button
                        onClick={async () => {
                            const confirmed = window.confirm('⚡ AUTO-ADVANCE\n\nThis will:\n• Disqualify candidates with age >= 27, beauty < 14, or 3+ red flags\n• Rank all candidates by total score\n• Assign stages based on ranking\n\nProceed?');
                            if (!confirmed) return;
                            try {
                                const res = await fetch(`${API_URL}/api/championship/auto-advance`, { method: 'POST' });
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
                                        {stageCandidates.map(candidate => {
                                            const badge = getCandidateBadge(candidate, candidates);
                                            return (
                                                <div key={candidate.id} className={`bg-void border ${badge.borderHighlight} p-3 group hover:border-gold/50 transition-colors relative`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-9 h-9 bg-steel/20 flex items-center justify-center overflow-hidden cursor-pointer border border-steel/30 relative shrink-0"
                                                                onClick={() => setScoringCandidate(candidate)}
                                                            >
                                                                {candidate.photoUrl ? (
                                                                    <img
                                                                        src={assetUrl(candidate.photoUrl)}
                                                                        alt={candidate.name}
                                                                        className="w-full h-full object-cover object-top"
                                                                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                                                    />
                                                                ) : null}
                                                                <div className={`w-full h-full flex items-center justify-center text-gold/70 font-mono text-xs font-bold ${candidate.photoUrl ? '-z-10' : ''}`}>
                                                                    {candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`text-[9px] font-mono px-1 py-0.2 border ${badge.badgeClasses}`}>
                                                                        {badge.icon} #{badge.rank}
                                                                    </span>
                                                                    <div className="font-bold text-concrete text-sm cursor-pointer hover:text-gold truncate max-w-[130px]" onClick={() => setScoringCandidate(candidate)}>
                                                                        {candidate.name}
                                                                    </div>
                                                                </div>
                                                                <div className="text-[10px] font-mono text-concrete/40 flex items-center gap-2 mt-0.5">
                                                                    <span>{candidate.age ? `${candidate.age} Y/O` : '? Y/O'}</span>
                                                                    <span className="text-[9px] uppercase tracking-wider">{badge.label}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`font-mono font-bold text-xs ${badge.tier === 'ELITE' ? 'text-gold' : badge.tier === 'STRONG' ? 'text-emerald-400' : badge.tier === 'DANGER' ? 'text-blood' : 'text-concrete'}`}>
                                                            {candidate.totalChampionshipScore || 0} PTS
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
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => setScoringCandidate(candidate)}
                                                                className="text-[9px] bg-steel/20 hover:bg-gold hover:text-void px-2 py-1 uppercase text-concrete/70 transition-colors font-bold"
                                                            >
                                                                EVAL
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenEdit(candidate)}
                                                                className="text-[9px] bg-steel/20 hover:bg-white hover:text-void p-1 text-concrete/50 transition-colors"
                                                                title="Edit Profile"
                                                            >
                                                                <Pencil size={11} />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingCandidate(candidate)}
                                                                className="text-[9px] bg-steel/20 hover:bg-blood hover:text-white p-1 text-concrete/50 transition-colors"
                                                                title="Delete Candidate"
                                                            >
                                                                <Trash2 size={11} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleMove(candidate.id, stage, 'next')}
                                                            disabled={stage === 'CHAMPION'}
                                                            className="p-1 hover:text-gold disabled:opacity-0 text-concrete/50"
                                                        >
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // GALLERY VIEW
                    <div className="p-6 overflow-y-auto h-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(() => {
                            const activeCandidates = candidates.filter(c => !c.isArchived);
                            const displayed = sortBy === 'RANK'
                                ? [...activeCandidates].sort((a, b) => (b.totalChampionshipScore || 0) - (a.totalChampionshipScore || 0))
                                : activeCandidates;

                            return displayed.map(candidate => {
                                const badge = getCandidateBadge(candidate, candidates);
                                return (
                                    <div
                                        key={candidate.id}
                                        className={`aspect-[3/4] bg-void border ${badge.borderHighlight} relative group overflow-hidden transition-all shadow-lg`}
                                    >
                                        {/* Portrait Photo */}
                                        {candidate.photoUrl ? (
                                            <img
                                                src={assetUrl(candidate.photoUrl)}
                                                alt={candidate.name}
                                                className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-all group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        ) : null}

                                        {/* Tactical Avatar Fallback (visible if photoUrl is null or fails) */}
                                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-steel/20 to-void/90 ${candidate.photoUrl ? '-z-10' : ''}`}>
                                            <div className="w-16 h-16 rounded-full bg-steel/30 border border-steel/40 flex items-center justify-center text-gold/90 font-display font-black text-xl mb-1 shadow-inner">
                                                {candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                            </div>
                                            <span className="text-[9px] font-mono text-concrete/40 uppercase tracking-widest">NO PORTRAIT</span>
                                        </div>

                                        {/* Rank & Performance Tier Badge */}
                                        <div className={`absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono font-bold tracking-wider backdrop-blur-md shadow-md ${badge.badgeClasses}`}>
                                            <span>{badge.icon}</span>
                                            <span>#{badge.rank}</span>
                                            <span className="opacity-40">|</span>
                                            <span>{badge.label}</span>
                                        </div>

                                        {/* Stage Pill */}
                                        <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 bg-void/80 backdrop-blur border border-steel/30 text-[8px] text-concrete/70 font-mono uppercase">
                                            {candidate.stage.replace(/_/g, ' ')}
                                        </div>

                                        {/* Quick Edit / Delete Buttons on Card */}
                                        <div className="absolute top-8 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <button
                                                onClick={() => handleOpenEdit(candidate)}
                                                className="p-1.5 bg-void/85 hover:bg-gold hover:text-void text-concrete/70 backdrop-blur border border-steel/30 text-[10px] transition-colors"
                                                title="Edit Candidate"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingCandidate(candidate)}
                                                className="p-1.5 bg-void/85 hover:bg-blood hover:text-white text-concrete/70 backdrop-blur border border-steel/30 text-[10px] transition-colors"
                                                title="Delete Candidate"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>

                                        {/* Gradient Overlay & Bottom Info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                                            <div className="flex justify-between items-end mb-1">
                                                <div>
                                                    <h3 className="text-white font-display font-bold uppercase leading-tight drop-shadow-sm">{candidate.name}</h3>
                                                    {candidate.nickname && (
                                                        <div className="text-[10px] text-gold/80 font-mono">"{candidate.nickname}"</div>
                                                    )}
                                                    <div className="text-[10px] text-concrete/60 font-mono">
                                                        {candidate.age ? `${candidate.age}y` : '?y'} &bull; {candidate.stage.replace(/_/g, ' ')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-black leading-none ${badge.tier === 'ELITE' ? 'text-gold' : badge.tier === 'STRONG' ? 'text-emerald-400' : badge.tier === 'DANGER' ? 'text-blood' : 'text-concrete'}`}>
                                                        {candidate.totalChampionshipScore || 0}
                                                    </div>
                                                    <div className="text-[8px] text-concrete/50 uppercase tracking-widest">PTS</div>
                                                </div>
                                            </div>
                                            <div className="h-0 group-hover:h-8 transition-all overflow-hidden flex items-end gap-1.5 pointer-events-auto">
                                                <button
                                                    onClick={() => setScoringCandidate(candidate)}
                                                    className="flex-1 bg-gold text-void text-[10px] font-bold py-1.5 uppercase tracking-widest hover:bg-white transition-colors"
                                                >
                                                    EVALUATE
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(candidate)}
                                                    className="bg-steel/30 text-concrete hover:text-gold hover:bg-steel/50 p-1.5 transition-colors"
                                                    title="Edit Profile"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingCandidate(candidate)}
                                                    className="bg-steel/30 text-concrete/70 hover:text-white hover:bg-blood p-1.5 transition-colors"
                                                    title="Delete Candidate"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
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
                                        <img src={assetUrl(previewUrl)} alt="Preview" className="w-full h-full object-cover object-top" />
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
                                <span className="text-[10px] text-concrete/30 font-mono mt-1">Click to upload file</span>
                                <div className="w-full mt-2">
                                    <input
                                        type="url"
                                        value={formData.photoUrl}
                                        onChange={(e) => {
                                            setFormData({ ...formData, photoUrl: e.target.value });
                                            setPreviewUrl(e.target.value || null);
                                        }}
                                        placeholder="Or paste direct image URL (https://...)"
                                        className="w-full bg-steel/10 border border-steel/20 p-1.5 text-concrete focus:border-gold/50 outline-none font-mono text-[11px]"
                                    />
                                </div>
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

            {/* Edit Candidate Modal */}
            {editingCandidate && (
                <div className="fixed inset-0 bg-void/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-void border border-steel/30 w-full max-w-md shadow-2xl">
                        <div className="p-4 border-b border-steel/20 flex justify-between items-center">
                            <div>
                                <h2 className="font-display font-black text-lg text-gold uppercase tracking-wider">
                                    EDIT TARGET DOSSIER
                                </h2>
                                <p className="text-[10px] font-mono text-concrete/50">ID #{editingCandidate.id} &bull; {editingCandidate.name}</p>
                            </div>
                            <button onClick={() => { setEditingCandidate(null); setEditPreviewUrl(null); }} className="text-concrete/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => editFileInputRef.current?.click()}
                                    className="w-24 h-24 border-2 border-dashed border-steel/30 hover:border-gold/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-steel/10 relative"
                                >
                                    {isEditUploading ? (
                                        <Loader className="w-6 h-6 text-gold animate-spin" />
                                    ) : editPreviewUrl ? (
                                        <img src={assetUrl(editPreviewUrl)} alt="Preview" className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <div className="flex flex-col items-center text-concrete/30">
                                            <Upload className="w-6 h-6" />
                                            <span className="text-[9px] font-mono mt-1">CHANGE PHOTO</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoEditUpload}
                                    className="hidden"
                                />
                                <span className="text-[10px] text-concrete/30 font-mono mt-1">Click to update portrait</span>
                                <div className="w-full mt-2">
                                    <input
                                        type="url"
                                        value={editFormData.photoUrl}
                                        onChange={(e) => {
                                            setEditFormData(prev => ({ ...prev, photoUrl: e.target.value }));
                                            setEditPreviewUrl(e.target.value || null);
                                        }}
                                        placeholder="Or paste direct image URL (https://...)"
                                        className="w-full bg-steel/10 border border-steel/20 p-1.5 text-concrete focus:border-gold/50 outline-none font-mono text-[11px]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                                        value={editFormData.nickname}
                                        onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
                                        className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono"
                                        placeholder="Codename"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">DOB</label>
                                    <input
                                        type="date"
                                        value={editFormData.dob}
                                        onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                                        className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Tournament Stage</label>
                                <select
                                    value={editFormData.stage}
                                    onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value as CandidateStage })}
                                    className="w-full bg-void border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono text-xs uppercase"
                                >
                                    {STAGES.map((s) => (
                                        <option key={s} value={s} className="bg-void text-concrete">
                                            {s.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Intel</label>
                                <textarea
                                    value={editFormData.notes}
                                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-concrete focus:border-gold/50 outline-none font-mono min-h-[80px] resize-none"
                                    placeholder="Updated notes or background intel..."
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditingCandidate(null); setEditPreviewUrl(null); }}
                                    className="flex-1 bg-steel/20 hover:bg-steel/30 text-concrete py-3 font-bold uppercase tracking-widest text-xs transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!editFormData.name.trim() || isEditUploading}
                                    className="flex-1 bg-gold text-void py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingCandidate && (
                <div className="fixed inset-0 bg-void/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-void border border-blood/50 w-full max-w-sm shadow-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-blood">
                            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                            <h2 className="font-display font-black text-lg uppercase tracking-wider text-blood">
                                EXPUNGE TARGET
                            </h2>
                        </div>
                        <p className="text-xs text-concrete/70 font-mono leading-relaxed">
                            Are you certain you want to permanently delete candidate <span className="text-white font-bold">{deletingCandidate.name}</span>?
                            All associated evaluation scores, questions, flags, and tactical logs will be permanently erased.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeletingCandidate(null)}
                                disabled={isDeleting}
                                className="flex-1 bg-steel/20 hover:bg-steel/30 text-concrete py-2.5 font-bold uppercase tracking-widest text-xs transition-colors font-mono"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="flex-1 bg-blood hover:bg-blood/80 text-white py-2.5 font-bold uppercase tracking-widest text-xs transition-colors font-mono disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader className="w-3.5 h-3.5 animate-spin" />
                                        DELETING...
                                    </>
                                ) : (
                                    'CONFIRM EXPUNGE'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
