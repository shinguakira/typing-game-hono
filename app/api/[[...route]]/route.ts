import { handle } from 'hono/vercel';
import { app } from './app';

// This file is only the Next.js App Router mount: it adapts the Hono app
// (defined in ./app) into Next route handlers via hono/vercel. The app runs
// inside Next.js — it is not a separate server.
export const GET = handle(app);
export const POST = handle(app);
