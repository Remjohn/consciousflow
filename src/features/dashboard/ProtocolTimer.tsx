import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Play, Pause, RefreshCw, Timer, Maximize2 } from 'lucide-react';
import { DeepWorkSession } from './DeepWorkSession';
import { useTimer } from '../../hooks/useTimer';

const DEEP_WORK_DURATION_MS = 90 * 60 * 1000; // 90 minutes
const MANAGEMENT_DURATION_MS = 60 * 60 * 1000; // 60 minutes
const BREAK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export type ProtocolSessionMode = 'DEEP_WORK' | 'MANAGEMENT';

export const ProtocolTimer = () => {
    const { getCurrentScheduleMode, incrementMetric } = useUserStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isBreak, setIsBreak] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [sessionMode, setSessionMode] = useState<ProtocolSessionMode>('DEEP_WORK');

    const schedule = getCurrentScheduleMode();
    const WORK_DURATION_MS = sessionMode === 'DEEP_WORK' ? DEEP_WORK_DURATION_MS : MANAGEMENT_DURATION_MS;

    // Update current time display
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Work timer
    const workTimer = useTimer({
        durationMs: WORK_DURATION_MS,
        onComplete: () => {
            const metricKey = sessionMode === 'DEEP_WORK' ? 'pomodoros' : 'managementSessions';
            incrementMetric('production', metricKey);
            setIsBreak(true);
            breakTimer.start();
        },
        notificationTitle: '🏆 Deep Work Complete!',
        notificationBody: 'Time for a 15-minute tactical reset.'
    });

    // Break timer
    const breakTimer = useTimer({
        durationMs: BREAK_DURATION_MS,
        onComplete: () => {
            setIsBreak(false);
        },
        notificationTitle: '⏰ Break Over!',
        notificationBody: 'Ready for another Deep Work session.'
    });

    const activeTimer = isBreak ? breakTimer : workTimer;

    const toggleTimer = () => {
        if (activeTimer.isRunning) {
            if (activeTimer.isPaused) {
                activeTimer.resume();
            } else {
                activeTimer.pause();
            }
        } else {
            activeTimer.start();
        }
    };

    const resetTimer = () => {
        workTimer.reset();
        breakTimer.reset();
        setIsBreak(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isActive = activeTimer.isRunning && !activeTimer.isPaused;

    return (
        <>
            <div className="bg-void border border-steel/20 relative overflow-hidden group">
                {/* Background Schedule Pulse */}
                <div className={`absolute top-0 left-0 w-1 h-full ${schedule.color.replace('text-', 'bg-')} opacity-50`}></div>

                <div className="p-4 flex flex-col gap-4">
                    {/* Header: Current Protocol Block */}
                    <div className="flex justify-between items-center border-b border-steel/10 pb-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-concrete/40 uppercase tracking-widest">Current Protocol Sector</span>
                            <div className={`text-sm font-black font-display uppercase tracking-wider ${schedule.color} animate-pulse`}>
                                {schedule.label}
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[9px] font-mono text-concrete/40 uppercase tracking-widest">Local Time</span>
                            <div className="text-sm font-mono text-concrete">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Pomodoro Engine */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isActive ? 'bg-gold/10 text-gold' : 'bg-steel/10 text-concrete/20'}`}>
                                <Timer size={18} className={isActive ? 'animate-spin-slow' : ''} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[50px] font-black font-display leading-none tracking-tighter tabular-nums text-concrete">
                                    {formatTime(activeTimer.remainingSeconds)}
                                </span>
                                <span className="text-[9px] font-mono uppercase text-concrete/40 tracking-[0.2em]">
                                    {isBreak ? 'Recovery Protocol' : (sessionMode === 'DEEP_WORK' ? 'Deep Work Cycle' : 'Management Cycle')}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={toggleTimer}
                                className={`p-3 rounded-full transition-all ${isActive ? 'bg-steel/10 text-concrete hover:bg-steel/20' : 'bg-gold text-void hover:bg-white'}`}
                            >
                                {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="p-3 rounded-full bg-steel/5 text-concrete/30 hover:text-blood hover:bg-blood/10 transition-colors"
                            >
                                <RefreshCw size={16} />
                            </button>
                            <button
                                onClick={() => setShowFullscreen(true)}
                                className="p-3 rounded-full bg-steel/5 text-concrete/30 hover:text-gold hover:bg-gold/10 transition-colors"
                                title="Fullscreen Mode"
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Mode Toggle (Only when idle) */}
                    {!activeTimer.isRunning && !activeTimer.isPaused && !isBreak && (
                        <div className="flex bg-steel/10 p-1 rounded-lg">
                            <button
                                onClick={() => setSessionMode('DEEP_WORK')}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${sessionMode === 'DEEP_WORK' ? 'bg-gold text-void' : 'text-concrete/50 hover:text-concrete'}`}
                            >
                                Deep Work (90m)
                            </button>
                            <button
                                onClick={() => setSessionMode('MANAGEMENT')}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${sessionMode === 'MANAGEMENT' ? 'bg-blue-400 text-void' : 'text-concrete/50 hover:text-concrete'}`}
                            >
                                Management (60m)
                            </button>
                        </div>
                    )}

                    {/* Background Mode Hint */}
                    {activeTimer.isRunning && (
                        <div className="text-[9px] text-concrete/30 text-center">
                            💡 Timer continues in background
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Session Modal */}
            {showFullscreen && (
                <DeepWorkSession 
                    mode={sessionMode} 
                    onClose={() => setShowFullscreen(false)} 
                />
            )}
        </>
    );
};
