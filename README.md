# Typing Game with Hono

A fun typing game built with Next.js, Hono, and Upstash Redis for the leaderboard system. Test your typing speed with programming-related words, Tailwind CSS classnames, Material UI components, or Shadcn UI components!

![Game Screenshot](./public/monster1.jpg)

## Features

- 🎮 Multiple game modes: Tech Terms, Tailwind CSS, Material UI, and Shadcn UI components
- 🌐 Internationalization (i18n) support for better SEO
- 🎵 Background music and sound effects for immersion
- 📊 Global leaderboard using Upstash Redis
- 🎯 Score calculation based on typing speed
- 🔄 Play again feature with new random questions
- 🎨 Themed visuals for each question category

## Tech Stack

- **Frontend:**
  - ⚡ Next.js 15
  - ⚛️ React
  - 📘 TypeScript
  - 🎨 Tailwind CSS

- **Backend:**
  - 🚀 Hono (API Routes)
  - 🗄️ Upstash Redis (Leaderboard)

- **Development:**
  - 🏃 Bun (Runtime & Package Manager)
  - 🔧 ESLint
  - ▲ Vercel (Deployment)

- **Assets:**
  - 👾 5 unique monster images
  - 🎵 Background music (bgm.mp3)
  - 🔊 Sound effects (shot.mp3)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Rules

1. Type the displayed programming term correctly
2. Score is calculated based on typing speed:
   - Base score: 10,000 points
   - Time deduction: 100 points per second
   - Minimum score: 1,000 points

## Project Structure

```
typing-game-hono/
├── app/
│   ├── api/
│   │   └── [[...route]]/     # Hono API routes
│   ├── components/
│   │   ├── StartPage.tsx     # Start page component
│   │   ├── TypingPage.tsx    # Typing game component
│   │   └── ResultPage.tsx    # Results and leaderboard component
│   ├── context/
│   │   └── GameContext.tsx   # Shared state management
│   ├── i18n/
│   │   └── dictionaries.ts   # Internationalization support
│   └── page.tsx              # Main component with conditional rendering
├── constants/
│   └── page.tsx              # Question pools (tech, tailwind, material, shadcn)
├── middleware.ts             # i18n middleware
├── public/
│   ├── monster1-5.jpg        # Monster images for tech questions
│   ├── mui-real/             # Material UI component images
│   ├── shadcn-real/          # Shadcn UI component images
│   ├── bgm.mp3               # Background music
│   └── shot.mp3              # Sound effect
└── .env                      # Environment variables
```

## Deployment

The game is deployed on Vercel and uses Upstash Redis for the leaderboard system.
