import { zValidator } from '@hono/zod-validator';
import { Redis } from '@upstash/redis';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { handle } from 'hono/vercel';
import { z } from 'zod';

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

// Validated request body for POST /api/result. zValidator also feeds the
// typed input into the RPC client, so `client.api.result.$post` requires
// exactly this shape at the call site.
const resultSchema = z.object({
  score: z.number(),
  userName: z.string().min(1),
});

// Routes are chained into a single expression so `typeof app` carries every
// route's input/output types — that is what the Hono RPC client infers from.
const app = new Hono()
  .basePath('/api')
  .get('/ping', c => {
    return c.text('pong');
  })
  .post('/result', zValidator('json', resultSchema), async c => {
    try {
      // Typed + already validated by zValidator; invalid bodies get a 400
      // before this handler runs.
      const { score, userName } = c.req.valid('json');

      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<EnvConfig>(c);

      const redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const result = {
        score: score,
        member: userName,
      };

      await redis.zadd('typing-score-rank', result);

      return c.json({ message: 'Success' }, 200);
    } catch (error: unknown) {
      return c.json({ message: (error as Error).message }, 500);
    }
  })
  .get('/result', async c => {
    try {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<EnvConfig>(c);

      const redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const result = await redis.zrange('typing-score-rank', 0, 9, {
        rev: true,
        withScores: true,
      });

      // Type the shape explicitly so the RPC client infers a real
      // `{ userName: string; score: number }[]` instead of `any[]`.
      const scores: { userName: string; score: number }[] = [];
      for (let i = 0; i < result.length; i += 2) {
        scores.push({
          userName: String(result[i]),
          score: Number(result[i + 1]),
        });
      }

      return c.json({ results: scores });
    } catch (error: unknown) {
      return c.json({ message: (error as Error).message }, 500);
    }
  });

// Type-only export consumed by the RPC client (`hc<AppType>`). It is erased at
// compile time, so no server code leaks into the browser bundle.
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
