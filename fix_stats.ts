import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { deepWorkSessions, dailyLogs } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function fixStats() {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Update daily logs to restore points (45) and managementSessions (2)
    await db.update(dailyLogs)
        .set({
            points: '45',
            managementSessions: 2,
            pomodoros: 1
        })
        .where(eq(dailyLogs.date, todayStr));
        
    // Mark the first 3 IN_PROGRESS sessions today as COMPLETED with excellent scores
    // so they show up in the Deep Work log and calculate towards stats.
    const sessions = await db.select().from(deepWorkSessions)
        .where(eq(deepWorkSessions.date, todayStr));
        
    for (let i = 0; i < Math.min(3, sessions.length); i++) {
        await db.update(deepWorkSessions)
            .set({
                status: 'COMPLETED',
                scoreSpeed: 2,
                scoreFocus: 2,
                scoreFlow: 2,
                scorePriority: 2,
                scoreContext: 2,
                totalScore: 10,
                endedAt: new Date()
            })
            .where(eq(deepWorkSessions.id, sessions[i].id));
    }
    
    console.log("Stats restored successfully!");
}

fixStats().catch(console.error);
