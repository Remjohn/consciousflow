export const RED_FLAG_POINTS = -10;
export const GREEN_FLAG_POINTS = 6;

export interface CandidateMetrics {
    valuesAlignment: number;
    familyStructure: number;
    communicationStyle: number;
    disciplineStructure: number;
    healthHygiene: number;
    socialReputation: number;
    teachability: number;
    socialMediaConduct: number;
    redFlagCount?: number;
    greenFlagCount?: number;
}

export function calculateAgeFromDob(dob: string | Date): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function calculateAgeScore(age: number): { score: number, isDisqualified: boolean } {
    let score = 0;
    let isDisqualified = false;
    
    if (age > 24) {
        isDisqualified = true;
    } else if (age === 24) {
        score = 0;
    } else if (age === 23) {
        score = 2;
    } else if (age === 22) {
        score = 6;
    } else if (age === 21) {
        score = 4;
    } else if (age === 20) {
        score = 2;
    } else if (age === 19) {
        score = -10;
    } else if (age <= 18) {
        score = -15;
    }
    
    return { score, isDisqualified };
}

export function calculateBeautyScore(cuteness: number, prettiness: number, hotness: number, cleanliness: number): number {
    return cuteness + prettiness + hotness + cleanliness;
}

export function meetsBeautyThreshold(beautyScore: number): boolean {
    return beautyScore >= 14;
}

export function calculateNumerologyScore(lifePathNumber: number, birthdateNumber: number, pinnacleNumber: number): { totalScore: number } {
    const numValues: Record<number, number> = {
        1: 0, 2: 10, 3: 4, 4: 6, 5: -2, 6: 10, 7: 7, 8: 2, 9: 5, 11: 10
    };
    
    const lpScore = (numValues[lifePathNumber] || 0) * 2;
    const bdScore = (numValues[birthdateNumber] || 0) * 1;
    const pinScore = (numValues[pinnacleNumber] || 0) * 1;
    // Expression number is skipped for now as per index.ts logic
    
    return { totalScore: lpScore + bdScore + pinScore };
}

export function calculateCoreMetricsScore(metrics: CandidateMetrics): number {
    return (
        (metrics.valuesAlignment || 0) +
        (metrics.familyStructure || 0) +
        (metrics.communicationStyle || 0) +
        (metrics.disciplineStructure || 0) +
        (metrics.healthHygiene || 0) +
        (metrics.socialReputation || 0) +
        (metrics.teachability || 0) +
        (metrics.socialMediaConduct || 0)
    );
}

export function calculateFlagScores(redCount: number, greenCount: number): { redScore: number, greenScore: number, netScore: number } {
    const redScore = redCount * RED_FLAG_POINTS;
    const greenScore = greenCount * GREEN_FLAG_POINTS;
    return {
        redScore,
        greenScore,
        netScore: redScore + greenScore
    };
}

export function calculateTotalScore(
    preScreening: number,
    coreMetrics: number,
    questionsScore: number,
    flagsNet: number,
    adjustments: number
): number {
    return preScreening + coreMetrics + questionsScore + flagsNet + adjustments;
}

export function canAdvanceStage(totalScore: number, redFlagCount: number): boolean {
    // Basic logic based on framework: no red flags to advance to finals.
    // DANGER threshold is 0.
    if (totalScore <= 0 || redFlagCount > 0) return false;
    return true;
}
