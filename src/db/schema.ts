import { pgTable, serial, text, integer, decimal, boolean, timestamp, date, time } from 'drizzle-orm/pg-core';

// Users Table (The King)
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    lifePath: integer('life_path').default(8),
    currentBalance: decimal('current_balance').default('0'), // The $5000 tracker
    videosTotal: integer('videos_total').default(0), // Lifetime videos
    location: text('location').default('Europe'), // 'Europe' | 'DRC'
    lastPunishmentDate: timestamp('last_punishment_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Challenges Table (The War Campaign)
export const challenges = pgTable('challenges', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    name: text('name').notNull(),
    targetVideos: integer('target_videos').notNull().default(200),
    targetDays: integer('target_days').notNull().default(40),
    dailyPushupsRequired: integer('daily_pushups_required').notNull().default(250),
    dailyAbsRequired: integer('daily_abs_required').notNull().default(250),
    startTimeDeadline: text('start_time_deadline').notNull().default('05:45'),
    minVideosPerTwoDays: integer('min_videos_per_2_days').notNull().default(8),
    startDate: date('start_date').notNull(),
    status: text('status').default('ACTIVE'), // ACTIVE, COMPLETED, FAILED
    failureReason: text('failure_reason'),
    failedAt: date('failed_at'),
    completedAt: date('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Daily Logs (The Production Line)
export const dailyLogs = pgTable('daily_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    challengeId: integer('challenge_id').references(() => challenges.id),
    date: date('date').notNull(),

    // Production
    videosProduced: integer('videos_produced').default(0),
    videosGoal: integer('videos_goal').default(5),
    pomodoros: integer('pomodoros').default(0),
    proofPhotoUrl: text('proof_photo_url'),

    // Fitness
    pushups: integer('pushups').default(0),
    abs: integer('abs').default(0),
    biceps: integer('biceps').default(0),
    burpees: integer('burpees').default(0),
    fitnessComplete: boolean('fitness_complete').default(false),

    // Lifestyle
    sleepHours: decimal('sleep_hours').default('0'),
    meditation: boolean('meditation').default(false),
    noSocialMedia: boolean('no_social_media').default(false),
    noYouTube: boolean('no_youtube').default(false),

    // Timing
    firstActivityTime: time('first_activity_time'),

    // Status
    isWin: boolean('is_win').default(false),
    isPunished: boolean('is_punished').default(false),
    showerCompleted: boolean('shower_completed').default(false),

    // Journal
    journalEntry: text('journal_entry'),
    aiResponse: text('ai_response'),
    aiMood: text('ai_mood'), // DOMINATION, ACCEPTABLE, DISGRACE, REDEMPTION
});

// Goals Table (The Targets)
export const goals = pgTable('goals', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    type: text('type').notNull(), // DAILY, WEEKLY, MONTHLY, YEARLY
    category: text('category').notNull(), // videos, revenue, pushups, etc.
    targetValue: integer('target_value').notNull(),
    currentValue: integer('current_value').default(0),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: text('status').default('ACTIVE'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Candidates (The Championship) - Full Ethical Discernment Framework
export const candidates = pgTable('candidates', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    name: text('name').notNull(),
    nickname: text('nickname'),
    dob: date('dob'),
    photoUrl: text('photo_url'),
    stage: text('stage').default('POOL'), // POOL, GROUP_STAGE, ROUND_OF_16, QUARTER_FINALS, SEMI_FINALS, FINALS, CHAMPION

    // === PRE-SCREENING LAYER (Section 2) ===

    // Age Data (Hard Rule - Section 2.1)
    age: integer('age'), // Calculated from dob
    ageScore: integer('age_score').default(0), // Range: -15 to +6
    isAgeDisqualified: boolean('is_age_disqualified').default(false),

    // Appearance Rating (Section 2.2) - 4 Categories, 1-5 each
    cuteness: integer('cuteness'), // 1-5
    prettiness: integer('prettiness'), // 1-5
    hotness: integer('hotness'), // 1-5
    cleanliness: integer('cleanliness'), // 1-5
    beautyScore: integer('beauty_score'), // Sum: 0-20
    beautyLocked: boolean('beauty_locked').default(false), // Fixed after 2 encounters
    encounterCount: integer('encounter_count').default(0),

    // Numerology Filter (Section 2.3)
    lifePathNumber: integer('life_path_number'), // 1-9, 11
    birthdateNumber: integer('birthdate_number'),
    pinnacleNumber: integer('pinnacle_number'),
    numerologyScore: integer('numerology_score').default(0), // Weighted sum

    // === CORE CHAMPIONSHIP METRICS (Section 3) ===
    // Each: -10 to +10 scale

    valuesAlignment: integer('values_alignment').default(0),
    familyStructure: integer('family_structure').default(0),
    communicationStyle: integer('communication_style').default(0),
    disciplineStructure: integer('discipline_structure').default(0),
    healthHygiene: integer('health_hygiene').default(0),
    socialReputation: integer('social_reputation').default(0),
    teachability: integer('teachability').default(0),

    // === SOCIAL MEDIA METRIC (Section 4) ===
    socialMediaConduct: integer('social_media_conduct').default(0), // -10 to +10

    // === FLAG TRACKING (Section 6) ===
    redFlagCount: integer('red_flag_count').default(0),
    greenFlagCount: integer('green_flag_count').default(0),
    redFlagScore: integer('red_flag_score').default(0), // redFlagCount * -10
    greenFlagScore: integer('green_flag_score').default(0), // greenFlagCount * +6

    // === COMPUTED SCORES ===
    preScreeningScore: integer('pre_screening_score').default(0), // Age + Beauty + Numerology
    coreMetricsScore: integer('core_metrics_score').default(0), // Sum of 8 core metrics
    questionsScore: integer('questions_score').default(0), // 12 Core Questions (each +7/-7, max 84)
    totalChampionshipScore: integer('total_championship_score').default(0), // Grand total

    // === FINAL DECISION RULE (Section 8) ===
    parentalApproval: boolean('parental_approval').default(false),

    // === SOCIAL PROFILE LINKS (Section 4 - Monitoring) ===
    tiktokUrl: text('tiktok_url'),
    instagramUrl: text('instagram_url'),
    facebookUrl: text('facebook_url'),

    // === MANUAL ADJUSTMENTS ===
    bonusPoints: integer('bonus_points').default(0),
    penaltyPoints: integer('penalty_points').default(0),

    // === ARCHIVAL & STATUS ===
    isArchived: boolean('is_archived').default(false),
    archiveReason: text('archive_reason'),
    isDisqualified: boolean('is_disqualified').default(false),
    disqualificationReason: text('disqualification_reason'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Candidate Flags (Red Flag / Green Flag Event Tracking - Section 6)
export const candidateFlags = pgTable('candidate_flags', {
    id: serial('id').primaryKey(),
    candidateId: integer('candidate_id').references(() => candidates.id),
    flagType: text('flag_type').notNull(), // 'RED' | 'GREEN'
    category: text('category').notNull(), // Documented categories from framework
    description: text('description').notNull(),
    points: integer('points').notNull(), // -10 for red, +6 for green
    observedAt: timestamp('observed_at').defaultNow(),
    verifiedBy: text('verified_by').default('OBSERVED'), // 'OBSERVED' | 'CLAIMED'
    notes: text('notes'),
});

// Core Test Questions Template (12 Standardized Questions - Section 5)
export const coreTestQuestions = pgTable('core_test_questions', {
    id: serial('id').primaryKey(),
    questionId: text('question_id').notNull().unique(), // Q1, Q2, ... Q12
    questionFr: text('question_fr').notNull(), // French text
    questionEn: text('question_en'), // English translation
    mappedMetric: text('mapped_metric').notNull(), // 'valuesAlignment', 'communication', etc.
    scoringRules: text('scoring_rules').notNull(), // JSON: scoring criteria
});

// Candidate Questions (Question-Based Evaluation - Section 5)
export const candidateQuestions = pgTable('candidate_questions', {
    id: serial('id').primaryKey(),
    candidateId: integer('candidate_id').references(() => candidates.id),
    questionId: text('question_id').notNull(), // Q1, Q2, ... Q12
    rawAnswer: text('raw_answer').notNull(),
    interpretedScore: integer('interpreted_score').notNull(), // Result: -10 to +10
    mappedMetric: text('mapped_metric'), // Which metric this affects
    askedAt: timestamp('asked_at').defaultNow(),
    inconsistencyFlag: boolean('inconsistency_flag').default(false),
    inconsistencyWith: text('inconsistency_with'), // Reference to conflicting Q#
    notes: text('notes'),
});

// Candidate Logs (The Interaction Ledger)
export const candidateLogs = pgTable('candidate_logs', {
    id: serial('id').primaryKey(),
    candidateId: integer('candidate_id').references(() => candidates.id),
    activityType: text('activity_type').notNull(), // DATE, CHAT, CALL, GIFT, INTIMACY, GHOST
    points: integer('points').notNull(),
    notes: text('notes'),
    date: timestamp('date').defaultNow(),
});

// Bonus/Penalty Log (Manual Adjustments)
export const candidateAdjustments = pgTable('candidate_adjustments', {
    id: serial('id').primaryKey(),
    candidateId: integer('candidate_id').references(() => candidates.id),
    adjustmentType: text('adjustment_type').notNull(), // 'BONUS' | 'PENALTY'
    points: integer('points').notNull(),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// INVESTMENT TRACKER (The Acquisition Pipeline)
// ============================================
export const investments = pgTable('investments', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),

    // Core Fields
    title: text('title').notNull(),
    description: text('description'), // The "WHY" - functional improvement
    price: decimal('price').notNull(), // Total price (or computed from sub-items)
    priority: text('priority').default('MEDIUM'), // LOW, MEDIUM, HIGH, CRITICAL
    category: text('category').default('GENERAL'), // TECH, VEHICLE, HEALTH, GROCERY, LIFESTYLE, BUSINESS
    imageUrl: text('image_url'),

    // Hierarchy (Master/Sub-Item)
    parentId: integer('parent_id'), // Self-reference for sub-items
    isRecurring: boolean('is_recurring').default(false),
    recurringInterval: text('recurring_interval'), // WEEKLY, MONTHLY

    // Status Tracking
    status: text('status').default('PENDING'), // PENDING, AFFORDABLE, PURCHASED, ARCHIVED
    purchasedAt: date('purchased_at'),
    targetDate: date('target_date'), // When user aims to purchase

    // Quantity/Unit (for sub-items)
    quantity: integer('quantity').default(1),
    unitPrice: decimal('unit_price'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// ============================================
// FITNESS PROTOCOL V2 (4×25 Pomodoro System)
// ============================================

// Fitness Sessions (Each 25-min Pomodoro workout)
export const fitnessSessions = pgTable('fitness_sessions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    date: date('date').notNull(),

    // Session Type
    sessionType: text('session_type').notNull(), // PUSHUPS, ABS, BICEPS, CARDIO

    // Timing
    scheduledTime: text('scheduled_time'), // 07:00, 10:30, 15:00, 19:00
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    durationMinutes: integer('duration_minutes').default(25),

    // Performance Metrics
    totalReps: integer('total_reps').default(0),
    variations: text('variations'), // JSON: [{name, reps}]
    avgHeartRate: integer('avg_heart_rate'),
    perceivedExertion: integer('perceived_exertion'), // 1-10 RPE scale

    // Status
    status: text('status').default('SCHEDULED'), // SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED
    notes: text('notes'),

    createdAt: timestamp('created_at').defaultNow()
});

// Body Metrics (Progression Tracking)
export const bodyMetrics = pgTable('body_metrics', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    date: date('date').notNull(),

    // Body Composition
    weight: decimal('weight'), // kg
    bodyFat: decimal('body_fat'), // percentage

    // Measurements (cm)
    chest: decimal('chest'),
    waist: decimal('waist'),
    hips: decimal('hips'),
    bicepLeft: decimal('bicep_left'),
    bicepRight: decimal('bicep_right'),
    thighLeft: decimal('thigh_left'),
    thighRight: decimal('thigh_right'),

    // Performance Benchmarks
    maxPushups: integer('max_pushups'), // single set to failure
    maxPlank: integer('max_plank'), // seconds
    maxJumpRope: integer('max_jump_rope'), // continuous jumps

    // Progress Photos
    photoFront: text('photo_front'),
    photoSide: text('photo_side'),
    photoBack: text('photo_back'),

    createdAt: timestamp('created_at').defaultNow()
});
