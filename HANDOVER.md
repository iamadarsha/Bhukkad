# Bhukkad POS — Handover Document for Codex

## What Is This?

**Bhukkad** is a full-featured, production-ready **restaurant Point-of-Sale (POS) and management system** built with Next.js 15, React 19, and SQLite. It covers the full restaurant workflow: taking orders at POS, sending them to the kitchen (KDS), managing tables, tracking inventory, running reports, and configuring the outlet.

The app runs completely **offline-first with zero external API keys**. The Gemini AI integration has been replaced with hardcoded demo responses. Auth has a mock session fallback so the app works without login in dev.

---

## Quick Start

```bash
npm install
npm run db:setup    # create SQLite schema + seed demo data
npm run dev         # starts on http://localhost:3000
```

No `.env` changes needed for local dev. The app auto-logs in as `admin` (role: owner).

If you need to reset the database:
```bash
rm sqlite.db
npm run db:setup
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.4 (App Router) |
| Language | TypeScript 5.9 (strict mode) |
| UI | React 19 + TailwindCSS 4 + Material Design 3 |
| Components | Radix UI + shadcn/ui (heavily customized to MD3) |
| Database | SQLite via `better-sqlite3` |
| ORM | Drizzle ORM (schema-first) |
| Auth | NextAuth.js v5 (JWT, credentials + PIN) |
| State | Zustand (cart) + TanStack React Query (server state) |
| Real-time | Socket.io (kitchen orders, table selection) |
| Server | Custom HTTP server (`server.ts`) wrapping Next.js |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Tables | TanStack React Table |
| Icons | Lucide React + Material Symbols |
| Animation | Motion (Framer Motion fork) |
| Print | react-to-print (receipts/KOTs) |

---

## Project Structure

```
Bhukkad/
├── app/
│   ├── (dashboard)/              # All authenticated pages (sidebar layout)
│   │   ├── dashboard/page.tsx    # KPI cards, sales chart, top items
│   │   ├── pos/page.tsx          # Point of Sale interface
│   │   ├── kitchen/page.tsx      # Kitchen Display System (KDS)
│   │   ├── orders/page.tsx       # Order history & management
│   │   ├── menu/page.tsx         # Menu items, categories, modifiers
│   │   ├── tables/page.tsx       # Floor plan & table management
│   │   ├── customers/page.tsx    # Customer profiles & loyalty
│   │   ├── inventory/page.tsx    # Stock levels & suppliers
│   │   ├── reservations/page.tsx # Table booking system
│   │   ├── reports/page.tsx      # Revenue analytics & day-end
│   │   ├── settings/page.tsx     # Outlet config, staff, payments
│   │   ├── kot/page.tsx          # KOT-specific view
│   │   └── layout.tsx            # Sidebar + header wrapper
│   ├── api/                      # REST API routes
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── orders/               # Order CRUD + payment
│   │   ├── menu/                 # categories, items, modifiers
│   │   ├── kitchen/kots/         # KOT management
│   │   ├── tables/               # Table + section CRUD
│   │   ├── customers/            # Customer CRUD
│   │   ├── inventory/            # Stock management
│   │   ├── settings/             # Outlet settings
│   │   └── upload/               # File uploads
│   ├── login/page.tsx            # Login (email or PIN)
│   ├── layout.tsx                # Root layout + providers
│   ├── page.tsx                  # Redirects → /dashboard
│   └── globals.css               # MD3 CSS variables + base styles (~20KB)
│
├── components/
│   ├── layout/                   # sidebar, header, breadcrumb, app-shell
│   ├── ui/                       # Base components (button, badge, modal, drawer, etc.)
│   ├── pos/                      # POS-specific (cart, payment, modifier sheet, etc.)
│   ├── kitchen/                  # KOT cards, timer badge, kitchen stats
│   ├── menu/                     # Item/category/modifier modals
│   └── providers.tsx             # SessionProvider, ThemeProvider, Toaster
│
├── db/
│   ├── schema.ts                 # All 21 Drizzle table definitions
│   ├── index.ts                  # DB connection + initialization
│   └── seed.ts                   # Demo data (restaurant, staff, menu, tables)
│
├── hooks/
│   ├── use-pos-store.ts          # Zustand: cart items, table, order type, pax
│   └── use-mobile.ts             # Mobile viewport hook
│
├── lib/
│   ├── auth.ts                   # NextAuth config + mock session fallback
│   ├── auth.config.ts            # JWT strategy, cookies, session callbacks
│   ├── api-client.ts             # Axios instance with error handling
│   ├── ai.ts                     # Demo AI responses (no API key needed)
│   ├── socket.ts                 # Socket.io client
│   └── utils/
│       ├── date.ts               # Date formatting helpers
│       ├── currency.ts           # INR (₹) formatting
│       ├── hash.ts               # bcrypt password/PIN hashing
│       ├── permissions.ts        # RBAC helpers
│       └── motion.ts             # Animation config helpers
│
├── types/index.ts                # TypeScript interfaces (MenuItem, Order, etc.)
├── server.ts                     # Custom HTTP server + Socket.io setup
├── drizzle.config.ts             # Drizzle Kit config
├── next.config.ts                # Next.js config (standalone output)
├── tailwind.config.ts            # TailwindCSS + MD3 color tokens
├── middleware.ts                 # Auth middleware (disabled for demo mode)
└── sqlite.db                     # SQLite database file (auto-created by db:setup)
```

---

## Database Schema (21 Tables)

All tables are defined in `db/schema.ts` using Drizzle ORM.

### Core
| Table | Purpose |
|-------|---------|
| `users` | Staff accounts with email/password/PIN, role, outletId |
| `roles` | Roles (owner/manager/cashier/waiter/kitchen) with permissions[] |
| `outlets` | Restaurant outlets with GSTIN, FSSAI, currency, timezone |
| `customers` | Customer profiles, loyalty points, visit history |

### Menu
| Table | Purpose |
|-------|---------|
| `menuCategories` | Categories with emoji, display order, time-based availability |
| `menuItems` | Items with price, food type, spice level, flags (bestseller/chef) |
| `menuItemVariants` | Size/portion variants (Half/Full) |
| `modifierGroups` | Customization groups (single/multi-select) |
| `modifiers` | Individual options with price delta |
| `itemModifierGroups` | Junction: item ↔ modifier group |
| `taxCategories` | Tax slabs: CGST/SGST/IGST/service charge rates |

### Orders & Kitchen
| Table | Purpose |
|-------|---------|
| `orders` | Master order (dine_in/takeaway/delivery/online), status lifecycle |
| `orderItems` | Line items with quantity, price, modifiers, void tracking |
| `orderItemModifiers` | Selected modifiers per order item |
| `kots` | Kitchen Order Tickets (pending→preparing→ready→served) |
| `kotItems` | KOT line items with modifier snapshot |

### Payments
| Table | Purpose |
|-------|---------|
| `payments` | Payment record per order |
| `paymentSplits` | Multi-method splits (cash/card/upi/wallet/complimentary) |
| `discounts` | Flat/percent discounts with validity, min order, max cap |
| `coupons` | Coupon codes with usage limits |

### Inventory
| Table | Purpose |
|-------|---------|
| `inventoryItems` | Stock items with unit, threshold, cost |
| `inventoryTransactions` | Movement log (purchase/adjustment/consumption/waste) |
| `itemInventoryMap` | Menu item → inventory item (quantity per serving) |
| `suppliers` | Supplier profiles with contact, GSTIN |
| `purchaseOrders` | POs with status (draft/sent/partial/received) |
| `purchaseOrderItems` | PO line items (ordered qty vs received qty) |

### Tables & Reservations
| Table | Purpose |
|-------|---------|
| `tableSections` | Floor sections (Ground Floor, First Floor, Outdoor) |
| `tables` | Tables with capacity, shape, status, floor-plan position |
| `reservations` | Bookings with status (pending/confirmed/seated/no_show) |

### Reporting & Audit
| Table | Purpose |
|-------|---------|
| `staffAttendance` | Punch in/out with hours |
| `loyaltyTransactions` | Points earned/redeemed per order |
| `dayEndReports` | Daily revenue, order count, tax, payment summaries |
| `auditLogs` | Change log for compliance |
| `onlineOrderSources` | Swiggy/Zomato/website integration configs |
| `onlineOrders` | Online orders from external platforms |

---

## API Routes

All endpoints are under `/api/`. They read from the SQLite database via Drizzle.

```
GET/POST   /api/orders                    List & create orders
GET        /api/orders/history            Order history with filters
POST       /api/orders/[id]/pay           Process payment + record splits

GET/POST   /api/menu/categories           Category CRUD
PUT/DELETE /api/menu/categories/[id]
GET/POST   /api/menu/items                Item CRUD
PUT/DELETE /api/menu/items/[id]
GET/POST   /api/menu/modifierGroups       Modifier group CRUD
PUT/DELETE /api/menu/modifierGroups/[id]
GET/POST   /api/menu/modifiers            Modifier CRUD
PUT/DELETE /api/menu/modifiers/[id]

GET/POST   /api/kitchen/kots              List & create KOTs
PUT/DELETE /api/kitchen/kots/[id]         Update KOT status

GET/POST   /api/tables                    Table CRUD
PUT/DELETE /api/tables/[id]
POST       /api/tables/bulk              Bulk create tables
GET/POST   /api/tables/sections          Section CRUD
PUT/DELETE /api/tables/sections/[id]

GET/POST   /api/customers                Customer CRUD
PUT/DELETE /api/customers/[id]

GET/POST   /api/inventory                Stock item CRUD
PUT/DELETE /api/inventory/[id]

GET/PUT    /api/settings                 Outlet settings

POST       /api/upload                   File upload
```

---

## Authentication

**NextAuth.js v5** with JWT strategy, 15-minute sessions.

**Login methods:**
1. Email + password (bcrypt hashed)
2. PIN (bcrypt hashed) — fast login for kitchen/waiters

**Dev / Demo mode:** `lib/auth.ts` returns a hardcoded mock session if no real session exists:
```ts
// Mock session: admin user, role: owner, outletId: outlet-1
// This means the app works without logging in during development
```

**Seeded credentials:**
```
admin@admin.com     / admin    (PIN: 1111) — owner
manager@...         / Mgr@123  (PIN: 2222) — manager
cashier@...         / Cash@123 (PIN: 3333) — cashier
waiter1@...         / Wait@123 (PIN: 4444) — waiter
kitchen@...         / Kitch@123 (PIN: 5555) — kitchen
```

---

## Real-time (Socket.io)

The custom HTTP server (`server.ts`) wraps Next.js and adds Socket.io.

**Events:**
| Event | Direction | Purpose |
|-------|-----------|---------|
| `kitchen:join` | client→server | Join kitchen namespace for outlet |
| `pos:join` | client→server | Join POS namespace for outlet |
| `table:select` | client→server | Broadcast table selection to prevent conflicts |
| `kot:markStatus` | client→server | Kitchen updates KOT status → broadcasts to POS |

The Socket.io instance is globally accessible in API routes via `global.__io`.

---

## Design System (Material Design 3)

The entire UI uses **Material Design 3 (MD3)** tokens.

- CSS variables defined in `app/globals.css` (~50+ color tokens)
- TailwindCSS classes mapped to MD3 tokens in `tailwind.config.ts` (e.g., `bg-md-primary`, `text-md-on-surface`)
- `@material/material-color-utilities` for runtime dynamic theming
- Dark mode via `[data-theme="dark"]` attribute
- MD3-compliant components: elevated buttons, filled buttons, outlined fields, cards, FABs, chips, snackbars

**Key token categories:**
- Primary, Secondary, Tertiary color roles + their `on-*` pairs
- Surface levels: dim, default, low, container, high, highest
- Error state colors
- Shape tokens (border-radius scale)

---

## POS Workflow (Core Feature)

1. Staff opens `/pos`
2. Selects order type: Dine-In / Takeaway / Delivery / Online
3. (Dine-In) Selects table from floor plan
4. Browses menu by category, adds items to cart via `use-pos-store.ts` (Zustand)
5. Adds modifiers/customizations per item via `modifier-sheet.tsx`
6. Applies discount or coupon via `discount-modal.tsx`
7. Looks up or creates customer via `customer-modal.tsx`
8. Proceeds to payment via `payment-modal.tsx`:
   - Supports cash, card, UPI, wallet, complimentary
   - Split billing across multiple methods
   - KOT auto-created and sent to kitchen
9. Receipt printed via `react-to-print`
10. Confetti plays on payment success

---

## Known State / Demo Limitations

- **API routes return demo/mock data** — several routes (`/api/menu/items`, `/api/inventory`, `/api/settings`) return hardcoded arrays instead of querying the DB. This was done in Phase 2 to stabilize the UI. Real DB queries exist in `db/schema.ts` and `db/index.ts` — they just need to be wired back in.
- **AI assistant** (`components/pos/ai-chatbot.tsx`) uses hardcoded responses from `lib/ai.ts`. There is no live Gemini/OpenAI call.
- **Gemini API key** is not required — ignore the original README instruction about `GEMINI_API_KEY`.
- **Auth middleware** is disabled in `middleware.ts` — all routes are publicly accessible in dev.
- **Reports page** uses mock/hardcoded chart data.

---

## NPM Scripts

```bash
npm run dev          # Development server (tsx server.ts → http://localhost:3000)
npm run build        # Production build (Next.js + tsc server.ts → dist/)
npm run start        # Production server (node dist/server.js)
npm run lint         # ESLint
npm run clean        # Remove .next/
npm run db:push      # Apply Drizzle schema to sqlite.db
npm run db:seed      # Seed demo data
npm run db:setup     # db:push + db:seed (run this on fresh setup)
npm run db:studio    # Open Drizzle Studio GUI
```

---

## Git Branch

Active development branch: `claude/phase-2-audit-md3-polish-WplDR`

Recent work completed:
- Phase 2: Full Material Design 3 overhaul
- TypeScript error fixes (strict mode)
- shadcn → MD3 token migration
- Demo data replacement (no external API keys needed)
- SQLite WAL files excluded from git

---

## What Needs Work (Suggested Next Steps)

These are areas identified during Phase 2 that still need attention:

1. **Wire real DB queries back into API routes** — `/api/menu/items`, `/api/inventory`, `/api/settings` return hardcoded data; connect them to Drizzle queries
2. **Reports page** — currently shows static charts; hook into `dayEndReports` and `orders` tables
3. **Online orders integration** — `onlineOrderSources` table exists but the UI isn't built
4. **Purchase order flow** — `purchaseOrders` and `purchaseOrderItems` tables exist; no UI yet
5. **Staff attendance** — table exists, no clock-in/clock-out UI
6. **Loyalty points** — `loyaltyTransactions` table exists; loyalty display in customer modal is UI-only
7. **Reservation confirmation flow** — reservations can be created; no email/SMS notification integrated
8. **Multi-outlet switching** — schema supports multiple outlets; UI doesn't have outlet switcher yet
9. **Production auth** — mock session fallback should be removed for prod; proper NextAuth setup needed
10. **Image uploads** — `/api/upload` exists but menu item images are placeholder URLs

---

## File Path Reference (Most Important Files)

| File | What It Does |
|------|-------------|
| `db/schema.ts` | Single source of truth for all DB tables |
| `db/seed.ts` | All demo data (modify here to change defaults) |
| `server.ts` | HTTP server + Socket.io setup |
| `app/globals.css` | All MD3 CSS variables |
| `tailwind.config.ts` | MD3 token → TailwindCSS class mapping |
| `lib/auth.ts` | Mock session fallback (remove for production) |
| `hooks/use-pos-store.ts` | POS cart state (Zustand) |
| `components/pos/payment-modal.tsx` | Payment flow (largest component, ~25KB) |
| `components/pos/order-cart.tsx` | Cart UI (~18KB) |
| `lib/ai.ts` | Demo AI responses (replace with real API calls) |
| `middleware.ts` | Auth guard (currently disabled) |
