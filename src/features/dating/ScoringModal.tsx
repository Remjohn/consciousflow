import { useState, useEffect, useRef } from 'react';
import type { Candidate, CandidateStage } from '../../store/useUserStore';
import { useUserStore } from '../../store/useUserStore';
import { X, Brain, Flag, Loader, User, MessageSquare, Calculator, History, Zap, Trash2, Upload, AlertTriangle, Check, Save } from 'lucide-react';
import { API_URL, assetUrl } from '../../lib/api';
import { getCandidateBadge } from '../../lib/championshipScoring';

const STAGES: CandidateStage[] = ['POOL', 'GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINALS', 'CHAMPION'];

interface Props {
    candidate: Candidate;
    onClose: () => void;
    onRefresh: () => void;
}

// Tab Types
type TabName = 'PROFILE' | 'PRESCREENING' | 'METRICS' | 'QUESTIONS' | 'FLAGS' | 'ADJUSTMENTS';

// Red Flag Categories from Framework Section 6.1
const RED_FLAG_CATEGORIES = [
    { id: 'SHARING_PRIVATE_INFO', label: 'Sharing private conversations or information' },
    { id: 'FINANCIAL_ENTITLEMENT', label: 'Financial entitlement or pressure' },
    { id: 'SEXUALIZED_ESCALATION', label: 'Sexualized escalation or provocation' },
    { id: 'DISRESPECT_AUTHORITY', label: 'Disrespect toward parents, church, or authority' },
    { id: 'MANIPULATION', label: 'Manipulation, guilt-tripping, or testing behavior' },
    { id: 'OTHER', label: 'Other (custom)' }
];

// Green Flag Categories from Framework Section 6.2
const GREEN_FLAG_CATEGORIES = [
    { id: 'FAMILY_ORIENTATION', label: 'Strong Family Orientation (+6)' },
    { id: 'FEMININE_SOFTNESS', label: 'Tenderness & Feminine Softness (+6)' },
    { id: 'ALTRUISM', label: 'Altruism & Caring Nature (+6)' },
    { id: 'GENUINE_EFFORT', label: 'Genuine Desire & Emotional Effort (+6)' },
    { id: 'NO_MALE_FRIENDS', label: 'No Male Friends / Clear Boundaries (+6)' },
    { id: 'DOMESTIC_PRIDE', label: 'Passion for Cooking & Domestic Pride (+6)' },
    { id: 'EXCEPTIONAL_TASTE', label: 'Exceptional Taste & Presentation (+6)' }
];

// Numerology point values from Framework Section 2.3
const NUMEROLOGY_VALUES: Record<number, number> = {
    1: 0, 2: 10, 3: 4, 4: 6, 5: -2, 6: 10, 7: 7, 8: 2, 9: 5, 11: 10
};

// Age point values from Framework Section 2.1
const AGE_SCORES: Record<number, { score: number; label: string; color: string }> = {
    18: { score: 0, label: 'BASELINE', color: 'text-concrete' },
    19: { score: 2, label: 'GOOD', color: 'text-emerald-500' },
    20: { score: 2, label: 'GOOD', color: 'text-emerald-500' },
    21: { score: 4, label: 'GREAT', color: 'text-emerald-500' },
    22: { score: 6, label: 'OPTIMAL', color: 'text-emerald-500' },
    23: { score: 0, label: 'BASELINE', color: 'text-concrete' },
    24: { score: -5, label: 'OLDER', color: 'text-gold' },
    25: { score: -10, label: 'RISKY', color: 'text-blood' },
    26: { score: -15, label: 'HIGH RISK', color: 'text-blood' }
};

// Core Metrics Descriptions from Framework Section 3
const METRIC_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
    valuesAlignment: {
        title: '3.1 Values Alignment',
        description: 'Faith seriousness, marriage-first mindset, sexual boundaries, respect for authority'
    },
    familyStructure: {
        title: '3.2 Family Structure',
        description: 'Presence of father figure, respect for parents, willingness for parental approval'
    },
    communicationStyle: {
        title: '3.3 Communication Style',
        description: 'Tone, respectfulness, emotional regulation, ability to listen'
    },
    disciplineStructure: {
        title: '3.4 Discipline & Daily Structure',
        description: 'Routine, church attendance, time management, delayed gratification'
    },
    healthHygiene: {
        title: '3.5 Health, Hygiene & Self-Care',
        description: 'Body care, grooming, energy levels, general cleanliness'
    },
    socialReputation: {
        title: '3.6 Social Reputation & Discretion',
        description: 'Gossip behavior, ability to keep private matters private, community reputation'
    },
    teachability: {
        title: '3.7 Teachability & Growth Mindset',
        description: 'Openness to learning, humility, ability to receive correction'
    },
    socialMediaConduct: {
        title: '4.1 Social Media Conduct',
        description: 'Posting behavior, validation-seeking, self-promotion vs discretion'
    }
};

interface CoreQuestion {
    questionId: string;
    questionFr: string;
    questionEn?: string;
    mappedMetric: string;
    scoringRules: string;
}

interface FlagHistoryItem {
    id: number;
    flagType: string;
    category: string;
    description: string;
    points: number;
    observedAt: string;
}

export const ScoringModal = ({ candidate, onClose, onRefresh }: Props) => {
    const { candidates, updateCandidate, removeCandidate } = useUserStore();
    const [activeTab, setActiveTab] = useState<TabName>('PROFILE');
    const [loading, setLoading] = useState(false);

    // Dynamic Ranking Badge
    const badge = getCandidateBadge(candidate, candidates);

    // Primary Identity State
    const [identity, setIdentity] = useState({
        name: candidate.name || '',
        nickname: candidate.nickname || '',
        dob: candidate.dob ? String(candidate.dob).split('T')[0] : '',
        photoUrl: candidate.photoUrl || '',
        stage: (candidate.stage || 'POOL') as CandidateStage,
        notes: candidate.notes || ''
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        candidate.photoUrl ? assetUrl(candidate.photoUrl) : null
    );
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [identitySaved, setIdentitySaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const photoFileInputRef = useRef<HTMLInputElement>(null);

    // Profile State
    const [profile, setProfile] = useState({
        name: candidate.name || '',
        nickname: candidate.nickname || '',
        dob: candidate.dob || '',
        tiktokUrl: candidate.tiktokUrl || '',
        instagramUrl: candidate.instagramUrl || '',
        facebookUrl: candidate.facebookUrl || ''
    });

    // Appearance State
    const [appearance, setAppearance] = useState({
        cuteness: candidate.cuteness || 0,
        prettiness: candidate.prettiness || 0,
        hotness: candidate.hotness || 0,
        cleanliness: candidate.cleanliness || 0
    });

    // Numerology State
    const [numerology, setNumerology] = useState({
        lifePathNumber: candidate.lifePathNumber || 0,
        birthdateNumber: candidate.birthdateNumber || 0,
        pinnacleNumber: candidate.pinnacleNumber || 0
    });

    // Metrics State
    const [metrics, setMetrics] = useState({
        valuesAlignment: candidate.valuesAlignment || 0,
        familyStructure: candidate.familyStructure || 0,
        communicationStyle: candidate.communicationStyle || 0,
        disciplineStructure: candidate.disciplineStructure || 0,
        healthHygiene: candidate.healthHygiene || 0,
        socialReputation: candidate.socialReputation || 0,
        teachability: candidate.teachability || 0,
        socialMediaConduct: candidate.socialMediaConduct || 0
    });

    // Flag State
    const [flagHistory, setFlagHistory] = useState<FlagHistoryItem[]>([]);
    const [newFlag, setNewFlag] = useState({ type: 'RED' as 'RED' | 'GREEN', category: '', description: '' });

    // Questions State
    const [coreQuestions, setCoreQuestions] = useState<CoreQuestion[]>([]);
    const [questionAnswers, setQuestionAnswers] = useState<Record<string, { answer: string; score: number }>>({});

    // Adjustment State
    const [newAdjustment, setNewAdjustment] = useState({ type: 'BONUS' as 'BONUS' | 'PENALTY', points: 0, reason: '' });

    // Fetch flag history
    useEffect(() => {
        if (activeTab === 'FLAGS') {
            fetch(`${API_URL}/api/championship/candidate/${candidate.id}/flags`)
                .then(res => res.json())
                .then(data => setFlagHistory(data.flags || []))
                .catch(console.error);
        }
    }, [activeTab, candidate.id]);

    // Fetch core questions
    useEffect(() => {
        if (activeTab === 'QUESTIONS') {
            fetch(`${API_URL}/api/championship/questions`)
                .then(res => res.json())
                .then(data => setCoreQuestions(data.questions || []))
                .catch(console.error);
        }
    }, [activeTab]);

    // Calculate scores
    const beautyScore = appearance.cuteness + appearance.prettiness + appearance.hotness + appearance.cleanliness;
    const meetsThreshold = beautyScore >= 14;

    const calculateNumerologyScore = () => {
        const lpScore = (NUMEROLOGY_VALUES[numerology.lifePathNumber] || 0) * 2;
        const bdScore = (NUMEROLOGY_VALUES[numerology.birthdateNumber] || 0) * 1;
        const pnScore = (NUMEROLOGY_VALUES[numerology.pinnacleNumber] || 0) * 1;
        return { lpScore, bdScore, pnScore, total: lpScore + bdScore + pnScore };
    };
    const numScore = calculateNumerologyScore();

    const age = candidate.age || 0;
    const ageData = AGE_SCORES[age] || { score: age >= 27 ? -100 : 0, label: age >= 27 ? 'DISQUALIFIED' : (age < 18 ? 'YOUTH' : 'N/A'), color: age >= 27 ? 'text-blood' : 'text-concrete' };

    // Save functions
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoPreview(URL.createObjectURL(file));
        setUploadingPhoto(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('photo', file);

            const res = await fetch(`${API_URL}/api/upload/photo`, {
                method: 'POST',
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setIdentity(prev => ({ ...prev, photoUrl: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const saveIdentity = async () => {
        if (!identity.name.trim()) return;
        setLoading(true);
        try {
            const success = await updateCandidate(candidate.id, {
                name: identity.name.trim(),
                nickname: identity.nickname.trim(),
                dob: identity.dob || undefined,
                photoUrl: identity.photoUrl || undefined,
                stage: identity.stage,
                notes: identity.notes
            });
            if (success) {
                setIdentitySaved(true);
                setTimeout(() => setIdentitySaved(false), 2500);
                onRefresh();
            }
        } catch (e) {
            console.error('Save identity failed:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCandidate = async () => {
        setIsDeleting(true);
        try {
            const success = await removeCandidate(candidate.id);
            if (success) {
                onRefresh();
                onClose();
            }
        } catch (e) {
            console.error('Delete candidate failed:', e);
        } finally {
            setIsDeleting(false);
        }
    };

    const saveSocialLinks = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/social`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tiktokUrl: profile.tiktokUrl,
                    instagramUrl: profile.instagramUrl,
                    facebookUrl: profile.facebookUrl
                })
            });
            onRefresh();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const saveAppearance = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/appearance`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appearance)
            });
            onRefresh();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const saveNumerology = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/numerology`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(numerology)
            });
            onRefresh();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const saveMetrics = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/metrics`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metrics)
            });
            onRefresh();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const addFlag = async () => {
        if (!newFlag.category || !newFlag.description) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/flag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flagType: newFlag.type,
                    category: newFlag.category,
                    description: newFlag.description
                })
            });
            onRefresh();
            setNewFlag({ type: 'RED', category: '', description: '' });
            // Refresh history
            const res = await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/flags`);
            const data = await res.json();
            setFlagHistory(data.flags || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const addAdjustment = async () => {
        if (!newAdjustment.reason || newAdjustment.points <= 0) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/adjustment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: newAdjustment.type,
                    points: newAdjustment.points,
                    reason: newAdjustment.reason
                })
            });
            onRefresh();
            setNewAdjustment({ type: 'BONUS', points: 0, reason: '' });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const saveQuestionAnswer = async (questionId: string, mappedMetric: string) => {
        const qa = questionAnswers[questionId];
        if (!qa?.answer) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/championship/candidate/${candidate.id}/question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId,
                    rawAnswer: qa.answer,
                    interpretedScore: qa.score,
                    mappedMetric,
                    notes: ''
                })
            });
            onRefresh();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const tabs: { id: TabName; label: string; icon: React.ReactNode }[] = [
        { id: 'PROFILE', label: 'Profile', icon: <User size={14} /> },
        { id: 'PRESCREENING', label: 'Pre-Screen', icon: <Calculator size={14} /> },
        { id: 'METRICS', label: 'Metrics', icon: <Brain size={14} /> },
        { id: 'QUESTIONS', label: 'Questions', icon: <MessageSquare size={14} /> },
        { id: 'FLAGS', label: 'Flags', icon: <Flag size={14} /> },
        { id: 'ADJUSTMENTS', label: 'Adjust', icon: <Zap size={14} /> }
    ];

    return (
        <div className="fixed inset-0 bg-void/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-void border border-steel/30 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-steel/10 border-b border-steel/20 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-steel/20 border border-steel/30 flex items-center justify-center relative overflow-hidden shrink-0">
                            {(photoPreview || candidate.photoUrl) ? (
                                <img
                                    src={assetUrl(photoPreview || candidate.photoUrl)}
                                    alt={identity.name || candidate.name}
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center text-gold/70 font-mono text-xs font-bold ${(photoPreview || candidate.photoUrl) ? '-z-10' : ''}`}>
                                {(identity.name || candidate.name).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-display font-black text-xl text-concrete uppercase">{identity.name || candidate.name}</h2>
                                {identity.nickname && (
                                    <span className="text-[11px] font-mono text-gold px-2 py-0.5 bg-steel/20 border border-steel/30">
                                        "{identity.nickname}"
                                    </span>
                                )}
                                <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold flex items-center gap-1 ${badge.badgeClasses}`}>
                                    {badge.icon} #{badge.rank} &bull; {badge.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-concrete/50">
                                <span>Stage: <span className="text-gold font-bold">{identity.stage || candidate.stage}</span></span>
                                <span>Total: <span className="text-emerald-400 font-bold">{candidate.totalChampionshipScore || 0} PTS</span></span>
                                <span className="text-concrete/30">|</span>
                                <span>Leaderboard: <span className="text-gold font-bold">#{badge.rank} of {badge.totalCandidates}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 text-concrete/40 hover:text-blood hover:bg-blood/10 transition-colors"
                            title="Expunge Candidate"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 text-concrete/50 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-steel/20 shrink-0 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-steel/20 text-gold border-b-2 border-gold'
                                : 'text-concrete/50 hover:text-concrete'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="absolute inset-0 bg-void/50 flex items-center justify-center z-10">
                            <Loader className="animate-spin text-gold" size={32} />
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-6">
                            {/* Primary Dossier / Identity Editor */}
                            <div className="border border-steel/20 p-5 bg-steel/5">
                                <div className="flex justify-between items-center mb-4 border-b border-steel/20 pb-2">
                                    <h3 className="font-display font-bold text-sm text-gold uppercase tracking-wider flex items-center gap-2">
                                        <User size={15} /> Primary Identity & Dossier
                                    </h3>
                                    {identitySaved && (
                                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                                            <Check size={14} /> Dossier updated
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Photo Upload Box */}
                                    <div className="flex flex-col items-center justify-center border border-dashed border-steel/30 p-4 bg-void/50">
                                        <div
                                            onClick={() => photoFileInputRef.current?.click()}
                                            className="w-24 h-24 border border-steel/30 hover:border-gold/60 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-steel/10 relative group"
                                            title="Click to update photo"
                                        >
                                            {uploadingPhoto ? (
                                                <Loader className="w-6 h-6 text-gold animate-spin" />
                                            ) : photoPreview ? (
                                                <>
                                                    <img src={assetUrl(photoPreview)} alt={identity.name} className="w-full h-full object-cover object-top" />
                                                    <div className="absolute inset-0 bg-void/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[9px] font-mono">
                                                        <Upload size={14} className="mb-1 text-gold" />
                                                        CHANGE
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-concrete/40 group-hover:text-gold transition-colors">
                                                    <Upload size={18} />
                                                    <span className="text-[9px] font-mono mt-1">UPLOAD</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={photoFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                        <span className="text-[10px] text-concrete/40 font-mono mt-1 text-center">Click portrait to upload</span>
                                        <div className="w-full mt-2">
                                            <input
                                                type="url"
                                                value={identity.photoUrl}
                                                onChange={(e) => {
                                                    setIdentity(prev => ({ ...prev, photoUrl: e.target.value }));
                                                    setPhotoPreview(e.target.value || null);
                                                }}
                                                placeholder="Or image URL (https://...)"
                                                className="w-full bg-steel/10 border border-steel/20 p-1.5 text-concrete focus:border-gold/50 outline-none font-mono text-[10px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Name, Nickname, DOB, Stage Inputs */}
                                    <div className="md:col-span-3 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Target Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={identity.name}
                                                    onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
                                                    placeholder="Candidate name"
                                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete focus:border-gold/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Codename / Nickname</label>
                                                <input
                                                    type="text"
                                                    value={identity.nickname}
                                                    onChange={(e) => setIdentity({ ...identity, nickname: e.target.value })}
                                                    placeholder="Codename"
                                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete focus:border-gold/50 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Date of Birth (DOB)</label>
                                                <input
                                                    type="date"
                                                    value={identity.dob}
                                                    onChange={(e) => setIdentity({ ...identity, dob: e.target.value })}
                                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete focus:border-gold/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Tournament Stage</label>
                                                <select
                                                    value={identity.stage}
                                                    onChange={(e) => setIdentity({ ...identity, stage: e.target.value as CandidateStage })}
                                                    className="w-full bg-void border border-steel/20 p-2 text-xs font-mono text-concrete focus:border-gold/50 outline-none uppercase"
                                                >
                                                    {STAGES.map((s) => (
                                                        <option key={s} value={s} className="bg-void text-concrete">
                                                            {s.replace(/_/g, ' ')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-mono text-concrete/50 uppercase block mb-1">Tactical Dossier Notes / Intel</label>
                                            <textarea
                                                value={identity.notes}
                                                onChange={(e) => setIdentity({ ...identity, notes: e.target.value })}
                                                placeholder="Candidate observations, evaluation notes, background..."
                                                className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete focus:border-gold/50 outline-none min-h-[70px] resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-1">
                                            <button
                                                onClick={saveIdentity}
                                                disabled={!identity.name.trim() || uploadingPhoto || loading}
                                                className="bg-gold text-void px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                            >
                                                <Save size={13} />
                                                Save Dossier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Profile Links */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4">Social Profile Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-mono text-concrete/50 uppercase">TikTok</label>
                                        <input
                                            type="text"
                                            value={profile.tiktokUrl}
                                            onChange={(e) => setProfile({ ...profile, tiktokUrl: e.target.value })}
                                            placeholder="@username or URL"
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-concrete/50 uppercase">Instagram</label>
                                        <input
                                            type="text"
                                            value={profile.instagramUrl}
                                            onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                                            placeholder="@username or URL"
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-concrete/50 uppercase">Facebook</label>
                                        <input
                                            type="text"
                                            value={profile.facebookUrl}
                                            onChange={(e) => setProfile({ ...profile, facebookUrl: e.target.value })}
                                            placeholder="Profile URL"
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete"
                                        />
                                    </div>
                                </div>
                                <button onClick={saveSocialLinks} className="mt-4 bg-gold text-void px-4 py-2 text-xs font-bold uppercase">
                                    Save Links
                                </button>
                            </div>

                            {/* Quick Links */}
                            {(profile.tiktokUrl || profile.instagramUrl || profile.facebookUrl) && (
                                <div className="flex gap-2">
                                    {profile.tiktokUrl && (
                                        <a href={profile.tiktokUrl.startsWith('http') ? profile.tiktokUrl : `https://tiktok.com/${profile.tiktokUrl}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 bg-black text-white text-xs font-bold flex items-center gap-2 hover:bg-gray-800">
                                            🎵 TikTok
                                        </a>
                                    )}
                                    {profile.instagramUrl && (
                                        <a href={profile.instagramUrl.startsWith('http') ? profile.instagramUrl : `https://instagram.com/${profile.instagramUrl}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center gap-2">
                                            📸 Instagram
                                        </a>
                                    )}
                                    {profile.facebookUrl && (
                                        <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-700">
                                            📘 Facebook
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Danger Zone */}
                            <div className="border border-blood/30 p-4 bg-blood/5 flex justify-between items-center">
                                <div>
                                    <h4 className="font-display font-bold text-xs uppercase text-blood flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> Danger Zone: Expunge Target
                                    </h4>
                                    <p className="text-[11px] font-mono text-concrete/50 mt-1">
                                        Permanently delete this candidate and all associated tournament evaluation history.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="bg-blood/20 hover:bg-blood text-blood hover:text-white border border-blood/40 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 size={13} />
                                    Expunge
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PRESCREENING TAB */}
                    {activeTab === 'PRESCREENING' && (
                        <div className="space-y-6">
                            {/* Age Score */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-3">Section 2.1 - Age Filter</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-3xl font-black text-concrete">{age}</span>
                                        <span className="text-sm text-concrete/50 ml-2">years old</span>
                                    </div>
                                    <div className={`text-right ${ageData.color}`}>
                                        <div className="text-2xl font-black">{ageData.score > 0 ? '+' : ''}{ageData.score}</div>
                                        <div className="text-[10px] font-mono uppercase">{ageData.label}</div>
                                    </div>
                                </div>
                                {age > 24 && (
                                    <div className="mt-2 p-2 bg-blood/20 border border-blood/50 text-blood text-xs font-mono">
                                        ⚠️ DISQUALIFIED - Age exceeds 24
                                    </div>
                                )}
                            </div>

                            {/* Beauty Score */}
                            <div className="border border-steel/20 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-display font-bold text-sm text-concrete uppercase">Section 2.2 - Appearance Rating</h3>
                                    <div className={`text-right ${meetsThreshold ? 'text-emerald-500' : 'text-blood'}`}>
                                        <span className="text-2xl font-black">{beautyScore}</span>
                                        <span className="text-sm opacity-70">/20</span>
                                        <div className="text-[10px] font-mono">{meetsThreshold ? '✓ PASSES' : '✗ BELOW 14'}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(['cuteness', 'prettiness', 'hotness', 'cleanliness'] as const).map(key => (
                                        <div key={key}>
                                            <label className="text-[10px] font-mono text-concrete/50 uppercase">{key}</label>
                                            <input
                                                type="range"
                                                min={1}
                                                max={5}
                                                value={appearance[key]}
                                                onChange={(e) => setAppearance({ ...appearance, [key]: parseInt(e.target.value) })}
                                                className="w-full"
                                            />
                                            <div className="text-center text-lg font-bold text-gold">{appearance[key]}/5</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={saveAppearance} className="mt-4 bg-gold text-void px-4 py-2 text-xs font-bold uppercase">
                                    Save Appearance
                                </button>
                            </div>

                            {/* Numerology Chart */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4">Section 2.3 - Numerology (Pythagorean)</h3>
                                <div className="bg-steel/5 border border-steel/10 p-4 font-mono text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Life Path Number:</span>
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={numerology.lifePathNumber}
                                                onChange={(e) => setNumerology({ ...numerology, lifePathNumber: parseInt(e.target.value) })}
                                                className="bg-steel/20 border border-steel/30 px-2 py-1 text-concrete"
                                            >
                                                <option value={0}>Select</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map(n => (
                                                    <option key={n} value={n}>{n} ({NUMEROLOGY_VALUES[n] > 0 ? '+' : ''}{NUMEROLOGY_VALUES[n]})</option>
                                                ))}
                                            </select>
                                            <span className="text-gold">×2 = {numScore.lpScore > 0 ? '+' : ''}{numScore.lpScore}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Birthdate Number:</span>
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={numerology.birthdateNumber}
                                                onChange={(e) => setNumerology({ ...numerology, birthdateNumber: parseInt(e.target.value) })}
                                                className="bg-steel/20 border border-steel/30 px-2 py-1 text-concrete"
                                            >
                                                <option value={0}>Select</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map(n => (
                                                    <option key={n} value={n}>{n} ({NUMEROLOGY_VALUES[n] > 0 ? '+' : ''}{NUMEROLOGY_VALUES[n]})</option>
                                                ))}
                                            </select>
                                            <span className="text-gold">×1 = {numScore.bdScore > 0 ? '+' : ''}{numScore.bdScore}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Pinnacle Number:</span>
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={numerology.pinnacleNumber}
                                                onChange={(e) => setNumerology({ ...numerology, pinnacleNumber: parseInt(e.target.value) })}
                                                className="bg-steel/20 border border-steel/30 px-2 py-1 text-concrete"
                                            >
                                                <option value={0}>Select</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map(n => (
                                                    <option key={n} value={n}>{n} ({NUMEROLOGY_VALUES[n] > 0 ? '+' : ''}{NUMEROLOGY_VALUES[n]})</option>
                                                ))}
                                            </select>
                                            <span className="text-gold">×1 = {numScore.pnScore > 0 ? '+' : ''}{numScore.pnScore}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-steel/30 pt-2 mt-2 flex justify-between">
                                        <span className="font-bold text-concrete">TOTAL NUMEROLOGY:</span>
                                        <span className={`text-xl font-black ${numScore.total >= 20 ? 'text-emerald-500' : numScore.total >= 10 ? 'text-gold' : 'text-blood'}`}>
                                            {numScore.total > 0 ? '+' : ''}{numScore.total}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={saveNumerology} className="mt-4 bg-gold text-void px-4 py-2 text-xs font-bold uppercase">
                                    Save Numerology
                                </button>
                            </div>
                        </div>
                    )}

                    {/* METRICS TAB */}
                    {activeTab === 'METRICS' && (
                        <div className="space-y-4">
                            <div className="text-xs font-mono text-concrete/50 mb-4">
                                Scale: <span className="text-blood">-10</span> (danger) → <span className="text-concrete">0</span> (neutral) → <span className="text-emerald-500">+10</span> (exemplary)
                            </div>
                            {Object.entries(METRIC_DESCRIPTIONS).map(([key, meta]) => (
                                <div key={key} className="border border-steel/20 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-display font-bold text-sm text-concrete uppercase">{meta.title}</h4>
                                            <p className="text-[10px] font-mono text-concrete/50">{meta.description}</p>
                                        </div>
                                        <div className={`text-2xl font-black tabular-nums ${(metrics as any)[key] > 0 ? 'text-emerald-500' :
                                            (metrics as any)[key] < 0 ? 'text-blood' : 'text-concrete/50'
                                            }`}>
                                            {(metrics as any)[key] > 0 ? '+' : ''}{(metrics as any)[key]}
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min={-10}
                                        max={10}
                                        value={(metrics as any)[key]}
                                        onChange={(e) => setMetrics({ ...metrics, [key]: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-[9px] font-mono text-concrete/30 mt-1">
                                        <span>-10 Danger</span>
                                        <span>0 Neutral</span>
                                        <span>+10 Exemplary</span>
                                    </div>
                                </div>
                            ))}
                            <button onClick={saveMetrics} className="w-full bg-gold text-void py-3 text-sm font-bold uppercase">
                                Save All Metrics
                            </button>
                        </div>
                    )}

                    {/* QUESTIONS TAB */}
                    {activeTab === 'QUESTIONS' && (
                        <div className="space-y-4">
                            <div className="text-xs font-mono text-concrete/50 mb-4">
                                12 Core Test Questions - Record answers and map to metrics
                            </div>
                            {coreQuestions.map((q) => {
                                const rules = JSON.parse(q.scoringRules || '{}');
                                return (
                                    <div key={q.questionId} className="border border-steel/20 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-gold text-void px-2 py-1 text-xs font-bold">{q.questionId}</span>
                                            <span className="text-[10px] font-mono text-concrete/50 uppercase">{q.mappedMetric}</span>
                                        </div>
                                        <p className="text-sm font-serif italic text-concrete mb-3">{q.questionFr}</p>

                                        {/* Scoring Rules Reference */}
                                        <div className="bg-steel/5 p-2 mb-3 text-[10px] font-mono space-y-1">
                                            {Object.entries(rules).map(([score, text]) => (
                                                <div key={score} className={`${parseInt(score) > 0 ? 'text-emerald-500' : parseInt(score) < 0 ? 'text-blood' : 'text-concrete'}`}>
                                                    {parseInt(score) > 0 ? '+' : ''}{score}: {text as string}
                                                </div>
                                            ))}
                                        </div>

                                        <textarea
                                            placeholder="Her answer..."
                                            value={questionAnswers[q.questionId]?.answer || ''}
                                            onChange={(e) => setQuestionAnswers({
                                                ...questionAnswers,
                                                [q.questionId]: { ...questionAnswers[q.questionId], answer: e.target.value }
                                            })}
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete h-20"
                                        />

                                        <div className="flex items-center gap-4 mt-2">
                                            <select
                                                value={questionAnswers[q.questionId]?.score || 0}
                                                onChange={(e) => setQuestionAnswers({
                                                    ...questionAnswers,
                                                    [q.questionId]: { ...questionAnswers[q.questionId], score: parseInt(e.target.value) }
                                                })}
                                                className="bg-steel/10 border border-steel/20 px-3 py-2 text-xs font-mono text-concrete"
                                            >
                                                <option value={0}>0 (Neutral)</option>
                                                <option value={-7}>-7 (Major Red Flag)</option>
                                                <option value={-5}>-5 (Concerning)</option>
                                                <option value={-3}>-3 (Weak)</option>
                                                <option value={3}>+3 (Positive)</option>
                                                <option value={5}>+5 (Strong)</option>
                                                <option value={7}>+7 (Exemplary)</option>
                                            </select>
                                            <button
                                                onClick={() => saveQuestionAnswer(q.questionId, q.mappedMetric)}
                                                className="bg-steel/20 hover:bg-gold hover:text-void text-concrete px-4 py-2 text-xs font-bold uppercase"
                                            >
                                                Log Answer
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* FLAGS TAB */}
                    {activeTab === 'FLAGS' && (
                        <div className="space-y-6">
                            {/* Add New Flag */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4">Log New Flag</h3>

                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => setNewFlag({ ...newFlag, type: 'RED', category: '' })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase ${newFlag.type === 'RED' ? 'bg-blood text-white' : 'bg-steel/20 text-concrete'}`}
                                    >
                                        🔴 Red Flag (-10)
                                    </button>
                                    <button
                                        onClick={() => setNewFlag({ ...newFlag, type: 'GREEN', category: '' })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase ${newFlag.type === 'GREEN' ? 'bg-emerald-500 text-white' : 'bg-steel/20 text-concrete'}`}
                                    >
                                        🟢 Green Flag (+6)
                                    </button>
                                </div>

                                <select
                                    value={newFlag.category}
                                    onChange={(e) => setNewFlag({ ...newFlag, category: e.target.value })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete mb-3"
                                >
                                    <option value="">Select Category...</option>
                                    {(newFlag.type === 'RED' ? RED_FLAG_CATEGORIES : GREEN_FLAG_CATEGORIES).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>

                                <textarea
                                    placeholder="Description of observed behavior..."
                                    value={newFlag.description}
                                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                                    className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete h-20 mb-3"
                                />

                                <button onClick={addFlag} className="bg-gold text-void px-4 py-2 text-xs font-bold uppercase">
                                    + Add Flag
                                </button>
                            </div>

                            {/* Flag History */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4 flex items-center gap-2">
                                    <History size={14} /> Flag History ({flagHistory.length})
                                </h3>
                                {flagHistory.length === 0 ? (
                                    <p className="text-xs font-mono text-concrete/50">No flags recorded yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {flagHistory.map(flag => (
                                            <div key={flag.id} className={`flex items-start gap-3 p-3 border ${flag.flagType === 'RED' ? 'border-blood/30 bg-blood/5' : 'border-emerald-500/30 bg-emerald-500/5'
                                                }`}>
                                                <span className="text-lg">{flag.flagType === 'RED' ? '🔴' : '🟢'}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-mono text-concrete">{flag.category}</span>
                                                        <span className={`text-xs font-bold ${flag.flagType === 'RED' ? 'text-blood' : 'text-emerald-500'}`}>
                                                            {flag.points > 0 ? '+' : ''}{flag.points}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-concrete/70 mt-1">{flag.description}</p>
                                                    <span className="text-[10px] text-concrete/30">{new Date(flag.observedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ADJUSTMENTS TAB */}
                    {activeTab === 'ADJUSTMENTS' && (
                        <div className="space-y-6">
                            {/* Score Breakdown */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4">Score Breakdown</h3>
                                <div className="font-mono text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Pre-Screening (Age + Beauty + Numerology):</span>
                                        <span className="text-gold">{candidate.preScreeningScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Core Metrics (8 × -10 to +10):</span>
                                        <span className="text-gold">{candidate.coreMetricsScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Questions (12 × -7 to +7):</span>
                                        <span className="text-gold">{candidate.questionsScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Green Flags ({candidate.greenFlagCount || 0} × +6):</span>
                                        <span className="text-emerald-500">+{candidate.greenFlagScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Red Flags ({candidate.redFlagCount || 0} × -10):</span>
                                        <span className="text-blood">{candidate.redFlagScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Bonus Points:</span>
                                        <span className="text-emerald-500">+{candidate.bonusPoints || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-concrete/70">Penalty Points:</span>
                                        <span className="text-blood">-{candidate.penaltyPoints || 0}</span>
                                    </div>
                                    <div className="border-t border-steel/30 pt-2 mt-2 flex justify-between">
                                        <span className="font-bold text-concrete">TOTAL CHAMPIONSHIP SCORE:</span>
                                        <span className="text-2xl font-black text-gold">{candidate.totalChampionshipScore || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Add Adjustment */}
                            <div className="border border-steel/20 p-4">
                                <h3 className="font-display font-bold text-sm text-concrete uppercase mb-4">Add Manual Adjustment</h3>

                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => setNewAdjustment({ ...newAdjustment, type: 'BONUS' })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase ${newAdjustment.type === 'BONUS' ? 'bg-emerald-500 text-white' : 'bg-steel/20 text-concrete'}`}
                                    >
                                        + Bonus
                                    </button>
                                    <button
                                        onClick={() => setNewAdjustment({ ...newAdjustment, type: 'PENALTY' })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase ${newAdjustment.type === 'PENALTY' ? 'bg-blood text-white' : 'bg-steel/20 text-concrete'}`}
                                    >
                                        - Penalty
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="text-[10px] font-mono text-concrete/50 uppercase">Points</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={newAdjustment.points}
                                            onChange={(e) => setNewAdjustment({ ...newAdjustment, points: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-sm font-mono text-concrete"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-concrete/50 uppercase">Reason</label>
                                        <input
                                            type="text"
                                            value={newAdjustment.reason}
                                            onChange={(e) => setNewAdjustment({ ...newAdjustment, reason: e.target.value })}
                                            placeholder="Reason for adjustment"
                                            className="w-full bg-steel/10 border border-steel/20 p-2 text-xs font-mono text-concrete"
                                        />
                                    </div>
                                </div>

                                <button onClick={addAdjustment} className="bg-gold text-void px-4 py-2 text-xs font-bold uppercase">
                                    Apply Adjustment
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-void/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                        <div className="bg-void border border-blood/50 w-full max-w-sm shadow-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-blood">
                                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                                <h2 className="font-display font-black text-lg uppercase tracking-wider text-blood">
                                    EXPUNGE TARGET
                                </h2>
                            </div>
                            <p className="text-xs text-concrete/70 font-mono leading-relaxed">
                                Are you certain you want to permanently erase <span className="text-white font-bold">{identity.name || candidate.name}</span>?
                                All ratings, questions, red/green flags, and stage records will be permanently expunged.
                            </p>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 bg-steel/20 hover:bg-steel/30 text-concrete py-2.5 font-bold uppercase tracking-widest text-xs transition-colors font-mono"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleDeleteCandidate}
                                    disabled={isDeleting}
                                    className="flex-1 bg-blood hover:bg-blood/80 text-white py-2.5 font-bold uppercase tracking-widest text-xs transition-colors font-mono disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader className="w-3.5 h-3.5 animate-spin" />
                                            EXPUNGING...
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
        </div>
    );
};
