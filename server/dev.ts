// Local development server - NOT used by Netlify Functions
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import * as fs from 'fs';
import * as path from 'path';
import app, { port } from './index';

// Setup uploads directory (local only)
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads/*', serveStatic({ root: './public' }));

// Start server
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port
});
