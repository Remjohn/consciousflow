import { useState, useEffect } from 'react';
import { Play, Check, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FitnessPomodoro } from './FitnessPomodoro';
import { API_URL } from '../../lib/api';

type SessionType = 'PUSHUPS' | 'ABS' | 'BICEPS' | 'CARDIO';
type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

interface FitnessSession {
    id: number;
    date: string;
    sessionType: SessionType;
    scheduledTime: string;
    status: SessionStatus;
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

export const FitnessProtocol = () => {
    const [sessions, setSessions] = useState<FitnessSession[]>([]);
    const [summary, setSummary] = useState<FitnessSummary | null>(null);
    const [activeSession, setActiveSession] = useState<FitnessSession | null>(null);

    useEffect(() => {
        fetchTodaySessions();
    }, []);

    const fetchTodaySessions = async () => {
        try {
            const res = await fetch('${API_URL}/api/fitness/today');
            const data = await res.json();
            setSessions(data.sessions || []);
            setSummary(data.summary || null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSessionComplete = async (data: { totalReps: number; perceivedExertion: number }) => {
        if (!activeSession) return;

        await fetch(`${API_URL}/api/fitness/session/${activeSession.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        setActiveSession(null);
        fetchTodaySessions();
    };

    const getSessionStatus = (session: FitnessSession) => {
        const now = new Date();
        const [hours, mins] = session.scheduledTime.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, mins, 0, 0);

        const diffMinutes = (now.getTime() - scheduledTime.getTime()) / 60000;

        if (session.status === 'COMPLETED') return 'COMPLETED';
        if (session.status === 'SKIPPED') return 'SKIPPED';
        if (session.status === 'IN_PROGRESS') return 'IN_PROGRESS';
        if (diffMinutes >= -30 && diffMinutes <= 120) return 'READY';
        if (diffMinutes > 120) return 'MISSED';
        return 'PENDING';
    };

    return (
        <>
            <div className="border border-steel/30 bg-void p-3">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-concrete flex items-center gap-2">
                        <Clock size={12} className="text-gold" />
                        Fitness Protocol (4×25)
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

                {/* Session Cards */}
                <div className="grid grid-cols-4 gap-2">
                    {sessions.map(session => {
                        const status = getSessionStatus(session);
                        const colors = SESSION_COLORS[session.sessionType];

                        return (
                            <div
                                key={session.id}
                                className={`p-2 border ${status === 'COMPLETED' ? 'border-emerald-500 bg-emerald-500/10' :
                                    status === 'READY' ? `${colors.border} ${colors.bg}` :
                                        status === 'MISSED' ? 'border-blood bg-blood/10' :
                                            'border-steel/20 bg-steel/5'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-lg">{SESSION_ICONS[session.sessionType]}</div>
                                    <div className="text-[9px] font-mono uppercase text-concrete/70">
                                        {session.sessionType}
                                    </div>
                                    <div className="text-[8px] font-mono text-concrete/40">
                                        {session.scheduledTime}
                                    </div>

                                    {/* Status/Action */}
                                    {status === 'COMPLETED' ? (
                                        <div className="mt-1">
                                            <Check size={14} className="mx-auto text-emerald-500" />
                                            <div className="text-[8px] text-emerald-500">
                                                {session.totalReps} reps
                                            </div>
                                        </div>
                                    ) : status === 'READY' ? (
                                        <button
                                            onClick={() => setActiveSession(session)}
                                            className="mt-1 w-full bg-gold text-void py-1 text-[9px] font-bold uppercase flex items-center justify-center gap-1"
                                        >
                                            <Play size={10} /> GO
                                        </button>
                                    ) : status === 'MISSED' ? (
                                        <button
                                            onClick={() => setActiveSession(session)}
                                            className="mt-1 w-full bg-blood/50 text-white py-1 text-[8px] font-bold uppercase"
                                        >
                                            LATE START
                                        </button>
                                    ) : (
                                        <div className="mt-1 text-[8px] text-concrete/30">
                                            PENDING
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Start Row */}
                <div className="flex gap-1 mt-2">
                    {(['PUSHUPS', 'ABS', 'BICEPS', 'CARDIO'] as SessionType[]).map(type => {
                        const session = sessions.find(s => s.sessionType === type);
                        if (!session || session.status === 'COMPLETED') return null;

                        return (
                            <button
                                key={type}
                                onClick={() => session && setActiveSession(session)}
                                className="flex-1 bg-steel/10 hover:bg-steel/20 text-concrete/60 py-1 text-[8px] font-mono uppercase"
                            >
                                {SESSION_ICONS[type]} {type.substring(0, 4)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Full-Screen Pomodoro Timer */}
            {activeSession && (
                <FitnessPomodoro
                    session={activeSession}
                    onClose={() => setActiveSession(null)}
                    onComplete={handleSessionComplete}
                />
            )}
        </>
    );
};

export default FitnessProtocol;
