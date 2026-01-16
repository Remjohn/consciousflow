import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, Check, ChevronRight } from 'lucide-react';
import { API_URL } from '../../lib/api';

type SessionMode = 'GUIDED' | 'FREE' | 'QUICK';
type ExerciseType = 'DEEP_BREATHING' | 'BIRD_DOGS' | 'DEAD_BUGS' | 'GLUTE_BRIDGE' | 'CHILD_POSE' | 'KEGEL_HOLDS' | 'KEGEL_FLUTTER';

interface Exercise {
    id: ExerciseType;
    name: string;
    instruction: string;
    icon: string;
    defaultDuration: number;
    repBased: boolean;
}

const EXERCISES: Exercise[] = [
    {
        id: 'DEEP_BREATHING',
        name: 'DEEP CORE BREATHING',
        instruction: 'Inhale deeply, expand belly. Exhale, gently lift pelvic floor. Hold 3 sec.',
        icon: '🧘',
        defaultDuration: 150,
        repBased: true
    },
    {
        id: 'BIRD_DOGS',
        name: 'BIRD DOGS',
        instruction: 'From all fours, extend opposite arm and leg. Core engaged. Alternate sides.',
        icon: '🐕',
        defaultDuration: 150,
        repBased: true
    },
    {
        id: 'DEAD_BUGS',
        name: 'DEAD BUGS',
        instruction: 'Lie on back, arms up, knees 90°. Lower opposite arm/leg. Keep back flat.',
        icon: '🪲',
        defaultDuration: 150,
        repBased: true
    },
    {
        id: 'GLUTE_BRIDGE',
        name: 'GLUTE BRIDGE',
        instruction: 'Lie on back, knees bent. Lift hips, squeeze glutes + pelvic floor. Hold 3 sec.',
        icon: '🌉',
        defaultDuration: 150,
        repBased: true
    },
    {
        id: 'CHILD_POSE',
        name: "CHILD'S POSE",
        instruction: 'Kneel, sit back on heels, stretch arms forward. Breathe deeply. Relax pelvic floor.',
        icon: '🙇',
        defaultDuration: 60,
        repBased: false
    }
];

interface KegelsSession {
    id?: number;
    deepBreathingReps: number;
    birdDogReps: number;
    deadBugReps: number;
    gluteBridgeReps: number;
    childPoseSeconds: number;
    quickContractions: number;
    holdContractions: number;
}

interface KegelsProps {
    onClose: () => void;
    onComplete: () => void;
}

export const KegelsPomodoro = ({ onClose, onComplete }: KegelsProps) => {
    const [phase, setPhase] = useState<'SELECT' | 'ACTIVE' | 'COMPLETE'>('SELECT');
    const [mode, setMode] = useState<SessionMode>('GUIDED');
    const [secondsLeft, setSecondsLeft] = useState(600);
    const [isPaused, setIsPaused] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [perceivedExertion, setPerceivedExertion] = useState(6);

    const [reps, setReps] = useState<KegelsSession>({
        deepBreathingReps: 0,
        birdDogReps: 0,
        deadBugReps: 0,
        gluteBridgeReps: 0,
        childPoseSeconds: 0,
        quickContractions: 0,
        holdContractions: 0
    });

    const totalDuration = mode === 'QUICK' ? 300 : 600;
    const currentExercise = EXERCISES[currentExerciseIndex];

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

                if (mode === 'GUIDED') {
                    const elapsed = totalDuration - prev;
                    const exerciseDuration = totalDuration / EXERCISES.length;
                    const newIndex = Math.min(Math.floor(elapsed / exerciseDuration), EXERCISES.length - 1);
                    if (newIndex !== currentExerciseIndex) {
                        setCurrentExerciseIndex(newIndex);
                        playSound('transition');
                    }
                }

                if (currentExercise?.id === 'CHILD_POSE' && prev % 1 === 0) {
                    setReps(r => ({ ...r, childPoseSeconds: r.childPoseSeconds + 1 }));
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, isPaused, mode, currentExerciseIndex, totalDuration, currentExercise]);

    const playSound = useCallback((type: 'transition' | 'complete' | 'click') => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case 'transition':
                oscillator.frequency.value = 523;
                gainNode.gain.value = 0.2;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 150);
                break;
            case 'complete':
                oscillator.frequency.value = 880;
                gainNode.gain.value = 0.4;
                oscillator.start();
                setTimeout(() => { oscillator.frequency.value = 1100; }, 200);
                setTimeout(() => { oscillator.frequency.value = 1320; }, 400);
                setTimeout(() => oscillator.stop(), 600);
                break;
            case 'click':
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.1;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 50);
                break;
        }
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = (selectedMode: SessionMode) => {
        setMode(selectedMode);
        setSecondsLeft(selectedMode === 'QUICK' ? 300 : 600);
        setPhase('ACTIVE');
    };

    const handleAddRep = (exerciseId: ExerciseType) => {
        playSound('click');
        setReps(r => {
            switch (exerciseId) {
                case 'DEEP_BREATHING': return { ...r, deepBreathingReps: r.deepBreathingReps + 1 };
                case 'BIRD_DOGS': return { ...r, birdDogReps: r.birdDogReps + 1 };
                case 'DEAD_BUGS': return { ...r, deadBugReps: r.deadBugReps + 1 };
                case 'GLUTE_BRIDGE': return { ...r, gluteBridgeReps: r.gluteBridgeReps + 1 };
                case 'KEGEL_FLUTTER': return { ...r, quickContractions: r.quickContractions + 1 };
                case 'KEGEL_HOLDS': return { ...r, holdContractions: r.holdContractions + 1 };
                default: return r;
            }
        });
    };

    const handleComplete = async () => {
        try {
            await fetch(`${API_URL}/api/kegels/session/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...reps,
                    sessionType: mode,
                    durationMinutes: Math.floor(totalDuration / 60),
                    perceivedExertion
                })
            });
        } catch (err) {
            console.error(err);
        }
        onComplete();
    };

    const totalReps = reps.deepBreathingReps + reps.birdDogReps + reps.deadBugReps + reps.gluteBridgeReps;
    const progressPercent = Math.round((1 - secondsLeft / totalDuration) * 100);

    return (
        <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-steel/20 hover:bg-steel/40 text-concrete"
            >
                <X size={24} />
            </button>

            {/* MODE SELECT */}
            {phase === 'SELECT' && (
                <div className="text-center animate-in fade-in duration-500 max-w-md px-4">
                    <div className="text-6xl mb-4">🏋️</div>
                    <h1 className="font-display font-black text-4xl uppercase tracking-wider mb-2 text-gold">
                        KEGELS PROTOCOL
                    </h1>
                    <p className="text-lg text-concrete/70 mb-8 font-mono uppercase tracking-widest text-sm">Pelvic Floor Command</p>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleStart('GUIDED')}
                            className="w-full bg-gold/20 hover:bg-gold/30 border border-gold/40 p-4 text-left"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-display font-bold text-lg text-gold uppercase tracking-wider">Guided Mission</div>
                                    <div className="text-sm text-concrete/60 font-mono">10 min • All 5 exercises • Recommended</div>
                                </div>
                                <ChevronRight size={20} className="text-gold" />
                            </div>
                        </button>

                        <button
                            onClick={() => handleStart('FREE')}
                            className="w-full bg-steel/10 hover:bg-steel/20 border border-steel/30 p-4 text-left"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-display font-bold text-concrete uppercase tracking-wider">Free Ops</div>
                                    <div className="text-sm text-concrete/50 font-mono">10 min • Choose exercises</div>
                                </div>
                                <ChevronRight size={20} className="text-concrete/50" />
                            </div>
                        </button>

                        <button
                            onClick={() => handleStart('QUICK')}
                            className="w-full bg-steel/10 hover:bg-steel/20 border border-steel/30 p-4 text-left"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-display font-bold text-concrete uppercase tracking-wider">Quick Strike</div>
                                    <div className="text-sm text-concrete/50 font-mono">5 min • Rapid execution</div>
                                </div>
                                <ChevronRight size={20} className="text-concrete/50" />
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 text-[10px] font-mono text-concrete/40 uppercase tracking-widest">
                        5 Movements: Breathing • Bird Dogs • Dead Bugs • Glute Bridge • Child Pose
                    </div>
                </div>
            )}

            {/* ACTIVE SESSION */}
            {phase === 'ACTIVE' && (
                <div className="text-center w-full max-w-lg px-4">
                    {/* Timer */}
                    <div className="mb-6">
                        <div className="text-[100px] font-mono font-black leading-none tracking-tight text-gold">
                            {formatTime(secondsLeft)}
                        </div>
                        <div className="w-full h-2 bg-steel/30 mt-4">
                            <div
                                className="h-full bg-gradient-to-r from-gold to-gold/60 transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="text-sm text-concrete/50 font-mono mt-2 uppercase tracking-wider">{progressPercent}% Complete</div>
                    </div>

                    {/* Current Exercise */}
                    <div className="border border-gold/40 bg-gold/10 py-5 px-6 mb-6">
                        <div className="text-4xl mb-2">{currentExercise.icon}</div>
                        <p className="text-2xl font-display font-black text-gold uppercase tracking-wider mb-2">{currentExercise.name}</p>
                        <p className="text-sm text-concrete/70 font-mono">{currentExercise.instruction}</p>
                    </div>

                    {/* Rep Counter */}
                    {currentExercise.repBased && (
                        <div className="mb-6">
                            <p className="text-[10px] uppercase tracking-widest text-concrete/50 font-mono mb-2">Tap to Log Rep</p>
                            <button
                                onClick={() => handleAddRep(currentExercise.id)}
                                className="bg-gold text-void px-12 py-6 text-5xl font-black hover:scale-105 transition-transform active:scale-95"
                            >
                                {currentExercise.id === 'DEEP_BREATHING' ? reps.deepBreathingReps :
                                    currentExercise.id === 'BIRD_DOGS' ? reps.birdDogReps :
                                        currentExercise.id === 'DEAD_BUGS' ? reps.deadBugReps :
                                            currentExercise.id === 'GLUTE_BRIDGE' ? reps.gluteBridgeReps : 0}
                            </button>
                        </div>
                    )}

                    {/* Exercise Dots */}
                    {mode === 'GUIDED' && (
                        <div className="flex justify-center gap-2 mb-6">
                            {EXERCISES.map((ex, i) => (
                                <div
                                    key={ex.id}
                                    className={`w-10 h-10 flex items-center justify-center transition-all border ${i === currentExerciseIndex
                                            ? 'bg-gold text-void border-gold scale-110'
                                            : i < currentExerciseIndex
                                                ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-500'
                                                : 'bg-steel/10 border-steel/30 text-concrete/50'
                                        }`}
                                >
                                    {ex.icon}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="bg-steel/20 border border-steel/40 p-4 hover:bg-steel/30 text-concrete"
                        >
                            {isPaused ? <Play size={28} /> : <Pause size={28} />}
                        </button>
                        <button
                            onClick={() => setPhase('COMPLETE')}
                            className="bg-emerald-500/20 border border-emerald-500/40 px-6 py-4 hover:bg-emerald-500/30 flex items-center gap-2 text-emerald-500 font-bold uppercase"
                        >
                            <Check size={24} /> Finish
                        </button>
                    </div>
                </div>
            )}

            {/* COMPLETION */}
            {phase === 'COMPLETE' && (
                <div className="text-center animate-in fade-in duration-500 w-full max-w-md px-4">
                    <div className="text-6xl mb-4">⚔️</div>
                    <h1 className="font-display font-black text-3xl uppercase tracking-wider mb-2 text-gold">
                        MISSION COMPLETE
                    </h1>
                    <p className="text-lg text-concrete/70 font-mono mb-6">{totalReps} REPS LOGGED</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="border border-steel/30 bg-steel/10 p-3">
                            <div className="text-2xl font-black text-gold">{reps.deepBreathingReps}</div>
                            <div className="text-[9px] font-mono uppercase text-concrete/50">Breathing</div>
                        </div>
                        <div className="border border-steel/30 bg-steel/10 p-3">
                            <div className="text-2xl font-black text-gold">{reps.birdDogReps}</div>
                            <div className="text-[9px] font-mono uppercase text-concrete/50">Bird Dogs</div>
                        </div>
                        <div className="border border-steel/30 bg-steel/10 p-3">
                            <div className="text-2xl font-black text-gold">{reps.deadBugReps}</div>
                            <div className="text-[9px] font-mono uppercase text-concrete/50">Dead Bugs</div>
                        </div>
                        <div className="border border-steel/30 bg-steel/10 p-3">
                            <div className="text-2xl font-black text-gold">{reps.gluteBridgeReps}</div>
                            <div className="text-[9px] font-mono uppercase text-concrete/50">Glute Bridges</div>
                        </div>
                    </div>

                    {/* RPE */}
                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-widest text-concrete/50 font-mono mb-3">Perceived Exertion</p>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPerceivedExertion(n)}
                                    className={`w-8 h-8 font-bold text-sm border ${n === perceivedExertion
                                            ? 'bg-gold text-void border-gold'
                                            : 'bg-steel/10 border-steel/30 text-concrete/50 hover:bg-steel/20'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleComplete}
                        className="bg-gold text-void px-10 py-4 font-display font-black text-lg uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                        <Check className="inline mr-2" size={20} /> LOG SESSION
                    </button>
                </div>
            )}
        </div>
    );
};

export default KegelsPomodoro;
