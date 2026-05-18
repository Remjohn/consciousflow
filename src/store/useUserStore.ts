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
        abs: number;
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
    fitness: { pushups: 0, abs: 0, biceps: 0, burpees: 0, boxing: 0, kegels: 0, singing: 0, dancing: 0 },
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

            // 00:00 - 06:30 (0 - 390) -> CORE SLEEP
            if (totalMins < 390) return { mode: 'CORE_SLEEP', label: 'CORE SLEEP', color: 'text-indigo-400' };

            // 06:30 - 07:00 (390 - 420) -> PROTOCOL START
            if (totalMins < 420) return { mode: 'PROTOCOL_START', label: 'IGNITION PROTOCOL', color: 'text-blood' };

            // 07:00 - 10:20 (420 - 620) -> ALPHA WORK 1
            if (totalMins < 620) return { mode: 'ALPHA_WORK', label: 'ALPHA PRIORITY', color: 'text-gold' };

            // 10:20 - 10:40 (620 - 640) -> RECOVERY
            if (totalMins < 640) return { mode: 'RECOVERY', label: 'TACTICAL RESET', color: 'text-emerald-400' };

            // 10:40 - 14:00 (640 - 840) -> ALPHA WORK 2
            if (totalMins < 840) return { mode: 'ALPHA_WORK', label: 'ALPHA PRIORITY', color: 'text-gold' };

            // 14:00 - 15:00 (840 - 900) -> NOURISH RESET
            if (totalMins < 900) return { mode: 'NOURISH_RESET', label: 'NOURISH & RESET', color: 'text-orange-400' };

            // 15:00 - 17:30 (900 - 1050) -> BRAVO WORK 1
            if (totalMins < 1050) return { mode: 'BRAVO_WORK', label: 'BRAVO PRIORITY', color: 'text-concrete' };

            // 17:30 - 17:50 (1050 - 1070) -> RECOVERY
            if (totalMins < 1070) return { mode: 'RECOVERY', label: 'TACTICAL RESET', color: 'text-emerald-400' };

            // 17:50 - 19:30 (1070 - 1170) -> BRAVO WORK 2
            if (totalMins < 1170) return { mode: 'BRAVO_WORK', label: 'BRAVO PRIORITY', color: 'text-concrete' };

            // 19:30 - 23:30 (1170 - 1410) -> FREE BLOCK
            if (totalMins < 1410) return { mode: 'FREE_BLOCK', label: 'SUPPORT / MGA OPS', color: 'text-blue-400' };

            // 23:30+ -> SHUTDOWN
            return { mode: 'SHUTDOWN', label: 'SHUTDOWN SEOUENCE', color: 'text-indigo-400' };
        },

        getRigourState: () => {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes();
            const totalMins = hours * 60 + mins;
            const { today } = get();
            const actual = today.production.videos; // Tracking against 12 daily packages

            let expected = 0;
            if (totalMins > 420 && totalMins <= 620) expected = Math.floor((totalMins - 420) / (200 / 3)); // Alpha 1: 3 pkgs
            else if (totalMins > 620 && totalMins <= 640) expected = 3;
            else if (totalMins > 640 && totalMins <= 840) expected = 3 + Math.floor((totalMins - 640) / (200 / 4)); // Alpha 2: +4 pkgs (7)
            else if (totalMins > 840 && totalMins <= 900) expected = 7;
            else if (totalMins > 900 && totalMins <= 1050) expected = 7 + Math.floor((totalMins - 900) / (150 / 3)); // Bravo 1: +3 pkgs (10)
            else if (totalMins > 1050 && totalMins <= 1070) expected = 10;
            else if (totalMins > 1070 && totalMins <= 1170) expected = 10 + Math.floor((totalMins - 1070) / (100 / 2)); // Bravo 2: +2 pkgs (12)
            else if (totalMins > 1170) expected = 12;

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
