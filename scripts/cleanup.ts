// Simple cleanup for fresh Day 1
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

async function run() {
    console.log('🧹 FULL CLEANUP...\n');

    // Delete ALL daily_logs
    await sql`DELETE FROM daily_logs`;
    console.log('✓ Deleted all daily_logs');

    // Check challenges
    const challenges = await sql`SELECT * FROM challenges`;
    console.log('✓ Challenges:', challenges.map((c: any) => `${c.name} (${c.start_date})`));

    console.log('\n✅ CLEAN! Refresh your browser.');
    console.log('🚀 Campaign Day 1 starts fresh.');
}

run().catch(console.error);
