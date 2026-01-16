import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { QUOTES } from '../../components/ScrollingQuotes';
import { useUserStore } from '../../store/useUserStore';

interface DeepWorkPomodoroProps {
    onClose: () => void;
}

export const DeepWorkPomodoro = ({ onClose }: DeepWorkPomodoroProps) => {
    const { incrementMetric } = useUserStore();
    const [phase, setPhase] = useState<'READY' | 'WORK' | 'BREAK' | 'COMPLETE'>('READY');
    const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 minutes
    const [isPaused, setIsPaused] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [currentQuote, setCurrentQuote] = useState(() =>
        QUOTES[Math.floor(Math.random() * QUOTES.length)]
    );

    const workDuration = 25 * 60;
    const shortBreak = 5 * 60;
    const longBreak = 15 * 60;

    // Timer logic
    useEffect(() => {
        if (phase !== 'WORK' && phase !== 'BREAK') return;
        if (isPaused) return;

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handlePhaseComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, isPaused]);

    // Rotate quotes every 45 seconds during work
    useEffect(() => {
        if (phase !== 'WORK' || isPaused) return;

        const quoteInterval = setInterval(() => {
            setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        }, 45000);

        return () => clearInterval(quoteInterval);
    }, [phase, isPaused]);

    const handlePhaseComplete = () => {
        playSound('complete');

        if (phase === 'WORK') {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);
            incrementMetric('production', 'pomodoros');

            if (newSessions % 4 === 0) {
                // Long break after 4 sessions
                setPhase('BREAK');
                setSecondsLeft(longBreak);
            } else {
                // Short break
                setPhase('BREAK');
                setSecondsLeft(shortBreak);
            }
        } else if (phase === 'BREAK') {
            setPhase('READY');
            setSecondsLeft(workDuration);
        }
    };

    const playSound = useCallback((type: 'start' | 'complete' | 'tick') => {
        if (!soundEnabled) return;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'complete') {
            oscillator.frequency.setValueAtTime(880, ctx.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } else if (type === 'start') {
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
        }
    }, [soundEnabled]);

    const startWork = () => {
        playSound('start');
        setPhase('WORK');
        setSecondsLeft(workDuration);
        setIsPaused(false);
    };

    const skipBreak = () => {
        setPhase('READY');
        setSecondsLeft(workDuration);
    };

    const resetAll = () => {
        setPhase('READY');
        setSecondsLeft(workDuration);
        setIsPaused(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = phase === 'WORK'
        ? ((workDuration - secondsLeft) / workDuration) * 100
        : phase === 'BREAK'
            ? ((shortBreak - secondsLeft) / shortBreak) * 100
            : 0;

    return (
        <div className="fixed inset-0 z-[100] bg-void flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-steel/20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 bg-steel/10 hover:bg-blood/20 text-concrete hover:text-blood rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div>
                        <h1 className="font-display font-bold text-gold uppercase tracking-wider">Deep Work Protocol</h1>
                        <p className="text-xs text-concrete/50 font-mono">Sessions: {sessionsCompleted} | {phase === 'BREAK' ? 'RECOVERY' : phase}</p>
                    </div>
                </div>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 bg-steel/10 hover:bg-steel/20 text-concrete rounded-full"
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Timer Display */}
                <div className="text-center mb-8">
                    <div className={`text-[150px] font-mono font-black leading-none tracking-tight ${phase === 'WORK' ? 'text-gold' : phase === 'BREAK' ? 'text-emerald-500' : 'text-concrete'
                        }`}>
                        {formatTime(secondsLeft)}
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-concrete/50 mt-2">
                        {phase === 'WORK' ? '🔥 DEEP WORK MODE' : phase === 'BREAK' ? '🧘 RECOVERY PROTOCOL' : '⚡ READY TO WORK'}
                    </div>
                </div>

                {/* Progress Bar */}
                {(phase === 'WORK' || phase === 'BREAK') && (
                    <div className="w-full max-w-md h-2 bg-steel/20 rounded-full mb-8 overflow-hidden">
                        <div
                            className={`h-full ${phase === 'WORK' ? 'bg-gold' : 'bg-emerald-500'} transition-all duration-1000`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Motivational Quote */}
                {phase === 'WORK' && (
                    <div className="w-full max-w-2xl bg-gold/5 border border-gold/20 py-6 px-8 mb-8 rounded-lg animate-in fade-in duration-500">
                        <p className="text-xl text-gold text-center font-bold leading-relaxed">
                            {currentQuote}
                        </p>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4">
                    {phase === 'READY' && (
                        <button
                            onClick={startWork}
                            className="bg-gold text-void px-12 py-4 font-bold text-xl uppercase tracking-wider rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                        >
                            <Play size={24} /> START DEEP WORK
                        </button>
                    )}

                    {phase === 'WORK' && (
                        <>
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`p-4 rounded-full ${isPaused ? 'bg-gold text-void' : 'bg-steel/20 text-concrete hover:bg-steel/30'}`}
                            >
                                {isPaused ? <Play size={32} /> : <Pause size={32} />}
                            </button>
                            <button
                                onClick={resetAll}
                                className="p-4 rounded-full bg-steel/10 text-concrete/50 hover:text-blood hover:bg-blood/10"
                            >
                                <RotateCcw size={24} />
                            </button>
                        </>
                    )}

                    {phase === 'BREAK' && (
                        <>
                            <button
                                onClick={skipBreak}
                                className="bg-steel/20 text-concrete px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-steel/30"
                            >
                                Skip Break
                            </button>
                            <button
                                onClick={startWork}
                                className="bg-gold text-void px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-white"
                            >
                                Start Next Session
                            </button>
                        </>
                    )}
                </div>

                {/* Session Indicators */}
                <div className="flex gap-2 mt-8">
                    {[1, 2, 3, 4].map((n) => (
                        <div
                            key={n}
                            className={`w-4 h-4 rounded-full ${n <= (sessionsCompleted % 4 || (sessionsCompleted > 0 ? 4 : 0))
                                ? 'bg-gold'
                                : 'bg-steel/20'
                                }`}
                        />
                    ))}
                    <span className="text-xs text-concrete/50 ml-2">
                        {4 - (sessionsCompleted % 4 || 4)} until long break
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-steel/20 text-center">
                <p className="text-xs text-concrete/30 font-mono">
                    🏰 THE FORTRESS • Deep Work is the Only Way
                </p>
            </div>
        </div>
    );
};

export default DeepWorkPomodoro;
