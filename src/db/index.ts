import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use process.env.DATABASE_URL (loaded by dotenv in server/index.ts)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
