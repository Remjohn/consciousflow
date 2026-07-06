import { create } from 'zustand';
import { isSameWeek, isSameMonth, parseISO } from 'date-fns';
import { API_URL } from '../lib/api';

// --- DATA STRUCTURES ---

export interface Metrics {
    production: {
        videos: number;
        pomodoros: number; // Deep Work
        managementSessions: number;
        points: number;
        proofPhotoUrl?: string;
    };
    finance: {
        revenue: number; // Calculated: videos * 25
        activeClients: number;
        total2026: number; // Cumulative
    };
    fitness: {
        pushups: number;
        pullups: number;
        abs: number;
        jumpSquats: number;
        swimLaps: number;
        footballMins: number;
        jumpRopeMins: number;
        runningMins: number;
        biceps: number;
        burpees: number;
        boxing: number;
        kegels: number;
        singing: number;
        dancing: number;
    };
    lifestyle: {
        sleep: number;
        noSocial: boolean;
        noYouTube: boolean;
        // Phone Usage (Priority #1)
        phoneHours: number;
        phonePickups: number;
        // Extended Protocols
        coldShower: boolean;
        kegels: boolean;  // Pelvic floor training
    };
}

export interface DailyRecord {
    date: string; // ISO String YYYY-MM-DD
    metrics: Metrics;
    isWin: boolean; // videos >= 5
}

export type ScheduleMode = 'CORE_SLEEP' | 'PROTOCOL_START' | 'ALPHA_WORK' | 'RECOVERY' | 'NOURISH_RESET' | 'BRAVO_WORK' | 'FREE_BLOCK' | 'SHUTDOWN';

interface UserState {
    name: string;
    location: 'Europe' | 'DRC';

    // LOADING STATE
    isLoading: boolean;
    lastFetch: string | null; // ISO timestamp of last backend fetch

    // HISTORY & STATE
    history: DailyRecord[];
    currentDate: string;

    // CURRENT DAY METRICS (Shortcut for UI)
    today: Metrics;

    // GOAL STATUS (From Backend)
    goalStatus: {
        monthVideos: number;
        monthTarget: number;
    };

    // ACTIONS
    fetchFromBackend: () => Promise<void>;
    incrementMetric: (category: keyof Metrics, field: string, amount?: number) => void;
    setMetric: (category: keyof Metrics, field: string, value: number | boolean | string) => void;
    checkDailyReset: () => void; // Checks if day turned over

    // GETTERS (Analytics)
    getStats: (scope: 'day' | 'week' | 'month', category: keyof Metrics, field: string) => number;
    getHungerState: () => 'STARVATION' | 'SUSTENANCE' | 'FEAST';
    getCurrentScheduleMode: () => { mode: ScheduleMode; label: string; color: string };
    getRigourState: () => { status: 'AHEAD' | 'ON_TRACK' | 'LAGGING'; expected: number; actual: number; diff: number };

    // PUNISHMENT
    isPunished: boolean;
    setPunished: (value: boolean) => void;
}

export const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_METRICS: Metrics = {
    production: { videos: 0, pomodoros: 0, managementSessions: 0, points: 0, proofPhotoUrl: '' },
    finance: { revenue: 0, activeClients: 0, total2026: 0 },
    fitness: {
        pushups: 0,
        pullups: 0,
        abs: 0,
        jumpSquats: 0,
        swimLaps: 0,
        footballMins: 0,
        jumpRopeMins: 0,
        runningMins: 0,
        biceps: 0,
        burpees: 0,
        boxing: 0,
        kegels: 0,
        singing: 0,
        dancing: 0
    },
    lifestyle: {
        sleep: 0, noSocial: false, noYouTube: false,
        phoneHours: 0, phonePickups: 0,
        coldShower: false, kegels: false
    }
};

export const useUserStore = create<UserState>()(
    (set, get) => ({
        name: 'Emilio',
        location: 'Europe',
        isLoading: false,
        lastFetch: null,
        history: [],
        currentDate: getTodayDate(),
        today: INITIAL_METRICS,
        goalStatus: { monthVideos: 0, monthTarget: 150 },
        isPunished: false,

        setPunished: (value) => set({ isPunished: value }),

        // FETCH FROM BACKEND - Load real data from database (single source of truth)
        fetchFromBackend: async () => {
            set({ isLoading: true });
            try {
                const res = await fetch(`${API_URL}/api/dashboard/today`);
                if (!res.ok) throw new Error('Backend unavailable');

                const data = await res.json();

                if (!data.success) throw new Error(data.error || 'Unknown error');

                // Map backend data to store structure (new format)
                set({
                    currentDate: data.date,
                    today: data.metrics,
                    goalStatus: {
                        monthVideos: data.goalStatus?.monthVideos || 0,
                        monthTarget: data.goalStatus?.monthTarget || 150
                    },
                    history: data.history || [],
                    isLoading: false,
                    lastFetch: new Date().toISOString()
                });
            } catch (error) {
                console.error('Backend fetch failed:', error);
                set({ isLoading: false });
            }
        },

        // ... (getCurrentScheduleMode and getRigourState omitted for brevity in replace, need target content match)
        getCurrentScheduleMode: () => {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes();
            const totalMins = hours * 60 + mins;

            // 00:00 - 05:30 (0 - 330) -> CORE SLEEP
            if (totalMins < 330) return { mode: 'CORE_SLEEP', label: 'CORE SLEEP', color: 'text-indigo-400' };

            // 05:30 - 06:00 (330 - 360) -> PROTOCOL START (Ignition starting by 6am max)
            if (totalMins < 360) return { mode: 'PROTOCOL_START', label: 'IGNITION PROTOCOL', color: 'text-blood' };

            // 06:00 - 08:00 (360 - 480) -> DEEP WORK SESSION 1
            if (totalMins < 480) return { mode: 'ALPHA_WORK', label: 'DEEP WORK 1', color: 'text-gold' };

            // 08:00 - 10:00 (480 - 600) -> DEEP WORK SESSION 2
            if (totalMins < 600) return { mode: 'ALPHA_WORK', label: 'DEEP WORK 2', color: 'text-gold' };

            // 10:00 - 12:00 (600 - 720) -> DEEP WORK SESSION 3
            if (totalMins < 720) return { mode: 'BRAVO_WORK', label: 'DEEP WORK 3', color: 'text-concrete' };

            // 12:00 - 14:00 (720 - 840) -> DEEP WORK SESSION 4
            if (totalMins < 840) return { mode: 'BRAVO_WORK', label: 'DEEP WORK 4', color: 'text-concrete' };

            // 14:00 - 15:00 (840 - 900) -> NOURISH & RESET
            if (totalMins < 900) return { mode: 'NOURISH_RESET', label: 'NOURISH & RESET', color: 'text-orange-400' };

            // 15:00 - 23:00 (900 - 1380) -> SUPPORT / MGA OPS (Management block at night)
            if (totalMins < 1380) return { mode: 'FREE_BLOCK', label: 'SUPPORT / MGA OPS', color: 'text-blue-400' };

            // 23:00+ -> SHUTDOWN
            return { mode: 'SHUTDOWN', label: 'SHUTDOWN SEQUENCE', color: 'text-indigo-400' };
        },

        getRigourState: () => {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes();
            const totalMins = hours * 60 + mins;
            const { today } = get();
            const actual = today.production.pomodoros; // Track actual Deep Work sessions (target: 4)

            let expected = 0;
            
            if (totalMins < 480) {
                // Before 8:00 AM (still in or before Session 1)
                expected = 0;
            } else if (totalMins < 600) {
                // 08:00 - 10:00 (Session 1 must be completed, currently in Session 2)
                expected = 1;
            } else if (totalMins < 720) {
                // 10:00 - 12:00 (Sessions 1 & 2 must be completed, currently in Session 3)
                expected = 2;
            } else if (totalMins < 840) {
                // 12:00 - 14:00 (Sessions 1, 2, & 3 must be completed, currently in Session 4)
                expected = 3;
            } else {
                // After 14:00 (All 4 Deep Work Sessions must be completed; expected freezes at 4)
                expected = 4;
            }

            const diff = actual - expected;
            let status: 'AHEAD' | 'ON_TRACK' | 'LAGGING' = 'ON_TRACK';
            if (diff >= 1) status = 'AHEAD';
            if (diff <= -1) status = 'LAGGING';

            return { status, expected, actual, diff };
        },

        getStats: (scope, category, field) => {
            // ... same ...
            const { today, history } = get();
            const now = parseISO(getTodayDate());
            if (scope === 'day') {
                // @ts-ignore
                return today[category][field];
            }
            const relevantRecords = history.filter(record => {
                const recordDate = parseISO(record.date);
                if (scope === 'week') return isSameWeek(recordDate, now, { weekStartsOn: 1 });
                if (scope === 'month') return isSameMonth(recordDate, now);
                return false;
            });
            const historySum = relevantRecords.reduce((acc, record) => {
                // @ts-ignore
                return acc + (record.metrics[category][field] || 0);
            }, 0);
            // @ts-ignore
            return historySum + today[category][field];
        },

        getHungerState: () => {
            const videos = get().today.production.videos;
            if (videos < 6) return 'STARVATION';
            if (videos < 12) return 'SUSTENANCE';
            return 'FEAST';
        },

        // --- ACTIONS ---

        incrementMetric: (category, field, amount = 1) => {
            get().checkDailyReset();

            set((state) => {
                const newToday = { ...state.today };

                if (category === 'production' && field === 'videos') {
                    newToday.production.videos += amount;
                    newToday.finance.revenue += (amount * 25);
                    newToday.finance.total2026 += (amount * 25);

                    fetch(`${API_URL}/api/dashboard/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'videos', value: newToday.production.videos })
                    }).catch(console.error);
                }
                else if (category === 'production' && field === 'pomodoros') {
                    newToday.production.pomodoros += amount;
                    fetch(`${API_URL}/api/dashboard/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'pomodoros', value: newToday.production.pomodoros })
                    }).catch(console.error);
                }
                else if (category === 'production' && field === 'points') {
                    newToday.production.points += amount;
                    fetch(`${API_URL}/api/dashboard/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'points', value: newToday.production.points })
                    }).catch(console.error);
                }
                else if (category === 'production' && field === 'managementSessions') {
                    newToday.production.managementSessions += amount;
                    fetch(`${API_URL}/api/dashboard/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'management_sessions', value: newToday.production.managementSessions })
                    }).catch(console.error);
                }
                else if (category === 'finance' && field === 'revenue') {
                    newToday.finance.revenue += amount;
                    newToday.finance.total2026 += amount;
                } else if (category === 'fitness') {
                    // @ts-ignore
                    newToday[category][field] += amount;
                    // Sync fitness to backend
                    fetch(`${API_URL}/api/dashboard/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: field, value: newToday.fitness[field as keyof typeof newToday.fitness] })
                    }).catch(console.error);
                } else {
                    // @ts-ignore
                    newToday[category][field] += amount;
                }
                return { today: newToday };
            });
        },

        setMetric: (category, field, value) => {
            get().checkDailyReset();
            set((state) => {
                const newToday = { ...state.today };
                // @ts-ignore
                newToday[category][field] = value;

                // Sync ALL changes to backend (write-through)
                fetch(`${API_URL}/api/dashboard/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ field: field, value: value })
                }).catch(console.error);

                return { today: newToday };
            });
        },

        checkDailyReset: () => {
            // ... same ...
            const nowStr = getTodayDate();
            const { currentDate, today, history } = get();
            if (nowStr !== currentDate) {
                const isWin = today.production.videos >= 5;
                const yesterdayRecord: DailyRecord = {
                    date: currentDate,
                    metrics: today,
                    isWin
                };
                const newDayMetrics: Metrics = {
                    ...INITIAL_METRICS,
                    finance: {
                        ...INITIAL_METRICS.finance,
                        total2026: today.finance.total2026,
                        activeClients: today.finance.activeClients
                    }
                };
                set({
                    history: [...history, yesterdayRecord],
                    currentDate: nowStr,
                    today: newDayMetrics
                });
            }
        },
    })
);
