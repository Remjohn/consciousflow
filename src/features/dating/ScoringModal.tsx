import { useState, useEffect } from 'react';
import type { Candidate } from '../../store/useUserStore';
import { X, Brain, Flag, Loader, User, MessageSquare, Calculator, History, Zap } from 'lucide-react';
import { API_URL } from '../../lib/api';

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
    18: { score: -15, label: 'TOO YOUNG', color: 'text-blood' },
    19: { score: -10, label: 'RISKY', color: 'text-blood' },
    20: { score: 2, label: 'ACCEPTABLE', color: 'text-gold' },
    21: { score: 4, label: 'GOOD', color: 'text-emerald-500' },
    22: { score: 6, label: 'OPTIMAL', color: 'text-emerald-500' },
    23: { score: 2, label: 'GOOD', color: 'text-gold' },
    24: { score: 0, label: 'BASELINE', color: 'text-concrete' }
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
    const [activeTab, setActiveTab] = useState<TabName>('PROFILE');
    const [loading, setLoading] = useState(false);

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
            fetch('${API_URL}/api/championship/questions')
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
    const ageData = AGE_SCORES[age] || { score: age > 24 ? -100 : 0, label: age > 24 ? 'DISQUALIFIED' : 'N/A', color: 'text-blood' };

    // Save functions
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
                        {candidate.photoUrl && (
                            <img src={candidate.photoUrl} alt={candidate.name} className="w-12 h-12 object-cover" />
                        )}
                        <div>
                            <h2 className="font-display font-black text-xl text-concrete uppercase">{candidate.name}</h2>
                            <div className="flex items-center gap-3 text-xs font-mono text-concrete/50">
                                <span>Stage: <span className="text-gold">{candidate.stage}</span></span>
                                <span>Total: <span className="text-emerald-400">{candidate.totalChampionshipScore || 0}</span></span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:text-blood"><X size={20} /></button>
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
            </div>
        </div>
    );
};
