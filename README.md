# Reports Dashboard

A Next.js (App Router) + TypeScript application featuring role-gated reports, server-side search and sort, AI-powered summaries, and a reusable component library.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login` — pick a role (Viewer or Admin) and continue to the reports dashboard.

## Features

### Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/reports` |
| `/login` | Role selection (sets a `role` cookie) |
| `/reports` | Paginated list of reports with search + sort |
| `/reports/[id]` | Report detail view with AI summary |
| `GET /api/reports` | Returns paginated, filtered, sorted report list |
| `GET /api/reports/[id]` | Returns a single report by ID |
| `GET /api/reports/[id]/summary` | Returns a mocked AI summary |

### Role-Gated Access (Middleware)

`src/proxy.ts` intercepts all requests to `/reports/*`. If the `role` cookie is absent or holds an unrecognized value, the user is redirected to `/login?from=<original-path>`. After login, they are returned to the page they tried to access.

Valid roles: `admin`, `viewer`. Both have read access in this demo.

### Search & Sort — via API

Search and sort are implemented server-side in `GET /api/reports`. The client sends query parameters:

| Param | Values |
|---|---|
| `search` | Free-text (matches title, author, category, tags) |
| `sortBy` | `title` \| `author` \| `category` \| `createdAt` |
| `sortOrder` | `asc` \| `desc` |
| `page` | integer ≥ 1 |
| `pageSize` | integer 1–50 |

### AI Summary

Each report detail page has a **Generate AI Summary** button. Clicking it calls `GET /api/reports/[id]/summary`, which:

- Simulates ~800–1400 ms latency (realistic API feel)
- Returns a hand-crafted contextual summary for each of the 10 mock reports
- Randomly fails ~10% of the time to demonstrate the **error + retry** state

The UI handles three states: loading (spinner), error (message + retry button), and success (styled AI card).

### Reusable Components

| Component | File | Description |
|---|---|---|
| `ReportCard` | `src/components/ReportCard/` | Card layout for grid view — links to detail page |
| `ReportTable` | `src/components/ReportTable/` | Sortable table for list view |

### Styling

Layout and structure use `.module.scss` files compiled via the `sass` package. Interactive UI primitives (buttons, inputs, selects, badges, cards, tables) use [shadcn/ui](https://ui.shadcn.com/) components built on Radix/Base UI with Tailwind v4 CSS variables for theming.

## Project Structure

```
src/
├── app/
│   ├── api/reports/
│   │   ├── route.ts              # GET /api/reports
│   │   └── [id]/
│   │       ├── route.ts          # GET /api/reports/[id]
│   │       └── summary/route.ts  # GET /api/reports/[id]/summary
│   ├── login/
│   │   ├── page.tsx
│   │   └── login.module.scss
│   ├── reports/
│   │   ├── layout.tsx            # Server component — reads role cookie, renders Navbar
│   │   ├── page.tsx
│   │   ├── reports.module.scss
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── report-detail.module.scss
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar/                   # Role badge + logout
│   ├── ReportCard/               # Grid view card
│   ├── ReportTable/              # List view sortable table
│   └── ui/                       # shadcn/ui primitives
├── data/reports.json             # 10 mock reports
├── lib/utils.ts                  # cn() utility
├── proxy.ts                      # Role-gating (Next.js 16 middleware)
└── types/report.ts               # Shared TypeScript types
```

## AI Tools Used

- **Claude (claude-sonnet-4-6 via Claude Code)** — used to build the entire application. Prompted to plan the architecture, generate all source files (types, API routes, components, pages, middleware, styles), verify the build, and write this README. Claude Code's agentic tool-use (file writing, shell commands, build verification) made it possible to go from an empty directory to a fully working, building application in a single session.
