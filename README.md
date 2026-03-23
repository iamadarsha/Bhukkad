# Bhukkad

Bhukkad is a restaurant operations app built with Next.js, NextAuth, Drizzle ORM, SQLite, and Socket.IO. It includes dashboard analytics, POS flows, menu management, KOT handling, reports, and staff-facing operational tooling.

## Stack

- Next.js 15 + React 19
- NextAuth v5 beta
- Drizzle ORM + SQLite
- Tailwind CSS v4
- Socket.IO for live updates

## Local Development

Prerequisites:

- Node.js 20+
- npm

Setup:

1. Install dependencies:
   `npm install`
2. Create a local env file:
   `cp .env.example .env.local`
3. Update `.env.local` with a real `AUTH_SECRET` and any optional API keys.
4. Initialize the database:
   `npm run db:setup`
5. Start the app:
   `npm run dev`

The app runs on [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the Next.js + Socket.IO server in development
- `npm run build` — build the Next.js app and compile the custom server
- `npm run start` — run the production server from `dist/server.js`
- `npm run lint` — run ESLint
- `npm run db:push` — push the Drizzle schema
- `npm run db:seed` — seed demo data
- `npm run db:setup` — schema push + seed

## Environment

See [.env.example](/Users/debadritamukhopadhyay/Bhukkad/.env.example) for supported variables.

## Notes

- Uploaded files are stored in `public/uploads`.
- Seed data references placeholder avatars and menu imagery in `public/avatars` and `public/menu`.
- Socket.IO origins can be controlled with `SOCKET_ALLOWED_ORIGINS`.
