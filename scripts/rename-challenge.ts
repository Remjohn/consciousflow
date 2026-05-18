// Quick rename of active challenge
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);

async function renameChallenge() {
    const result = await sql`
        UPDATE challenges 
        SET name = '40-Day of a Silent Killer' 
        WHERE status = 'ACTIVE' 
        RETURNING id, name
    `;
    console.log('✓ Challenge renamed:', result[0]);
}

renameChallenge().catch(console.error);
