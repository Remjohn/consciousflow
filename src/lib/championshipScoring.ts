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
    
    if (age >= 27) {
        isDisqualified = true;
    } else if (age === 26) {
        score = -15;
    } else if (age === 25) {
        score = -10;
    } else if (age === 24) {
        score = -5;
    } else if (age === 23) {
        score = 0;
    } else if (age === 22) {
        score = 6;
    } else if (age === 21) {
        score = 4;
    } else if (age === 20) {
        score = 2;
    } else if (age === 19) {
        score = 2;
    } else if (age <= 18) {
        score = 0;
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

// ============================================
// CANDIDATE BADGES & RANKING SYSTEM
// ============================================

export type CandidateTier = 'ELITE' | 'STRONG' | 'ACCEPTABLE' | 'WEAK' | 'DANGER';

export interface CandidateBadgeInfo {
    rank: number;
    totalCandidates: number;
    tier: CandidateTier;
    label: string;
    badgeClasses: string;
    borderHighlight: string;
    rankBadgeBg: string;
    icon: string;
}

export interface CandidateRankable {
    id: number;
    totalChampionshipScore?: number | null;
    redFlagCount?: number | null;
    isDisqualified?: boolean | null;
    isAgeDisqualified?: boolean | null;
    isArchived?: boolean | null;
}

export function getCandidateBadge(
    candidate: CandidateRankable,
    allCandidates: CandidateRankable[]
): CandidateBadgeInfo {
    const active = allCandidates
        .filter(c => !c.isArchived)
        .sort((a, b) => (b.totalChampionshipScore || 0) - (a.totalChampionshipScore || 0));

    const rankIndex = active.findIndex(c => c.id === candidate.id);
    const rank = rankIndex !== -1 ? rankIndex + 1 : active.length;
    const score = candidate.totalChampionshipScore || 0;
    const redFlags = candidate.redFlagCount || 0;
    const totalCandidates = active.length;

    if (candidate.isDisqualified || candidate.isAgeDisqualified || redFlags >= 2 || score < 0) {
        return {
            rank,
            totalCandidates,
            tier: 'DANGER',
            label: candidate.isDisqualified ? 'DISQUALIFIED' : (score < 0 ? 'CRITICAL' : 'HIGH RISK'),
            badgeClasses: 'bg-blood/20 text-blood border-blood/60',
            borderHighlight: 'border-blood/50 shadow-[0_0_12px_rgba(220,38,38,0.25)]',
            rankBadgeBg: 'bg-blood text-white font-bold',
            icon: '⚠️'
        };
    }

    if (score >= 70 && redFlags === 0) {
        return {
            rank,
            totalCandidates,
            tier: 'ELITE',
            label: rank === 1 ? 'LEADER' : 'ELITE',
            badgeClasses: 'bg-gold/20 text-gold border-gold/70 font-black',
            borderHighlight: 'border-gold/70 ring-1 ring-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.3)]',
            rankBadgeBg: rank === 1 ? 'bg-gold text-void font-black' : 'bg-gold/80 text-void font-bold',
            icon: rank === 1 ? '👑' : '⭐'
        };
    }

    if (score >= 45 && redFlags <= 1) {
        return {
            rank,
            totalCandidates,
            tier: 'STRONG',
            label: 'CONTENDER',
            badgeClasses: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60 font-bold',
            borderHighlight: 'border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
            rankBadgeBg: 'bg-emerald-600 text-white font-bold',
            icon: '💎'
        };
    }

    if (score >= 20) {
        return {
            rank,
            totalCandidates,
            tier: 'ACCEPTABLE',
            label: 'VIABLE',
            badgeClasses: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
            borderHighlight: 'border-amber-500/30',
            rankBadgeBg: 'bg-amber-600/80 text-white font-bold',
            icon: '🛡️'
        };
    }

    return {
        rank,
        totalCandidates,
        tier: 'WEAK',
        label: 'PROBATION',
        badgeClasses: 'bg-steel/30 text-concrete/70 border-steel/40',
        borderHighlight: 'border-steel/30',
        rankBadgeBg: 'bg-steel/40 text-concrete font-mono',
        icon: '⏳'
    };
}
