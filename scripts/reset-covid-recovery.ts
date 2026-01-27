// Hard Reset for COVID Recovery - New Campaign Start: January 27th, 2026
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

const NEW_START_DATE = '2026-01-27';
const RESET_REASON = 'COVID Recovery - Hard Reset';

async function hardResetChallenge() {
    console.log('🔄 HARD RESET: COVID RECOVERY');
    console.log(`📅 New campaign start date: ${NEW_START_DATE}\n`);

    // 1. Mark ALL active challenges as FAILED
    const failedChallenges = await sql`
        UPDATE challenges 
        SET status = 'FAILED',
            failure_reason = ${RESET_REASON},
            failed_at = ${NEW_START_DATE}
        WHERE status = 'ACTIVE'
        RETURNING id, name, start_date
    `;
    console.log(`✓ Marked ${failedChallenges.length} active challenge(s) as FAILED`);
    failedChallenges.forEach((c: any) => console.log(`  - ${c.name} (started ${c.start_date})`));

    // 2. Delete ALL daily_logs before new start date
    const dailyLogsResult = await sql`
        DELETE FROM daily_logs 
        WHERE date < ${NEW_START_DATE}
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${dailyLogsResult.length} daily_logs entries before ${NEW_START_DATE}`);

    // 3. Delete ALL fitness_sessions before new start date
    const fitnessResult = await sql`
        DELETE FROM fitness_sessions 
        WHERE date < ${NEW_START_DATE}
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${fitnessResult.length} fitness_sessions before ${NEW_START_DATE}`);

    // 4. Delete ALL deep_work_sessions before new start date
    const deepWorkResult = await sql`
        DELETE FROM deep_work_sessions 
        WHERE date < ${NEW_START_DATE}
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${deepWorkResult.length} deep_work_sessions before ${NEW_START_DATE}`);

    // 5. Delete ALL kegel_sessions before new start date
    const kegelResult = await sql`
        DELETE FROM kegel_sessions 
        WHERE date < ${NEW_START_DATE}
        RETURNING id, date
    `;
    console.log(`✓ Deleted ${kegelResult.length} kegel_sessions before ${NEW_START_DATE}`);

    // 6. Reset user cumulative stats
    const userReset = await sql`
        UPDATE users 
        SET videos_total = 0,
            current_balance = '0'
        WHERE id = 1
        RETURNING id, name
    `;
    console.log(`✓ Reset cumulative stats for user: ${userReset[0]?.name || 'Unknown'}`);

    // 7. Create NEW challenge starting today
    const newChallenge = await sql`
        INSERT INTO challenges (
            user_id, 
            name, 
            target_videos, 
            target_days, 
            daily_pushups_required, 
            daily_abs_required, 
            start_time_deadline, 
            min_videos_per_2_days, 
            start_date, 
            status
        )
        VALUES (
            1, 
            'Tour 2 - The Rebirth (Post-COVID)', 
            150, 
            40, 
            250, 
            250, 
            '05:45', 
            8, 
            ${NEW_START_DATE}, 
            'ACTIVE'
        )
        RETURNING id, name, start_date
    `;
    console.log(`✓ Created NEW challenge: "${newChallenge[0].name}"`);
    console.log(`  📅 Start date: ${newChallenge[0].start_date}`);

    // 8. Create fresh daily_log for Day 1
    const todayLog = await sql`
        INSERT INTO daily_logs (
            user_id, 
            challenge_id,
            date, 
            videos_produced, 
            pomodoros, 
            pushups, 
            abs, 
            meditation, 
            no_social_media, 
            no_youtube, 
            is_win
        )
        VALUES (
            1, 
            ${newChallenge[0].id},
            ${NEW_START_DATE}, 
            0, 
            0, 
            0, 
            0, 
            false, 
            false, 
            false, 
            false
        )
        ON CONFLICT (user_id, date) DO UPDATE SET
            challenge_id = ${newChallenge[0].id},
            videos_produced = 0,
            pomodoros = 0,
            pushups = 0,
            abs = 0
        RETURNING id, date
    `;
    console.log(`✓ Created fresh daily_log for Day 1: ${todayLog[0].date}`);

    console.log('\n' + '═'.repeat(50));
    console.log('✅ HARD RESET COMPLETE!');
    console.log('═'.repeat(50));
    console.log(`\n🔥 THE REBIRTH BEGINS NOW. DAY 1 OF 40.`);
    console.log(`📅 ${NEW_START_DATE} - THE COMEBACK STARTS HERE.`);
    console.log(`💪 150 Videos. 40 Days. NO EXCUSES.\n`);
}

hardResetChallenge().catch(console.error);
