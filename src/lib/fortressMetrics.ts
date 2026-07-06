import type { Metrics } from '../store/useUserStore';
import type { FortressOSState } from '../store/useFortressOSStore';

export const SAMPLE_TRIAL_PRICE = 29;
export const MONTHLY_PACKAGE_PRICE = 99;

export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
export const percent = (value: number, target: number) => (target <= 0 ? 0 : clamp(Math.round((value / target) * 100)));
export const money = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);

export const compactNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number.isFinite(value) ? value : 0);

export function deriveSnapshot(today: Metrics, os: Pick<FortressOSState, 'studio' | 'passions' | 'challenges'>) {
  const sampleVideosDelivered = Math.max(os.studio.sampleVideosDelivered, today.production?.videos ?? 0);
  const managementSessions = Math.max(os.studio.managementSessions, today.production?.managementSessions ?? 0);
  const sampleVideoTrials = os.studio.sampleVideoTrials;
  const activeMonthlyPackages = os.studio.activeMonthlyPackages;
  const interviewSessions = os.studio.interviewSessions;

  const mrr = activeMonthlyPackages * MONTHLY_PACKAGE_PRICE;
  const trialRevenue = sampleVideoTrials * SAMPLE_TRIAL_PRICE;
  const totalTrackedRevenue = mrr + trialRevenue;

  const coldShowerActive = os.passions.lifestyle.coldShower || today.lifestyle?.coldShower || false;

  const lifestyleHabits = os.passions.lifestyle;
  const lifestyleCompleted =
    (lifestyleHabits.water ? 1 : 0) +
    (lifestyleHabits.read ? 1 : 0) +
    (lifestyleHabits.meditate ? 1 : 0) +
    (lifestyleHabits.journal ? 1 : 0) +
    (coldShowerActive ? 1 : 0);
  const lifestyleTarget = Object.values(lifestyleHabits).length;

  const dietScore = percent(os.passions.diet.calories, os.passions.diet.targetCalories);
  const investmentsScore = clamp(os.passions.investments.portfolioHealth);

  const kegelMinutes = Math.max(os.passions.kegel.minutes, today.fitness?.kegels ?? 0);
  const kegelScore = percent(kegelMinutes, os.passions.kegel.targetMinutes);

  const singingMinutes = Math.max(os.passions.singing.minutes, today.fitness?.singing ?? 0);
  const singingScore = percent(singingMinutes, os.passions.singing.targetMinutes);

  const boxingMinutes = Math.max(os.passions.boxing.minutes, today.fitness?.boxing ?? 0);
  const boxingScore = percent(boxingMinutes, os.passions.boxing.targetMinutes);

  const dancingMinutes = Math.max(os.passions.dancing.minutes, today.fitness?.dancing ?? 0);
  const dancingScore = percent(dancingMinutes, os.passions.dancing.targetMinutes);

  const strengthMinutes = (today.fitness?.pushups ?? 0) / 5 + (today.fitness?.pullups ?? 0) / 2 + (today.fitness?.abs ?? 0) / 5 + (today.fitness?.jumpSquats ?? 0) / 3;
  const cardioMinutes = (today.fitness?.swimLaps ?? 0) + (today.fitness?.footballMins ?? 0) + (today.fitness?.jumpRopeMins ?? 0) + (today.fitness?.runningMins ?? 0);
  const fitnessMinutes = Math.min(60, strengthMinutes + cardioMinutes);
  const fitnessScore = percent(fitnessMinutes, 60);

  const practiceScores = [dietScore, investmentsScore, kegelScore, singingScore, boxingScore, dancingScore];
  const corePassionScore = Math.round(practiceScores.reduce((sum, score) => sum + score, 0) / practiceScores.length);
  const operatorReadiness = Math.round((fitnessScore + percent(lifestyleCompleted, lifestyleTarget) + corePassionScore) / 3);

  const kegelCompleted = Math.max(os.passions.kegel.completed, Math.floor(kegelMinutes / 3));
  const singingCompleted = Math.max(os.passions.singing.completed, Math.floor(singingMinutes / 5));
  const boxingCompleted = Math.max(os.passions.boxing.completed, Math.floor(boxingMinutes / 5));
  const dancingCompleted = Math.max(os.passions.dancing.completed, Math.floor(dancingMinutes / 5));

  return {
    sampleVideosDelivered,
    sampleVideosTarget: os.studio.sampleVideosTarget,
    sampleVideoTrials,
    activeMonthlyPackages,
    interviewSessions,
    interviewTarget: os.studio.interviewTarget,
    managementSessions,
    managementTarget: os.studio.managementTarget,
    blockedClients: os.studio.blockedClients,
    mrr,
    trialRevenue,
    totalTrackedRevenue,
    lifestyleCompleted,
    lifestyleTarget,
    dietScore,
    investmentsScore,
    kegelScore,
    singingScore,
    boxingScore,
    dancingScore,
    fitnessMinutes,
    fitnessScore,
    corePassionScore,
    operatorReadiness,
    kegelMinutes,
    singingMinutes,
    boxingMinutes,
    dancingMinutes,
    coldShowerActive,
    kegelCompleted,
    singingCompleted,
    boxingCompleted,
    dancingCompleted,
  };
}

export const monthlyTrend = (baseMrr: number) => {
  const base = Math.max(baseMrr, 99);
  return [0.52, 0.61, 0.69, 0.78, 0.86, 1].map((factor, index) => ({
    month: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index],
    mrr: Math.round(base * factor),
  }));
};
