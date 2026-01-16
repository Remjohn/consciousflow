// Full database cleanup for fresh campaign start on January 16th, 2026
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

async function fullCleanup() {
    console.log('🧹 FULL DATABASE CLEANUP for Campaign Day 1...\n');

    // Delete ALL daily_logs before 2026-01-16
    const dailyLogsResult = await sql`
        DELETE FROM daily_logs 
        WHERE date < '2026-01-16'
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${dailyLogsResult.length} daily_logs entries before 2026-01-16`);
    if (dailyLogsResult.length > 0) {
        dailyLogsResult.forEach((r: any) => console.log(`  - ${r.date}`));
    }

    // Delete ALL fitness_sessions before 2026-01-16
    const fitnessResult = await sql`
        DELETE FROM fitness_sessions 
        WHERE date < '2026-01-16'
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${fitnessResult.length} fitness_sessions before 2026-01-16`);

    // Delete ALL challenges (we'll create fresh ones)
    const challengesResult = await sql`
        DELETE FROM challenges
        RETURNING id, name
    `;
    console.log(`✓ Deleted ${challengesResult.length} old challenges`);

    // Create fresh Tour 1 challenge starting Jan 16
    const newChallenge = await sql`
        INSERT INTO challenges (user_id, name, target_videos, target_days, daily_pushups_required, daily_abs_required, start_time_deadline, min_videos_per_2_days, start_date, status)
        VALUES (1, 'Tour 1 - The 40-Day War', 150, 40, 250, 250, '05:45', 8, '2026-01-16', 'ACTIVE')
        RETURNING id, name, start_date
    `;
    console.log(`✓ Created fresh challenge: ${newChallenge[0].name} starting ${newChallenge[0].start_date}`);

    // Create today's log with zeros
    const todayLog = await sql`
        INSERT INTO daily_logs (user_id, date, videos_produced, pomodoros, pushups, abs, meditation, no_social_media, no_youtube, is_win)
        VALUES (1, '2026-01-16', 0, 0, 0, 0, false, false, false, false)
        ON CONFLICT (user_id, date) DO UPDATE SET
            videos_produced = 0,
            pomodoros = 0,
            pushups = 0,
            abs = 0
        RETURNING id, date
    `;
    console.log(`✓ Created fresh daily_log for ${todayLog[0].date}`);

    console.log('\n✅ DATABASE CLEAN! Campaign Day 1 is ready.');
    console.log('🚀 THE 120-DAY WAR BEGINS NOW. FOR KIMYA.');
}

fullCleanup().catch(console.error);
