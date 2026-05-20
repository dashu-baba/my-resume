# Resume Builder — Architecture & Design

**Status:** Draft — pending user review
**Date:** 2026-05-20
**Owner:** Nowshad
**Stack:** Next.js 14+ (App Router) · TypeScript · CSS Modules · Cloudflare Web Analytics · GitHub Pages

---

## 1. Goals & Non-Goals

### Goals

- Render Nowshad's resume as a website at `https://resume.nowshad.dev`.
- Offer **role-tailored variants** (architect, fullstack, backend, frontend, dotnet, js, golang) at distinct URLs.
- Offer **three visual templates** per role (classic, modern, minimal).
- Look print-perfect — one click downloads a PDF that mirrors what's on screen.
- One source of truth (`resume.json`); editing one bullet updates every variant.
- Static hosting on GitHub Pages with a custom domain.

### Non-Goals (v1)

- No multi-user. No upload UI. No editor UI. No backend.
- No runtime PDF parsing. The PDF is extracted once into JSON, then archived.
- No analytics, A/B testing, or visitor identification.
- No internationalization. English only.
- No per-role OG images (single default OG card is fine).

---

## 2. Decisions Snapshot

The eight decisions that shape this design:

| # | Topic | Decision |
|---|---|---|
| 1 | Route purpose | Layered: role × template |
| 2 | Scope | Personal site only; JSON committed; no editor / backend |
| 3 | Tailoring model | Tag-based filtering (untagged = visible to all roles) |
| 4 | Roles in v1 | `architect`, `fullstack`, `backend`, `frontend`, `dotnet`, `js`, `golang` |
| 5 | Templates in v1 | `classic`, `modern`, `minimal` |
| 6 | PDF export | `window.print()` + `@media print` + `@page A4` |
| 7 | Source of truth | JSON. PDF extracted once and archived in `public/` |
| 8 | URL scheme | `/[role]/[template]` nested; landing page at `/` |

---

## 3. Data Model

### Single source: `data/resume.json`

```ts
type Role =
  | "architect" | "fullstack" | "backend" | "frontend"
  | "dotnet"    | "js"        | "golang";

type Tagged<T> = T & { roles?: Role[] };  // omit roles = visible to all

interface Resume {
  meta: {
    name: string;
    titles: { default: string; byRole?: Partial<Record<Role, string>> };
    contact: {
      phone: string;
      email: string;
      location: string;
      links: { label: string; url: string }[];
    };
  };

  overview: { default: string; byRole?: Partial<Record<Role, string>> };

  competencies: Tagged<{ category: string; items: string[] }>[];

  experience: {
    company: string;
    location?: string;
    role: string;
    period: string;
    summary?: string;
    bullets: Tagged<{ text: string }>[];
    techStack?: Tagged<{ items: string[] }>[];
  }[];

  projects: Tagged<{ name: string; description: string; url?: string }>[];

  education: { degree: string; institution: string; year: string }[];
}
```

### Filtering semantics — `filterResumeForRole(resume, role)`

For a given route's role:

1. **Singular fields** (`titles`, `overview`): pick `byRole[role] ?? default`.
2. **Tagged list items**: include when `roles` is absent OR `roles.includes(role)`.
3. **Experience entries**:
   - Bullets are filtered per item.
   - If all bullets filter out and the entry has a `summary`, keep the entry with just the summary.
   - If no bullets and no summary, the entry is omitted.
4. **Competency categories**: if all items tag out, drop the category.
5. **Sections with zero remaining items** are not rendered (no empty headers).

### Validation

- `data/resume.schema.ts` declares the shape using **zod**.
- `scripts/validate-resume.ts` parses `resume.json` with zod.
- Wired as `prebuild` script — fails the build with a readable error if the JSON is invalid or references an unknown role.

### Initial PDF extraction (one-time)

The original PDF (`S_M_NOWSHADUR_RAHAMAN.pdf`) is read once. A human-readable extraction produces `data/resume.json`, then the PDF is moved to `public/` as a downloadable historical artifact. After this point, edit `resume.json` directly; don't touch the PDF.

---

## 4. Routing

### Custom domain

Deploys to `resume.nowshad.dev`. A `public/CNAME` file containing `resume.nowshad.dev` is committed; GitHub Pages binds the domain.

Because it's the apex of a custom domain, **no `basePath` / `assetPrefix`** is needed.

### App Router tree

```
src/app/
├── layout.tsx                          # <html>, fonts, global + print CSS
├── page.tsx                            # / — landing page (role grid)
├── not-found.tsx                       # static 404
├── [role]/
│   ├── page.tsx                        # /architect — renders 'classic'
│   └── [template]/
│       └── page.tsx                    # /architect/classic etc.
```

### Static params

```ts
// src/app/[role]/[template]/page.tsx
export async function generateStaticParams() {
  return ROLES.flatMap(role =>
    TEMPLATES.map(template => ({ role, template }))
  );
}
export const dynamicParams = false;     // unknown combos → static 404
```

### Total static pages

- 1 landing
- 7 role-default pages (`/architect` etc., each rendering its classic template with `<link rel="canonical">` pointing to `/architect/classic`)
- 21 role × template pages
- 1 not-found
- **= 30 HTML files**

### Defaults & canonicals

| URL | Behavior |
|---|---|
| `/` | Landing page (role picker); no auto-redirect |
| `/architect` | Renders `classic`; `<link rel="canonical" href="/architect/classic">` |
| `/architect/classic` | Canonical |
| `/architect/modern` | Canonical |
| `/foo` | Static 404 |
| `/architect/foo` | Static 404 |

A pure static export cannot do server-side redirects. Canonical link tags resolve SEO duplication between `/[role]` and `/[role]/classic`.

### Registry

```ts
// src/lib/registry.ts
export const ROLES = [
  "architect", "fullstack", "backend",
  "frontend", "dotnet", "js", "golang",
] as const;

export const TEMPLATES = ["classic", "modern", "minimal"] as const;

export const DEFAULT_TEMPLATE = "classic";

export const ROLE_LABELS: Record<Role, string> = {
  architect: "Solution Architect",
  fullstack: "Senior Full-Stack Engineer",
  backend:   "Backend / Platform Engineer",
  frontend:  "Frontend Engineer",
  dotnet:    ".NET Engineer",
  js:        "JavaScript / TypeScript Engineer",
  golang:    "Go Engineer",
};
```

### Per-page metadata

```ts
export async function generateMetadata({ params }) {
  const { role, template } = await params;
  return {
    title: `${ROLE_LABELS[role]} — S M Nowshadur Rahaman`,
    description: overviewFor(role).slice(0, 160),
    alternates: { canonical: `/${role}/${template}` },
  };
}
```

---

## 5. Component Architecture

### Folder layout

```
src/
├── components/
│   ├── chrome/                       # outside the printable resume; hidden in print
│   │   ├── TopBar.tsx                # role & template dropdowns, print button
│   │   ├── RoleGrid.tsx              # landing-page cards
│   │   └── PrintButton.tsx           # client component: window.print()
│   ├── resume/                       # the printable resume
│   │   ├── ResumeShell.tsx           # picks template, passes filtered data
│   │   ├── templates/
│   │   │   ├── Classic.tsx           # PDF replica
│   │   │   ├── Modern.tsx            # two-column dark sidebar
│   │   │   └── Minimal.tsx           # airy editorial
│   │   └── sections/                 # template-agnostic content blocks
│   │       ├── Header.tsx
│   │       ├── Overview.tsx
│   │       ├── Competencies.tsx
│   │       ├── Experience.tsx
│   │       ├── Projects.tsx
│   │       └── Education.tsx
│   └── ui/                           # primitives
│       ├── SectionTitle.tsx
│       ├── BulletList.tsx
│       └── TechPills.tsx
├── lib/
│   ├── registry.ts                   # ROLES, TEMPLATES, defaults, labels
│   ├── resume.ts                     # load + zod-validate resume.json
│   ├── filter.ts                     # filterResumeForRole(resume, role)
│   └── types.ts                      # TypeScript Resume types (inferred from zod)
├── styles/
│   ├── globals.css                   # tokens, resets, @page rules
│   ├── print.css                     # @media print + page-break helpers
│   └── templates/
│       ├── classic.module.css
│       ├── modern.module.css
│       └── minimal.module.css
└── app/...
```

### Two-layer split

The component tree has a strict boundary between *content* and *presentation*:

- **`sections/*`** know the data shape but not the template. They render semantic HTML — `<header>`, `<section>`, `<ul>` — with class hooks. Shared across all three templates.
- **`templates/*`** are layout wrappers. They decide page structure (single-column, two-column), import the relevant CSS module, and arrange the sections inside their grid.

Each section accepts a `variant` prop so the same component adapts without forking into three copies.

```tsx
// templates/Modern.tsx (illustrative)
export function Modern({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <aside className={styles.sidebar}>
        <Header data={data.meta} variant="compact" />
        <Competencies data={data.competencies} variant="pills" />
        <Education data={data.education} />
      </aside>
      <main className={styles.main}>
        <Overview text={data.overview} />
        <Experience data={data.experience} />
        <Projects data={data.projects} />
      </main>
    </article>
  );
}
```

### Data flow per page

```
data/resume.json
       │
       ▼
lib/resume.ts ─── loads, zod-validates at build time (cached singleton)
       │
       ▼
[role]/[template]/page.tsx
   const data = filterResumeForRole(resume, role);
   const Template = templates[template];
   return <Template data={data} />;
       │
       ▼
templates/Modern.tsx ─── arranges sections/*
       │
       ▼
sections/Experience.tsx ─── renders <ul>, etc.
```

All evaluation is **build-time**. Final HTML is static; no JS is required to read the resume. The only client components are `TopBar` (navigation dropdowns) and `PrintButton`.

### Styling

- **CSS Modules per template** — scoped, predictable, easy to reason about for print rules.
- **`globals.css`** holds design tokens shared by all templates as CSS custom properties:
  - `--color-ink`, `--color-muted`, `--color-paper`, `--color-accent`, `--color-sidebar-bg`
  - `--font-serif`, `--font-sans`
  - `--page-margin`, `--page-max-width`
  - `@page { size: A4; margin: 12mm; }` lives here too
- **`print.css`** loaded globally inside `@media print`:
  - Hides `.no-print` (chrome).
  - Forces white background, removes shadows and box-shadows.
  - `break-inside: avoid` on each experience job entry so jobs don't split across pages.
  - `print-color-adjust: exact` so the Modern template's dark sidebar still prints with its background.
- **Each template's `.module.css`** owns its layout — single-column grid for Classic, two-column grid for Modern, generous padding for Minimal. CSS custom properties from `globals.css` are consumed directly so cross-template tweaks stay easy.

### Why this structure

- **One change to a bullet updates all 30 pages.** Sections read filtered data; templates just arrange.
- **New role = one line in `registry.ts` + tagging.** No code changes elsewhere.
- **New template = one folder under `templates/` + one CSS module.** Sections are reusable.
- **Files stay focused**: a template file is layout only; a section file is content only.

---

## 6. Build & Deploy

### Local development

```bash
npm install
npm run dev          # next dev — hot reload at http://localhost:3000
npm run validate     # zod-parse resume.json (sanity check)
npm run build        # next build with output: 'export'
npm run preview      # serve the built /out directory locally
```

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
export default {
  output: "export",
  trailingSlash: true,             // GH Pages serves /architect/ → /architect/index.html
  images: { unoptimized: true },   // required for static export
};
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "validate": "tsx scripts/validate-resume.ts",
    "prebuild": "npm run validate && tsc --noEmit",
    "build": "next build",
    "preview": "npx serve out",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

### GitHub Actions — `.github/workflows/deploy.yml`

Triggers: push to `main`, manual `workflow_dispatch`.

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Custom domain

- `public/CNAME` contains a single line: `resume.nowshad.dev`.
- DNS: a `CNAME` record at `resume.nowshad.dev` → `dashu-baba.github.io`.
- HTTPS auto-provisioned by GitHub Pages once DNS resolves.

### Repository settings (one-time, manual)

1. GitHub → Settings → Pages → Source = **GitHub Actions**.
2. GitHub → Settings → Pages → Custom domain = `resume.nowshad.dev`.
3. Enforce HTTPS checkbox once cert provisions (5–30 min).

### Cloudflare Web Analytics

- Sign up at `dash.cloudflare.com` → Web Analytics → add `resume.nowshad.dev` as a site (no Cloudflare proxy required for the DNS — works with any host).
- Cloudflare issues a **beacon token**; store it as repo secret `CF_ANALYTICS_TOKEN`.
- The GitHub Actions workflow injects it as `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` at build time.
- `src/app/layout.tsx` renders the beacon via `next/script` only when the token is present:

  ```tsx
  {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
    <Script
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
    />
  )}
  ```

- Local dev defaults to no token → beacon not loaded → no tracking during development.
- A `.env.example` documents the variable.

---

## 7. Edge Cases, Error Handling, Testing

### Edge cases the design handles explicitly

| Case | Handling |
|---|---|
| Role has zero items in a section (e.g., `/golang` has no projects) | Section is omitted; no empty header rendered |
| All bullets in a job filter out but `summary` exists | Entry renders with just the summary |
| All bullets filter out and no `summary` | Entry omitted entirely |
| `byRole` override missing for current role | Falls back to `default` |
| `resume.json` fails schema | Build fails with zod error message identifying the path |
| Unknown role / template in URL | Static `not-found.tsx` (Next dropped them via `dynamicParams: false`) |
| Long content overflows A4 | `break-inside: avoid` on experience entries; bullet-level splits are acceptable |
| Mobile viewport viewing a print-sized layout | Each template's CSS includes a mobile media query that shrinks padding and stacks two-column to single-column for `<768px`; the printable layout is preserved for `@media print` |
| External links | `rel="noopener noreferrer"`; open in new tab |
| Accessibility | Semantic HTML, single `<h1>` (name), `aria-current="page"` on the active TopBar option, sufficient contrast in Modern's dark sidebar (verified against WCAG AA) |

### Testing strategy

Scaled to a personal site — light but meaningful.

1. **Build-time validation (primary safety net):** zod-parsing `resume.json` on every build catches structural drift immediately.
2. **TypeScript strict mode** (`tsc --noEmit` in `prebuild`): the `Resume` types are inferred from the zod schema, so any consumer of the data is type-checked end to end.
3. **Vitest unit tests** for `lib/filter.ts`:
   - Untagged items appear for every role.
   - Tagged items appear only for listed roles.
   - `byRole` overrides resolve correctly.
   - Empty sections drop out.
   - Job entries with no surviving bullets but a summary keep the summary.
4. **Component snapshot tests** (Vitest + React Testing Library) for each (role, template) pair — 21 snapshots. Catches accidental visual regressions in HTML structure.
5. **Manual visual checklist** before merging template/style changes:
   - Print to PDF in Chrome and visually compare against the original PDF.
   - Verify no chrome elements appear in print.
   - Verify no awkward page breaks mid-entry.
   - Verify on mobile viewport (375px wide).
6. **No E2E tests in v1** — overkill for this surface area. Revisit if dropdown navigation ever gets complex.

---

## 8. Resolved Decisions

> Each row was an open question during brainstorming; resolved on 2026-05-20.

| # | Question | Decision |
|---|---|---|
| 1 | CSS Modules vs Tailwind | **CSS Modules** |
| 2 | `zod` for validation | **Yes** — schema is the single source of truth for both runtime validation and TypeScript types |
| 3 | Print page size | **A4 only** for v1 |
| 4 | `/golang` route | **Ship anyway** with the Go content available (Go in Languages, FinSync project) + a 1-line "Open to Go-focused roles" framing in `overview.byRole.golang` |
| 5 | Theme toggle (light/dark) | **No** for v1 |
| 6 | Analytics / hit tracking | **Cloudflare Web Analytics** — privacy-friendly, free, no cookies, no GDPR banner needed |

---

## 9. Initial File Manifest

What the first PR creates:

```
my-resume/
├── .github/workflows/deploy.yml
├── docs/architecture.md                 # this file
├── data/
│   ├── resume.json
│   └── resume.schema.ts                 # zod schema
├── public/
│   ├── CNAME                            # resume.nowshad.dev
│   ├── S_M_NOWSHADUR_RAHAMAN.pdf        # archived original
│   └── favicon.ico
├── scripts/
│   └── validate-resume.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   └── [role]/
│   │       ├── page.tsx
│   │       └── [template]/page.tsx
│   ├── components/...                   # as in §5
│   ├── lib/...
│   └── styles/...
├── next.config.mjs
├── tsconfig.json
├── package.json
├── .env.example                         # NEXT_PUBLIC_CF_ANALYTICS_TOKEN
└── README.md
```

---

## 10. What v2+ Could Add

Captured here so we don't bloat v1 — none of these are in scope right now.

- Multi-user mode (PDF upload, in-browser parse, LocalStorage persistence).
- Inline content editor with live preview.
- Per-role OG images.
- Light/dark toggle.
- Plausible analytics.
- Letter / A4 toggle.
- Additional templates (e.g., compact one-pager, academic CV).
- Internationalization.
