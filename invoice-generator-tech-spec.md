# Invoice Generator — Technical Architecture Spec

This document defines the technical stack, folder structure, and coding conventions for building
the Invoice Generator PWA. It is meant to be used as a build spec/prompt for scaffolding the
project (e.g. via Codex or a similar code-generation agent).

Refer to `invoice-generator-spec.md` (product spec) and `invoice-generator-er-diagram.mermaid`
(data model) for feature and entity details — this document covers **how** to build it, not
**what** to build.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend framework | React + Next.js (App Router) |
| Styling | Tailwind CSS |
| Icons | Tabler Icons (`@tabler/icons-react`) |
| Backend | Firebase (Auth, Firestore, Storage, Cloud Functions where needed) |
| Language | TypeScript, strict mode, no implicit `any` anywhere |
| i18n | JSON-based translation files, loaded at runtime |
| App type | PWA — installable, with manifest + service worker (no offline data sync in v1) |

---

## 2. Monorepo Folder Structure

```
invoice-generator/
├── apps/
│   ├── web/                         # Next.js app
│   │   ├── app/                     # App Router — routes only, no business logic here
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx                 # Invoice List route
│   │   │   │   ├── [invoiceId]/page.tsx     # Invoice Details route
│   │   │   │   ├── new/page.tsx             # Invoice Form (create)
│   │   │   │   └── [invoiceId]/edit/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [clientId]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── organization/page.tsx
│   │   │   ├── layout.tsx           # renders <BottomNav /> from packages/ui, wraps all routes
│   │   │   ├── globals.css          # single source of truth: colors, font sizes, CSS vars
│   │   │   └── manifest.ts          # PWA manifest (or /public/manifest.json)
│   │   ├── public/
│   │   │   ├── icons/               # PWA icons (192x192, 512x512, etc.)
│   │   │   └── locales/             # i18n JSON files (see section 6)
│   │   ├── sw.ts                    # service worker entry (via next-pwa or custom)
│   │   ├── tailwind.config.ts       # reads CSS vars from globals.css — no hardcoded colors here
│   │   ├── next.config.ts
│   │   └── tsconfig.json            # strict: true
│   │
│   └── server/                      # Backend-for-frontend layer (talks to Firebase)
│       ├── api/
│       │   ├── invoices/
│       │   │   ├── actions.ts       # create, update, delete, markAsPaid, copy
│       │   │   └── queries.ts       # getList, getById, getByClient
│       │   ├── clients/
│       │   │   ├── actions.ts
│       │   │   └── queries.ts
│       │   ├── organizations/
│       │   │   ├── actions.ts
│       │   │   └── queries.ts
│       │   └── auth/
│       │       ├── actions.ts
│       │       └── queries.ts
│       ├── firebase/
│       │   ├── config.ts            # Firebase app init (env-driven)
│       │   ├── firestore.ts         # Firestore instance + converters
│       │   ├── auth.ts              # Firebase Auth instance + helpers
│       │   └── storage.ts           # Firebase Storage instance + helpers
│       └── http.ts                  # generic request wrapper all actions/queries call through
│
├── packages/
│   ├── modules/                     # one folder per route/feature — all business logic lives here
│   │   ├── invoice-list/
│   │   │   ├── screen/              # top-level screen component rendered by the route
│   │   │   ├── components/          # InvoiceCard, CalendarFilter, StatusTabs, etc.
│   │   │   ├── utils/               # formatting, filtering, pagination helpers
│   │   │   └── constants/           # tab labels, page size, etc.
│   │   ├── invoice-details/
│   │   │   ├── screen/
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── constants/
│   │   ├── invoice-form/
│   │   │   ├── screen/
│   │   │   ├── components/          # ClientSearchDropdown, ItemsTable, GstSplitSummary, etc.
│   │   │   ├── utils/                # gstCalculator.ts, invoiceNumberGenerator.ts
│   │   │   └── constants/
│   │   ├── client-list/  ...
│   │   ├── client-details/  ...
│   │   ├── client-form/  ...
│   │   ├── organization/  ...
│   │   └── auth/  ...
│   │
│   ├── ui/                          # shared, dumb, reusable components (Button, Chip, Pagination,
│   │                                 # EmptyState, Modal, ConfirmDialog, BottomNav) — no business logic
│   │
│   ├── types/                       # shared TypeScript types/interfaces + Zod schemas,
│   │                                 # mirroring the ER diagram entities 1:1
│   │
│   └── i18n/                        # i18n loader/hook logic (framework-agnostic helper)
│
├── package.json                     # workspaces: ["apps/*", "packages/*"]
├── tsconfig.base.json                # shared strict compiler options
└── turbo.json / pnpm-workspace.yaml  # monorepo tooling (pick one: Turborepo + pnpm recommended)
```

**Rules to enforce:**
- `apps/web/app/**/page.tsx` files should only compose a `Screen` component from the matching
  `packages/modules/<name>/screen` folder, plus route-level concerns (metadata, layout). No
  business logic, no direct Firestore calls, inside route files.
- `packages/modules/<name>/screen` orchestrates the module's components and calls into
  `apps/server/api/<name>` for data — never calls Firebase directly.
- All Firebase access is centralized in `apps/server/firebase/*`. No other file imports the
  Firebase SDK directly.
- `apps/server/http.ts` is the single generic entry point through which every action/query is
  invoked — this is the place for shared concerns like error normalization, loading-state
  helpers, and (later) auth token attachment.

---

## 2a. Monorepo Config Conventions (strict — no per-package duplication)

This is a **single pnpm workspace**. Only the repo root owns real dependency installation and
shared tooling config. Individual packages under `apps/*` and `packages/*` must stay minimal —
they declare what they need, they do not redeclare how the whole repo is built.

**Hard rules:**
- There is exactly **one** `node_modules` folder that matters — the one pnpm manages at the repo
  root (pnpm itself creates small internal `node_modules/.pnpm` symlink structures per package,
  which is normal and not something to "fix" — what must **never** happen is a package having its
  own independently-installed, duplicated copy of dependencies).
- `pnpm install` is only ever run from the **repo root**. Never `cd` into a package and run
  install there.
- Only **one** `tsconfig.base.json` exists, at the repo root, holding all shared strict compiler
  options (see Section 5). Every other `tsconfig.json` in the repo — in `apps/web`, `apps/server`,
  and every folder under `packages/` — must be a few lines that only `extend` it plus declare its
  own `include`/`paths`. No package re-declares `strict`, `target`, `module`, etc.
- **Tailwind config, PostCSS config, and Next.js config exist in exactly one place: `apps/web`.**
  Nothing under `packages/` (including `packages/app/modules/*` and `packages/ui`) gets its own
  `tailwind.config.ts`, `postcss.config.js`, or `next.config.mjs` — these are plain TypeScript/React
  packages consumed by the Next.js app, not standalone apps, and Tailwind classes inside them are
  compiled by `apps/web`'s single Tailwind pipeline (via its `content` globs pointing into
  `packages/`).
- Each package under `packages/*` (`modules`, `ui`, `types`, `i18n`) gets exactly one minimal
  `package.json`:
  ```json
  {
    "name": "@invoice-generator/ui",
    "version": "0.0.0",
    "private": true,
    "main": "./index.ts",
    "types": "./index.ts"
  }
  ```
  Only add a `dependencies` entry here if that specific package needs a library nothing else in
  the repo uses. Shared dev tooling (TypeScript, ESLint, Prettier, Tailwind, testing libraries)
  is declared **once**, at the root `package.json`, under `devDependencies`.
- Each package's `tsconfig.json` looks like this, and nothing more:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": { "outDir": "./dist" },
    "include": ["**/*.ts", "**/*.tsx"]
  }
  ```
- `apps/web` and `apps/server` are the **only** two places allowed to have a fuller
  `tsconfig.json` (still extending the base) because they're the actual runnable
  targets — everything under `packages/` is a library consumed by them, not an app in its own
  right.

**Before generating code, confirm this structure:**
```
invoice-generator/
├── node_modules/            # the ONLY real node_modules in the repo
├── package.json             # root — declares workspaces + all shared devDependencies
├── tsconfig.base.json        # the ONLY source of shared compiler options
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── web/
│   │   ├── package.json      # its own deps (next, react, tailwindcss, @tabler/icons-react, etc.)
│   │   ├── tsconfig.json      # extends base, adds Next.js-specific options
│   │   ├── tailwind.config.ts # ONLY tailwind config in the repo
│   │   ├── postcss.config.js  # ONLY postcss config in the repo
│   │   └── next.config.mjs    # ONLY next config in the repo
│   └── server/
│       ├── package.json
│       └── tsconfig.json      # extends base
└── packages/
    ├── modules/
    │   ├── package.json       # minimal, as shown above
    │   └── tsconfig.json      # minimal, as shown above — NO tailwind/postcss/next config here
    ├── ui/
    │   ├── package.json
    │   └── tsconfig.json
    ├── types/
    │   ├── package.json
    │   └── tsconfig.json
    └── i18n/
        ├── package.json
        └── tsconfig.json
```
If, while generating the project, a package under `packages/` seems to need its own build/dev
config beyond a minimal `package.json` + `tsconfig.json`, stop and ask — that almost always
signals the folder boundary is wrong rather than a genuine need for another config file.

---

## 3. Styling — Tailwind + `globals.css`

- All color values and font sizes are defined **once**, as CSS custom properties, inside
  `apps/web/app/globals.css`.
- `tailwind.config.ts` extends the theme by referencing those CSS variables — no color hex codes
  or font-size numbers should appear directly in `tailwind.config.ts` or in component code.

Example pattern:

```css
/* globals.css */
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-text-primary: #0f172a;
  --color-status-paid: #16a34a;
  --color-status-unpaid: #dc2626;
  --color-status-draft: #64748b;
  --color-status-partial: #d97706;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
}
```

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      surface: 'var(--color-surface)',
      textPrimary: 'var(--color-text-primary)',
      statusPaid: 'var(--color-status-paid)',
      statusUnpaid: 'var(--color-status-unpaid)',
      statusDraft: 'var(--color-status-draft)',
      statusPartial: 'var(--color-status-partial)',
    },
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
    },
  },
}
```

Components then use `bg-primary`, `text-statusPaid`, `text-lg`, etc. — never inline hex values.

---

## 3a. Bottom Navigation

- `BottomNav` lives in `packages/ui` (it's shared chrome, not module-specific logic) and is
  rendered once from `apps/web/app/layout.tsx` so it persists across route changes.
- 2 tabs: **Invoices** (icon: `IconFileInvoice` or similar from Tabler) and **Clients** (icon:
  `IconUsers`), each linking to their respective list route.
- Active-tab state is derived from the current pathname (e.g. any path starting with
  `/invoices` highlights the Invoices tab, any path starting with `/clients` highlights Clients)
  — not from component-local state, so it stays correct on refresh/deep-link.
- Hidden on auth routes (`/login`, `/signup`).
- Uses the same `--color-primary` / `--color-text-primary` CSS variables for active/inactive
  states — no separate color values introduced just for this component.

---

## 4. Icons — Tabler Icons

- Use `@tabler/icons-react`.
- Icons are sized/colored via Tailwind classes (`className="w-5 h-5 text-primary"`), consistent
  with the color system above — never pass raw hex/px values as icon props.
- Wrap commonly reused icons (e.g. status icons per invoice state) in a small helper inside
  `packages/ui` so status-to-icon mapping lives in one place.

---

## 5. Strict Typing

- `tsconfig.base.json` must set: `"strict": true`, `"noImplicitAny": true`,
  `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`.
- Every entity from the ER diagram gets a corresponding TypeScript type/interface in
  `packages/types`, plus a **Zod schema** for runtime validation of data coming back from
  Firestore (Firestore itself is schemaless, so validation at the boundary is required).
- Firestore reads/writes should go through typed **converters**
  (`FirestoreDataConverter<T>`) defined in `apps/server/firebase/firestore.ts`, so every query
  returns a fully-typed object, never `DocumentData`.
- No `any` in application code. `unknown` + narrowing is the only acceptable escape hatch, and
  only at true external boundaries (API responses, JSON parsing).

---

## 6. i18n

- All user-facing strings live in JSON files under `apps/web/public/locales/<lang>/common.json`
  (e.g. `en/common.json`), grouped by module (`invoiceList`, `invoiceForm`, `clientList`, etc.)
  as nested keys.
- A small loader/hook in `packages/i18n` reads the JSON for the active language and exposes a
  `t('invoiceList.title')`-style function to all modules.
- Default language: English. Structure should allow adding more languages by dropping in a new
  JSON file with the same key structure — no code changes required to add a language.

---

## 7. Data Model → Firestore Mapping

Firestore is a NoSQL document store, so the relational ER diagram needs to be translated into
collections. Suggested mapping:

| Entity | Firestore structure |
|---|---|
| `users` | Top-level collection, doc ID = Firebase Auth UID |
| `orgMembers` | Top-level collection, fields: `userId`, `orgId`, `role` (enables querying "all orgs for a user" and "all members of an org") |
| `organizations` | Top-level collection |
| `clients` | Top-level collection, field `orgId` for scoping + composite index on `(orgId, isDeleted)` |
| `invoices` | Top-level collection, field `orgId` + `clientId`, composite indexes for `(orgId, status)`, `(orgId, createdAt)`, `(clientId, status)` |
| `invoiceItems` | Embedded array field **within** the invoice document (not a subcollection) — items are always read/written together with their parent invoice, so embedding avoids extra reads |

**Invoice numbering:** since Firestore doesn't have auto-increment, maintain
`invoiceNumberCurrentSeq` on the `organizations` document and increment it inside a **Firestore
transaction** whenever a new invoice number is issued (Add New / Copy), to avoid race conditions
if two invoices are created concurrently.

**Soft deletes:** implemented as an `isDeleted: boolean` field with queries filtering it out by
default — never a real document delete for clients/invoices in a non-Draft state.

---

## 8. PWA Setup

- `manifest.json` (or `app/manifest.ts` in Next.js App Router) — name, short_name, icons
  (192x192, 512x512, maskable variant), theme_color and background_color pulled from the same
  `globals.css` variables where possible.
- A minimal service worker (via `next-pwa` or hand-rolled) registered app-wide — sufficient to
  satisfy installability criteria. No offline data caching/sync logic in v1.
- Custom "Install App" button using the `beforeinstallprompt` event for Chrome/Android.
- An in-app hint banner for iOS Safari users pointing them to Share → "Add to Home Screen."

---

## 9. Out of Scope for Initial Build

(Kept here for traceability — see product spec's "Later Discussion" section for details.)
- Offline data sync
- Push notifications
- Forgot password / email verification / Google+password account linking
- Export to CSV/Excel, direct email/share of invoices, analytics dashboard
- Multi-currency support
