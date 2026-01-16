/**
 * Championship Scoring System - Ethical Discernment Framework
 * 
 * This module implements all scoring calculations from the Championship
 * Scoring System document. It provides pure functions for computing
 * age scores, numerology scores, core metrics, and total championship scores.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type CandidateStage =
    | 'POOL'
    | 'GROUP_STAGE'
    | 'ROUND_OF_16'
    | 'QUARTER_FINALS'
    | 'SEMI_FINALS'
    | 'FINALS'
    | 'CHAMPION';

export interface CandidateMetrics {
    // Pre-screening
    age?: number;
    cuteness?: number;
    prettiness?: number;
    hotness?: number;
    cleanliness?: number;
    lifePathNumber?: number;
    birthdateNumber?: number;
    pinnacleNumber?: number;

    // Core Metrics (-10 to +10)
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
}

export interface AgeScoreResult {
    score: number;
    isDisqualified: boolean;
    reason?: string;
}

export interface NumerologyBreakdown {
    lifePathScore: number;
    birthdateScore: number;
    pinnacleScore: number;
    totalScore: number;
}

export interface ScoreBreakdown {
    preScreening: {
        ageScore: number;
        beautyScore: number;
        numerologyScore: number;
        total: number;
    };
    coreMetrics: {
        valuesAlignment: number;
        familyStructure: number;
        communicationStyle: number;
        disciplineStructure: number;
        healthHygiene: number;
        socialReputation: number;
        teachability: number;
        socialMediaConduct: number;
        total: number;
    };
    flags: {
        redFlagScore: number;
        greenFlagScore: number;
        total: number;
    };
    grandTotal: number;
}

// ============================================
// AGE SCORING (Section 2.1)
// ============================================

/**
 * Calculate age score based on the hard rules in Section 2.1
 * 
 * Age Points:
 * - 24 years → 0 points
 * - 23 years → +2 points
 * - 22 years → +6 points (optimal)
 * - 21 years → +4 points
 * - 20 years → +2 points
 * - 19 years → −10 points
 * - 18 years → −15 points
 * - Above 24 → DISQUALIFIED
 */
export const calculateAgeScore = (age: number): AgeScoreResult => {
    const SCORING_MAP: Record<number, number> = {
        24: 0,
        23: 2,
        22: 6,
        21: 4,
        20: 2,
        19: -10,
        18: -15
    };

    if (age > 24) {
        return {
            score: 0,
            isDisqualified: true,
            reason: `Age ${age} exceeds maximum threshold of 24`
        };
    }

    if (age < 18) {
        return {
            score: 0,
            isDisqualified: true,
            reason: `Age ${age} is below minimum threshold of 18`
        };
    }

    return {
        score: SCORING_MAP[age] ?? 0,
        isDisqualified: false
    };
};

/**
 * Calculate age from date of birth
 */
export const calculateAgeFromDob = (dob: string | Date): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// ============================================
// APPEARANCE SCORING (Section 2.2)
// ============================================

/**
 * Calculate beauty score from 4 categories
 * Each category: 1-5 points
 * Total range: 4-20 points
 * Minimum threshold: 14/20
 */
export const calculateBeautyScore = (
    cuteness: number,
    prettiness: number,
    hotness: number,
    cleanliness: number
): number => {
    // Validate ranges
    const clamp = (val: number) => Math.max(1, Math.min(5, val));

    return (
        clamp(cuteness) +
        clamp(prettiness) +
        clamp(hotness) +
        clamp(cleanliness)
    );
};

/**
 * Check if candidate meets minimum beauty threshold (14/20)
 */
export const meetsBeautyThreshold = (beautyScore: number): boolean => {
    return beautyScore >= 14;
};

// ============================================
// NUMEROLOGY SCORING (Section 2.3)
// ============================================

/**
 * Numerology point values for each number
 */
const NUMEROLOGY_VALUES: Record<number, number> = {
    1: 0,
    2: 10,
    3: 4,
    4: 6,
    5: -2,
    6: 10,
    7: 7,
    8: 2,
    9: 5,
    11: 10  // Master number
};

/**
 * Calculate numerology score with proper weighting:
 * - Life Path Number × 2
 * - Birthdate Number × 1
 * - Pinnacle/Destiny Number × 1
 */
export const calculateNumerologyScore = (
    lifePath: number,
    birthdate: number,
    pinnacle: number
): NumerologyBreakdown => {
    const lifePathScore = (NUMEROLOGY_VALUES[lifePath] ?? 0) * 2;
    const birthdateScore = NUMEROLOGY_VALUES[birthdate] ?? 0;
    const pinnacleScore = NUMEROLOGY_VALUES[pinnacle] ?? 0;

    return {
        lifePathScore,
        birthdateScore,
        pinnacleScore,
        totalScore: lifePathScore + birthdateScore + pinnacleScore
    };
};

/**
 * Calculate Life Path Number from date of birth
 * Reduces all digits to single digit (except 11 which is a master number)
 */
export const calculateLifePathNumber = (dob: string | Date): number => {
    const date = new Date(dob);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const reduceToSingleDigit = (num: number): number => {
        while (num > 9 && num !== 11) {
            num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
        }
        return num;
    };

    const dayReduced = reduceToSingleDigit(day);
    const monthReduced = reduceToSingleDigit(month);
    const yearReduced = reduceToSingleDigit(year);

    return reduceToSingleDigit(dayReduced + monthReduced + yearReduced);
};

/**
 * Calculate Birthdate Number (day of birth reduced)
 */
export const calculateBirthdateNumber = (dob: string | Date): number => {
    const date = new Date(dob);
    const day = date.getDate();

    let num = day;
    while (num > 9 && num !== 11) {
        num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
    }
    return num;
};

// ============================================
// CORE METRICS SCORING (Section 3)
// ============================================

/**
 * Validate that a metric value is within the -10 to +10 range
 */
export const validateMetricValue = (value: number): number => {
    return Math.max(-10, Math.min(10, value));
};

/**
 * Calculate total core metrics score
 * Includes all 7 behavioral metrics + social media conduct
 */
export const calculateCoreMetricsScore = (metrics: CandidateMetrics): number => {
    return (
        validateMetricValue(metrics.valuesAlignment) +
        validateMetricValue(metrics.familyStructure) +
        validateMetricValue(metrics.communicationStyle) +
        validateMetricValue(metrics.disciplineStructure) +
        validateMetricValue(metrics.healthHygiene) +
        validateMetricValue(metrics.socialReputation) +
        validateMetricValue(metrics.teachability) +
        validateMetricValue(metrics.socialMediaConduct)
    );
};

// ============================================
// FLAG SCORING (Section 6)
// ============================================

/**
 * Red Flag Categories (Section 6.1)
 * Each confirmed red flag = -10 points
 */
export const RED_FLAG_CATEGORIES = [
    'SHARING_PRIVATE_INFO',
    'FINANCIAL_ENTITLEMENT',
    'SEXUALIZED_ESCALATION',
    'DISRESPECT_AUTHORITY',
    'MANIPULATION_GUILT_TRIPPING',
    'TESTING_BEHAVIOR',
    'OTHER'
] as const;

export type RedFlagCategory = typeof RED_FLAG_CATEGORIES[number];

/**
 * Green Flag Categories (Section 6.2)
 * Each observed green flag = +6 points
 */
export const GREEN_FLAG_CATEGORIES = [
    'STRONG_FAMILY_ORIENTATION',
    'TENDERNESS_SOFTNESS',
    'ALTRUISM_CARING',
    'GENUINE_DESIRE_EFFORT',
    'NO_MALE_FRIENDS',
    'COOKING_DOMESTIC_PRIDE',
    'EXCEPTIONAL_TASTE',
    'OTHER'
] as const;

export type GreenFlagCategory = typeof GREEN_FLAG_CATEGORIES[number];

export const RED_FLAG_POINTS = -10;
export const GREEN_FLAG_POINTS = 6;

/**
 * Calculate flag scores
 */
export const calculateFlagScores = (
    redFlagCount: number,
    greenFlagCount: number
): { redScore: number; greenScore: number; netScore: number } => {
    const redScore = redFlagCount * RED_FLAG_POINTS;
    const greenScore = greenFlagCount * GREEN_FLAG_POINTS;

    return {
        redScore,
        greenScore,
        netScore: redScore + greenScore
    };
};

// ============================================
// TOTAL SCORE CALCULATION
// ============================================

/**
 * Calculate complete score breakdown for a candidate
 */
export const calculateTotalScore = (
    metrics: CandidateMetrics,
    beautyScore: number = 0,
    ageScore: number = 0,
    numerologyScore: number = 0
): ScoreBreakdown => {
    const preScreeningTotal = ageScore + beautyScore + numerologyScore;
    const coreMetricsTotal = calculateCoreMetricsScore(metrics);
    const { redScore, greenScore, netScore: flagTotal } = calculateFlagScores(
        metrics.redFlagCount,
        metrics.greenFlagCount
    );

    return {
        preScreening: {
            ageScore,
            beautyScore,
            numerologyScore,
            total: preScreeningTotal
        },
        coreMetrics: {
            valuesAlignment: metrics.valuesAlignment,
            familyStructure: metrics.familyStructure,
            communicationStyle: metrics.communicationStyle,
            disciplineStructure: metrics.disciplineStructure,
            healthHygiene: metrics.healthHygiene,
            socialReputation: metrics.socialReputation,
            teachability: metrics.teachability,
            socialMediaConduct: metrics.socialMediaConduct,
            total: coreMetricsTotal
        },
        flags: {
            redFlagScore: redScore,
            greenFlagScore: greenScore,
            total: flagTotal
        },
        grandTotal: preScreeningTotal + coreMetricsTotal + flagTotal
    };
};

// ============================================
// STAGE PROGRESSION RULES
// ============================================

/**
 * Check if candidate can advance to next stage
 */
export const canAdvanceStage = (
    currentStage: CandidateStage,
    totalScore: number,
    redFlagCount: number,
    parentalApproval: boolean
): { canAdvance: boolean; reason?: string } => {
    // Cannot advance with red flags in late stages
    if (currentStage === 'SEMI_FINALS' && redFlagCount > 0) {
        return {
            canAdvance: false,
            reason: 'Cannot advance to Finals with any red flags'
        };
    }

    // Final decision rule: Must have parental approval
    if (currentStage === 'FINALS' && !parentalApproval) {
        return {
            canAdvance: false,
            reason: 'Parental approval required for Champion selection'
        };
    }

    // General score thresholds per stage
    const STAGE_THRESHOLDS: Partial<Record<CandidateStage, number>> = {
        'GROUP_STAGE': 10,
        'ROUND_OF_16': 20,
        'QUARTER_FINALS': 35,
        'SEMI_FINALS': 50,
        'FINALS': 70,
        'CHAMPION': 90
    };

    const nextStageThreshold = getNextStage(currentStage);
    if (nextStageThreshold && STAGE_THRESHOLDS[nextStageThreshold]) {
        const threshold = STAGE_THRESHOLDS[nextStageThreshold]!;
        if (totalScore < threshold) {
            return {
                canAdvance: false,
                reason: `Score ${totalScore} below threshold ${threshold} for ${nextStageThreshold}`
            };
        }
    }

    return { canAdvance: true };
};

/**
 * Get next stage in progression
 */
export const getNextStage = (current: CandidateStage): CandidateStage | null => {
    const ORDER: CandidateStage[] = [
        'POOL',
        'GROUP_STAGE',
        'ROUND_OF_16',
        'QUARTER_FINALS',
        'SEMI_FINALS',
        'FINALS',
        'CHAMPION'
    ];

    const index = ORDER.indexOf(current);
    if (index === -1 || index === ORDER.length - 1) return null;
    return ORDER[index + 1];
};

/**
 * Get previous stage
 */
export const getPreviousStage = (current: CandidateStage): CandidateStage | null => {
    const ORDER: CandidateStage[] = [
        'POOL',
        'GROUP_STAGE',
        'ROUND_OF_16',
        'QUARTER_FINALS',
        'SEMI_FINALS',
        'FINALS',
        'CHAMPION'
    ];

    const index = ORDER.indexOf(current);
    if (index <= 0) return null;
    return ORDER[index - 1];
};

// ============================================
// QUESTION-BASED EVALUATION (Section 5)
// ============================================

/**
 * Standard question templates for evaluation
 */
export const EVALUATION_QUESTIONS = [
    {
        id: 'marriage_seriousness',
        question: 'What makes someone serious for marriage today?',
        mappedMetrics: ['valuesAlignment', 'disciplineStructure']
    },
    {
        id: 'good_women_ruins',
        question: 'What do you think ruins good women?',
        mappedMetrics: ['valuesAlignment', 'socialReputation']
    },
    {
        id: 'married_couples_admiration',
        question: 'What do you admire in married couples you respect?',
        mappedMetrics: ['familyStructure', 'valuesAlignment']
    }
] as const;

/**
 * Detect inconsistency between responses
 */
export const detectInconsistency = (
    responses: Array<{ questionId: string; sentiment: 'positive' | 'neutral' | 'negative' }>
): boolean => {
    // Simple inconsistency detection: contradicting sentiments on related questions
    const valueResponses = responses.filter(r =>
        r.questionId === 'marriage_seriousness' || r.questionId === 'good_women_ruins'
    );

    if (valueResponses.length >= 2) {
        const hasPositive = valueResponses.some(r => r.sentiment === 'positive');
        const hasNegative = valueResponses.some(r => r.sentiment === 'negative');
        return hasPositive && hasNegative;
    }

    return false;
};
