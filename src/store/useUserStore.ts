import { create } from 'zustand';
import { isSameWeek, isSameMonth, parseISO } from 'date-fns';

// --- DATA STRUCTURES ---

export interface Metrics {
    production: {
        videos: number;
        pomodoros: number;
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
    };
    lifestyle: {
        sleep: number;
        meditation: boolean;
        noSocial: boolean;
        noYouTube: boolean;
    };
}

export interface DailyRecord {
    date: string; // ISO String YYYY-MM-DD
    metrics: Metrics;
    isWin: boolean; // videos >= 5
}

export type CandidateStage = 'POOL' | 'GROUP_STAGE' | 'ROUND_OF_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'FINALS' | 'CHAMPION';

export type ScheduleMode = 'CORE_SLEEP' | 'PROTOCOL_START' | 'ALPHA_WORK' | 'RECOVERY' | 'NOURISH_RESET' | 'BRAVO_WORK' | 'FREE_BLOCK' | 'SHUTDOWN';

export interface Candidate {
    id: number;
    userId: number;
    name: string;
    nickname?: string;
    dob?: string;
    photoUrl?: string;
    stage: CandidateStage;

    // Prescreening
    age?: number;
    ageScore: number;
    isAgeDisqualified: boolean;

    cuteness?: number;
    prettiness?: number;
    hotness?: number;
    cleanliness?: number;
    beautyScore?: number;
    beautyLocked: boolean;

    lifePathNumber?: number;
    birthdateNumber?: number;
    pinnacleNumber?: number;
    numerologyScore: number;

    // Metrics
    valuesAlignment: number;
    familyStructure: number;
    communicationStyle: number;
    disciplineStructure: number;
    healthHygiene: number;
    socialReputation: number;
    teachability: number;
    socialMediaConduct: number;

    // Flags
    redFlagCount: number;
    greenFlagCount: number;
    redFlagScore: number;
    greenFlagScore: number;

    // Totals
    preScreeningScore: number;
    coreMetricsScore: number;
    questionsScore: number;
    totalChampionshipScore: number;

    // Meta
    parentalApproval: boolean;
    isArchived: boolean;
    archiveReason?: string;
    isDisqualified: boolean;
    disqualificationReason?: string;

    notes?: string;
    createdAt?: string;

    // V2 Fields
    tiktokUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    bonusPoints?: number;
    penaltyPoints?: number;
}

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

    // CHAMPIONSHIP (Dating)
    candidates: Candidate[];

    // ACTIONS
    fetchFromBackend: () => Promise<void>;
    incrementMetric: (category: keyof Metrics, field: string, amount?: number) => void;
    setMetric: (category: keyof Metrics, field: string, value: number | boolean | string) => void;
    checkDailyReset: () => void; // Checks if day turned over

    // CHAMPIONSHIP ACTIONS
    fetchCandidates: () => Promise<void>;
    addCandidate: (candidate: { name: string; nickname?: string; dob?: string; photoUrl?: string; notes?: string; }) => Promise<void>;
    moveCandidate: (id: number, stage: CandidateStage) => Promise<void>;
    updateCandidate: (id: number, updates: Partial<Candidate>) => void;
    removeCandidate: (id: number) => void;

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
    production: { videos: 0, pomodoros: 0, proofPhotoUrl: '' },
    finance: { revenue: 0, activeClients: 0, total2026: 0 },
    fitness: { pushups: 0, abs: 0, biceps: 0, burpees: 0 },
    lifestyle: { sleep: 0, meditation: false, noSocial: false, noYouTube: false }
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
        candidates: [],
        goalStatus: { monthVideos: 0, monthTarget: 150 },
        isPunished: false,

        setPunished: (value) => set({ isPunished: value }),

        // FETCH FROM BACKEND - Load real data from database (single source of truth)
        fetchFromBackend: async () => {
            set({ isLoading: true });
            try {
                const res = await fetch('http://localhost:3000/api/dashboard/today');
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
            const actual = today.production.pomodoros;

            let expected = 0;
            // ... same logic as before ...
            if (totalMins > 420 && totalMins <= 620) expected = Math.floor((totalMins - 420) / 25);
            else if (totalMins > 620 && totalMins <= 640) expected = 8;
            else if (totalMins > 640 && totalMins <= 840) expected = 8 + Math.floor((totalMins - 640) / 25);
            else if (totalMins > 840 && totalMins <= 900) expected = 16;
            else if (totalMins > 900 && totalMins <= 1050) expected = 16 + Math.floor((totalMins - 900) / 30);
            else if (totalMins > 1050 && totalMins <= 1070) expected = 21;
            else if (totalMins > 1070 && totalMins <= 1170) expected = 21 + Math.floor((totalMins - 1070) / 25);
            else if (totalMins > 1170) expected = 25;

            const diff = actual - expected;
            let status: 'AHEAD' | 'ON_TRACK' | 'LAGGING' = 'ON_TRACK';
            if (diff >= 1) status = 'AHEAD';
            if (diff <= -2) status = 'LAGGING';

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
            if (videos < 2) return 'STARVATION';
            if (videos < 5) return 'SUSTENANCE';
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

                    fetch('http://localhost:3000/api/dashboard/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'videos', value: newToday.production.videos })
                    }).catch(console.error);
                }
                else if (category === 'production' && field === 'pomodoros') {
                    newToday.production.pomodoros += amount;
                    fetch('http://localhost:3000/api/dashboard/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ field: 'pomodoros', value: newToday.production.pomodoros })
                    }).catch(console.error);
                }
                else if (category === 'finance' && field === 'revenue') {
                    newToday.finance.revenue += amount;
                    newToday.finance.total2026 += amount;
                } else if (category === 'fitness') {
                    // @ts-ignore
                    newToday[category][field] += amount;
                    // Sync fitness to backend
                    fetch('http://localhost:3000/api/dashboard/update', {
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
                fetch('http://localhost:3000/api/dashboard/update', {
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
        // --- CHAMPIONSHIP ACTIONS ---

        fetchCandidates: async () => {
            try {
                const res = await fetch('http://localhost:3000/api/championship/leaderboard');
                if (!res.ok) throw new Error('Failed to fetch candidates');
                const data = await res.json();
                set({ candidates: data.candidates });
            } catch (err) {
                console.error(err);
            }
        },

        addCandidate: async (candidate) => {
            // Now assumes calling with { name, nickname, dob, photoUrl, notes }
            try {
                const res = await fetch('http://localhost:3000/api/championship/candidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(candidate)
                });
                if (res.ok) {
                    get().fetchCandidates(); // Refresh list
                }
            } catch (err) { console.error(err); }
        },

        moveCandidate: async (id, stage) => {
            try {
                await fetch(`http://localhost:3000/api/championship/candidate/${id}/advance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetStage: stage }) // Assuming simple move for now
                });
                get().fetchCandidates();
            } catch (err) { console.error(err); }
        },

        updateCandidate: (id, updates) => {
            // Placeholder for local optimistic update or specific API call
            // For full integration, we should use specific setter actions (setAppearance, etc.)
            // This generic one might be deprecated or mapped to specific endpoints.
            // For now, let's keep it local-only to avoid breaking UI that relies on valid ID logic?
            // Actually, logic is backend now.
            console.warn("Generic updateCandidate called - use specific setters");
        },

        removeCandidate: async (id) => {
            // Implement delete/archive endpoint later?
            // For now, local optimistic removal to keep UI responsive
            set((state) => ({ candidates: state.candidates.filter(c => c.id !== id) }));
        },
    })
);
