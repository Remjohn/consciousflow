import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
    durationMs: number;
    onComplete: () => void;
    onTick?: (remainingMs: number) => void;
    notificationTitle?: string;
    notificationBody?: string;
}

interface UseTimerReturn {
    remainingMs: number;
    remainingSeconds: number;
    isRunning: boolean;
    isPaused: boolean;
    progress: number;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    stop: () => void;
}

/**
 * PWA-compatible timer hook that works in background tabs.
 * 
 * Uses timestamp-based timing instead of setInterval counting.
 * Includes Web Worker for background completion detection and
 * Notification API for alerting user when timer completes.
 */
export function useTimer({
    durationMs,
    onComplete,
    onTick,
    notificationTitle = '⏰ Timer Complete!',
    notificationBody = 'Your session has ended.'
}: UseTimerOptions): UseTimerReturn {
    // Core state
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [pausedAt, setPausedAt] = useState<number | null>(null);
    const [pauseOffset, setPauseOffset] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [remainingMs, setRemainingMs] = useState(durationMs);

    // Refs for cleanup
    const workerRef = useRef<Worker | null>(null);
    const rafRef = useRef<number | null>(null);
    const completedRef = useRef(false);

    // Calculate remaining time from timestamps
    const calculateRemaining = useCallback(() => {
        if (!startedAt) return durationMs;
        if (pausedAt) {
            return Math.max(0, durationMs - (pausedAt - startedAt - pauseOffset));
        }
        return Math.max(0, durationMs - (Date.now() - startedAt - pauseOffset));
    }, [startedAt, pausedAt, pauseOffset, durationMs]);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Show notification
    const showNotification = useCallback(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(notificationTitle, {
                    body: notificationBody,
                    icon: '/favicon.ico',
                    requireInteraction: true,
                    tag: 'timer-complete'
                });
            } catch (e) {
                console.warn('Notification failed:', e);
            }
        }

        // Also play a sound
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.frequency.setValueAtTime(880, ctx.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio failed:', e);
        }
    }, [notificationTitle, notificationBody]);

    // Handle timer completion
    const handleComplete = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;

        setIsRunning(false);
        setRemainingMs(0);
        showNotification();
        onComplete();

        // Stop worker
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'STOP' });
        }
    }, [onComplete, showNotification]);

    // Initialize Web Worker
    useEffect(() => {
        // Create worker from inline code (avoids separate file issues)
        const workerCode = `
            let timerId = null;
            let endTime = null;
            
            self.onmessage = (e) => {
                if (e.data.type === 'START') {
                    endTime = e.data.endTime;
                    checkTime();
                } else if (e.data.type === 'STOP') {
                    if (timerId) clearTimeout(timerId);
                    timerId = null;
                }
            };
            
            function checkTime() {
                const remaining = endTime - Date.now();
                if (remaining <= 0) {
                    self.postMessage({ type: 'COMPLETE' });
                } else {
                    timerId = setTimeout(checkTime, Math.min(remaining, 1000));
                }
            }
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);

        try {
            workerRef.current = new Worker(workerUrl);
            workerRef.current.onmessage = (e) => {
                if (e.data.type === 'COMPLETE') {
                    handleComplete();
                }
            };
        } catch (e) {
            console.warn('Web Worker creation failed, falling back to main thread:', e);
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
            URL.revokeObjectURL(workerUrl);
        };
    }, [handleComplete]);

    // Main animation loop for UI updates
    useEffect(() => {
        if (!isRunning || pausedAt) {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            return;
        }

        const tick = () => {
            const remaining = calculateRemaining();
            setRemainingMs(remaining);

            if (onTick) {
                onTick(remaining);
            }

            if (remaining <= 0) {
                handleComplete();
                return;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isRunning, pausedAt, calculateRemaining, onTick, handleComplete]);

    // Handle visibility change - re-sync when user returns
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isRunning && !pausedAt) {
                const remaining = calculateRemaining();
                setRemainingMs(remaining);

                if (remaining <= 0) {
                    handleComplete();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, pausedAt, calculateRemaining, handleComplete]);

    // Start timer
    const start = useCallback(() => {
        completedRef.current = false;
        const now = Date.now();
        setStartedAt(now);
        setPausedAt(null);
        setPauseOffset(0);
        setIsRunning(true);
        setRemainingMs(durationMs);

        // Start worker
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'START',
                endTime: now + durationMs
            });
        }
    }, [durationMs]);

    // Pause timer
    const pause = useCallback(() => {
        if (!isRunning || pausedAt) return;
        setPausedAt(Date.now());

        // Stop worker during pause
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'STOP' });
        }
    }, [isRunning, pausedAt]);

    // Resume timer
    const resume = useCallback(() => {
        if (!pausedAt) return;

        const pauseDuration = Date.now() - pausedAt;
        setPauseOffset(prev => prev + pauseDuration);
        setPausedAt(null);

        // Restart worker with adjusted end time
        if (workerRef.current && startedAt) {
            const remaining = calculateRemaining();
            workerRef.current.postMessage({
                type: 'START',
                endTime: Date.now() + remaining
            });
        }
    }, [pausedAt, startedAt, calculateRemaining]);

    // Reset timer
    const reset = useCallback(() => {
        completedRef.current = false;
        setStartedAt(null);
        setPausedAt(null);
        setPauseOffset(0);
        setIsRunning(false);
        setRemainingMs(durationMs);

        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'STOP' });
        }
    }, [durationMs]);

    // Stop timer (same as reset but might be used differently)
    const stop = reset;

    // Calculate derived values
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const progress = ((durationMs - remainingMs) / durationMs) * 100;
    const isPaused = pausedAt !== null;

    return {
        remainingMs,
        remainingSeconds,
        isRunning,
        isPaused,
        progress,
        start,
        pause,
        resume,
        reset,
        stop
    };
}

export default useTimer;
