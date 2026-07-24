# AGENTS.md — typing-game-hono

Rules and context for AI agents (Claude Code, etc.) and humans working in this
repo. Read this before making changes. These conventions override generic
defaults.

## What this project is

An interactive typing game. **Next.js 15 (App Router) frontend + a Hono API that
runs inside Next.js.** Leaderboard is stored in Upstash Redis; the contact form
sends mail via Nodemailer. Deployed on Vercel.

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Hono (mounted in Next.js), Upstash Redis, Nodemailer
- **Runtime / package manager:** Bun (Vercel build also uses Bun)

## Commands

Use **bun** for everything. Do not introduce npm/yarn/pnpm lockfiles.

| Task | Command |
| --- | --- |
| Dev server | `bun run dev` |
| Production build (type-checks first) | `bun run build` |
| Type check | `bun run typecheck` |
| Tests | `bun test` |
| Lint | `bun run oxlint` (fix: `bun run oxlint:fix`) |
| Format | `bun run oxfmt` (check: `bun run oxfmt:check`) |
| Dead-code / unused deps | `bun run knip` |

Before committing, a change should pass: `bun run typecheck`, `bun run build`,
`bun test`, `bun run oxlint`, `bun run knip`.

## Architecture rules (important)

### 1. Hono is the Next.js backend — never an isolated server

The Hono app is defined in [`app/api/[[...route]]/app.ts`](app/api/[[...route]]/app.ts)
and mounted into Next.js by [`app/api/[[...route]]/route.ts`](app/api/[[...route]]/route.ts)
via `handle(app)` from `hono/vercel`. It runs on the same Vercel deployment as
the frontend. **Do not** spin up a standalone `@hono/node-server` / Bun server,
and do not add a separate backend process.

- `app.ts` is the single source of truth: routes, schemas, and the `app`/`AppType`
  exports live there.
- `route.ts` is only the Next mount (`export const GET/POST = handle(app)`).

### 2. Use Hono RPC to the fullest — the client is typed, never use raw fetch

The frontend talks to the API **only** through the typed RPC client in
[`lib/hono-client.ts`](lib/hono-client.ts) (`client.api.<route>.$get()/$post()`).

- ❌ Do **not** call the API with `fetch('/api/...')` from components/hooks.
- ✅ Do use `client.api.result.$get()`, `client.api.contact.$post({ json })`, etc.
- Derive frontend types from the server with `InferResponseType<...>` instead of
  hand-declaring response shapes (see `type Score` in
  [`app/context/GameContext.tsx`](app/context/GameContext.tsx)).
- Narrow responses with `if (res.ok) { ... }` before `await res.json()`.

How RPC works here: routes are **chained** into one `app` expression so
`typeof app` (exported as `AppType`) carries every route's input/output types.
`hc<AppType>` reflects that into a typed client — pure compile-time inference, no
codegen. `AppType` is imported with `import type`, so no server code (Redis,
Nodemailer) reaches the browser bundle.

### 3. Adding or changing an endpoint

1. Add the route to the chained `app` in `app.ts` (keep it chained — the type
   inference depends on it).
2. Validate input with `@hono/zod-validator`: `zValidator('json', schema)` and
   read it via `c.req.valid('json')`. Don't hand-roll `c.req.json()` + manual
   presence checks.
3. Return typed JSON with explicit status codes (`c.json(payload, 200)`).
4. Call it from the frontend via the `client` — never raw fetch.
5. Add/extend a smoke test in [`tests/`](tests/).

### 4. Type checking uses tsgo, not tsc

Type checking is done by **tsgo** (`@typescript/native-preview`) via
`bun run typecheck`, and `bun run build` runs it before `next build`. Next's own
tsc pass is disabled (`typescript.ignoreBuildErrors` in
[`next.config.ts`](next.config.ts)) on purpose. `typescript` (v5) stays a
devDependency because Next needs it, but it is not the type checker. Side-effect
CSS imports need an ambient `*.css` declaration ([`types/css.d.ts`](types/css.d.ts)).

### 5. Lint / format / dead code

- **oxlint** (`.oxlintrc.json`) is the linter, **oxfmt** (`.oxfmtrc.json`, migrated
  from the old Prettier config) is the formatter. Prettier/ESLint still exist but
  oxlint+oxfmt are preferred for new work.
- **knip** (`knip.json`) guards unused files/exports/deps. If knip flags a
  false positive (a dep used only implicitly), add it to `ignoreDependencies`
  rather than deleting the dep.

### 6. Testing

`bun test` runs the smoke tests in [`tests/`](tests/) directly against the Hono
`app` (via `hono/testing` + `app.request`) — no dev server, no Redis/SMTP. Cover
health, validation (400) and routing (404) there. Happy paths that hit Redis or
mail need mocked dependencies.

## Formatting conventions

Single quotes, semicolons, 2-space indent, width 100, `trailingComma: es5`,
`arrowParens: avoid`. Enforced by oxfmt — just run `bun run oxfmt`.

## Project layout

```
app/
  api/[[...route]]/
    app.ts        # THE Hono app: routes, zod schemas, exports app + AppType
    route.ts      # Next.js mount only: handle(app)
  components/     # React components (StartPage, TypingPage, ResultPage, ContactForm, ...)
  context/GameContext.tsx  # global state; calls the API via the RPC client
  i18n/dictionaries.ts     # i18n strings
  page.tsx        # main screen (conditional rendering by game phase)
lib/
  hono-client.ts  # hc<AppType> typed RPC client — the ONLY way the UI hits the API
  utils.ts
constants/page.tsx # question pools (tech / tailwind / material / shadcn / monster)
middleware.ts      # i18n locale middleware (excludes /api)
tests/             # bun test smoke tests
```

## Environment variables

Set in `.env` (see `.env.example`):

- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — leaderboard
- `EMAIL_USER`, `EMAIL_PASSWORD` — contact-form mail (Gmail SMTP)

## Scoring rule

Base 10,000 points; −100 per second; minimum 1,000. Implemented in
`addResult` in `GameContext.tsx`.
