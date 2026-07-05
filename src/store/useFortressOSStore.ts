import { create } from 'zustand';

const STORAGE_KEY = 'fortress-cmf-operator-os-v1';

const isoToday = () => new Date().toISOString().split('T')[0];

type StudioMetrics = {
  sampleVideoTrials: number;
  sampleVideosDelivered: number;
  sampleVideosTarget: number;
  activeMonthlyPackages: number;
  interviewSessions: number;
  interviewTarget: number;
  managementSessions: number;
  managementTarget: number;
  blockedClients: number;
};

type DietMetrics = {
  calories: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealsComplete: number;
  targetMeals: number;
};

type InvestmentsMetrics = {
  portfolioHealth: number;
  monthlyContribution: number;
  monthlyGoal: number;
  portfolioValue: number;
  watchlistCount: number;
};

type PracticeMetric = {
  minutes: number;
  targetMinutes: number;
  completed: number;
  target: number;
};

type PassionMetrics = {
  diet: DietMetrics;
  investments: InvestmentsMetrics;
  kegel: PracticeMetric;
  singing: PracticeMetric;
  boxing: PracticeMetric;
  dancing: PracticeMetric;
  lifestyle: {
    water: boolean;
    read: boolean;
    meditate: boolean;
    journal: boolean;
    coldShower: boolean;
  };
};

type ChallengeMetric = {
  title: string;
  completed: number;
  target: number;
  daysLeft: number;
  type: 'business' | 'personal';
};

export type FortressOSState = {
  date: string;
  studio: StudioMetrics;
  passions: PassionMetrics;
  challenges: {
    business: ChallengeMetric;
    personal: ChallengeMetric;
  };
  ensureCurrentDay: () => void;
  updateStudio: <K extends keyof StudioMetrics>(field: K, value: StudioMetrics[K]) => void;
  incrementStudio: (field: keyof StudioMetrics, amount?: number) => void;
  updateDiet: (patch: Partial<DietMetrics>) => void;
  updateInvestments: (patch: Partial<InvestmentsMetrics>) => void;
  updatePractice: (practice: 'kegel' | 'singing' | 'boxing' | 'dancing', patch: Partial<PracticeMetric>) => void;
  toggleLifestyleHabit: (habit: keyof PassionMetrics['lifestyle']) => void;
  updateChallenge: (kind: 'business' | 'personal', patch: Partial<ChallengeMetric>) => void;
  resetToday: () => void;
};

const DEFAULT_STUDIO: StudioMetrics = {
  sampleVideoTrials: 0,
  sampleVideosDelivered: 0,
  sampleVideosTarget: 5,
  activeMonthlyPackages: 0,
  interviewSessions: 0,
  interviewTarget: 4,
  managementSessions: 0,
  managementTarget: 2,
  blockedClients: 0,
};

const DEFAULT_PASSIONS: PassionMetrics = {
  diet: {
    calories: 0,
    targetCalories: 2000,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealsComplete: 0,
    targetMeals: 3,
  },
  investments: {
    portfolioHealth: 0,
    monthlyContribution: 0,
    monthlyGoal: 1000,
    portfolioValue: 0,
    watchlistCount: 0,
  },
  kegel: { minutes: 0, targetMinutes: 10, completed: 0, target: 3 },
  singing: { minutes: 0, targetMinutes: 20, completed: 0, target: 3 },
  boxing: { minutes: 0, targetMinutes: 25, completed: 0, target: 5 },
  dancing: { minutes: 0, targetMinutes: 30, completed: 0, target: 3 },
  lifestyle: {
    water: false,
    read: false,
    meditate: false,
    journal: false,
    coldShower: false,
  },
};

const DEFAULT_CHALLENGES: { business: ChallengeMetric; personal: ChallengeMetric } = {
  business: {
    type: 'business' as const,
    title: 'Sell 30 sample video trials in 14 days',
    completed: 0,
    target: 30,
    daysLeft: 14,
  },
  personal: {
    type: 'personal' as const,
    title: 'Train 5x this week',
    completed: 0,
    target: 5,
    daysLeft: 7,
  },
};

const createDefaultState = () => ({
  date: isoToday(),
  studio: DEFAULT_STUDIO,
  passions: DEFAULT_PASSIONS,
  challenges: DEFAULT_CHALLENGES,
});

const mergePractice = (value: Partial<PracticeMetric> | undefined, fallback: PracticeMetric): PracticeMetric => ({ ...fallback, ...(value ?? {}) });

const normalize = (raw: Partial<ReturnType<typeof createDefaultState>> | null | undefined) => ({
  date: raw?.date ?? isoToday(),
  studio: { ...DEFAULT_STUDIO, ...(raw?.studio ?? {}) },
  passions: {
    diet: { ...DEFAULT_PASSIONS.diet, ...(raw?.passions?.diet ?? {}) },
    investments: { ...DEFAULT_PASSIONS.investments, ...(raw?.passions?.investments ?? {}) },
    kegel: mergePractice(raw?.passions?.kegel, DEFAULT_PASSIONS.kegel),
    singing: mergePractice(raw?.passions?.singing, DEFAULT_PASSIONS.singing),
    boxing: mergePractice(raw?.passions?.boxing, DEFAULT_PASSIONS.boxing),
    dancing: mergePractice(raw?.passions?.dancing, DEFAULT_PASSIONS.dancing),
    lifestyle: { ...DEFAULT_PASSIONS.lifestyle, ...(raw?.passions?.lifestyle ?? {}) },
  },
  challenges: {
    business: { ...DEFAULT_CHALLENGES.business, ...(raw?.challenges?.business ?? {}) },
    personal: { ...DEFAULT_CHALLENGES.personal, ...(raw?.challenges?.personal ?? {}) },
  },
});

const loadState = () => {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return normalize(stored ? JSON.parse(stored) : null);
  } catch {
    return createDefaultState();
  }
};

const persist = (state: Pick<FortressOSState, 'date' | 'studio' | 'passions' | 'challenges'>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: state.date,
      studio: state.studio,
      passions: state.passions,
      challenges: state.challenges,
    })
  );
};

export const useFortressOSStore = create<FortressOSState>()((set, get) => ({
  ...loadState(),

  ensureCurrentDay: () => {
    const today = isoToday();
    if (get().date === today) return;

    const current = get();
    const next = normalize({
      date: today,
      // Keep monthly/client context, reset daily counters.
      studio: {
        ...DEFAULT_STUDIO,
        activeMonthlyPackages: current.studio.activeMonthlyPackages,
        sampleVideosTarget: current.studio.sampleVideosTarget,
        interviewTarget: current.studio.interviewTarget,
        managementTarget: current.studio.managementTarget,
      },
      passions: {
        ...DEFAULT_PASSIONS,
        investments: current.passions.investments,
      },
      challenges: current.challenges,
    });
    persist(next);
    set(next);
  },

  updateStudio: (field, value) => {
    set((state) => {
      const next = { ...state, studio: { ...state.studio, [field]: value } };
      persist(next);
      return next;
    });
  },

  incrementStudio: (field, amount = 1) => {
    set((state) => {
      const current = Number(state.studio[field] ?? 0);
      const next = { ...state, studio: { ...state.studio, [field]: Math.max(0, current + amount) } } as FortressOSState;
      persist(next);
      return next;
    });
  },

  updateDiet: (patch) => {
    set((state) => {
      const next = { ...state, passions: { ...state.passions, diet: { ...state.passions.diet, ...patch } } };
      persist(next);
      return next;
    });
  },

  updateInvestments: (patch) => {
    set((state) => {
      const next = { ...state, passions: { ...state.passions, investments: { ...state.passions.investments, ...patch } } };
      persist(next);
      return next;
    });
  },

  updatePractice: (practice, patch) => {
    set((state) => {
      const next = {
        ...state,
        passions: {
          ...state.passions,
          [practice]: { ...state.passions[practice], ...patch },
        },
      } as FortressOSState;
      persist(next);
      return next;
    });
  },

  toggleLifestyleHabit: (habit) => {
    set((state) => {
      const next = {
        ...state,
        passions: {
          ...state.passions,
          lifestyle: { ...state.passions.lifestyle, [habit]: !state.passions.lifestyle[habit] },
        },
      };
      persist(next);
      return next;
    });
  },

  updateChallenge: (kind, patch) => {
    set((state) => {
      const next = { ...state, challenges: { ...state.challenges, [kind]: { ...state.challenges[kind], ...patch } } };
      persist(next);
      return next;
    });
  },

  resetToday: () => {
    const next = createDefaultState();
    persist(next);
    set(next);
  },
}));
