import { zValidator } from '@hono/zod-validator';
import { Redis } from '@upstash/redis';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { handle } from 'hono/vercel';
import nodemailer from 'nodemailer';
import { z } from 'zod';

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

type EmailEnvConfig = {
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
};

// Validated request body for POST /api/result. zValidator also feeds the
// typed input into the RPC client, so `client.api.result.$post` requires
// exactly this shape at the call site.
const resultSchema = z.object({
  score: z.number(),
  userName: z.string().min(1),
});

// Validated request body for POST /api/contact.
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  message: z.string().min(1),
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
  })
  .post('/contact', zValidator('json', contactSchema), async c => {
    try {
      const { name, email, message } = c.req.valid('json');
      const { EMAIL_USER, EMAIL_PASSWORD } = env<EmailEnvConfig>(c);

      if (!EMAIL_USER || !EMAIL_PASSWORD) {
        return c.json(
          {
            error: 'Failed to send message: Email configuration missing. Need to fix application.',
          },
          500
        );
      }

      let transporter;
      try {
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
          },
        });

        await transporter.verify();
      } catch (error) {
        console.error('Failed to create email transport:', error);
        return c.json(
          { error: 'Failed to initialize email service. Please try again later.' },
          500
        );
      }

      const htmlMessage = message
        .split('\n')
        .map(line => `<div>${line}</div>`)
        .join('');

      const mailOptions = {
        from: `"Typing Game Contact Form" <${EMAIL_USER}>`,
        to: 'shinguakira1022@gmail.com',
        replyTo: email,
        subject: `New message from ${name} via Typing Game Contact Form`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${htmlMessage}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              This email was sent from the contact form on the Typing Game website.
            </p>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        return c.json({ success: true, messageId: info.messageId }, 200);
      } catch (error) {
        console.error('Failed to send email:', error);
        return c.json({ error: 'Failed to send email. Please try again later.' }, 500);
      }
    } catch (error) {
      console.error('Error details:', error instanceof Error ? error.toString() : 'Unknown error');
      return c.json({ error: 'Failed to send message: Need to fix application.' }, 500);
    }
  });

// Type-only export consumed by the RPC client (`hc<AppType>`). It is erased at
// compile time, so no server code leaks into the browser bundle.
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
