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

  const lifestyleHabits = os.passions.lifestyle;
  const lifestyleCompleted = Object.values(lifestyleHabits).filter(Boolean).length;
  const lifestyleTarget = Object.values(lifestyleHabits).length;

  const dietScore = percent(os.passions.diet.calories, os.passions.diet.targetCalories);
  const investmentsScore = clamp(os.passions.investments.portfolioHealth);
  const kegelScore = percent(os.passions.kegel.completed, os.passions.kegel.target);
  const singingScore = percent(os.passions.singing.minutes, os.passions.singing.targetMinutes);
  const boxingScore = percent(os.passions.boxing.minutes, os.passions.boxing.targetMinutes);
  const dancingScore = percent(os.passions.dancing.minutes, os.passions.dancing.targetMinutes);

  const fitnessMinutes = Math.min(60, (today.fitness?.pushups ?? 0) / 5 + (today.fitness?.abs ?? 0) / 5 + (today.fitness?.biceps ?? 0) / 3 + (today.fitness?.burpees ?? 0) / 3);
  const fitnessScore = Math.max(percent(fitnessMinutes, 60), Math.max(boxingScore, 0));

  const practiceScores = [dietScore, investmentsScore, kegelScore, singingScore, boxingScore, dancingScore];
  const corePassionScore = Math.round(practiceScores.reduce((sum, score) => sum + score, 0) / practiceScores.length);
  const operatorReadiness = Math.round((fitnessScore + percent(lifestyleCompleted, lifestyleTarget) + corePassionScore) / 3);

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
  };
}

export const monthlyTrend = (baseMrr: number) => {
  const base = Math.max(baseMrr, 99);
  return [0.52, 0.61, 0.69, 0.78, 0.86, 1].map((factor, index) => ({
    month: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index],
    mrr: Math.round(base * factor),
  }));
};
