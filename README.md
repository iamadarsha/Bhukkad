# Bhukkad

Bhukkad is a restaurant operations platform built as a single Next.js application with a custom Node server, SQLite persistence, and Socket.IO realtime updates. It covers dine-in service, POS workflows, kitchen ticketing, menu and modifier management, tablet ordering, inventory, customers, reservations, reports, and outlet settings.

## Product Surface

- Dashboard with operational KPIs
- POS and table service
- Kitchen KOT queue and status updates
- Tablet and QR ordering
- Menu categories, items, variants, modifiers, and modifier groups
- Customers, loyalty, and reservations
- Inventory and purchasing flows
- Reports and outlet configuration

## Tech Stack

- Next.js 15 App Router + React 19 + TypeScript
- NextAuth v5 credentials authentication
- Drizzle ORM + `better-sqlite3`
- Tailwind CSS v4 + Radix UI primitives
- Socket.IO for kitchen and table state sync
- Zod, React Hook Form, TanStack Query/Table, Zustand, Recharts

More detail lives in [docs/TECH_STACK.md](docs/TECH_STACK.md).

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Local Setup

1. Install dependencies:
   `npm install`
2. Create a local env file:
   `cp .env.example .env.local`
3. Update `.env.local` with at least a real `AUTH_SECRET`.
4. Initialize the database and seed demo data:
   `npm run db:setup`
5. Start the development server:
   `npm run dev`

The app runs on [http://localhost:3000](http://localhost:3000).

## Demo Access

`npm run db:setup` seeds demo users you can use immediately:

| Role | Email | Password | PIN |
| --- | --- | --- | --- |
| Owner | `admin@admin.com` | `admin` | `1111` |
| Manager | `manager@spicegarden.com` | `Mgr@123` | `2222` |
| Cashier | `cashier@spicegarden.com` | `Cash@123` | `3333` |
| Waiter | `waiter1@spicegarden.com` | `Wait@123` | `4444` |
| Kitchen | `kitchen@spicegarden.com` | `Kitch@123` | `5555` |
| Waiter | `waiter2@spicegarden.com` | `Wait@456` | `6666` |

These are seeded demo credentials only. Rotate or replace them before any real deployment.

## Scripts

- `npm run dev` - start the custom Next.js + Socket.IO development server via `tsx server.ts`
- `npm run build` - build the Next.js app and compile `server.ts` into `dist/server.js`
- `npm run start` - run the production server from `dist/server.js`
- `npm run lint` - run ESLint
- `npm run clean` - clear Next.js build artifacts
- `npm run db:push` - push the Drizzle schema to `sqlite.db`
- `npm run db:seed` - reseed the demo database
- `npm run db:setup` - schema push plus demo seed
- `npm run db:studio` - open Drizzle Studio

## Environment

See [.env.example](.env.example) for the supported variables.

Core variables:

- `APP_URL` - canonical app URL and Socket fallback origin
- `AUTH_SECRET` - NextAuth signing secret
- `NEXT_PUBLIC_GEMINI_API_KEY` - optional client-side Gemini integration
- `HOSTNAME` - host binding for the custom Node server
- `PORT` - port for the custom Node server
- `SOCKET_ALLOWED_ORIGINS` - comma-separated Socket.IO CORS origins

## Project Structure

```text
app/              App Router pages, layouts, and route handlers
components/       UI primitives and product-specific interface components
db/               Drizzle schema, DB bootstrap, and seed data
docs/             Technical documentation and handoff material
lib/              Auth, order workflows, validations, and shared server logic
public/           Static assets and uploaded files
server.ts         Custom Next.js + Socket.IO server entrypoint
middleware.ts     Route protection for page requests
BRANDING.md       Brand system reference for UI work
CLAUDE.md         Claude Code project memory
AGENTS.md         General agent handoff document
```

## Documentation Map

- [docs/README.md](docs/README.md) - documentation index
- [docs/RECREATION_GUIDE.md](docs/RECREATION_GUIDE.md) - source-of-truth order and exact recreation rules
- [docs/UI_SYSTEM.md](docs/UI_SYSTEM.md) - implemented visual system and shell behavior
- [docs/PAGE_BLUEPRINTS.md](docs/PAGE_BLUEPRINTS.md) - page-by-page product blueprint
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - runtime and module layout
- [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md) - route handler inventory
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - schema overview by domain
- [docs/TECH_STACK.md](docs/TECH_STACK.md) - concrete dependency and runtime stack
- [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) - common dev loops and verification expectations
- [CLAUDE.md](CLAUDE.md) - Claude Code handoff
- [AGENTS.md](AGENTS.md) - agent handoff for Antigravity and other coding agents
- [BRANDING.md](BRANDING.md) - UI and brand rules
- [docs/brand/pdf/bhukkad-brand-guidelines.pdf](docs/brand/pdf/bhukkad-brand-guidelines.pdf) - exportable brand book

If the task is to recreate Bhukkad exactly, start with `docs/RECREATION_GUIDE.md`, then `docs/UI_SYSTEM.md`, then `docs/PAGE_BLUEPRINTS.md` before changing code.

## Runtime Notes

- The app uses a custom `server.ts`, so development and production should go through the npm scripts instead of raw `next dev`.
- `/api` routes are not protected by middleware; they enforce auth inside each route handler with `auth()`.
- The app stores state locally in `sqlite.db` and writes uploads to `public/uploads`.
- Realtime behavior depends on Socket.IO rooms for outlet, kitchen, POS, and table updates.
- Seed data also installs sample avatars, menu imagery, and realistic restaurant records for local demos.
