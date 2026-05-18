import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { deepWorkSessions, dailyLogs } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessions = await db.select().from(deepWorkSessions).where(eq(deepWorkSessions.date, todayStr));
    console.log('Sessions today:', JSON.stringify(sessions, null, 2));
    const logs = await db.select().from(dailyLogs).where(eq(dailyLogs.date, todayStr));
    console.log('Daily log today:', JSON.stringify(logs, null, 2));
}

main().catch(console.error);
