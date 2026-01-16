import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Check, AlertTriangle, Zap, Target, Focus, Repeat, Star } from 'lucide-react';
import { QUOTES } from '../../components/ScrollingQuotes';
import { useUserStore } from '../../store/useUserStore';
import { API_URL } from '../../lib/api';
import { useTimer } from '../../hooks/useTimer';

interface DeepWorkPomodoroProps {
    onClose: () => void;
}

type Phase = 'TASK_INPUT' | 'ACTIVE' | 'RATING' | 'COMPLETE';
type ScoreValue = 1 | 0 | -2;

interface PillarRating {
    speed: ScoreValue | null;
    focus: ScoreValue | null;
    flow: ScoreValue | null;
    priority: ScoreValue | null;
    context: ScoreValue | null;
}

const PILLARS = [
    { key: 'speed', icon: Zap, label: 'Maximum Speed', question: 'Did you work at peak velocity?' },
    { key: 'focus', icon: Focus, label: 'Zero Distraction', question: 'Were you 100% focused?' },
    { key: 'flow', icon: Repeat, label: 'Zero Pause', question: 'Did you work continuously?' },
    { key: 'priority', icon: Target, label: 'First Priority', question: 'Was this your #1 task?' },
    { key: 'context', icon: Star, label: 'Minimal Switching', question: 'Did you stay on one thing?' },
] as const;

const SCORE_OPTIONS = [
    { value: 1 as ScoreValue, label: 'EXCELLENT', emoji: '⭐', color: 'bg-gold text-void', points: '+1' },
    { value: 0 as ScoreValue, label: 'AVERAGE', emoji: '◐', color: 'bg-steel/30 text-concrete', points: '0' },
    { value: -2 as ScoreValue, label: 'POOR', emoji: '⚠', color: 'bg-blood/50 text-white', points: '-2' },
];

const WORK_DURATION_MS = 25 * 60 * 1000; // 25 minutes

export const DeepWorkPomodoro = ({ onClose }: DeepWorkPomodoroProps) => {
    const { incrementMetric } = useUserStore();

    // Phase management
    const [phase, setPhase] = useState<Phase>('TASK_INPUT');

    // Task input phase
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCategory, setTaskCategory] = useState('');
    const [isFirstPriority, setIsFirstPriority] = useState(true);

    // Active session phase
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [pauseCount, setPauseCount] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [currentQuote, setCurrentQuote] = useState(() =>
        QUOTES[Math.floor(Math.random() * QUOTES.length)]
    );

    // Rating phase
    const [pillarRatings, setPillarRatings] = useState<PillarRating>({
        speed: null, focus: null, flow: null, priority: null, context: null
    });
    const [accomplishmentNotes, setAccomplishmentNotes] = useState('');

    // Complete phase
    const [finalScore, setFinalScore] = useState(0);

    // Use the PWA-compatible timer hook
    const timer = useTimer({
        durationMs: WORK_DURATION_MS,
        onComplete: () => {
            setPhase('RATING');
        },
        notificationTitle: '🏆 Deep Work Complete!',
        notificationBody: `${taskDescription.slice(0, 50)}... - Time to rate your session!`
    });

    // Rotate quotes every 45 seconds during active phase
    useEffect(() => {
        if (phase !== 'ACTIVE' || timer.isPaused) return;

        const quoteInterval = setInterval(() => {
            setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        }, 45000);

        return () => clearInterval(quoteInterval);
    }, [phase, timer.isPaused]);

    const playSound = useCallback((type: 'start' | 'complete' | 'pause') => {
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

    const startSession = async () => {
        if (!taskDescription.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/deepwork/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskDescription,
                    taskCategory: taskCategory || null,
                    isFirstPriority
                })
            });
            const data = await res.json();

            if (data.session) {
                setSessionId(data.session.id);
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        }

        // Start timer and transition to active phase
        playSound('start');
        timer.start();
        setPhase('ACTIVE');
    };

    const handlePause = async () => {
        if (timer.isPaused) {
            // Resuming
            timer.resume();
        } else {
            // Pausing
            setPauseCount(prev => prev + 1);
            timer.pause();

            // Record pause on backend
            if (sessionId) {
                fetch(`${API_URL}/api/deepwork/session/${sessionId}/pause`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pauseDuration: 0 }) // Duration tracked by hook
                }).catch(console.error);
            }
        }
    };

    const ratePillar = (pillar: keyof PillarRating, value: ScoreValue) => {
        setPillarRatings(prev => ({ ...prev, [pillar]: value }));
    };

    const calculateTotalScore = () => {
        const scores = Object.values(pillarRatings).filter(v => v !== null) as number[];
        return scores.reduce((sum, v) => sum + v, 0);
    };

    const allPillarsRated = () => {
        return Object.values(pillarRatings).every(v => v !== null);
    };

    const submitRating = async () => {
        if (!allPillarsRated()) return;

        const total = calculateTotalScore();
        setFinalScore(total);

        // Submit to backend
        if (sessionId) {
            try {
                await fetch(`${API_URL}/api/deepwork/session/${sessionId}/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accomplishmentNotes,
                        scoreSpeed: pillarRatings.speed,
                        scoreFocus: pillarRatings.focus,
                        scoreFlow: pillarRatings.flow,
                        scorePriority: pillarRatings.priority,
                        scoreContext: pillarRatings.context,
                        durationMinutes: 25
                    })
                });
            } catch (error) {
                console.error('Failed to submit rating:', error);
            }
        }

        incrementMetric('production', 'pomodoros');
        setPhase('COMPLETE');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreBadge = (score: number) => {
        if (score === 5) return { emoji: '🏆', label: 'PERFECT', color: 'text-gold' };
        if (score >= 3) return { emoji: '⭐', label: 'EXCELLENT', color: 'text-emerald-500' };
        if (score >= 1) return { emoji: '✓', label: 'GOOD', color: 'text-blue-400' };
        if (score === 0) return { emoji: '◐', label: 'NEUTRAL', color: 'text-concrete' };
        if (score >= -3) return { emoji: '⚠', label: 'WEAK', color: 'text-orange-500' };
        return { emoji: '💀', label: 'FAILED', color: 'text-blood' };
    };

    return (
        <div className="fixed inset-0 z-[100] bg-void flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-steel/20 sticky top-0 bg-void z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 bg-steel/10 hover:bg-blood/20 text-concrete hover:text-blood rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div>
                        <h1 className="font-display font-bold text-gold uppercase tracking-wider">Deep Work Protocol</h1>
                        <p className="text-xs text-concrete/50 font-mono">
                            {phase === 'TASK_INPUT' && '⚡ MISSION BRIEF'}
                            {phase === 'ACTIVE' && `🔥 IN COMBAT ${pauseCount > 0 ? `(${pauseCount} pauses)` : ''}`}
                            {phase === 'RATING' && '📊 DEBRIEF'}
                            {phase === 'COMPLETE' && '🏆 MISSION COMPLETE'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 bg-steel/10 hover:bg-steel/20 text-concrete rounded-full"
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            {/* PHASE 1: TASK INPUT */}
            {phase === 'TASK_INPUT' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-lg">
                        <h2 className="text-2xl font-display font-bold text-gold text-center mb-8">
                            WHAT IS YOUR MISSION?
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-concrete/50 mb-2">
                                    Task Description *
                                </label>
                                <textarea
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder="What EXACTLY will you accomplish in the next 25 minutes?"
                                    className="w-full bg-steel/10 border border-steel/30 rounded-lg p-4 text-concrete placeholder-concrete/30 focus:border-gold focus:outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-concrete/50 mb-2">
                                    Category (optional)
                                </label>
                                <select
                                    value={taskCategory}
                                    onChange={(e) => setTaskCategory(e.target.value)}
                                    className="w-full bg-steel/10 border border-steel/30 rounded-lg p-3 text-concrete focus:border-gold focus:outline-none"
                                >
                                    <option value="">Select category...</option>
                                    <option value="video_editing">Video Editing</option>
                                    <option value="coding">Coding</option>
                                    <option value="writing">Writing</option>
                                    <option value="design">Design</option>
                                    <option value="research">Research</option>
                                    <option value="admin">Admin</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gold/10 border border-gold/30 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="priority"
                                    checked={isFirstPriority}
                                    onChange={(e) => setIsFirstPriority(e.target.checked)}
                                    className="w-5 h-5 accent-gold"
                                />
                                <label htmlFor="priority" className="text-gold font-bold cursor-pointer">
                                    This is my #1 PRIORITY right now
                                </label>
                            </div>

                            <button
                                onClick={startSession}
                                disabled={!taskDescription.trim()}
                                className={`w-full py-4 rounded-lg font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${taskDescription.trim()
                                    ? 'bg-gold text-void hover:bg-white'
                                    : 'bg-steel/20 text-concrete/30 cursor-not-allowed'
                                    }`}
                            >
                                <Play size={24} /> START DEEP WORK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 2: ACTIVE SESSION */}
            {phase === 'ACTIVE' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {/* Timer */}
                    <div className="text-center mb-6">
                        <div className={`text-[120px] font-mono font-black leading-none tracking-tight ${timer.isPaused ? 'text-orange-500 animate-pulse' : 'text-gold'
                            }`}>
                            {formatTime(timer.remainingSeconds)}
                        </div>
                        <div className="text-xs uppercase tracking-[0.3em] text-concrete/50 mt-2">
                            {timer.isPaused ? '⏸️ PAUSED' : '🔥 DEEP WORK MODE'}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md h-2 bg-steel/20 rounded-full mb-6 overflow-hidden">
                        <div
                            className="h-full bg-gold transition-all duration-1000"
                            style={{ width: `${timer.progress}%` }}
                        />
                    </div>

                    {/* Task Display */}
                    <div className="bg-steel/10 border border-steel/30 py-3 px-6 rounded-lg mb-6 max-w-md text-center">
                        <p className="text-xs uppercase tracking-widest text-concrete/50 mb-1">Current Task</p>
                        <p className="text-concrete font-bold">{taskDescription}</p>
                    </div>

                    {/* Motivational Quote */}
                    <div className="w-full max-w-lg bg-gold/5 border border-gold/20 py-4 px-6 mb-8 rounded-lg">
                        <p className="text-lg text-gold text-center font-bold leading-relaxed">
                            {currentQuote}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4">
                        <button
                            onClick={handlePause}
                            className={`p-4 rounded-full ${timer.isPaused ? 'bg-gold text-void' : 'bg-steel/20 text-concrete hover:bg-steel/30'}`}
                        >
                            {timer.isPaused ? <Play size={32} /> : <Pause size={32} />}
                        </button>
                    </div>

                    {/* Pause Warning */}
                    {pauseCount > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-orange-500 text-sm">
                            <AlertTriangle size={16} />
                            <span>{pauseCount} pause{pauseCount > 1 ? 's' : ''} recorded - affects FLOW score</span>
                        </div>
                    )}

                    {/* Background Mode Hint */}
                    <div className="mt-6 text-xs text-concrete/30 text-center max-w-sm">
                        💡 You can switch to other apps. Timer continues in background and will notify you when complete.
                    </div>
                </div>
            )}

            {/* PHASE 3: RATING */}
            {phase === 'RATING' && (
                <div className="flex-1 p-8">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-display font-bold text-gold text-center mb-2">
                            SESSION DEBRIEF
                        </h2>
                        <p className="text-concrete/50 text-center mb-8">
                            Rate your performance honestly. This is how you become a Deep Work King.
                        </p>

                        {/* Accomplishment Notes */}
                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest text-concrete/50 mb-2">
                                What did you ACCOMPLISH?
                            </label>
                            <textarea
                                value={accomplishmentNotes}
                                onChange={(e) => setAccomplishmentNotes(e.target.value)}
                                placeholder="Be specific about what got done..."
                                className="w-full bg-steel/10 border border-steel/30 rounded-lg p-4 text-concrete placeholder-concrete/30 focus:border-gold focus:outline-none resize-none"
                                rows={3}
                            />
                        </div>

                        {/* 5-Pillar Rating */}
                        <div className="space-y-4 mb-8">
                            {PILLARS.map(pillar => (
                                <div key={pillar.key} className="bg-steel/5 border border-steel/20 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <pillar.icon size={20} className="text-gold" />
                                        <div>
                                            <p className="font-bold text-concrete">{pillar.label}</p>
                                            <p className="text-xs text-concrete/50">{pillar.question}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {SCORE_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => ratePillar(pillar.key as keyof PillarRating, option.value)}
                                                className={`flex-1 py-3 rounded-lg font-bold text-sm uppercase transition-all ${pillarRatings[pillar.key as keyof PillarRating] === option.value
                                                    ? option.color + ' ring-2 ring-white/50'
                                                    : 'bg-steel/10 text-concrete/50 hover:bg-steel/20'
                                                    }`}
                                            >
                                                {option.emoji} {option.label}
                                                <span className="block text-xs opacity-70">{option.points}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Live Score Preview */}
                        <div className="bg-steel/10 border border-steel/30 rounded-lg p-4 mb-6 text-center">
                            <p className="text-xs uppercase tracking-widest text-concrete/50 mb-2">Current Score</p>
                            <p className={`text-4xl font-mono font-black ${calculateTotalScore() >= 3 ? 'text-gold' :
                                calculateTotalScore() >= 0 ? 'text-concrete' : 'text-blood'
                                }`}>
                                {calculateTotalScore() > 0 ? '+' : ''}{calculateTotalScore()}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={submitRating}
                            disabled={!allPillarsRated()}
                            className={`w-full py-4 rounded-lg font-bold text-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${allPillarsRated()
                                ? 'bg-gold text-void hover:bg-white'
                                : 'bg-steel/20 text-concrete/30 cursor-not-allowed'
                                }`}
                        >
                            <Check size={24} /> SUBMIT DEBRIEF
                        </button>
                    </div>
                </div>
            )}

            {/* PHASE 4: COMPLETE */}
            {phase === 'COMPLETE' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-center">
                        <div className="text-8xl mb-4">{getScoreBadge(finalScore).emoji}</div>
                        <h2 className={`text-4xl font-display font-bold mb-2 ${getScoreBadge(finalScore).color}`}>
                            {getScoreBadge(finalScore).label}
                        </h2>
                        <p className={`text-6xl font-mono font-black mb-8 ${getScoreBadge(finalScore).color}`}>
                            {finalScore > 0 ? '+' : ''}{finalScore} pts
                        </p>

                        {/* Score Breakdown */}
                        <div className="flex justify-center gap-4 mb-8">
                            {PILLARS.map(pillar => {
                                const score = pillarRatings[pillar.key as keyof PillarRating];
                                return (
                                    <div key={pillar.key} className={`px-3 py-2 rounded-lg ${score === 1 ? 'bg-gold/20 text-gold' :
                                        score === 0 ? 'bg-steel/20 text-concrete' :
                                            'bg-blood/20 text-blood'
                                        }`}>
                                        <pillar.icon size={16} className="mx-auto mb-1" />
                                        <p className="text-xs font-bold">{score === 1 ? '+1' : score === 0 ? '0' : '-2'}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={onClose}
                            className="bg-gold text-void px-12 py-4 font-bold text-xl uppercase tracking-wider rounded-lg hover:bg-white transition-colors"
                        >
                            BACK TO FORTRESS
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeepWorkPomodoro;
