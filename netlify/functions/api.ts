// Netlify Functions adapter for Hono
// Netlify Functions are AWS Lambda under the hood, NOT Edge Functions
import { handle } from 'hono/aws-lambda';
import app from '../../server/index';

export const handler = handle(app);
