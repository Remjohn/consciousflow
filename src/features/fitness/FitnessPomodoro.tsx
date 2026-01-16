import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Check, Plus, Minus } from 'lucide-react';
import { API_URL } from '../../lib/api';

type SessionType = 'PUSHUPS' | 'ABS' | 'BICEPS' | 'CARDIO';

interface FitnessSession {
    id: number;
    sessionType: SessionType;
    scheduledTime: string;
    status: string;
    totalReps?: number;
    durationMinutes: number;
}

interface FitnessPomodoroProps {
    session: FitnessSession;
    onClose: () => void;
    onComplete: (data: { totalReps: number; perceivedExertion: number; notes?: string }) => void;
}

const SESSION_VARIATIONS: Record<SessionType, string[]> = {
    PUSHUPS: ['Standard', 'Diamond', 'Wide', 'Decline', 'Incline'],
    ABS: ['Crunches', 'Leg Raises', 'Plank', 'Mountain Climbers', 'Flutter Kicks'],
    BICEPS: ['Band Curls', 'Hammer Curls', 'Concentration', 'Pelvic Floor', 'Bridges'],
    CARDIO: ['Jump Rope', 'High Knees', 'Jump Squats', 'Tuck Jumps', 'Skaters']
};

export const FitnessPomodoro = ({ session, onClose, onComplete }: FitnessPomodoroProps) => {
    const [phase, setPhase] = useState<'PRE' | 'ACTIVE' | 'COMPLETE'>('PRE');
    const [secondsLeft, setSecondsLeft] = useState(session.durationMinutes * 60);
    const [isPaused, setIsPaused] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const [currentVariation, setCurrentVariation] = useState(0);
    const [perceivedExertion, setPerceivedExertion] = useState(7);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const variations = SESSION_VARIATIONS[session.sessionType];
    const totalDuration = session.durationMinutes * 60;
    const variationInterval = Math.floor(totalDuration / variations.length);

    // Start session on backend
    useEffect(() => {
        if (phase === 'ACTIVE') {
            fetch(`${API_URL}/api/fitness/session/${session.id}/start`, {
                method: 'POST'
            });
        }
    }, [phase, session.id]);

    // Timer logic
    useEffect(() => {
        if (phase !== 'ACTIVE' || isPaused) return;

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setPhase('COMPLETE');
                    playSound('complete');
                    return 0;
                }

                // Play beep at 5-minute intervals
                if (prev % 300 === 0 && prev !== totalDuration) {
                    playSound('interval');
                }

                // Play warning at 60 seconds
                if (prev === 60) {
                    playSound('warning');
                }

                // Update variation
                const elapsed = totalDuration - prev;
                const newVariation = Math.min(Math.floor(elapsed / variationInterval), variations.length - 1);
                if (newVariation !== currentVariation) {
                    setCurrentVariation(newVariation);
                    playSound('variation');
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, isPaused, currentVariation, totalDuration, variationInterval, variations.length]);

    const playSound = useCallback((type: 'interval' | 'warning' | 'complete' | 'variation') => {
        // Simple beep using Web Audio API
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case 'interval':
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.3;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 200);
                break;
            case 'warning':
                oscillator.frequency.value = 660;
                gainNode.gain.value = 0.5;
                oscillator.start();
                setTimeout(() => { oscillator.frequency.value = 880; }, 100);
                setTimeout(() => oscillator.stop(), 300);
                break;
            case 'complete':
                oscillator.frequency.value = 880;
                gainNode.gain.value = 0.5;
                oscillator.start();
                setTimeout(() => { oscillator.frequency.value = 1100; }, 200);
                setTimeout(() => { oscillator.frequency.value = 1320; }, 400);
                setTimeout(() => oscillator.stop(), 600);
                break;
            case 'variation':
                oscillator.frequency.value = 523;
                gainNode.gain.value = 0.2;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 100);
                break;
        }
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleComplete = () => {
        onComplete({
            totalReps: repCount,
            perceivedExertion
        });
    };

    const sessionColors: Record<SessionType, string> = {
        PUSHUPS: 'from-blood/80 to-blood/40',
        ABS: 'from-gold/80 to-gold/40',
        BICEPS: 'from-emerald-600/80 to-emerald-600/40',
        CARDIO: 'from-purple-600/80 to-purple-600/40'
    };

    const sessionEmojis: Record<SessionType, string> = {
        PUSHUPS: '💪',
        ABS: '🔥',
        BICEPS: '💪',
        CARDIO: '🏃'
    };

    return (
        <div className={`fixed inset-0 z-[100] bg-gradient-to-br ${sessionColors[session.sessionType]} flex flex-col items-center justify-center text-white`}>
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
                <X size={24} />
            </button>

            {/* PRE-SESSION */}
            {phase === 'PRE' && (
                <div className="text-center animate-in fade-in duration-500">
                    <div className="text-6xl mb-4">{sessionEmojis[session.sessionType]}</div>
                    <h1 className="font-display font-black text-5xl uppercase tracking-wider mb-2">
                        {session.sessionType}
                    </h1>
                    <p className="text-xl opacity-70 mb-8">{session.durationMinutes} minutes continuous</p>

                    <div className="mb-8">
                        <p className="text-sm uppercase tracking-widest opacity-50 mb-2">Variations</p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                            {variations.map((v, i) => (
                                <span key={i} className="bg-white/10 px-3 py-1 text-sm rounded-full">
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setPhase('ACTIVE')}
                        className="bg-white text-void px-12 py-4 font-bold text-xl uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                        <Play className="inline mr-2" size={24} /> START
                    </button>
                </div>
            )}

            {/* ACTIVE SESSION */}
            {phase === 'ACTIVE' && (
                <div className="text-center w-full max-w-lg px-4">
                    {/* Timer */}
                    <div className="mb-8">
                        <div className="text-[120px] font-mono font-black leading-none tracking-tight">
                            {formatTime(secondsLeft)}
                        </div>
                        <div className="text-sm uppercase tracking-widest opacity-50 mt-2">
                            {Math.round((1 - secondsLeft / totalDuration) * 100)}% complete
                        </div>
                    </div>

                    {/* Current Variation */}
                    <div className="bg-white/10 py-4 px-6 mb-8 rounded-lg">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Current Variation</p>
                        <p className="text-2xl font-bold">{variations[currentVariation]}</p>
                    </div>

                    {/* Rep Counter */}
                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Rep Counter</p>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setRepCount(Math.max(0, repCount - 10))}
                                className="bg-white/10 p-3 rounded-full hover:bg-white/20"
                            >
                                <Minus size={24} />
                            </button>
                            <button
                                onClick={() => setRepCount(repCount + 1)}
                                className="bg-white text-void px-8 py-4 text-4xl font-black rounded-lg hover:scale-105 transition-transform"
                            >
                                {repCount}
                            </button>
                            <button
                                onClick={() => setRepCount(repCount + 10)}
                                className="bg-white/10 p-3 rounded-full hover:bg-white/20"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                        <p className="text-xs opacity-50 mt-2">Tap number to +1, buttons for ±10</p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="bg-white/10 p-4 rounded-full hover:bg-white/20"
                        >
                            {isPaused ? <Play size={32} /> : <Pause size={32} />}
                        </button>
                        <button
                            onClick={() => {
                                setSecondsLeft(totalDuration);
                                setRepCount(0);
                                setCurrentVariation(0);
                            }}
                            className="bg-white/10 p-4 rounded-full hover:bg-white/20"
                        >
                            <RotateCcw size={32} />
                        </button>
                    </div>
                </div>
            )}

            {/* COMPLETION */}
            {phase === 'COMPLETE' && (
                <div className="text-center animate-in fade-in duration-500 w-full max-w-md px-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="font-display font-black text-4xl uppercase tracking-wider mb-2">
                        SESSION COMPLETE
                    </h1>
                    <p className="text-xl opacity-70 mb-8">{repCount} reps in {session.durationMinutes} minutes</p>

                    {/* RPE Scale */}
                    <div className="mb-8">
                        <p className="text-sm uppercase tracking-widest opacity-50 mb-4">
                            Perceived Exertion (1-10)
                        </p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPerceivedExertion(n)}
                                    className={`w-10 h-10 rounded-full font-bold ${n === perceivedExertion
                                        ? 'bg-white text-void'
                                        : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs opacity-50 mt-2">
                            {perceivedExertion <= 3 ? 'Easy' :
                                perceivedExertion <= 5 ? 'Moderate' :
                                    perceivedExertion <= 7 ? 'Hard' :
                                        perceivedExertion <= 9 ? 'Very Hard' : 'Maximum'}
                        </p>
                    </div>

                    <button
                        onClick={handleComplete}
                        className="bg-white text-void px-12 py-4 font-bold text-xl uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                        <Check className="inline mr-2" size={24} /> LOG SESSION
                    </button>
                </div>
            )}

            <audio ref={audioRef} />
        </div>
    );
};

export default FitnessPomodoro;
