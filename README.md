# Bhukkad POS

A full-featured restaurant Point-of-Sale and management system built with **Next.js 15, React 19, SQLite, and Material Design 3**.

> **For Codex / new contributors:** Read [`HANDOVER.md`](./HANDOVER.md) first — it has the full architecture, schema, workflow, and known gaps.

## Quick Start

```bash
npm install
npm run db:setup    # create schema + seed demo data
npm run dev         # http://localhost:3000
```

No API keys needed. The app auto-authenticates as `admin` in dev.

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | KPIs, sales chart, top items |
| `/pos` | Point of Sale — order, cart, payment |
| `/kitchen` | Kitchen Display System (real-time KOTs) |
| `/orders` | Order history |
| `/menu` | Menu items, categories, modifiers |
| `/tables` | Floor plan & table management |
| `/customers` | Customer profiles & loyalty |
| `/inventory` | Stock levels & suppliers |
| `/reservations` | Table booking |
| `/reports` | Revenue analytics |
| `/settings` | Outlet config, staff, billing |

## Scripts

```bash
npm run dev          # Development (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run db:setup     # Fresh DB setup (push schema + seed)
npm run db:studio    # Drizzle GUI
npm run lint         # ESLint
```

## Stack

Next.js 15 · React 19 · TypeScript · TailwindCSS · Material Design 3 · SQLite · Drizzle ORM · NextAuth.js v5 · Zustand · Socket.io · Recharts · Radix UI
