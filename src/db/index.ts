import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// DATABASE_URL is required - fail gracefully if missing
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.error('Available env vars:', Object.keys(process.env).filter(k => !k.includes('npm')).join(', '));
}

// Create connection (will throw if databaseUrl is undefined, but with clear error)
const sql = neon(databaseUrl || '');
export const db = drizzle(sql, { schema });
