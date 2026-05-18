import { useState, useEffect } from 'react';
import { Play, Check, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FitnessSession } from './FitnessSession';
import { API_URL } from '../../lib/api';

type SessionType = 'PUSHUPS' | 'ABS' | 'BICEPS' | 'CARDIO';

interface FitnessSession {
    id: number;
    date: string;
    sessionType: SessionType;
    scheduledTime: string;
    status: 'PENDING' | 'COMPLETED' | 'SKIPPED' | 'IN_PROGRESS';
    totalReps?: number;
    durationMinutes: number;
    perceivedExertion?: number;
}

interface FitnessSummary {
    completed: number;
    total: number;
    minutes: number;
    targetMinutes: number;
}

const SESSION_ICONS: Record<SessionType, string> = {
    PUSHUPS: '💪',
    ABS: '🔥',
    BICEPS: '💪',
    CARDIO: '🏃'
};

const SESSION_COLORS: Record<SessionType, { bg: string; border: string }> = {
    PUSHUPS: { bg: 'bg-blood/10', border: 'border-blood' },
    ABS: { bg: 'bg-gold/10', border: 'border-gold' },
    BICEPS: { bg: 'bg-emerald-500/10', border: 'border-emerald-500' },
    CARDIO: { bg: 'bg-purple-500/10', border: 'border-purple-500' }
};

// Default exercise types - ALWAYS shown
const EXERCISE_TYPES: SessionType[] = ['PUSHUPS', 'ABS', 'BICEPS', 'CARDIO'];

export const FitnessProtocol = () => {
    const [sessions, setSessions] = useState<FitnessSession[]>([]);
    const [summary, setSummary] = useState<FitnessSummary | null>(null);
    const [activeSessionType, setActiveSessionType] = useState<SessionType | null>(null);
    const [activeSession, setActiveSession] = useState<FitnessSession | null>(null);

    useEffect(() => {
        fetchTodaySessions();
    }, []);

    const fetchTodaySessions = async () => {
        try {
            const res = await fetch(`${API_URL}/api/fitness/today`);
            const data = await res.json();
            setSessions(data.sessions || []);
            setSummary(data.summary || null);
        } catch (err) {
            console.error(err);
        }
    };

    const startSession = async (type: SessionType) => {
        // Check if session already exists for this type today
        const existingSession = sessions.find(s => s.sessionType === type);
        if (existingSession) {
            setActiveSession(existingSession);
            setActiveSessionType(type);
        } else {
            // Create a temporary session object for the session timer
            // It will be saved when completed
            setActiveSession(null);
            setActiveSessionType(type);
        }
    };

    const handleSessionComplete = async (data: { totalReps: number; perceivedExertion: number }) => {
        if (!activeSessionType) return;

        if (activeSession) {
            // Update existing session
            await fetch(`${API_URL}/api/fitness/session/${activeSession.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create new session with completion data
            await fetch(`${API_URL}/api/fitness/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionType: activeSessionType,
                    totalReps: data.totalReps,
                    perceivedExertion: data.perceivedExertion,
                    durationMinutes: 15, // Era 3 Default Baseline
                    status: 'COMPLETED'
                })
            });
        }

        setActiveSession(null);
        setActiveSessionType(null);
        fetchTodaySessions();
    };

    const getSessionForType = (type: SessionType) => {
        return sessions.find(s => s.sessionType === type);
    };

    return (
        <>
            <div className="border border-steel/30 bg-void p-3">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-concrete flex items-center gap-2">
                        <Clock size={12} className="text-gold" />
                        Fitness Protocol
                    </span>
                    <div className="flex items-center gap-2">
                        {summary && (
                            <span className={`text-[10px] font-mono ${summary.completed === 4 ? 'text-emerald-500' : 'text-concrete/50'}`}>
                                {summary.completed}/4 • {summary.minutes}/{summary.targetMinutes}min
                            </span>
                        )}
                        <Link
                            to="/fitness/progress"
                            className="p-1 bg-gold/20 hover:bg-gold/40 text-gold rounded"
                            title="Body Progress"
                        >
                            <TrendingUp size={14} />
                        </Link>
                    </div>
                </div>

                {/* Exercise Cards - ALWAYS SHOW ALL 4 */}
                <div className="grid grid-cols-4 gap-2">
                    {EXERCISE_TYPES.map(type => {
                        const session = getSessionForType(type);
                        const isCompleted = session?.status === 'COMPLETED';
                        const colors = SESSION_COLORS[type];

                        return (
                            <div
                                key={type}
                                className={`p-2 border ${isCompleted
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : `${colors.border} ${colors.bg}`
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-lg">{SESSION_ICONS[type]}</div>
                                    <div className="text-[9px] font-mono uppercase text-concrete/70">
                                        {type}
                                    </div>

                                    {/* Status/Action */}
                                    {isCompleted ? (
                                        <div className="mt-1">
                                            <Check size={14} className="mx-auto text-emerald-500" />
                                            <div className="text-[8px] text-emerald-500">
                                                {session?.totalReps} reps
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startSession(type)}
                                            className="mt-1 w-full bg-gold text-void py-1 text-[9px] font-bold uppercase flex items-center justify-center gap-1"
                                        >
                                            <Play size={10} /> GO
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Full-Screen Session Timer */}
            {activeSessionType && (
                <FitnessSession
                    sessionType={activeSessionType}
                    session={activeSession}
                    onClose={() => {
                        setActiveSession(null);
                        setActiveSessionType(null);
                    }}
                    onComplete={handleSessionComplete}
                />
            )}
        </>
    );
};

export default FitnessProtocol;
