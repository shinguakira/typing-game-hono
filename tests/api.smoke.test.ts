/// <reference types="bun" />
import { describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { app } from '@/app/api/[[...route]]/app';

// Smoke tests for the Hono API that runs inside Next.js. These exercise the
// app directly (no network, no dev server) via Hono's request helper and the
// typed test client. They cover the paths that need no external services:
// the health check and zValidator's rejection of bad input (which returns 400
// before any Redis/email code runs).

describe('Hono API smoke', () => {
  it('GET /api/ping returns pong (typed test client)', async () => {
    const client = testClient(app);
    const res = await client.api.ping.$get();

    expect(res.status).toBe(200);
    expect(await res.text()).toBe('pong');
  });

  it('POST /api/result rejects a non-numeric score with 400', async () => {
    const res = await app.request('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 'not-a-number', userName: 'alice' }),
    });

    expect(res.status).toBe(400);
  });

  it('POST /api/result rejects an empty userName with 400', async () => {
    const res = await app.request('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 1234, userName: '' }),
    });

    expect(res.status).toBe(400);
  });

  it('POST /api/contact rejects an invalid email with 400', async () => {
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice', email: 'not-an-email', message: 'hello' }),
    });

    expect(res.status).toBe(400);
  });

  it('unknown route returns 404', async () => {
    const res = await app.request('/api/does-not-exist');

    expect(res.status).toBe(404);
  });
});
