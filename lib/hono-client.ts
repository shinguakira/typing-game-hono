import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/app';

// Typed RPC client for the Hono API that runs INSIDE this Next.js app
// (served by app/api/[[...route]]/route.ts via hono/vercel `handle`) — it is
// NOT a separate/isolated Hono server. `hc` is just a type-safe fetch wrapper
// that calls the same-origin `/api/*` routes.
//
// The base is '/' so requests are relative to the current origin. These calls
// run in client components (browser), matching the previous raw fetch usage.
export const client = hc<AppType>('/');
