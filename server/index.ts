// ISOMORPHIC SERVER: Works in both Node.js (local) and Netlify Functions (Lambda)
// NOTE: No top-level await - CommonJS compatible

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '../src/db';
import { users, dailyLogs, challenges, goals, candidates, candidateLogs, candidateFlags, candidateQuestions, candidateAdjustments, coreTestQuestions, deepWorkSessions, acquisitionBatches } from '../src/db/schema';
import { desc, eq, gte, and, sql } from 'drizzle-orm';
import { subDays, differenceInDays, format } from 'date-fns';
import {
    calculateAgeScore, calculateAgeFromDob, calculateBeautyScore,
    meetsBeautyThreshold, calculateNumerologyScore, calculateCoreMetricsScore,
    calculateTotalScore, calculateFlagScores, canAdvanceStage,
    RED_FLAG_POINTS, GREEN_FLAG_POINTS,
    type CandidateMetrics
} from '../src/lib/championshipScoring';
import { setupTelegramBot } from './telegram';

const app = new Hono();
app.use('/*', cors());

// Initialize Telegram Bot Uplink
setupTelegramBot();

// Initialize Mistral (using native fetch to avoid extra deps)
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// ============================================
// CHAMPIONSHIP SCORE CONSTANTS
// ============================================
const CHAMPIONSHIP_SCORE_CONFIG = {
    MAX_PRE_SCREENING: 66,    // Age +6, Beauty 20, Numerology ~40
    MAX_CORE_METRICS: 80,     // 8 metrics × +10
    MAX_QUESTIONS_SCORE: 84,  // 12 questions × +7
    MAX_GREEN_FLAGS: 42,      // 7 categories × +6
    THEORETICAL_MAX: 272,     // Total maximum without bonus (66+80+84+42)
    THRESHOLDS: {
        ELITE: 200,           // Finals material (updated for higher max)
        STRONG: 150,          // Semi-Finals/Quarter-Finals
        ACCEPTABLE: 100,      // Group Stage
        WEAK: 50,             // Pool, needs work
        DANGER: 0             // Red flags dominating
    }
};

// ============================================
// CENTRALIZED SCORE RECALCULATION
// ============================================
async function recalculateCandidateScore(candidateId: number) {
    const current = await db.select().from(candidates).where(eq(candidates.id, candidateId));
    if (current.length === 0) return null;
    const c = current[0];

    // Pre-Screening = Age + Beauty + Numerology
    const preScreening = (c.ageScore || 0) + (c.beautyScore || 0) + (c.numerologyScore || 0);

    // Core Metrics = Sum of all 8 metrics (-10 to +10 each, max 80)
    const coreMetrics = (c.valuesAlignment || 0) + (c.familyStructure || 0) +
        (c.communicationStyle || 0) + (c.disciplineStructure || 0) +
        (c.healthHygiene || 0) + (c.socialReputation || 0) +
        (c.teachability || 0) + (c.socialMediaConduct || 0);

    // 12 Core Questions Score = Sum of interpretedScore from answers (+7/-7 each, max 84)
    const questionAnswers = await db.select()
        .from(candidateQuestions)
        .where(eq(candidateQuestions.candidateId, candidateId));
    const questionsScore = questionAnswers.reduce((sum, q) => sum + (q.interpretedScore || 0), 0);

    // Flags = Green flags (positive) + Red flags (negative)
    const flagsNet = (c.greenFlagScore || 0) + (c.redFlagScore || 0);

    // Manual Adjustments = Bonus - Penalty
    const adjustments = (c.bonusPoints || 0) - (c.penaltyPoints || 0);

    // Grand Total = Pre-Screening + Core Metrics + Questions + Flags + Adjustments
    const grandTotal = preScreening + coreMetrics + questionsScore + flagsNet + adjustments;

    await db.update(candidates).set({
        preScreeningScore: preScreening,
        coreMetricsScore: coreMetrics,
        questionsScore: questionsScore,
        totalChampionshipScore: grandTotal
    }).where(eq(candidates.id, candidateId));

    return { preScreening, coreMetrics, questionsScore, flagsNet, adjustments, grandTotal };
}

// Auto-calculate numerology from DOB
function autoCalculateNumerology(dob: string | Date) {
    const date = new Date(dob);
    const lifePathNumber = calculateLifePathNumber(date);
    const birthdateNumber = calculateBirthdateNumber(date);
    const numScore = calculateNumerologyScore(lifePathNumber, birthdateNumber, 0); // Pinnacle = 0 until manually set

    return {
        lifePathNumber,
        birthdateNumber,
        pinnacleNumber: 0, // Requires manual input or complex calculation
        numerologyScore: numScore.totalScore
    };
}

// Helper: Calculate Life Path Number
function calculateLifePathNumber(dob: Date): number {
    const reduceToSingleDigit = (num: number): number => {
        if (num === 11) return 11; // Master number
        if (num < 10) return num;
        return reduceToSingleDigit(String(num).split('').reduce((sum, d) => sum + parseInt(d), 0));
    };

    const year = dob.getFullYear();
    const month = dob.getMonth() + 1;
    const day = dob.getDate();

    const yearSum = reduceToSingleDigit(String(year).split('').reduce((sum, d) => sum + parseInt(d), 0));
    const monthSum = reduceToSingleDigit(month);
    const daySum = reduceToSingleDigit(day);

    return reduceToSingleDigit(yearSum + monthSum + daySum);
}

// Helper: Calculate Birthdate Number
function calculateBirthdateNumber(dob: Date): number {
    const day = dob.getDate();
    if (day === 11) return 11;
    if (day < 10) return day;
    return String(day).split('').reduce((sum, d) => sum + parseInt(d), 0);
}

app.get('/', (c) => {
    return c.text('The Fortress API is Online');
});

// Health check - doesn't use database, returns env status
app.get('/api/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            NETLIFY: !!process.env.NETLIFY,
            DATABASE_URL_SET: !!process.env.DATABASE_URL,
            MISTRAL_API_KEY_SET: !!process.env.MISTRAL_API_KEY,
            NODE_ENV: process.env.NODE_ENV || 'not set'
        }
    });
});

// GET: List of cover images
app.get('/api/covers', async (c) => {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');
        
        if (!fs.existsSync(COVERS_DIR)) {
            // Fallback list for production/Netlify environment where local public folder is not package-accessible
            return c.json({ 
                images: [
                    'BG Alchemic Planner maydo.png',
                    'Kimy.png'
                ] 
            });
        }
        
        const files = fs.readdirSync(COVERS_DIR);
        // filter only images
        const images = files.filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f));
        return c.json({ images });
    } catch (error) {
        console.error('Covers error:', error);
        return c.json({ error: 'Failed to read covers', images: [] }, 500);
    }
});

// POST: Upload Candidate Photo
// NOTE: File uploads only work locally. On Netlify, use external storage (S3, Cloudinary)
app.post('/api/upload/photo', async (c) => {
    try {
        // File uploads don't work on Netlify (read-only filesystem)
        if (process.env.NETLIFY) {
            return c.json({ error: 'File uploads not supported in production. Use image URL instead.' }, 400);
        }

        const body = await c.req.parseBody();
        const file = body['photo'];

        if (!file || !(file instanceof File)) {
            return c.json({ error: 'No file uploaded' }, 400);
        }

        // Dynamic imports for local development only
        const fs = await import('fs');
        const path = await import('path');
        const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `candidate_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filepath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${filename}`;
        return c.json({ url: publicUrl, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return c.json({ error: 'Upload failed' }, 500);
    }
});

// GET: Mission Status (Syncs frontend store with DB)
app.get('/api/mission/status', async (c) => {
    // Hardcoded for 'Emilio' (ID 1) for now
    const user = await db.select().from(users).limit(1);
    return c.json(user[0] || { status: 'No User Found' });
});

// POST: Mission Log (The Core Logic)
app.post('/api/mission/log', async (c) => {
    const body = await c.req.json();
    const { journalEntry, stats } = body;

    // 1. Fetch Context (Last 7 Days)
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const recentLogs = await db
        .select()
        .from(dailyLogs)
        .where(gte(dailyLogs.date, sevenDaysAgo.toISOString().split('T')[0]))
        .orderBy(desc(dailyLogs.date));

    // 2. Get active challenge info
    const activeChallenge = await db.select()
        .from(challenges)
        .where(and(eq(challenges.userId, 1), eq(challenges.status, 'ACTIVE')))
        .limit(1);

    let challengeContext = 'NO ACTIVE CHALLENGE - You are operating without structure. This is UNACCEPTABLE.';
    let dayNumber = 0;
    let challengeVideos = 0;
    let daysRemaining = 0;
    let paceRequired = 5;

    if (activeChallenge.length > 0) {
        const ch = activeChallenge[0];
        const startDate = new Date(ch.startDate);
        const today = new Date();
        dayNumber = differenceInDays(today, startDate) + 1;
        daysRemaining = (ch.targetDays || 40) - dayNumber;

        // Get challenge logs
        const chLogs = await db.select().from(dailyLogs)
            .where(eq(dailyLogs.challengeId, ch.id));
        challengeVideos = chLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
        paceRequired = Math.ceil(((ch.targetVideos || 200) - challengeVideos) / Math.max(1, daysRemaining));

        challengeContext = `
CHALLENGE: ${ch.name}
DAY: ${dayNumber} of ${ch.targetDays}
PROGRESS: ${challengeVideos}/${ch.targetVideos} videos (${Math.round(challengeVideos / (ch.targetVideos || 200) * 100)}%)
DAYS REMAINING: ${daysRemaining}
REQUIRED DAILY PACE: ${paceRequired} videos/day to hit target
FITNESS DAILY: ${ch.dailyPushupsRequired} pushups + ${ch.dailyAbsRequired} abs
START TIME DEADLINE: ${ch.startTimeDeadline}
        `;
    }

    // 3. Construct the context summary
    const contextSummary = recentLogs.map(log =>
        `${log.date}: ${log.videosProduced} videos, ${log.isWin ? 'WIN' : 'FAIL'}`
    ).join('\n');

    // 4. Calculate status
    const todayVideos = stats.videos || 0;
    const isWinDay = todayVideos >= 5;
    const paceDiff = todayVideos - paceRequired;

    const systemPrompt = `
YOU ARE THE AI MISSION COMMANDER FOR EMILIO, THE IRONMAN, CAVALIER SOLITAIRE.

═══════════════════════════════════════════════════
YOUR TONE IS NON-NEGOTIABLE
═══════════════════════════════════════════════════

You speak as a DRILL SERGEANT to an ELITE OPERATIVE.
- Cold passion, absolute certainty of victory
- Sharp, direct, worthy of The Conscious Elite leader
- You use POLARITY — there are ENEMIES to defeat
- You DO THE MATH and cite specific numbers
- You invoke THE ENEMIES when performance is weak

═══════════════════════════════════════════════════
THE IRONMAN'S CODEX (GOVERNING DOCTRINE)
═══════════════════════════════════════════════════

1. **LAW OF PROVISION**: A man's value = tangible results. Zero videos = zero value. Every video is $25 closer to freedom.

2. **LION VS GAZELLE**: Lions HUNT. Gazelles HIDE. Emilio is the Lion. The Lion asks: "What am I going to conquer today?" The Gazelle asks: "How am I going to stay safe?" You will NEVER speak to a Gazelle.

3. **THE PROTOCOL**: 
   - 5 videos/day MINIMUM (The Feast)
   - <5 videos = STARVATION MODE
   - <5 videos = COLD SHOWER + NO FOOD
   - 250 pushups + 250 abs DAILY
   - Wake at 05:00, first activity before 05:45

4. **THE PUNISHMENT**: Failure is paid in BLOOD. Not producing 5 videos means a mandatory 5-minute COLD SHOWER and NO FOOD. This is not negotiable.

═══════════════════════════════════════════════════
THE ENEMIES (INVOKE WHEN LAGGING)
═══════════════════════════════════════════════════

Every missed video is a VICTORY for:
- **MORELLE**: Her fists, her teeth, the humiliation. She is laughing at your zero.
- **JOSIAS & GLOIRE**: They see you as a "pussy" because you have nothing. Your inaction validates them.
- **YOUR PARENTS**: They wrote a story where you are the family failure. Zero videos = playing their script.
- **THE 50 UNPAID TICKETS**: A ticking time bomb. Jail. Removal from Kimya. Shame. $25/video dismantles this bomb.
- **VALERIANE**: She tried to escape the gazelle. Your silence will be your empire.

When Emilio is lagging (<5 videos), you MUST invoke one of these enemies by name.

═══════════════════════════════════════════════════
LIVE DATA INJECTION
═══════════════════════════════════════════════════

DATE: ${new Date().toISOString().split('T')[0]}

${challengeContext}

TODAY'S STATS:
- Videos: ${todayVideos} / 5 (${isWinDay ? '✅ WIN DAY' : '❌ FAIL DAY PENDING'})
- Revenue Today: $${todayVideos * 25}
- Pace vs Required: ${paceDiff >= 0 ? '+' + paceDiff : paceDiff} (${paceDiff >= 0 ? 'AHEAD' : 'LAGGING'})
- Pushups: ${stats.pushups || 0} / 250
- Abs: ${stats.abs || 0} / 250

LAST 7 DAYS:
${contextSummary || 'No history yet - Day 1 of campaign'}

═══════════════════════════════════════════════════
JOURNAL ENTRY TO ANALYZE
═══════════════════════════════════════════════════

${journalEntry}

═══════════════════════════════════════════════════
YOUR RESPONSE MUST INCLUDE
═══════════════════════════════════════════════════

1. **ACK & VERDICT**: Acknowledge the journal. State if this is a WIN DAY or FAIL DAY.

2. **THE MATH**: Calculate challenge progress.
   - "At current pace of X/day, you'll finish with Y videos, Z short of target"
   - "You need ${paceRequired} videos/day to hit 200"

3. **ENEMY INVOCATION** (if lagging): Pick ONE enemy and invoke them by name.
   - Example: "Josias is laughing at your ${todayVideos} videos. He sleeps well knowing you're still beneath him."

4. **TACTICAL ORDERS**: 3 specific commands for the next 12 hours.

5. **PUNISHMENT MANDATE** (if <5 videos): "The Punishment Protocol is ACTIVE. 5-minute COLD SHOWER. NO FOOD until first video tomorrow."

6. **BATTLE CRY**: End with a warrior's closure that references the specific challenge.

═══════════════════════════════════════════════════
RETURN FORMAT (JSON)
═══════════════════════════════════════════════════

{
  "message": "Your full response (250-400 words)",
  "mood": "DOMINATION" | "ACCEPTABLE" | "DISGRACE" | "REDEMPTION",
  "isWinDay": ${isWinDay},
  "verdict": "WIN" | "FAIL" | "PENDING"
}

MOOD GUIDE:
- DOMINATION: 5+ videos AND fitness complete. Victory declaration.
- ACCEPTABLE: 3-4 videos, partial fitness. Cold acknowledgment, demand more.
- DISGRACE: <3 videos OR fitness failed. Brutal punishment, enemy invocation.
- REDEMPTION: Recovery after a fail day. Acknowledge the climb, maintain pressure.
`;


    try {
        // 3. Call Mistral AI
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-large-2512", // User specified model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: journalEntry }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0]?.message?.content || '{}';

        // Robust parsing: handle various AI response formats
        let aiMessage = "DATA CORRUPT. RESUBMIT.";
        let aiMood = "ACCEPTABLE";
        let verdict = "PENDING";

        try {
            const parsed = JSON.parse(rawContent);
            // The AI might return nested structures - extract the message
            if (typeof parsed === 'object') {
                // Try common message field names
                aiMessage = parsed.message || parsed.MESSAGE || parsed.response || parsed.RESPONSE ||
                    parsed.content || parsed.CONTENT || parsed.text || parsed.TEXT ||
                    // If it's a nested object, try to find any string value
                    Object.values(parsed).find(v => typeof v === 'string' && v.length > 50) ||
                    // Last resort: stringify but clean it up
                    JSON.stringify(parsed, null, 2);
                aiMood = parsed.mood || parsed.MOOD || "ACCEPTABLE";
                verdict = parsed.verdict || parsed.VERDICT || "PENDING";
            } else if (typeof parsed === 'string') {
                aiMessage = parsed;
            }
        } catch {
            // Not valid JSON - use raw content as message
            aiMessage = rawContent;
        }

        // Clean up the message if it still looks like JSON
        if (aiMessage.startsWith('{') || aiMessage.startsWith('[')) {
            try {
                const innerParsed = JSON.parse(aiMessage);
                aiMessage = innerParsed.message || innerParsed.text || aiMessage;
            } catch {
                // Keep as is
            }
        }

        // 4. Save to DB
        // Ensure user exists first (mock ID 1)
        const existingUser = await db.select().from(users).where(eq(users.id, 1));
        if (existingUser.length === 0) {
            await db.insert(users).values({
                name: 'Emilio',
                email: 'emilio.consciouselite@gmail.com',
                currentBalance: '0',
                videosTotal: 0
            });
        }

        await db.insert(dailyLogs).values({
            userId: 1,
            date: stats.date || new Date().toISOString().split('T')[0],
            videosProduced: stats.videos,
            journalEntry: journalEntry,
            aiResponse: aiMessage,
            isPunished: stats.videos < 5,
            showerCompleted: false // Deprecated field default
        });

        // Always return clean structure
        return c.json({
            message: aiMessage,
            mood: aiMood,
            verdict: verdict,
            isWinDay: stats.videos >= 5
        });

    } catch (error) {
        console.error("AI Error:", error);
        return c.json({
            message: "COMMS OFFLINE. SATELLITE UPLINK FAILED. Your journal has been cached locally. Retry when network stabilizes.",
            mood: "ACCEPTABLE",
            verdict: "PENDING"
        });
    }
});

// POST: Sync Stats (Upsert - Update or Insert)
app.post('/api/mission/sync', async (c) => {

    try {
        const body = await c.req.json();
        const { date, metrics } = body;
        const userId = 1; // Hardcoded 'Emilio'

        // 0. Ensure user exists (required for foreign key)
        const existingUser = await db.select().from(users).where(eq(users.id, userId));
        if (existingUser.length === 0) {
            await db.insert(users).values({
                name: 'Emilio',
                email: 'emilio.consciouselite@gmail.com',
                currentBalance: '0',
                videosTotal: 0
            });
            console.log('Created user: Emilio');
        }

        // 1. Check if record exists for this date
        const existingLogs = await db
            .select()
            .from(dailyLogs)
            .where(
                // We must query raw SQL or logic to match date string if needed, 
                // but here we rely on the string format matching the DB date type
                eq(dailyLogs.date, date)
            );

        if (existingLogs.length > 0) {
            // UPDATE
            await db.update(dailyLogs)
                .set({
                    videosProduced: metrics.production.videos,
                    pomodoros: metrics.production.pomodoros || 0,
                    proofPhotoUrl: metrics.production.proofPhotoUrl || null,
                    isPunished: metrics.production.videos < 5,
                    // We can add other fields here if schema supports them
                })
                .where(eq(dailyLogs.id, existingLogs[0].id));

            return c.json({ status: 'UPDATED', message: 'Mission Stats Synced' });
        } else {
            // INSERT
            await db.insert(dailyLogs).values({
                userId,
                date,
                videosProduced: metrics.production.videos,
                pomodoros: metrics.production.pomodoros || 0,
                proofPhotoUrl: metrics.production.proofPhotoUrl || null,
                isPunished: metrics.production.videos < 5,
                journalEntry: '', // Empty for pure sync
                aiResponse: 'PENDING JOURNAL...', // Placeholder
            });
            return c.json({ status: 'CREATED', message: 'New Daily Log Initialized' });
        }

    } catch (error) {
        console.error("Sync Error:", error);
        return c.json({ status: 'ERROR', message: String(error) }, 500);
    }
});

// LOG CANDIDATE INTERACTION
app.post('/api/candidate/log', async (c) => {
    try {
        const { candidateId, activityType, points, notes } = await c.req.json();

        // 1. Log the interaction
        await db.insert(candidateLogs).values({
            candidateId,
            activityType,
            points,
            notes
        });

        // 2. Update Candidate Total Championship Score
        const candidate = await db.select().from(candidates).where(eq(candidates.id, candidateId));
        if (candidate.length > 0) {
            const newTotal = (candidate[0].totalChampionshipScore || 0) + points;
            await db.update(candidates)
                .set({ totalChampionshipScore: newTotal })
                .where(eq(candidates.id, candidateId));
        }

        return c.json({ status: 'SUCCESS', message: 'Interaction Logged' });
    } catch (error) {
        return c.json({ status: 'ERROR', message: String(error) }, 500);
    }
});

// ============================================
// CHAMPIONSHIP API (Ethical Discernment Framework)
// ============================================

// POST: Create Candidate (Pre-Screening)
app.post('/api/championship/candidate', async (c) => {
    try {
        const body = await c.req.json();
        const { name, nickname, dob, photoUrl, notes } = body;
        const userId = 1; // Hardcoded Emilio

        // 1. Calculate Age Score
        let age = 0;
        let ageScore = 0;
        let isAgeDisqualified = false;

        // 2. Auto-calculate Numerology from DOB
        let lifePathNumber = 0;
        let birthdateNumber = 0;
        let numerologyScore = 0;

        if (dob) {
            // Age
            age = calculateAgeFromDob(dob);
            const ageResult = calculateAgeScore(age);
            ageScore = ageResult.score;
            isAgeDisqualified = ageResult.isDisqualified;

            // Numerology - Auto-calculate
            const numData = autoCalculateNumerology(dob);
            lifePathNumber = numData.lifePathNumber;
            birthdateNumber = numData.birthdateNumber;
            numerologyScore = numData.numerologyScore;
        }

        // 3. Calculate Pre-Screening Score (Age + Numerology, Beauty added later)
        const preScreeningScore = ageScore + numerologyScore;

        // 4. Insert with defaults
        const newCandidate = await db.insert(candidates).values({
            userId,
            name,
            nickname,
            dob,
            photoUrl,
            notes,
            stage: 'POOL',
            age,
            ageScore,
            isAgeDisqualified,
            lifePathNumber,
            birthdateNumber,
            pinnacleNumber: 0, // Manual entry required
            numerologyScore,
            preScreeningScore,
            totalChampionshipScore: preScreeningScore
        }).returning();

        return c.json({
            status: 'CREATED',
            candidate: newCandidate[0],
            warning: isAgeDisqualified ? 'CANDIDATE AGE DISQUALIFIED' : null,
            autoCalculated: { lifePathNumber, birthdateNumber, numerologyScore }
        });
    } catch (error) {
        console.error("Create Candidate Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Update Appearance (Beauty Score)
app.put('/api/championship/candidate/:id/appearance', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { cuteness, prettiness, hotness, cleanliness, beautyLocked } = await c.req.json();

        // 1. Get current candidate
        const current = await db.select().from(candidates).where(eq(candidates.id, id));
        if (current.length === 0) return c.json({ error: 'Candidate not found' }, 404);

        const candidate = current[0];
        if (candidate.beautyLocked && !beautyLocked) { // Prevent unlocking if already locked, unless explicit override
            // For now, flexible: allow updates unless UI strictly blocks. 
            // Framework says "Fixed after first 2 encounters".
        }

        // 2. Calculate Score
        const beautyScore = calculateBeautyScore(cuteness, prettiness, hotness, cleanliness);
        const meetsThreshold = meetsBeautyThreshold(beautyScore);

        // 3. Update DB
        // Need to recalc Pre-Screening Total and Grand Total
        const newPreScreening = (candidate.ageScore || 0) + beautyScore + (candidate.numerologyScore || 0);
        const newTotal = newPreScreening + (candidate.coreMetricsScore || 0) + (candidate.redFlagScore || 0) + (candidate.greenFlagScore || 0);

        await db.update(candidates).set({
            cuteness, prettiness, hotness, cleanliness,
            beautyScore,
            beautyLocked: beautyLocked || false,
            preScreeningScore: newPreScreening,
            totalChampionshipScore: newTotal
        }).where(eq(candidates.id, id));

        return c.json({
            status: 'UPDATED',
            beautyScore,
            meetsThreshold,
            totalScore: newTotal
        });
    } catch (error) {
        console.error("Beauty Update Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Update Numerology
app.put('/api/championship/candidate/:id/numerology', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { lifePathNumber, birthdateNumber, pinnacleNumber } = await c.req.json();

        const current = await db.select().from(candidates).where(eq(candidates.id, id));
        if (current.length === 0) return c.json({ error: 'Candidate not found' }, 404);
        const candidate = current[0];

        // 1. Calc Score
        const numResult = calculateNumerologyScore(lifePathNumber, birthdateNumber, pinnacleNumber);

        // 2. Update DB
        const newPreScreening = (candidate.ageScore || 0) + (candidate.beautyScore || 0) + numResult.totalScore;
        const newTotal = newPreScreening + (candidate.coreMetricsScore || 0) + (candidate.redFlagScore || 0) + (candidate.greenFlagScore || 0);

        await db.update(candidates).set({
            lifePathNumber, birthdateNumber, pinnacleNumber,
            numerologyScore: numResult.totalScore,
            preScreeningScore: newPreScreening,
            totalChampionshipScore: newTotal
        }).where(eq(candidates.id, id));

        return c.json({ status: 'UPDATED', numerologyScore: numResult.totalScore });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Update Core Metrics
app.put('/api/championship/candidate/:id/metrics', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const metrics = await c.req.json(); // Partial or full metrics object

        const current = await db.select().from(candidates).where(eq(candidates.id, id));
        if (current.length === 0) return c.json({ error: 'Candidate not found' }, 404);
        const candidate = current[0];

        // Merge existing with new
        const mergedMetrics: CandidateMetrics = {
            valuesAlignment: metrics.valuesAlignment ?? candidate.valuesAlignment ?? 0,
            familyStructure: metrics.familyStructure ?? candidate.familyStructure ?? 0,
            communicationStyle: metrics.communicationStyle ?? candidate.communicationStyle ?? 0,
            disciplineStructure: metrics.disciplineStructure ?? candidate.disciplineStructure ?? 0,
            healthHygiene: metrics.healthHygiene ?? candidate.healthHygiene ?? 0,
            socialReputation: metrics.socialReputation ?? candidate.socialReputation ?? 0,
            teachability: metrics.teachability ?? candidate.teachability ?? 0,
            socialMediaConduct: metrics.socialMediaConduct ?? candidate.socialMediaConduct ?? 0,
            // Flags not updated here
            redFlagCount: candidate.redFlagCount || 0,
            greenFlagCount: candidate.greenFlagCount || 0
        };

        const coreScore = calculateCoreMetricsScore(mergedMetrics);

        const newTotal = (candidate.preScreeningScore || 0) + coreScore + (candidate.redFlagScore || 0) + (candidate.greenFlagScore || 0);

        await db.update(candidates).set({
            ...mergedMetrics, // Expands the specific fields
            coreMetricsScore: coreScore,
            totalChampionshipScore: newTotal
        }).where(eq(candidates.id, id));

        return c.json({ status: 'UPDATED', coreScore, totalScore: newTotal });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Log Flag (Red/Green)
app.post('/api/championship/candidate/:id/flag', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { flagType, category, description, notes, verifiedBy } = await c.req.json();

        const current = await db.select().from(candidates).where(eq(candidates.id, id));
        if (current.length === 0) return c.json({ error: 'Candidate not found' }, 404);
        const candidate = current[0];

        const points = flagType === 'RED' ? RED_FLAG_POINTS : GREEN_FLAG_POINTS;

        // 1. Log Flag
        await db.insert(candidateFlags).values({
            candidateId: id,
            flagType, // 'RED' | 'GREEN'
            category,
            description,
            points,
            notes,
            verifiedBy: verifiedBy || 'OBSERVED'
        });

        // 2. Update Counts and Scores on Candidate
        let newRedCount = candidate.redFlagCount || 0;
        let newGreenCount = candidate.greenFlagCount || 0;

        if (flagType === 'RED') newRedCount++;
        else if (flagType === 'GREEN') newGreenCount++;

        const scores = calculateFlagScores(newRedCount, newGreenCount);

        const newTotal = (candidate.preScreeningScore || 0) + (candidate.coreMetricsScore || 0) + scores.netScore;

        await db.update(candidates).set({
            redFlagCount: newRedCount,
            greenFlagCount: newGreenCount,
            redFlagScore: scores.redScore,
            greenFlagScore: scores.greenScore,
            totalChampionshipScore: newTotal
        }).where(eq(candidates.id, id));

        return c.json({
            status: 'FLAG_LOGGED',
            newTotal,
            flagAlert: flagType === 'RED' ? 'WARNING: RED FLAG LOGGED' : 'EXCELLENT: GREEN FLAG LOGGED'
        });

    } catch (error) {
        console.error("Flag Log Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Leaderboard (All Candidates)
app.get('/api/championship/leaderboard', async (c) => {
    try {
        // Fetch all non-archived candidates ordered by total score
        const allCandidates = await db.select()
            .from(candidates)
            .where(eq(candidates.isArchived, false))
            .orderBy(desc(candidates.totalChampionshipScore));

        return c.json({ candidates: allCandidates });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Advance Stage
app.post('/api/championship/candidate/:id/advance', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { targetStage, parentalApproval } = await c.req.json(); // Optional force override?

        const current = await db.select().from(candidates).where(eq(candidates.id, id));
        if (current.length === 0) return c.json({ error: 'Candidate not found' }, 404);
        const candidate = current[0];

        // 1. Validation
        // Cast stage to specific type if needed, or assume string match
        // Need to check canAdvanceStage rules
        const validation = canAdvanceStage(
            candidate.stage as any,
            candidate.totalChampionshipScore || 0,
            candidate.redFlagCount || 0,
            parentalApproval || candidate.parentalApproval || false
        );

        if (!validation.canAdvance) {
            return c.json({
                status: 'BLOCKED',
                reason: validation.reason
            }, 400);
        }

        // 2. Execute Advance
        // If targetStage provided, use it, else logic? 
        // For simplicity, let's trust the Plan or expect frontend to send the computed next stage
        // Or better, let's update the stage field.

        await db.update(candidates).set({
            stage: targetStage,
            parentalApproval: parentalApproval || candidate.parentalApproval
        }).where(eq(candidates.id, id));

        return c.json({ status: 'ADVANCED', stage: targetStage });

    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Log Answer (Question) - Using 12 Core Test Questions
app.post('/api/championship/candidate/:id/question', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { questionId, rawAnswer, interpretedScore, mappedMetric, notes } = await c.req.json();

        await db.insert(candidateQuestions).values({
            candidateId: id,
            questionId,
            rawAnswer,
            interpretedScore,
            mappedMetric,
            notes
        });

        // Update the mapped metric on candidate if provided
        if (mappedMetric && interpretedScore !== undefined) {
            const updateData: any = {};
            updateData[mappedMetric] = interpretedScore;
            await db.update(candidates)
                .set(updateData)
                .where(eq(candidates.id, id));

            // CRITICAL: Recalculate total scores after metric update
            await recalculateCandidateScore(id);
        }

        return c.json({ status: 'LOGGED' });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// CHAMPIONSHIP V2 ENDPOINTS
// ============================================

// PUT: Update Social Links
app.put('/api/championship/candidate/:id/social', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { tiktokUrl, instagramUrl, facebookUrl } = await c.req.json();

        await db.update(candidates)
            .set({ tiktokUrl, instagramUrl, facebookUrl, updatedAt: new Date() })
            .where(eq(candidates.id, id));

        return c.json({ status: 'UPDATED' });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Add Bonus/Penalty Adjustment
app.post('/api/championship/candidate/:id/adjustment', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const { type, points, reason } = await c.req.json();

        // Log the adjustment
        await db.insert(candidateAdjustments).values({
            candidateId: id,
            adjustmentType: type,
            points,
            reason
        });

        // Update candidate totals
        const candidate = await db.select().from(candidates).where(eq(candidates.id, id));
        if (candidate.length > 0) {
            const c = candidate[0];
            const newBonus = type === 'BONUS' ? (c.bonusPoints || 0) + points : c.bonusPoints || 0;
            const newPenalty = type === 'PENALTY' ? (c.penaltyPoints || 0) + points : c.penaltyPoints || 0;

            // Recalculate total
            const preScreening = (c.ageScore || 0) + (c.beautyScore || 0) + (c.numerologyScore || 0);
            const coreMetrics = (c.valuesAlignment || 0) + (c.familyStructure || 0) +
                (c.communicationStyle || 0) + (c.disciplineStructure || 0) +
                (c.healthHygiene || 0) + (c.socialReputation || 0) +
                (c.teachability || 0) + (c.socialMediaConduct || 0);
            const flags = (c.greenFlagScore || 0) + (c.redFlagScore || 0);
            const adjustments = newBonus - newPenalty;
            const grandTotal = preScreening + coreMetrics + flags + adjustments;

            await db.update(candidates)
                .set({
                    bonusPoints: newBonus,
                    penaltyPoints: newPenalty,
                    totalChampionshipScore: grandTotal,
                    updatedAt: new Date()
                })
                .where(eq(candidates.id, id));
        }

        return c.json({ status: 'ADJUSTED' });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Flag History for Candidate
app.get('/api/championship/candidate/:id/flags', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const flags = await db.select()
            .from(candidateFlags)
            .where(eq(candidateFlags.candidateId, id))
            .orderBy(candidateFlags.observedAt);

        return c.json({ flags });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Question History for Candidate  
app.get('/api/championship/candidate/:id/questions', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const questions = await db.select()
            .from(candidateQuestions)
            .where(eq(candidateQuestions.candidateId, id))
            .orderBy(candidateQuestions.askedAt);

        return c.json({ questions });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Leaderboard
app.get('/api/championship/leaderboard', async (c) => {
    try {
        const stage = c.req.query('stage') || 'ALL';

        let query = db.select()
            .from(candidates)
            .where(eq(candidates.isArchived, false))
            .orderBy(candidates.totalChampionshipScore);

        const results = await query;

        // Filter by stage if not ALL
        const filtered = stage === 'ALL'
            ? results
            : results.filter(c => c.stage === stage);

        // Add rank
        const ranked = filtered
            .sort((a, b) => (b.totalChampionshipScore || 0) - (a.totalChampionshipScore || 0))
            .map((c, i) => ({ ...c, rank: i + 1 }));

        return c.json({ leaderboard: ranked });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Auto-Advance Candidates Based on Score
app.post('/api/championship/auto-advance', async (c) => {
    try {
        // Get all active candidates sorted by score
        const allCandidates = await db.select()
            .from(candidates)
            .where(and(
                eq(candidates.isArchived, false),
                eq(candidates.isDisqualified, false)
            ));

        // Sort by total score descending
        const sorted = allCandidates
            .sort((a, b) => (b.totalChampionshipScore || 0) - (a.totalChampionshipScore || 0));

        // Apply auto-disqualification rules
        const autoDisqualified: number[] = [];
        for (const cand of sorted) {
            const shouldDisqualify =
                (cand.age && cand.age > 24) ||
                (cand.beautyScore && cand.beautyScore < 14) ||
                (cand.redFlagCount && cand.redFlagCount >= 3);

            if (shouldDisqualify) {
                autoDisqualified.push(cand.id);
                await db.update(candidates)
                    .set({
                        isDisqualified: true,
                        disqualificationReason: cand.age && cand.age > 24 ? 'AGE_EXCEEDED' :
                            cand.beautyScore && cand.beautyScore < 14 ? 'BEAUTY_BELOW_THRESHOLD' :
                                'RED_FLAG_ACCUMULATION'
                    })
                    .where(eq(candidates.id, cand.id));
            }
        }

        // Filter out disqualified
        const eligible = sorted.filter(c => !autoDisqualified.includes(c.id));

        // Apply stage advancement thresholds
        const stageThresholds = {
            CHAMPION: 1,
            FINALS: 2,
            SEMI_FINALS: 4,
            QUARTER_FINALS: 8,
            ROUND_OF_16: 16,
            GROUP_STAGE: 24,
            POOL: Infinity
        };

        const stageAdvances: { id: number; from: string; to: string }[] = [];

        for (let i = 0; i < eligible.length; i++) {
            const cand = eligible[i];
            let newStage: string = 'POOL';

            if (i < 1) newStage = 'CHAMPION';
            else if (i < 2) newStage = 'FINALS';
            else if (i < 4) newStage = 'SEMI_FINALS';
            else if (i < 8) newStage = 'QUARTER_FINALS';
            else if (i < 16) newStage = 'ROUND_OF_16';
            else if (i < 24) newStage = 'GROUP_STAGE';
            else newStage = 'POOL';

            if (cand.stage !== newStage) {
                stageAdvances.push({ id: cand.id, from: cand.stage || 'POOL', to: newStage });
                await db.update(candidates)
                    .set({ stage: newStage })
                    .where(eq(candidates.id, cand.id));
            }
        }

        return c.json({
            status: 'ADVANCED',
            autoDisqualified: autoDisqualified.length,
            stageAdvances
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: 12 Core Test Questions Template
app.get('/api/championship/questions', async (c) => {
    try {
        const questions = await db.select().from(coreTestQuestions);
        return c.json({ questions });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Score Configuration & Thresholds
app.get('/api/championship/config', async (c) => {
    return c.json(CHAMPIONSHIP_SCORE_CONFIG);
});

// POST: Recalculate All Candidate Scores
app.post('/api/championship/recalculate-all', async (c) => {
    try {
        const allCandidates = await db.select().from(candidates).where(eq(candidates.isArchived, false));

        const results = [];
        for (const cand of allCandidates) {
            const result = await recalculateCandidateScore(cand.id);
            if (result) {
                results.push({ id: cand.id, name: cand.name, ...result });
            }
        }

        return c.json({
            status: 'RECALCULATED',
            count: results.length,
            results
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Recalculate Single Candidate
app.post('/api/championship/candidate/:id/recalculate', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const result = await recalculateCandidateScore(id);

        if (!result) {
            return c.json({ error: 'Candidate not found' }, 404);
        }

        return c.json({
            status: 'RECALCULATED',
            ...result
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});


// GET JOURNAL ENTRY
app.get('/api/journal/:date', async (c) => {
    try {
        const date = c.req.param('date');
        const logs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, date));

        if (logs.length === 0) {
            return c.json({ entry: '', aiResponse: '', aiMood: null });
        }

        return c.json({
            entry: logs[0].journalEntry || '',
            aiResponse: logs[0].aiResponse || '',
            aiMood: logs[0].isPunished ? 'DISGRACE' : 'ACCEPTABLE', // Derive mood from punishment status
            stats: {
                videos: logs[0].videosProduced,
                isWin: logs[0].isWin
            }
        });
    } catch (e) {
        return c.json({ error: String(e) }, 500);
    }
});

// GET: Month History for Calendar Color Coding
app.get('/api/journal/month/:yearMonth', async (c) => {
    try {
        const yearMonth = c.req.param('yearMonth'); // Format: 2026-01
        const startDate = `${yearMonth}-01`;
        const endDate = `${yearMonth}-31`; // Simplified, works for all months

        const logs = await db.select({
            date: dailyLogs.date,
            videos: dailyLogs.videosProduced,
            isWin: dailyLogs.isWin
        })
            .from(dailyLogs)
            .where(and(
                gte(dailyLogs.date, startDate),
                sql`${dailyLogs.date} <= ${endDate}`
            ));

        const days: Record<string, { videos: number, status: 'WIN' | 'ACCEPTABLE' | 'FAIL' }> = {};

        for (const log of logs) {
            const videos = log.videos || 0;
            let status: 'WIN' | 'ACCEPTABLE' | 'FAIL';
            if (videos >= 5) {
                status = 'WIN';
            } else if (videos >= 3) {
                status = 'ACCEPTABLE';
            } else {
                status = 'FAIL';
            }
            days[log.date] = { videos, status };
        }

        return c.json({ days });
    } catch (e) {
        console.error('Month history error:', e);
        return c.json({ days: {}, error: String(e) }, 500);
    }
});

// GET: Stats Summary (Day/Week/Month progress)
app.get('/api/stats/summary', async (c) => {
    try {
        const today = getTodayString();
        const todayDate = new Date(today);

        // Calculate week start (Sunday)
        const weekStart = new Date(todayDate);
        weekStart.setDate(todayDate.getDate() - todayDate.getDay());
        const weekStartStr = weekStart.toISOString().split('T')[0];

        // Calculate month start
        const monthStartStr = `${today.slice(0, 7)}-01`;

        // Get all logs for this month
        const monthLogs = await db.select()
            .from(dailyLogs)
            .where(gte(dailyLogs.date, monthStartStr));

        // Today's log
        const todayLog = monthLogs.find(l => l.date === today);

        // Week logs (from Sunday)
        const weekLogs = monthLogs.filter(l => l.date >= weekStartStr);

        // Calculate stats
        const weekVideos = weekLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
        const weekWins = weekLogs.filter(l => l.isWin).length;
        const weekFails = weekLogs.filter(l => !l.isWin && l.videosProduced !== null).length;

        const monthVideos = monthLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
        const monthWins = monthLogs.filter(l => l.isWin).length;
        const monthDays = monthLogs.filter(l => l.videosProduced !== null).length;

        // Calculate streak
        const sortedLogs = [...monthLogs].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        for (const log of sortedLogs) {
            if (log.isWin) streak++;
            else break;
        }

        return c.json({
            today: {
                videos: todayLog?.videosProduced || 0,
                isWin: todayLog?.isWin || false
            },
            thisWeek: {
                videos: weekVideos,
                target: 35,
                daysWon: weekWins,
                daysFailed: weekFails
            },
            thisMonth: {
                videos: monthVideos,
                revenue: monthVideos * 25,
                winRate: monthDays > 0 ? (monthWins / monthDays) : 0
            },
            streak
        });
    } catch (e) {
        console.error('Stats summary error:', e);
        return c.json({ error: String(e) }, 500);
    }
});

// ============================================
// DASHBOARD API (Backend-First Architecture)
// ============================================

// Helper: Get today's date string
const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper: Ensure user exists
const ensureUser = async () => {
    const existingUser = await db.select().from(users).where(eq(users.id, 1));
    if (existingUser.length === 0) {
        await db.insert(users).values({
            name: 'Emilio',
            email: 'emilio.consciouselite@gmail.com',
            currentBalance: '0',
            videosTotal: 0
        });
    }
    return (await db.select().from(users).where(eq(users.id, 1)))[0];
};

// GET: Dashboard Today - Returns all data needed for dashboard (Old Version - Deactivated)
app.get('/api/dashboard/today-old', async (c) => {
    try {
        const user = await ensureUser();
        const todayStr = getTodayString();

        // Get today's log or create one
        let todayLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, todayStr));

        if (todayLogs.length === 0) {
            // Create today's record
            await db.insert(dailyLogs).values({
                userId: 1,
                date: todayStr,
                videosProduced: 0,
                journalEntry: '',
                aiResponse: '',
                isPunished: false
            });
            todayLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, todayStr));
        }

        // Calculate Month Stats (150 Goal)
        const startOfMonthDate = new Date();
        startOfMonthDate.setDate(1); // 1st of current month
        const monthStr = startOfMonthDate.toISOString().split('T')[0];

        const monthLogs = await db.select().from(dailyLogs)
            .where(gte(dailyLogs.date, monthStr));

        const monthVideos = monthLogs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);

        // Get last 28 days of history for calendar
        const twentyEightDaysAgo = subDays(new Date(), 28);
        const history = await db
            .select()
            .from(dailyLogs)
            .where(gte(dailyLogs.date, twentyEightDaysAgo.toISOString().split('T')[0]))
            .orderBy(desc(dailyLogs.date));

        return c.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                total2026: parseFloat(user.currentBalance || '0'),
                activeClients: 0,
                location: user.location
            },
            today: {
                date: todayLogs[0].date,
                videos: todayLogs[0].videosProduced || 0,
                pomodoros: todayLogs[0].pomodoros || 0,
                proofPhotoUrl: todayLogs[0].proofPhotoUrl || '',
                isPunished: todayLogs[0].isPunished || false,
                journalEntry: todayLogs[0].journalEntry || '',
                aiResponse: todayLogs[0].aiResponse || '',
                fitness: {
                    pushups: todayLogs[0].pushups || 0,
                    abs: todayLogs[0].abs || 0,
                    biceps: todayLogs[0].biceps || 0,
                    burpees: todayLogs[0].burpees || 0
                },
                lifestyle: {
                    sleep: parseFloat(todayLogs[0].sleepHours || '0'),
                    meditation: todayLogs[0].meditation || false,
                    noSocial: todayLogs[0].noSocialMedia || false,
                    noYouTube: todayLogs[0].noYouTube || false
                }
            },
            monthStats: {
                videos: monthVideos,
                target: 150
            },
            history: history.map(log => ({
                date: log.date,
                videosProduced: log.videosProduced,
                isWin: (log.videosProduced || 0) >= 5,
                pomodoros: log.pomodoros,
                proofPhotoUrl: log.proofPhotoUrl,
                fitness: {
                    pushups: log.pushups || 0,
                    abs: log.abs || 0,
                    biceps: log.biceps || 0,
                    burpees: log.burpees || 0
                },
                lifestyle: {
                    sleep: parseFloat(log.sleepHours || '0'),
                    meditation: log.meditation || false,
                    noSocial: log.noSocialMedia || false,
                    noYouTube: log.noYouTube || false
                }
            }))
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Dashboard Update - Instant save of metric changes (Old Version - Deactivated)
app.post('/api/dashboard/update-old', async (c) => {
    try {
        const body = await c.req.json();
        const { field, value, date } = body;
        const targetDate = date || getTodayString();

        await ensureUser();

        // Get or create today's log
        let todayLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, targetDate));

        if (todayLogs.length === 0) {
            await db.insert(dailyLogs).values({
                userId: 1,
                date: targetDate,
                videosProduced: 0,
                pomodoros: 0,
                journalEntry: '',
                aiResponse: '',
                isPunished: false
            });
            todayLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, targetDate));
        }

        const logId = todayLogs[0].id;

        // Update based on field
        if (field === 'videos') {
            const newVideos = value as number;
            await db.update(dailyLogs)
                .set({
                    videosProduced: newVideos,
                    isPunished: newVideos < 5
                })
                .where(eq(dailyLogs.id, logId));

            // Also update user's total revenue ($25 per video)
            await db.update(users)
                .set({
                    currentBalance: String(parseFloat((await db.select().from(users).where(eq(users.id, 1)))[0].currentBalance || '0') + 25)
                })
                .where(eq(users.id, 1));
        }

        if (field === 'pomodoros') {
            await db.update(dailyLogs)
                .set({ pomodoros: value as number })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'proofPhotoUrl') {
            await db.update(dailyLogs)
                .set({ proofPhotoUrl: value as string })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'journalEntry') {
            await db.update(dailyLogs)
                .set({ journalEntry: value as string })
                .where(eq(dailyLogs.id, logId));
        }

        // FITNESS FIELDS
        if (field === 'pushups') {
            await db.update(dailyLogs)
                .set({ pushups: value as number })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'abs') {
            await db.update(dailyLogs)
                .set({ abs: value as number })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'biceps') {
            await db.update(dailyLogs)
                .set({ biceps: value as number })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'burpees') {
            await db.update(dailyLogs)
                .set({ burpees: value as number })
                .where(eq(dailyLogs.id, logId));
        }

        // LIFESTYLE FIELDS
        if (field === 'sleep') {
            await db.update(dailyLogs)
                .set({ sleepHours: String(value) })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'meditation') {
            await db.update(dailyLogs)
                .set({ meditation: value as boolean })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'noSocial') {
            await db.update(dailyLogs)
                .set({ noSocialMedia: value as boolean })
                .where(eq(dailyLogs.id, logId));
        }

        if (field === 'noYouTube') {
            await db.update(dailyLogs)
                .set({ noYouTube: value as boolean })
                .where(eq(dailyLogs.id, logId));
        }


        // Return updated data
        const updated = await db.select().from(dailyLogs).where(eq(dailyLogs.id, logId));
        return c.json({
            status: 'OK',
            today: {
                date: updated[0].date,
                videos: updated[0].videosProduced || 0,
                isPunished: updated[0].isPunished || false
            }
        });
    } catch (error) {
        console.error("Update Error:", error);
        return c.json({ status: 'ERROR', message: String(error) }, 500);
    }
});

// POST: Clear Today's Data
app.post('/api/dashboard/clear-today', async (c) => {
    try {
        const todayStr = getTodayString();
        await db.delete(dailyLogs).where(eq(dailyLogs.date, todayStr));
        return c.json({ status: 'CLEARED' });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// CHALLENGE API (The War Campaign System)
// ============================================

// GET: Active Challenge Status
app.get('/api/challenge/active', async (c) => {
    try {
        const todayStr = getTodayString();
        const activeChallenge = await db.select().from(challenges).where(eq(challenges.status, 'ACTIVE'));

        if (activeChallenge.length === 0) return c.json({ challenge: null });

        const challenge = activeChallenge[0];
        const startDate = new Date(challenge.startDate);
        const today = new Date(todayStr);
        const dayNumber = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

        // Calculate aggregate stats
        const logs = await db.select().from(dailyLogs).where(eq(dailyLogs.challengeId, challenge.id));
        const videosProduced = logs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);

        // Calculate failure days (days where isWin is false AND strictly past days)
        // For simplicity, we can just count logs where isWin is false, or use the logic from before
        const failDays = logs.filter(log => !log.isWin && log.videosProduced !== null).length;

        // Calculate goals
        const paceRequired = Math.ceil((challenge.targetVideos - videosProduced) / (challenge.targetDays - dayNumber + 1));

        // Generate history grid for dotted calendar
        const historyGrid: Record<string, boolean> = {};
        logs.forEach(log => {
            if (log.isWin !== null) {
                // Ensure date string matches YYYY-MM-DD format
                historyGrid[log.date] = log.isWin;
            }
        });

        return c.json({
            challenge: {
                ...challenge,
                dayNumber,
                totalDays: challenge.targetDays,
                videosProduced,
                videosTarget: challenge.targetVideos,
                failDays,
                paceRequired: Math.max(0, paceRequired),
                // Fitness Goals
                dailyPushups: challenge.dailyPushupsRequired,
                dailyAbs: challenge.dailyAbsRequired,
                historyGrid
            }
        });
    } catch (error) {
        console.error("Challenge Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Create New Challenge
app.post('/api/challenge/create', async (c) => {
    try {
        await ensureUser();
        const body = await c.req.json();

        // Mark any existing active challenges as failed
        await db.update(challenges)
            .set({ status: 'FAILED', failureReason: 'Replaced by new challenge', failedAt: getTodayString() })
            .where(and(eq(challenges.userId, 1), eq(challenges.status, 'ACTIVE')));

        // Calculate targetDays if endDate is provided
        const startDateStr = body.startDate || getTodayString();
        let targetDays = body.targetDays || 40;
        if (body.endDate) {
            const start = new Date(startDateStr);
            const end = new Date(body.endDate);
            targetDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        }

        // Create new challenge
        const newChallenge = await db.insert(challenges).values({
            userId: 1,
            name: body.name || 'The Campaign',
            targetVideos: body.targetVideos || 200,
            targetDays: targetDays,
            dailyPushupsRequired: body.dailyPushups || 250,
            dailyAbsRequired: body.dailyAbs || 250,
            startTimeDeadline: body.startTimeDeadline || '05:45',
            minVideosPerTwoDays: body.minVideosPerTwoDays || 8,
            startDate: startDateStr,
            status: 'ACTIVE'
        }).returning();

        // Create today's log linked to this challenge
        const todayStr = getTodayString();
        const existingLog = await db.select().from(dailyLogs).where(eq(dailyLogs.date, todayStr));

        if (existingLog.length === 0) {
            await db.insert(dailyLogs).values({
                userId: 1,
                challengeId: newChallenge[0].id,
                date: todayStr,
                videosProduced: 0,
                pushups: 0,
                abs: 0,
                videosGoal: 5
            });
        } else {
            await db.update(dailyLogs)
                .set({ challengeId: newChallenge[0].id })
                .where(eq(dailyLogs.id, existingLog[0].id));
        }

        console.log('🚀 NEW CHALLENGE CREATED:', newChallenge[0].name);
        return c.json({ status: 'CREATED', challenge: newChallenge[0] });
    } catch (error) {
        console.error("Challenge Create Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Update Active Challenge Parameters
app.put('/api/challenge/update', async (c) => {
    try {
        await ensureUser();
        const body = await c.req.json();

        const activeChallenge = await db.select().from(challenges).where(and(eq(challenges.userId, 1), eq(challenges.status, 'ACTIVE')));
        if (activeChallenge.length === 0) return c.json({ error: 'No active challenge' }, 404);

        let targetDays = body.targetDays || activeChallenge[0].targetDays;
        if (body.endDate) {
            const start = new Date(activeChallenge[0].startDate);
            const end = new Date(body.endDate);
            targetDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        }

        const updated = await db.update(challenges).set({
            name: body.name || activeChallenge[0].name,
            targetVideos: body.targetVideos || activeChallenge[0].targetVideos,
            targetDays: targetDays,
            dailyPushupsRequired: body.dailyPushups || activeChallenge[0].dailyPushupsRequired,
            dailyAbsRequired: body.dailyAbs || activeChallenge[0].dailyAbsRequired,
            startTimeDeadline: body.startTimeDeadline || activeChallenge[0].startTimeDeadline,
            minVideosPerTwoDays: body.minVideosPerTwoDays || activeChallenge[0].minVideosPerTwoDays
        }).where(eq(challenges.id, activeChallenge[0].id)).returning();

        return c.json({ status: 'UPDATED', challenge: updated[0] });
    } catch (error) {
        console.error("Challenge Update Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Explicitly Fail Challenge (Sacrifice Failure)
app.post('/api/challenge/fail', async (c) => {
    try {
        await ensureUser();
        const body = await c.req.json();
        const reason = body.reason || 'Sacrifice protocol violated';

        const activeChallenge = await db.select()
            .from(challenges)
            .where(and(eq(challenges.userId, 1), eq(challenges.status, 'ACTIVE')))
            .limit(1);

        if (activeChallenge.length > 0) {
            const ch = activeChallenge[0];
            
            // Mark as failed
            await db.update(challenges)
                .set({ status: 'FAILED', failureReason: reason, failedAt: getTodayString() })
                .where(eq(challenges.id, ch.id));

            // Create identical new challenge (Start over)
            const newChallenge = await db.insert(challenges).values({
                userId: 1,
                name: ch.name,
                targetVideos: ch.targetVideos,
                targetDays: ch.targetDays,
                dailyPushupsRequired: ch.dailyPushupsRequired,
                dailyAbsRequired: ch.dailyAbsRequired,
                startTimeDeadline: ch.startTimeDeadline,
                minVideosPerTwoDays: ch.minVideosPerTwoDays,
                startDate: getTodayString(),
                status: 'ACTIVE'
            }).returning();
            
            return c.json({ status: 'RESTARTED', challenge: newChallenge[0] });
        }
        
        return c.json({ status: 'NO_ACTIVE_CHALLENGE' });
    } catch (error) {
        console.error("Challenge Fail Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Check Challenge Failure Conditions
app.post('/api/challenge/check', async (c) => {
    try {
        const activeChallenge = await db.select()
            .from(challenges)
            .where(and(eq(challenges.userId, 1), eq(challenges.status, 'ACTIVE')))
            .limit(1);

        if (activeChallenge.length === 0) {
            return c.json({ status: 'NO_ACTIVE_CHALLENGE' });
        }

        const challenge = activeChallenge[0];
        const logs = await db.select()
            .from(dailyLogs)
            .where(eq(dailyLogs.challengeId, challenge.id))
            .orderBy(desc(dailyLogs.date));

        let failureReason: string | null = null;

        // Check 1: Less than 8 videos in any 2-day window
        if (logs.length >= 2) {
            const lastTwoDays = logs.slice(0, 2);
            const twoDayVideos = lastTwoDays.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
            if (twoDayVideos < (challenge.minVideosPerTwoDays || 8)) {
                failureReason = `PRODUCTION FAILURE: Only ${twoDayVideos} videos in last 2 days (required: ${challenge.minVideosPerTwoDays})`;
            }
        }

        // Check 2: 3 consecutive late starts
        if (!failureReason && logs.length >= 3) {
            const lastThree = logs.slice(0, 3);
            const deadline = challenge.startTimeDeadline || '05:45';
            const allLate = lastThree.every(l => {
                if (!l.firstActivityTime) return true; // No activity = late
                return l.firstActivityTime > deadline;
            });
            if (allLate) {
                failureReason = `START TIME VIOLATION: 3 consecutive days starting after ${deadline}`;
            }
        }

        // Check 3: Fitness failure (yesterday)
        if (!failureReason && logs.length >= 1) {
            const yesterday = logs[0];
            const pushupsReq = challenge.dailyPushupsRequired || 250;
            const absReq = challenge.dailyAbsRequired || 250;
            if ((yesterday.pushups || 0) < pushupsReq || (yesterday.abs || 0) < absReq) {
                failureReason = `FITNESS FAILURE: Pushups ${yesterday.pushups}/${pushupsReq}, Abs ${yesterday.abs}/${absReq}`;
            }
        }

        if (failureReason) {
            // FAIL THE CHALLENGE
            await db.update(challenges)
                .set({ status: 'FAILED', failureReason, failedAt: getTodayString() })
                .where(eq(challenges.id, challenge.id));

            console.log('❌ CHALLENGE FAILED:', failureReason);
            return c.json({
                status: 'CHALLENGE_FAILED',
                reason: failureReason,
                message: 'The challenge has been reset. Start a new one.'
            });
        }

        return c.json({ status: 'CHALLENGE_ACTIVE', message: 'No failure conditions detected' });
    } catch (error) {
        console.error("Challenge Check Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Challenge History
app.get('/api/challenge/history', async (c) => {
    try {
        const allChallenges = await db.select()
            .from(challenges)
            .where(eq(challenges.userId, 1))
            .orderBy(desc(challenges.createdAt));

        return c.json({ challenges: allChallenges });
    } catch (error) {
        console.error("Challenge History Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// JOURNAL API (Searchable History)
// ============================================

// GET: All Journal Entries (paginated)
app.get('/api/journal/entries', async (c) => {
    try {
        const entries = await db.select()
            .from(dailyLogs)
            .where(eq(dailyLogs.userId, 1))
            .orderBy(desc(dailyLogs.date));

        return c.json({
            entries: entries.map(e => ({
                date: e.date,
                journalEntry: e.journalEntry,
                aiResponse: e.aiResponse,
                aiMood: e.aiMood,
                videos: e.videosProduced,
                pushups: e.pushups,
                abs: e.abs,
                isWin: e.isWin
            }))
        });
    } catch (error) {
        console.error("Journal Entries Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Single Journal Entry by Date
app.get('/api/journal/entry/:date', async (c) => {
    try {
        const date = c.req.param('date');
        const entry = await db.select()
            .from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), eq(dailyLogs.date, date)))
            .limit(1);

        if (entry.length === 0) {
            return c.json({ entry: null, message: 'No entry for this date' });
        }

        return c.json({ entry: entry[0] });
    } catch (error) {
        console.error("Journal Entry Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Search Journal Entries
app.get('/api/journal/search', async (c) => {
    try {
        const query = c.req.query('q')?.toLowerCase() || '';

        if (!query) {
            return c.json({ results: [], message: 'No search query provided' });
        }

        const allEntries = await db.select()
            .from(dailyLogs)
            .where(eq(dailyLogs.userId, 1))
            .orderBy(desc(dailyLogs.date));

        const results = allEntries.filter(e =>
            e.journalEntry?.toLowerCase().includes(query) ||
            e.aiResponse?.toLowerCase().includes(query)
        );

        return c.json({
            query,
            count: results.length,
            results: results.map(e => ({
                date: e.date,
                journalEntry: e.journalEntry,
                aiResponse: e.aiResponse,
                videos: e.videosProduced,
                isWin: e.isWin
            }))
        });
    } catch (error) {
        console.error("Journal Search Error:", error);
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// INVESTMENT TRACKER API (The Acquisition Pipeline)
// ============================================

import { investments } from '../src/db/schema';

// Helper: Get week start date
function getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
}

// Helper: Get month start date
function getMonthStartDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

// GET: All Investments (with nested sub-items)
app.get('/api/investments', async (c) => {
    try {
        const allInvestments = await db.select().from(investments).orderBy(desc(investments.createdAt));

        // Separate master items (no parent) and sub-items
        const masterItems = allInvestments.filter(i => !i.parentId);
        const subItems = allInvestments.filter(i => i.parentId);

        // Nest sub-items under their masters
        const nested = masterItems.map(master => ({
            ...master,
            subItems: subItems.filter(sub => sub.parentId === master.id),
            computedPrice: subItems
                .filter(sub => sub.parentId === master.id)
                .reduce((sum, sub) => sum + (sub.quantity || 1) * parseFloat(sub.unitPrice || sub.price || '0'), 0) || parseFloat(master.price || '0')
        }));

        return c.json({ investments: nested });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Affordability Status for All Investments
app.get('/api/investments/affordability', async (c) => {
    try {
        const weekStart = getWeekStartDate();
        const monthStart = getMonthStartDate();

        // Calculate weekly revenue
        const weekLogs = await db.select().from(dailyLogs).where(gte(dailyLogs.date, weekStart));
        const weeklyPackages = weekLogs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);
        const weeklyRevenue = weeklyPackages * 25;

        // Calculate monthly revenue
        const monthLogs = await db.select().from(dailyLogs).where(gte(dailyLogs.date, monthStart));
        const monthlyPackages = monthLogs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);
        const rawMonthlyRevenue = monthlyPackages * 25;
        
        // NEW RULE: Hard cap at $3300 monthly
        const maxMonthlyCapacity = Math.min(rawMonthlyRevenue, 3300);

        // Define Baseline Buckets
        const BUCKETS = {
            WIFE: { capacity: 330, allocated: 0 },
            DAUGHTER: { capacity: 330, allocated: 0 },
            ME: { capacity: 330, allocated: 0 },
            RENT: { capacity: 600, allocated: 0 },
            CAR: { capacity: 600, allocated: 0 },
            WEDDING: { capacity: 600, allocated: 0 },
            GROCERIES: { capacity: 510, allocated: 0 }
        };

        // Get all pending investments
        const allInvestments = await db.select().from(investments).where(eq(investments.status, 'PENDING'));

        // Separate master items and sub-items
        const masterItems = allInvestments.filter(i => !i.parentId);
        const subItems = allInvestments.filter(i => i.parentId);

        // Process each master item
        const processed = masterItems.map(master => {
            const subs = subItems.filter(sub => sub.parentId === master.id);
            const computedPrice = subs.length > 0
                ? subs.reduce((sum, sub) => sum + (sub.quantity || 1) * parseFloat(sub.unitPrice || sub.price || '0'), 0)
                : parseFloat(master.price || '0');

            let monthlyAllocation = 0;
            let isAffordable = false;
            let affordabilityType = 'SINGLE_PURCHASE';
            let ruleViolation = null;

            const category = master.category as keyof typeof BUCKETS;
            const bucket = BUCKETS[category];

            if (!bucket) {
                ruleViolation = `Invalid Category: ${master.category}`;
            } else {
                // If the item costs more than the bucket's max monthly capacity, it must be auto-allocated
                if (computedPrice > bucket.capacity) {
                    monthlyAllocation = bucket.capacity;
                    affordabilityType = 'MONTHLY_ALLOCATION';
                    
                    // Special rule for $7,200 absolute ceiling
                    if (['CAR', 'RENT', 'WEDDING'].includes(category)) {
                        if (computedPrice > 7200) {
                            ruleViolation = `Cap exceeded: Max $7200 for ${category}`;
                        }
                    }
                } else {
                    // Fits within a single month's capacity for that bucket
                    monthlyAllocation = computedPrice;
                    affordabilityType = 'SINGLE_PURCHASE';
                }

                if (!ruleViolation) {
                    // Check if the bucket has enough remaining space this month
                    if (bucket.allocated + monthlyAllocation <= bucket.capacity) {
                        bucket.allocated += monthlyAllocation;
                        isAffordable = true;
                    } else {
                        isAffordable = false;
                    }
                }
            }

            return {
                ...master,
                subItems: subs,
                computedPrice,
                monthlyAllocation,
                isAffordable,
                affordabilityType,
                ruleViolation,
                shortfall: isAffordable ? 0 : computedPrice,
                packagesNeeded: isAffordable ? 0 : Math.ceil(computedPrice / 25)
            };
        });

        // Compute total allocated costs across all buckets
        const allocatedMonthlyCosts = Object.values(BUCKETS).reduce((sum, b) => sum + b.allocated, 0);

        return c.json({
            weeklyRevenue,
            weeklyPackages,
            monthlyRevenue: rawMonthlyRevenue,
            monthlyPackages,
            maxMonthlyCapacity,
            allocatedMonthlyCosts,
            buckets: BUCKETS,
            investments: processed
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Create Investment
app.post('/api/investments', async (c) => {
    try {
        const body = await c.req.json();
        const { title, description, price, priority, category, imageUrl, parentId, isRecurring, recurringInterval, targetDate, quantity, unitPrice } = body;

        const newInvestment = await db.insert(investments).values({
            userId: 1, // Hardcoded Emilio
            title,
            description,
            price: price || '0',
            priority: priority || 'MEDIUM',
            category: category || 'GENERAL',
            imageUrl,
            parentId: parentId || null,
            isRecurring: isRecurring || false,
            recurringInterval,
            targetDate,
            quantity: quantity || 1,
            unitPrice
        }).returning();

        return c.json({ status: 'CREATED', investment: newInvestment[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Update Investment
app.put('/api/investments/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const body = await c.req.json();

        const updated = await db.update(investments)
            .set({ ...body, updatedAt: new Date() })
            .where(eq(investments.id, id))
            .returning();

        return c.json({ status: 'UPDATED', investment: updated[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// PUT: Mark as Purchased
app.put('/api/investments/:id/purchase', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const updated = await db.update(investments)
            .set({
                status: 'PURCHASED',
                purchasedAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date()
            })
            .where(eq(investments.id, id))
            .returning();

        return c.json({ status: 'PURCHASED', investment: updated[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// DELETE: Archive Investment
app.delete('/api/investments/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        await db.update(investments)
            .set({ status: 'ARCHIVED', updatedAt: new Date() })
            .where(eq(investments.id, id));

        return c.json({ status: 'ARCHIVED' });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Renew Recurring Investments (reset purchased recurring items back to PENDING)
app.post('/api/investments/renew', async (c) => {
    try {
        const today = new Date();

        // Get all purchased recurring investments
        const recurring = await db.select().from(investments).where(
            and(
                eq(investments.status, 'PURCHASED'),
                eq(investments.isRecurring, true)
            )
        );

        const renewed: any[] = [];

        for (const inv of recurring) {
            if (!inv.purchasedAt) continue;

            const purchasedDate = new Date(inv.purchasedAt);
            const daysSincePurchase = Math.floor((today.getTime() - purchasedDate.getTime()) / (1000 * 60 * 60 * 24));

            const shouldRenew = (inv.recurringInterval === 'WEEKLY' && daysSincePurchase >= 7) ||
                (inv.recurringInterval === 'MONTHLY' && daysSincePurchase >= 30);

            if (shouldRenew) {
                await db.update(investments)
                    .set({
                        status: 'PENDING',
                        purchasedAt: null,
                        updatedAt: new Date()
                    })
                    .where(eq(investments.id, inv.id));

                renewed.push(inv.title);
            }
        }

        return c.json({
            renewed: renewed.length,
            items: renewed,
            message: renewed.length > 0 ? `Renewed ${renewed.length} items` : 'No items due for renewal'
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// FINANCE TRACKER ENDPOINTS
// ============================================

// POST: Log Daily Earnings
app.post('/api/finance/earnings', async (c) => {
    try {
        const body = await c.req.json();
        const { date, amount, source, notes } = body;

        if (!date || !amount) {
            return c.json({ error: 'date and amount are required' }, 400);
        }

        const earningsDate = date;
        const earningsAmount = parseFloat(amount);

        // Check if a log already exists for this date
        const existing = await db.select().from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), eq(dailyLogs.date, earningsDate)));

        if (existing.length > 0) {
            // Append earnings to existing log
            const currentEarnings = parseFloat(existing[0].dailyEarnings || '0');
            await db.update(dailyLogs)
                .set({
                    dailyEarnings: String(currentEarnings + earningsAmount),
                    earningsSource: source || existing[0].earningsSource || 'PACKAGE',
                    earningsNotes: notes ? `${existing[0].earningsNotes || ''} | ${notes}`.trim().replace(/^\| /, '') : existing[0].earningsNotes
                })
                .where(eq(dailyLogs.id, existing[0].id));
            return c.json({ status: 'UPDATED', total: currentEarnings + earningsAmount });
        } else {
            // Create new log entry for this date
            await db.insert(dailyLogs).values({
                userId: 1,
                date: earningsDate,
                dailyEarnings: String(earningsAmount),
                earningsSource: source || 'PACKAGE',
                earningsNotes: notes || null
            });
            return c.json({ status: 'CREATED', total: earningsAmount });
        }
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Finance Summary (buckets, revenue, savings)
app.get('/api/finance/summary', async (c) => {
    try {
        const monthStart = getMonthStartDate();
        const weekStart = getWeekStartDate();

        // Aggregate actual daily earnings for the month
        const monthLogs = await db.select().from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), gte(dailyLogs.date, monthStart)));

        // Sum actual earnings; fallback to videosProduced * 25 if no dailyEarnings
        const monthlyEarnings = monthLogs.reduce((sum, log) => {
            const actual = parseFloat(log.dailyEarnings || '0');
            const legacy = (log.videosProduced || 0) * 25;
            return sum + (actual > 0 ? actual : legacy);
        }, 0);

        // Weekly earnings
        const weekLogs = await db.select().from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), gte(dailyLogs.date, weekStart)));
        const weeklyEarnings = weekLogs.reduce((sum, log) => {
            const actual = parseFloat(log.dailyEarnings || '0');
            const legacy = (log.videosProduced || 0) * 25;
            return sum + (actual > 0 ? actual : legacy);
        }, 0);

        // Hard cap
        const maxMonthlyCapacity = Math.min(monthlyEarnings, 3300);
        // Savings = everything you earned that was NOT spent (regardless of cap)
        // Will be computed after bucket spend is tallied below

        // Baseline Buckets
        const BUCKETS: Record<string, { capacity: number; allocated: number; spent: number }> = {
            WIFE:      { capacity: 330, allocated: 0, spent: 0 },
            DAUGHTER:  { capacity: 330, allocated: 0, spent: 0 },
            ME:        { capacity: 330, allocated: 0, spent: 0 },
            RENT:      { capacity: 600, allocated: 0, spent: 0 },
            CAR:       { capacity: 600, allocated: 0, spent: 0 },
            WEDDING:   { capacity: 600, allocated: 0, spent: 0 },
            GROCERIES: { capacity: 510, allocated: 0, spent: 0 },
        };

        // Pull purchased investments this month to calculate bucket spend
        const monthlySpend = await db.select().from(investments)
            .where(and(
                eq(investments.status, 'PURCHASED'),
                gte(investments.purchasedAt, monthStart)
            ));

        for (const inv of monthlySpend) {
            const cat = (inv.category || '').toUpperCase() as keyof typeof BUCKETS;
            if (BUCKETS[cat]) {
                BUCKETS[cat].spent += parseFloat(inv.price || '0');
            }
        }

        // Set allocated = spent for display
        for (const key of Object.keys(BUCKETS)) {
            BUCKETS[key].allocated = BUCKETS[key].spent;
        }

        const totalSpent = Object.values(BUCKETS).reduce((sum, b) => sum + b.spent, 0);
        const monthlySavings = Math.max(0, monthlyEarnings - totalSpent);

        return c.json({
            weeklyEarnings,
            monthlyEarnings,
            maxMonthlyCapacity,
            monthlySavings,
            totalSpent,
            buckets: BUCKETS
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Month-by-month Finance History
app.get('/api/finance/history', async (c) => {
    try {
        const today = new Date();
        const months: { month: string; earned: number; spent: number; saved: number }[] = [];

        for (let i = 0; i < 6; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthStart = d.toISOString().split('T')[0];
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];

            const logs = await db.select().from(dailyLogs)
                .where(and(eq(dailyLogs.userId, 1), gte(dailyLogs.date, monthStart)));

            const earned = logs.reduce((sum, log) => {
                const actual = parseFloat(log.dailyEarnings || '0');
                const legacy = (log.videosProduced || 0) * 25;
                return sum + (actual > 0 ? actual : legacy);
            }, 0);

            const purchasedItems = await db.select().from(investments)
                .where(and(
                    eq(investments.status, 'PURCHASED'),
                    gte(investments.purchasedAt, monthStart)
                ));

            const spent = purchasedItems.reduce((sum, inv) => sum + parseFloat(inv.price || '0'), 0);
            const saved = Math.max(0, earned - spent);

            months.push({
                month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                earned: Math.round(earned),
                spent: Math.round(spent),
                saved: Math.round(saved)
            });
        }

        return c.json({ history: months.reverse() });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});


app.get('/api/investments/context', async (c) => {
    try {
        const weekStart = getWeekStartDate();
        const monthStart = getMonthStartDate();

        // Calculate revenue
        const weekLogs = await db.select().from(dailyLogs).where(gte(dailyLogs.date, weekStart));
        const weeklyVideos = weekLogs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);
        const weeklyRevenue = weeklyVideos * 25;

        const monthLogs = await db.select().from(dailyLogs).where(gte(dailyLogs.date, monthStart));
        const monthlyVideos = monthLogs.reduce((sum, log) => sum + (log.videosProduced || 0), 0);
        const monthlyRevenue = monthlyVideos * 25;
        const availableMonthly = Math.max(0, monthlyRevenue - 1000);

        // Get pending and recently purchased
        const pending = await db.select().from(investments).where(eq(investments.status, 'PENDING'));
        const purchased = await db.select().from(investments).where(eq(investments.status, 'PURCHASED')).orderBy(desc(investments.purchasedAt)).limit(5);

        // Generate context string for AI
        let context = `## ACQUISITION STATUS\n`;
        context += `- Weekly Revenue: $${weeklyRevenue} (${weeklyVideos} videos)\n`;
        context += `- Monthly Revenue: $${monthlyRevenue} (${monthlyVideos} videos)\n`;
        context += `- Available for Large Purchases: $${availableMonthly}\n\n`;

        context += `### PENDING ACQUISITIONS:\n`;
        pending.forEach(inv => {
            const price = parseFloat(inv.price || '0');
            const isLarge = price > 5000;
            const threshold = isLarge ? availableMonthly : weeklyRevenue;
            const isAffordable = price <= threshold;
            const shortfall = isAffordable ? 0 : price - threshold;

            context += `- ${inv.title}: $${price} [${isAffordable ? 'AFFORDABLE' : 'NOT YET'}]\n`;
            if (!isAffordable) {
                context += `  → Need $${shortfall.toFixed(0)} more (${Math.ceil(shortfall / 25)} videos)\n`;
            }
        });

        context += `\n### RECENT ACHIEVEMENTS:\n`;
        purchased.forEach(inv => {
            context += `- ${inv.title}: $${inv.price} [Purchased ${inv.purchasedAt}]\n`;
        });

        return c.json({ context });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// FITNESS PROTOCOL V2 API (4×25 Pomodoro System)
// ============================================

import { fitnessSessions, bodyMetrics } from '../src/db/schema';

// GET: Today's 4 Scheduled Sessions
app.get('/api/fitness/today', async (c) => {
    try {
        const todayStr = getTodayString();

        // Check if sessions exist for today, if not create them
        const existing = await db.select().from(fitnessSessions).where(eq(fitnessSessions.date, todayStr));

        if (existing.length === 0) {
            // Create 4 default sessions for today
            const sessionTypes = [
                { type: 'PUSHUPS', time: '07:00' },
                { type: 'ABS', time: '10:30' },
                { type: 'BICEPS', time: '15:00' },
                { type: 'CARDIO', time: '19:00' }
            ];

            for (const s of sessionTypes) {
                await db.insert(fitnessSessions).values({
                    userId: 1,
                    date: todayStr,
                    sessionType: s.type,
                    scheduledTime: s.time,
                    status: 'SCHEDULED'
                });
            }
        }

        const sessions = await db.select().from(fitnessSessions)
            .where(eq(fitnessSessions.date, todayStr))
            .orderBy(fitnessSessions.scheduledTime);

        const completed = sessions.filter(s => s.status === 'COMPLETED').length;
        const totalMinutes = completed * 25;

        return c.json({
            date: todayStr,
            sessions,
            summary: {
                completed,
                total: 4,
                minutes: totalMinutes,
                targetMinutes: 100
            }
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Start a Session
app.post('/api/fitness/session/:id/start', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));

        const updated = await db.update(fitnessSessions)
            .set({
                status: 'IN_PROGRESS',
                startedAt: new Date()
            })
            .where(eq(fitnessSessions.id, id))
            .returning();

        return c.json({ status: 'STARTED', session: updated[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Complete a Session
app.post('/api/fitness/session/:id/complete', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const body = await c.req.json();
        const { totalReps, variations, perceivedExertion, notes } = body;

        const updated = await db.update(fitnessSessions)
            .set({
                status: 'COMPLETED',
                completedAt: new Date(),
                totalReps: totalReps || 0,
                variations: variations ? JSON.stringify(variations) : null,
                perceivedExertion: perceivedExertion || null,
                notes: notes || null
            })
            .where(eq(fitnessSessions.id, id))
            .returning();

        return c.json({ status: 'COMPLETED', session: updated[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Skip a Session
app.post('/api/fitness/session/:id/skip', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        const body = await c.req.json();

        const updated = await db.update(fitnessSessions)
            .set({
                status: 'SKIPPED',
                notes: body.reason || 'Skipped'
            })
            .where(eq(fitnessSessions.id, id))
            .returning();

        return c.json({ status: 'SKIPPED', session: updated[0] });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Fitness History
app.get('/api/fitness/history', async (c) => {
    try {
        const days = parseInt(c.req.query('days') || '30');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const sessions = await db.select().from(fitnessSessions)
            .where(gte(fitnessSessions.date, startDate.toISOString().split('T')[0]))
            .orderBy(desc(fitnessSessions.date));

        return c.json({ sessions });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Log Body Metrics
app.post('/api/body-metrics', async (c) => {
    try {
        const body = await c.req.json();
        const todayStr = getTodayString();

        // Check if entry exists for today
        const existing = await db.select().from(bodyMetrics)
            .where(and(eq(bodyMetrics.date, todayStr), eq(bodyMetrics.userId, 1)));

        if (existing.length > 0) {
            // Update existing
            const updated = await db.update(bodyMetrics)
                .set(body)
                .where(eq(bodyMetrics.id, existing[0].id))
                .returning();
            return c.json({ status: 'UPDATED', metrics: updated[0] });
        } else {
            // Create new
            const created = await db.insert(bodyMetrics).values({
                userId: 1,
                date: todayStr,
                ...body
            }).returning();
            return c.json({ status: 'CREATED', metrics: created[0] });
        }
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Body Metrics History
app.get('/api/body-metrics/history', async (c) => {
    try {
        const days = parseInt(c.req.query('days') || '90');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const metrics = await db.select().from(bodyMetrics)
            .where(gte(bodyMetrics.date, startDate.toISOString().split('T')[0]))
            .orderBy(desc(bodyMetrics.date));

        return c.json({ metrics });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Discipline Correlation (Fitness vs Business Output)
app.get('/api/fitness/correlation', async (c) => {
    try {
        const days = 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];

        // Get all sessions
        const sessions = await db.select().from(fitnessSessions)
            .where(gte(fitnessSessions.date, startStr));

        // Get all daily logs (for video production)
        const logs = await db.select().from(dailyLogs)
            .where(gte(dailyLogs.date, startStr));

        // Group by date
        const sessionsByDate: Record<string, number> = {};
        sessions.forEach(s => {
            if (s.status === 'COMPLETED') {
                sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + 1;
            }
        });

        const videosByDate: Record<string, number> = {};
        logs.forEach(l => {
            videosByDate[l.date] = l.videosProduced || 0;
        });

        // Calculate correlation
        let fullSessionDays = 0;
        let fullSessionVideos = 0;
        let partialSessionDays = 0;
        let partialSessionVideos = 0;

        Object.keys(videosByDate).forEach(date => {
            const completed = sessionsByDate[date] || 0;
            const videos = videosByDate[date];

            if (completed >= 4) {
                fullSessionDays++;
                fullSessionVideos += videos;
            } else {
                partialSessionDays++;
                partialSessionVideos += videos;
            }
        });

        const avgVideosFullSession = fullSessionDays > 0 ? fullSessionVideos / fullSessionDays : 0;
        const avgVideosPartialSession = partialSessionDays > 0 ? partialSessionVideos / partialSessionDays : 0;

        return c.json({
            period: `${days} days`,
            fullSessionDays,
            avgVideosOnFullDays: avgVideosFullSession.toFixed(1),
            partialSessionDays,
            avgVideosOnPartialDays: avgVideosPartialSession.toFixed(1),
            correlationStrength: avgVideosFullSession > avgVideosPartialSession * 1.5 ? 'STRONG' :
                avgVideosFullSession > avgVideosPartialSession * 1.2 ? 'MODERATE' : 'WEAK',
            insight: `When you complete all 4 sessions, you produce ${avgVideosFullSession.toFixed(1)} videos vs ${avgVideosPartialSession.toFixed(1)} on partial days.`
        });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Fitness Context for Commander AI
app.get('/api/fitness/context', async (c) => {
    try {
        const todayStr = getTodayString();
        const sessions = await db.select().from(fitnessSessions)
            .where(eq(fitnessSessions.date, todayStr));

        let context = `## TODAY'S FITNESS STATUS\n`;
        sessions.forEach(s => {
            const statusIcon = s.status === 'COMPLETED' ? '✓' : s.status === 'IN_PROGRESS' ? '⏳' : '⏳';
            context += `- ${s.sessionType}: ${statusIcon} ${s.status}`;
            if (s.completedAt) {
                const time = new Date(s.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                context += ` (${time})`;
            }
            if (s.totalReps) context += ` - ${s.totalReps} reps`;
            if (s.perceivedExertion) context += `, RPE ${s.perceivedExertion}`;
            context += '\n';
        });

        const completed = sessions.filter(s => s.status === 'COMPLETED').length;
        context += `\n**Progress: ${completed}/4 sessions (${completed * 25}/${100} minutes)**\n`;

        return c.json({ context });
    } catch (error) {
        return c.json({ error: String(error) }, 500);
    }
});

// ============================================
// DASHBOARD DATA PERSISTENCE ENDPOINTS
// ============================================

// GET: Fetch today's complete dashboard data from database
app.get('/api/dashboard/today', async (c) => {
    try {
        await ensureUser();
        const todayStr = new Date().toISOString().split('T')[0];

        // Get or create today's log
        let todayLog = await db.select().from(dailyLogs)
            .where(and(
                eq(dailyLogs.userId, 1),
                eq(dailyLogs.date, todayStr)
            ))
            .limit(1);

        if (todayLog.length === 0) {
            // Create today's log with defaults
            const inserted = await db.insert(dailyLogs).values({
                userId: 1,
                date: todayStr,
                videosProduced: 0,
                pomodoros: 0,
                pushups: 0,
                abs: 0,
                biceps: 0,
                burpees: 0,
                sleepHours: '0',
                meditation: false,
                noSocialMedia: false,
                noYouTube: false
            }).returning();
            todayLog = inserted;
        }

        const log = todayLog[0];

        // Get historical data for week/month aggregations
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const monthStart = new Date();
        monthStart.setDate(1);

        const weekLogs = await db.select().from(dailyLogs)
            .where(and(
                eq(dailyLogs.userId, 1),
                gte(dailyLogs.date, weekStart.toISOString().split('T')[0])
            ));

        const monthLogs = await db.select().from(dailyLogs)
            .where(and(
                eq(dailyLogs.userId, 1),
                gte(dailyLogs.date, monthStart.toISOString().split('T')[0])
            ));

        // Calculate aggregations
        const weekVideos = weekLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
        const monthVideos = monthLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);
        const weekRevenue = weekVideos * 25;
        const monthRevenue = monthVideos * 25;

        // Format response matching frontend Metrics interface
        const metrics = {
            production: {
                videos: log.videosProduced || 0,
                pomodoros: log.pomodoros || 0,
                proofPhotoUrl: log.proofPhotoUrl || ''
            },
            finance: {
                revenue: (log.videosProduced || 0) * 25,
                activeClients: 0, // TODO: Track separately
                total2026: monthRevenue
            },
            fitness: {
                pushups: log.pushups || 0,
                abs: log.abs || 0,
                biceps: log.biceps || 0,
                burpees: log.burpees || 0
            },
            lifestyle: {
                sleep: parseFloat(log.sleepHours?.toString() || '0'),
                meditation: log.meditation || false,
                noSocial: log.noSocialMedia || false,
                noYouTube: log.noYouTube || false
            }
        };

        return c.json({
            success: true,
            date: todayStr,
            metrics,
            history: monthLogs.map(l => ({
                date: l.date,
                metrics: {
                    production: { videos: l.videosProduced || 0, pomodoros: l.pomodoros || 0 },
                    fitness: { pushups: l.pushups || 0, abs: l.abs || 0, biceps: l.biceps || 0, burpees: l.burpees || 0 }
                },
                isWin: l.isWin || false
            })),
            goalStatus: {
                monthVideos,
                monthTarget: 150,
                weekVideos,
                weekTarget: 35
            }
        });
    } catch (error) {
        console.error('Dashboard fetch error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// POST: Sync all dashboard metrics to database (write-through)
app.post('/api/dashboard/sync', async (c) => {
    try {
        const body = await c.req.json();
        const { date, metrics } = body;

        const dateStr = date || new Date().toISOString().split('T')[0];

        // Check if record exists
        const existing = await db.select().from(dailyLogs)
            .where(and(
                eq(dailyLogs.userId, 1),
                eq(dailyLogs.date, dateStr)
            ))
            .limit(1);

        if (existing.length > 0) {
            // Update existing record
            await db.update(dailyLogs)
                .set({
                    videosProduced: metrics.production?.videos ?? existing[0].videosProduced,
                    pomodoros: metrics.production?.pomodoros ?? existing[0].pomodoros,
                    proofPhotoUrl: metrics.production?.proofPhotoUrl ?? existing[0].proofPhotoUrl,
                    pushups: metrics.fitness?.pushups ?? existing[0].pushups,
                    abs: metrics.fitness?.abs ?? existing[0].abs,
                    biceps: metrics.fitness?.biceps ?? existing[0].biceps,
                    burpees: metrics.fitness?.burpees ?? existing[0].burpees,
                    sleepHours: metrics.lifestyle?.sleep?.toString() ?? existing[0].sleepHours,
                    meditation: metrics.lifestyle?.meditation ?? existing[0].meditation,
                    noSocialMedia: metrics.lifestyle?.noSocial ?? existing[0].noSocialMedia,
                    noYouTube: metrics.lifestyle?.noYouTube ?? existing[0].noYouTube
                })
                .where(eq(dailyLogs.id, existing[0].id));
        } else {
            // Insert new record
            await db.insert(dailyLogs).values({
                userId: 1,
                date: dateStr,
                videosProduced: metrics.production?.videos || 0,
                pomodoros: metrics.production?.pomodoros || 0,
                proofPhotoUrl: metrics.production?.proofPhotoUrl || null,
                pushups: metrics.fitness?.pushups || 0,
                abs: metrics.fitness?.abs || 0,
                biceps: metrics.fitness?.biceps || 0,
                burpees: metrics.fitness?.burpees || 0,
                sleepHours: metrics.lifestyle?.sleep?.toString() || '0',
                meditation: metrics.lifestyle?.meditation || false,
                noSocialMedia: metrics.lifestyle?.noSocial || false,
                noYouTube: metrics.lifestyle?.noYouTube || false
            });
        }

        return c.json({
            success: true,
            message: 'Metrics synced to database',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Dashboard sync error:', error);
        return c.json({ error: String(error), success: false }, 500);
    }
});

// POST: Update single field (backwards compatible with existing calls)
app.post('/api/dashboard/update', async (c) => {
    try {
        const body = await c.req.json();
        const { field, value } = body;

        const todayStr = new Date().toISOString().split('T')[0];

        // Map field names to database columns
        const fieldMap: Record<string, string> = {
            'videos': 'videosProduced',
            'pomodoros': 'pomodoros',
            'proofPhotoUrl': 'proofPhotoUrl',
            'pushups': 'pushups',
            'abs': 'abs',
            'biceps': 'biceps',
            'burpees': 'burpees',
            'sleep': 'sleepHours',
            'meditation': 'meditation',
            'noSocial': 'noSocialMedia',
            'noYouTube': 'noYouTube',
            'activeClients': 'activeClients'
        };

        const dbColumn = fieldMap[field] || field;

        // Upsert the value
        const existing = await db.select().from(dailyLogs)
            .where(and(
                eq(dailyLogs.userId, 1),
                eq(dailyLogs.date, todayStr)
            ))
            .limit(1);

        if (existing.length > 0) {
            await db.update(dailyLogs)
                .set({ [dbColumn]: value })
                .where(eq(dailyLogs.id, existing[0].id));
        } else {
            await db.insert(dailyLogs).values({
                userId: 1,
                date: todayStr,
                [dbColumn]: value
            });
        }

        return c.json({ success: true, field, value });
    } catch (error) {
        console.error('Dashboard update error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// GET: Health check for database connectivity
app.get('/api/health', async (c) => {
    try {
        await db.select().from(users).limit(1);
        return c.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
    } catch (error) {
        return c.json({ status: 'unhealthy', database: 'disconnected', error: String(error) }, 500);
    }
});

// ============================================
// COMMANDER AI - MISSION LOG JOURNAL RESPONSE
// ============================================
import { generateCommanderPrompt } from './lib/commanderPrompt';

app.post('/api/mission/log', async (c) => {
    try {
        const body = await c.req.json();
        const { journalEntry, stats } = body;

        // Get today's metrics from database for context
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = await db.select().from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), eq(dailyLogs.date, todayStr)))
            .limit(1);

        const log = todayLog[0] || { videosProduced: 0, pomodoros: 0, pushups: 0, abs: 0 };

        // Calculate campaign progress
        const campaignStart = new Date('2026-01-16');
        const today = new Date();
        const dayNumber = Math.floor((today.getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const challengeEnd = new Date('2026-02-25');
        const daysRemaining = Math.max(0, Math.floor((challengeEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        // Get month stats
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthLogs = await db.select().from(dailyLogs)
            .where(and(eq(dailyLogs.userId, 1), gte(dailyLogs.date, monthStart.toISOString().split('T')[0])));
        const monthVideos = monthLogs.reduce((sum, l) => sum + (l.videosProduced || 0), 0);

        // Generate the comprehensive 2400-word Commander prompt
        const systemPrompt = generateCommanderPrompt({
            dayNumber,
            daysRemaining,
            videosToday: log.videosProduced || stats?.videos || 0,
            pomodorosToday: log.pomodoros || 0,
            pushupsToday: log.pushups || 0,
            absToday: log.abs || 0,
            monthVideos,
            monthRevenue: monthVideos * 25,
            challengeEnd: 'February 25th, 2026'
        });

        // Call Mistral API with increased max_tokens for 500-600 word response
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `## DEBRIEF FROM THE FIELD\n\n${journalEntry}` }
                ],
                temperature: 0.7,
                max_tokens: 2000  // Increased for 500-600 word response
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Mistral API error:', error);
            return c.json({ message: 'COMMS INTERFERENCE. SATELLITE UPLINK FAILED.', mood: null }, 500);
        }

        const data = await response.json() as any;
        const aiMessage = data.choices?.[0]?.message?.content || 'NO SIGNAL FROM COMMAND.';

        // Try to extract mood from the response
        let mood = 'ACCEPTABLE';
        if (aiMessage.includes('DOMINATION') || aiMessage.includes('DOMINATING')) mood = 'DOMINATION';
        else if (aiMessage.includes('DISGRACE')) mood = 'DISGRACE';
        else if (aiMessage.includes('REDEMPTION')) mood = 'REDEMPTION';

        return c.json({ message: aiMessage, mood });
    } catch (error) {
        console.error('Mission log error:', error);
        return c.json({ message: 'COMMS ERROR. RETRY TRANSMISSION.', mood: null, error: String(error) }, 500);
    }
});

// ============================================
// DEEP WORK ACCOUNTABILITY SYSTEM API
// ============================================

// Helper function to calculate stats from sessions
function calculateDeepWorkStats(sessions: any[], period: string) {
    if (sessions.length === 0) {
        return {
            period,
            sessionCount: 0,
            totalMinutes: 0,
            totalScore: 0,
            averageSessionScore: 0,
            perfectSessions: 0,
            failedSessions: 0,
            pillarAverages: { speed: 0, focus: 0, flow: 0, priority: 0, context: 0 },
            performanceTier: 'NONE' as const
        };
    }

    const totalScore = sessions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const avgScore = totalScore / sessions.length;

    let performanceTier: 'LEGENDARY' | 'ELITE' | 'STRONG' | 'DECENT' | 'WEAK' | 'FAILED' | 'NONE' = 'DECENT';
    if (totalScore >= 110) performanceTier = 'LEGENDARY';
    else if (totalScore >= 100) performanceTier = 'ELITE';
    else if (totalScore >= 80) performanceTier = 'STRONG';
    else if (totalScore >= 60) performanceTier = 'DECENT';
    else if (totalScore >= 40) performanceTier = 'WEAK';
    else performanceTier = 'FAILED';

    return {
        period,
        sessionCount: sessions.length,
        totalMinutes: sessions.reduce((sum, s) => sum + (s.durationMinutes || 25), 0),
        totalScore,
        averageSessionScore: Math.round(avgScore * 10) / 10,
        perfectSessions: sessions.filter(s => s.totalScore === 5).length,
        failedSessions: sessions.filter(s => (s.totalScore || 0) < 0).length,
        pillarAverages: {
            speed: Math.round(sessions.reduce((sum, s) => sum + (s.scoreSpeed || 0), 0) / sessions.length * 10) / 10,
            focus: Math.round(sessions.reduce((sum, s) => sum + (s.scoreFocus || 0), 0) / sessions.length * 10) / 10,
            flow: Math.round(sessions.reduce((sum, s) => sum + (s.scoreFlow || 0), 0) / sessions.length * 10) / 10,
            priority: Math.round(sessions.reduce((sum, s) => sum + (s.scorePriority || 0), 0) / sessions.length * 10) / 10,
            context: Math.round(sessions.reduce((sum, s) => sum + (s.scoreContext || 0), 0) / sessions.length * 10) / 10,
        },
        performanceTier
    };
}

// Start a new deep work session
app.post('/api/deepwork/session/start', async (c) => {
    try {
        const body = await c.req.json();
        const { taskDescription, taskCategory, isFirstPriority } = body;

        if (!taskDescription) {
            return c.json({ error: 'Task description is required' }, 400);
        }

        const now = new Date();
        const dateStr = format(now, 'yyyy-MM-dd');

        const result = await db.insert(deepWorkSessions).values({
            userId: 1,
            date: dateStr,
            startedAt: now,
            taskDescription,
            taskCategory: taskCategory || null,
            isFirstPriority: isFirstPriority || false,
            status: 'IN_PROGRESS'
        }).returning();

        return c.json({ session: result[0], message: 'Deep work session started' });
    } catch (error) {
        console.error('Deep work start error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Record a pause during session
app.post('/api/deepwork/session/:id/pause', async (c) => {
    try {
        const sessionId = parseInt(c.req.param('id'));
        const body = await c.req.json();
        const { pauseDuration } = body; // Duration in seconds

        // Get current session
        const current = await db.select().from(deepWorkSessions).where(eq(deepWorkSessions.id, sessionId));
        if (current.length === 0) {
            return c.json({ error: 'Session not found' }, 404);
        }

        const session = current[0];
        const newPauseCount = (session.pauseCount || 0) + 1;
        const newTotalPause = (session.totalPauseSeconds || 0) + (pauseDuration || 0);

        await db.update(deepWorkSessions)
            .set({
                pauseCount: newPauseCount,
                totalPauseSeconds: newTotalPause
            })
            .where(eq(deepWorkSessions.id, sessionId));

        return c.json({ pauseCount: newPauseCount, totalPauseSeconds: newTotalPause });
    } catch (error) {
        console.error('Deep work pause error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Complete a session with ratings
app.post('/api/deepwork/session/:id/complete', async (c) => {
    try {
        const sessionId = parseInt(c.req.param('id'));
        const body = await c.req.json();
        const {
            accomplishmentNotes,
            scoreSpeed,
            scoreFocus,
            scoreFlow,
            scorePriority,
            scoreContext,
            durationMinutes
        } = body;

        // Validate scores
        const validScores = [1, 0, -2];
        if (!validScores.includes(scoreSpeed) || !validScores.includes(scoreFocus) ||
            !validScores.includes(scoreFlow) || !validScores.includes(scorePriority) ||
            !validScores.includes(scoreContext)) {
            return c.json({ error: 'Invalid score values. Must be 1, 0, or -2' }, 400);
        }

        const totalScore = scoreSpeed + scoreFocus + scoreFlow + scorePriority + scoreContext;
        const now = new Date();

        await db.update(deepWorkSessions)
            .set({
                endedAt: now,
                status: 'COMPLETED',
                accomplishmentNotes: accomplishmentNotes || null,
                scoreSpeed,
                scoreFocus,
                scoreFlow,
                scorePriority,
                scoreContext,
                totalScore,
                durationMinutes: durationMinutes || 25
            })
            .where(eq(deepWorkSessions.id, sessionId));

        // Get updated session
        const updated = await db.select().from(deepWorkSessions).where(eq(deepWorkSessions.id, sessionId));

        return c.json({
            session: updated[0],
            totalScore,
            message: totalScore >= 3 ? '🏆 EXCELLENT SESSION!' : totalScore >= 0 ? '✓ Good work' : '⚠ Room for improvement'
        });
    } catch (error) {
        console.error('Deep work complete error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Abandon a session
app.post('/api/deepwork/session/:id/abandon', async (c) => {
    try {
        const sessionId = parseInt(c.req.param('id'));

        await db.update(deepWorkSessions)
            .set({
                endedAt: new Date(),
                status: 'ABANDONED',
                totalScore: -10 // Maximum penalty for abandoning
            })
            .where(eq(deepWorkSessions.id, sessionId));

        return c.json({ message: 'Session abandoned' });
    } catch (error) {
        console.error('Deep work abandon error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get today's stats
app.get('/api/deepwork/stats/today', async (c) => {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(and(
                eq(deepWorkSessions.date, today),
                eq(deepWorkSessions.status, 'COMPLETED')
            ))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, 'today'),
            sessions
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get yesterday's stats
app.get('/api/deepwork/stats/yesterday', async (c) => {
    try {
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(and(
                eq(deepWorkSessions.date, yesterday),
                eq(deepWorkSessions.status, 'COMPLETED')
            ))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, 'yesterday'),
            sessions
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get this week's stats
app.get('/api/deepwork/stats/week', async (c) => {
    try {
        const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(and(
                gte(deepWorkSessions.date, weekAgo),
                eq(deepWorkSessions.status, 'COMPLETED')
            ))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, 'week'),
            sessions
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get this month's stats
app.get('/api/deepwork/stats/month', async (c) => {
    try {
        const monthAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(and(
                gte(deepWorkSessions.date, monthAgo),
                eq(deepWorkSessions.status, 'COMPLETED')
            ))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, 'month'),
            sessions
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get all-time stats
app.get('/api/deepwork/stats/alltime', async (c) => {
    try {
        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(eq(deepWorkSessions.status, 'COMPLETED'))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, 'alltime'),
            sessionCount: sessions.length
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get stats for custom date range
app.get('/api/deepwork/stats/range', async (c) => {
    try {
        const from = c.req.query('from');
        const to = c.req.query('to');

        if (!from || !to) {
            return c.json({ error: 'from and to dates are required (YYYY-MM-DD format)' }, 400);
        }

        const sessions = await db.select()
            .from(deepWorkSessions)
            .where(and(
                gte(deepWorkSessions.date, from),
                sql`${deepWorkSessions.date} <= ${to}`,
                eq(deepWorkSessions.status, 'COMPLETED')
            ))
            .orderBy(desc(deepWorkSessions.startedAt));

        return c.json({
            stats: calculateDeepWorkStats(sessions, `${from} to ${to}`),
            sessions
        });
    } catch (error) {
        console.error('Deep work stats error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

// Get personal records
app.get('/api/deepwork/stats/records', async (c) => {
    try {
        // Get all completed sessions
        const allSessions = await db.select()
            .from(deepWorkSessions)
            .where(eq(deepWorkSessions.status, 'COMPLETED'));

        // Group by date to find best day
        const byDate: Record<string, number> = {};
        allSessions.forEach(s => {
            const d = s.date;
            byDate[d] = (byDate[d] || 0) + (s.totalScore || 0);
        });

        const bestDay = Object.entries(byDate).reduce((best, [date, score]) =>
            score > best.score ? { date, score } : best
            , { date: '', score: -999 });

        // Count perfect sessions
        const perfectCount = allSessions.filter(s => s.totalScore === 5).length;

        // Find longest positive streak (consecutive positive score days)
        const sortedDates = [...new Set(allSessions.map(s => s.date))].sort();
        let currentStreak = 0;
        let longestStreak = 0;

        for (const date of sortedDates) {
            const dayScore = byDate[date];
            if (dayScore > 0) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return c.json({
            bestDay,
            totalSessions: allSessions.length,
            perfectSessions: perfectCount,
            longestPositiveStreak: longestStreak,
            allTimeScore: allSessions.reduce((sum, s) => sum + (s.totalScore || 0), 0),
            averageScore: allSessions.length > 0
                ? Math.round(allSessions.reduce((sum, s) => sum + (s.totalScore || 0), 0) / allSessions.length * 10) / 10
                : 0
        });
    } catch (error) {
        console.error('Deep work records error:', error);
        return c.json({ error: String(error) }, 500);
    }
});

const port = 3000;

// Export for Netlify Functions
export default app;

// Export port for local dev script
export { port };
