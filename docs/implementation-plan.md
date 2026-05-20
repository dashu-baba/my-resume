# Resume Builder — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js resume site that renders Nowshad's resume in 7 role-tailored variants across 3 visual templates, deployed to `resume.nowshad.dev` via GitHub Pages.

**Architecture:** Next.js 14 App Router with `output: "export"`. Single `data/resume.json` validated by zod. Tag-based filtering produces a per-role view that is rendered by one of three CSS-Modules-styled templates. All 30 HTML pages are statically pre-rendered at build time. Spec lives at `docs/architecture.md`.

**Tech Stack:** Next.js 14 · React 18 · TypeScript 5 · CSS Modules · zod 3 · Vitest 1 · @testing-library/react · Cloudflare Web Analytics · GitHub Pages

---

## Conventions

- **Commit per task.** Each task ends with a commit. Use the `feat:`/`chore:`/`docs:`/`test:` prefix matching the task type.
- **Run tests after every code change.** Never assume a test passes — run it.
- **Type-check before commits.** `npm run type-check` (defined in Task 1.1) must pass.
- **Frequent navigation across tasks is normal.** The plan is structured so later tasks rely on the artifacts of earlier ones in order.
- **File paths are absolute from the repo root** (`/Users/nowshadurrahaman/Projects/Nowshad/my-resume/`).
- **All commits should be Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>** if executed by an agent.

---

# Phase 1 · Project Scaffold

## Task 1.1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.mjs`, `.eslintrc.json`, `.prettierrc`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/types/global.d.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "my-resume",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "npx serve out",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "validate": "tsx scripts/validate-resume.ts",
    "prebuild": "npm run validate && npm run type-check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "@testing-library/react": "16.0.0",
    "@testing-library/jest-dom": "6.4.8",
    "@types/node": "20.14.10",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "jsdom": "24.1.0",
    "prettier": "3.3.3",
    "tsx": "4.16.2",
    "typescript": "5.5.3",
    "vitest": "1.6.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```
Expected: `node_modules/` populated, `package-lock.json` created.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".next"]
}
```

- [ ] **Step 4: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 5: Create `.eslintrc.json`**

```json
{ "extends": "next/core-web-vitals" }
```

- [ ] **Step 6: Create `.prettierrc`**

```json
{ "semi": true, "singleQuote": false, "trailingComma": "all", "printWidth": 100 }
```

- [ ] **Step 7: Create placeholder `src/app/layout.tsx`**

```tsx
import "@/styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "S M Nowshadur Rahaman — Resume",
  description: "Resume of S M Nowshadur Rahaman",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder `src/app/page.tsx`**

```tsx
export default function Home() {
  return <main>Resume scaffold — landing page comes in Task 5.6.</main>;
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```
Expected: Next starts on `http://localhost:3000`. Visit it; you should see "Resume scaffold". Stop with Ctrl+C.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts .eslintrc.json .prettierrc src/app/layout.tsx src/app/page.tsx
git commit -m "chore: scaffold Next.js + TypeScript + ESLint baseline"
```

---

## Task 1.2: Configure static export + custom domain

**Files:**
- Create: `next.config.mjs`, `public/CNAME`, `public/favicon.ico` (placeholder)
- Modify: none

- [ ] **Step 1: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
```

- [ ] **Step 2: Create `public/CNAME`**

The file must contain exactly one line, no trailing newline issues:
```
resume.nowshad.dev
```

- [ ] **Step 3: Add a placeholder `public/favicon.ico`**

```bash
# Generate a tiny placeholder (16x16 black square). Replace later with real favicon.
printf '\x00\x00\x01\x00\x01\x00\x10\x10\x00\x00\x01\x00\x18\x00\x68\x03\x00\x00\x16\x00\x00\x00\x28\x00\x00\x00\x10\x00\x00\x00\x20\x00\x00\x00\x01\x00\x18\x00\x00\x00\x00\x00\x00\x03\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' > public/favicon.ico
```
(Alternatively, drop in any real `.ico` file you have.)

- [ ] **Step 4: Verify build produces `out/` with `CNAME`**

```bash
npm run build
ls out/CNAME
cat out/CNAME
```
Expected: `out/CNAME` exists and contains `resume.nowshad.dev`. The `prebuild` script will fail because `scripts/validate-resume.ts` doesn't exist yet — that's OK; comment out the `prebuild` line in `package.json` temporarily, build, then restore it.

Actually do this cleanly: edit `package.json` to temporarily change `prebuild` to `"prebuild": "echo skipped"`, run `npm run build`, verify, then restore the original `prebuild` line. **Do not commit the temporary edit.**

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs public/CNAME public/favicon.ico
git commit -m "chore: enable static export and set CNAME for resume.nowshad.dev"
```

---

## Task 1.3: Add styles foundation

**Files:**
- Create: `src/styles/globals.css`, `src/styles/print.css`

- [ ] **Step 1: Create `src/styles/globals.css`**

```css
/* Design tokens shared across all templates */
:root {
  --color-ink: #1a1a1a;
  --color-muted: #595959;
  --color-paper: #ffffff;
  --color-accent: #1f3a8a;
  --color-sidebar-bg: #1f2a3a;
  --color-sidebar-ink: #e9edf4;
  --color-sidebar-muted: #9fb4d8;
  --color-rule: #9a9a9a;

  --font-serif: Georgia, Cambria, "Times New Roman", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Menlo, Consolas, monospace;

  --page-margin: 12mm;
  --page-max-width: 800px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #f3f4f6;
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

a { color: var(--color-accent); text-decoration: underline; }
a:hover { text-decoration: none; }

/* Page sizing for print. Engineers can re-declare margin inside @media print if needed. */
@page { size: A4; margin: 12mm; }

@import "./print.css";
```

- [ ] **Step 2: Create `src/styles/print.css`**

```css
@media print {
  html, body { background: #fff !important; }

  .no-print { display: none !important; }

  /* Force print color fidelity (Modern template's dark sidebar stays dark). */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

  /* Each experience entry should never split across pages. */
  .break-avoid { break-inside: avoid-page; page-break-inside: avoid; }

  a { color: inherit !important; text-decoration: none; }
  a::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #555; }
  /* Suppress href-after-link for internal nav (links starting with /). */
  a[href^="/"]::after { content: none; }
}
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```
Expected: build succeeds (with the `prebuild` echo stub still or restored as needed).

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/styles/print.css
git commit -m "chore: add globals.css with design tokens and print rules"
```

---

## Task 1.4: Set up Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `src/__tests__/sanity.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 2: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add types reference. Modify `src/types/global.d.ts` (create it)**

```ts
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
```

- [ ] **Step 4: Create `src/__tests__/sanity.test.ts` to verify the harness**

```ts
import { describe, it, expect } from "vitest";

describe("vitest sanity", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the sanity test**

```bash
npm test
```
Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts src/types/global.d.ts src/__tests__/sanity.test.ts
git commit -m "test: set up Vitest + jsdom + Testing Library harness"
```

---

# Phase 2 · Data Layer

## Task 2.1: zod schema and TypeScript types

**Files:**
- Create: `src/lib/schema.ts`, `src/lib/types.ts`, `src/lib/registry.ts`, `src/__tests__/schema.test.ts`

- [ ] **Step 1: Create `src/lib/registry.ts`** (referenced by schema for `Role` enum)

```ts
export const ROLES = [
  "architect",
  "fullstack",
  "backend",
  "frontend",
  "dotnet",
  "js",
  "golang",
] as const;

export const TEMPLATES = ["classic", "modern", "minimal"] as const;

export const DEFAULT_TEMPLATE = "classic" as const;

export type Role = (typeof ROLES)[number];
export type Template = (typeof TEMPLATES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  architect: "Solution Architect",
  fullstack: "Senior Full-Stack Engineer",
  backend: "Backend / Platform Engineer",
  frontend: "Frontend Engineer",
  dotnet: ".NET Engineer",
  js: "JavaScript / TypeScript Engineer",
  golang: "Go Engineer",
};

export const TEMPLATE_LABELS: Record<Template, string> = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
};
```

- [ ] **Step 2: Create `src/lib/schema.ts`**

```ts
import { z } from "zod";
import { ROLES } from "./registry";

const RoleEnum = z.enum(ROLES);
const Roles = z.array(RoleEnum).min(1).optional();

const ByRole = <T extends z.ZodTypeAny>(value: T) =>
  z
    .object({
      default: value,
      byRole: z.record(RoleEnum, value).optional(),
    })
    .strict();

export const ResumeSchema = z
  .object({
    meta: z
      .object({
        name: z.string().min(1),
        titles: ByRole(z.string().min(1)),
        contact: z
          .object({
            phone: z.string().min(1),
            email: z.string().email(),
            location: z.string().min(1),
            links: z
              .array(
                z
                  .object({ label: z.string().min(1), url: z.string().url() })
                  .strict(),
              )
              .default([]),
          })
          .strict(),
      })
      .strict(),

    overview: ByRole(z.string().min(1)),

    competencies: z
      .array(
        z
          .object({
            category: z.string().min(1),
            items: z.array(z.string().min(1)).min(1),
            roles: Roles,
          })
          .strict(),
      )
      .default([]),

    experience: z
      .array(
        z
          .object({
            company: z.string().min(1),
            location: z.string().optional(),
            role: z.string().min(1),
            period: z.string().min(1),
            summary: z.string().optional(),
            bullets: z
              .array(
                z.object({ text: z.string().min(1), roles: Roles }).strict(),
              )
              .default([]),
            techStack: z
              .array(
                z
                  .object({
                    items: z.array(z.string().min(1)).min(1),
                    roles: Roles,
                  })
                  .strict(),
              )
              .optional(),
          })
          .strict(),
      )
      .default([]),

    projects: z
      .array(
        z
          .object({
            name: z.string().min(1),
            description: z.string().min(1),
            url: z.string().url().optional(),
            roles: Roles,
          })
          .strict(),
      )
      .default([]),

    education: z
      .array(
        z
          .object({
            degree: z.string().min(1),
            institution: z.string().min(1),
            year: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export type Resume = z.infer<typeof ResumeSchema>;
```

- [ ] **Step 3: Create `src/lib/types.ts`** (re-exports for ergonomic imports)

```ts
export type { Resume } from "./schema";
export type { Role, Template } from "./registry";

import type { Resume } from "./schema";
export type Experience = Resume["experience"][number];
export type Competency = Resume["competencies"][number];
export type Project = Resume["projects"][number];
export type Education = Resume["education"][number];
export type Bullet = Experience["bullets"][number];
```

- [ ] **Step 4: Write `src/__tests__/schema.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { ResumeSchema } from "@/lib/schema";

const minimal = {
  meta: {
    name: "Test",
    titles: { default: "Engineer" },
    contact: { phone: "+1", email: "t@example.com", location: "Earth", links: [] },
  },
  overview: { default: "Overview." },
};

describe("ResumeSchema", () => {
  it("accepts minimal resume", () => {
    const r = ResumeSchema.parse(minimal);
    expect(r.meta.name).toBe("Test");
  });

  it("rejects unknown role in tag list", () => {
    const bad = {
      ...minimal,
      competencies: [{ category: "X", items: ["y"], roles: ["nope"] }],
    };
    expect(() => ResumeSchema.parse(bad)).toThrow();
  });

  it("rejects invalid email", () => {
    const bad = { ...minimal, meta: { ...minimal.meta, contact: { ...minimal.meta.contact, email: "not-an-email" } } };
    expect(() => ResumeSchema.parse(bad)).toThrow();
  });

  it("accepts byRole override map", () => {
    const r = ResumeSchema.parse({
      ...minimal,
      overview: { default: "Default.", byRole: { architect: "Architect text." } },
    });
    expect(r.overview.byRole?.architect).toBe("Architect text.");
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```
Expected: 4 schema tests + 1 sanity test = 5 passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/registry.ts src/lib/schema.ts src/lib/types.ts src/__tests__/schema.test.ts
git commit -m "feat: define zod Resume schema and role/template registry"
```

---

## Task 2.2: Extract PDF content into `data/resume.json`

**Files:**
- Create: `data/resume.json`

**Tagging policy (apply throughout):**

- Items relevant to **every** role: omit `roles` entirely.
- Items relevant to a **subset**: include explicit `roles: [...]`.
- For language-specific roles (`dotnet`, `js`, `golang`): include them when the bullet actually involved that ecosystem.
- For `architect`: bullets that mention design, leadership, strategy, system-level decisions.
- For `backend`: bullets about APIs, databases, services, data pipelines, infra.
- For `frontend`: bullets about UI, web components, SDKs, browser work.
- For `fullstack`: typically a superset — include for cross-cutting hands-on work.

- [ ] **Step 1: Create `data/resume.json`**

```json
{
  "meta": {
    "name": "S M Nowshadur Rahaman",
    "titles": {
      "default": "Solution Architect | Senior Full Stack Engineer",
      "byRole": {
        "architect": "Solution Architect",
        "fullstack": "Senior Full-Stack Engineer",
        "backend": "Backend / Platform Engineer",
        "frontend": "Senior Frontend Engineer",
        "dotnet": "Senior .NET Engineer",
        "js": "Senior JavaScript / TypeScript Engineer",
        "golang": "Backend Engineer · Open to Go-focused roles"
      }
    },
    "contact": {
      "phone": "+880 1851 836744",
      "email": "nowshad.rahaman@gmail.com",
      "location": "Rampura, Dhaka, Bangladesh",
      "links": [
        { "label": "LinkedIn", "url": "https://www.linkedin.com/in/dashu-baba" },
        { "label": "GitHub", "url": "https://github.com/dashu-baba" },
        { "label": "TopCoder", "url": "https://www.topcoder.com/members/dashu-baba" }
      ]
    }
  },

  "overview": {
    "default": "Hands-on architect with over 11+ years of experience developing scalable, cloud-native platforms across startups and enterprises. Specializes in JavaScript/TypeScript, .NET, distributed systems, serverless architecture, and real-time data pipelines. Proven leadership in architecting platforms, driving cross-functional teams, and managing the DevOps lifecycle.",
    "byRole": {
      "architect": "Solution architect with 11+ years building scalable cloud-native platforms. Focus on distributed systems, serverless, CQRS, edge-first design, and real-time data pipelines. Track record of leading migrations, designing event-driven backbones, and aligning engineering execution with product roadmap.",
      "frontend": "Senior frontend engineer with 11+ years across React, Remix, Angular, Astro, Lit and Web Components. Shipped onboarding SDKs, content platforms, and product UIs with strong attention to performance, SEO, and accessibility.",
      "backend": "Backend engineer with 11+ years building APIs, services, and data platforms on Node.js, .NET Core, and serverless runtimes. Deep experience with Postgres, Kafka, Redis, Cosmos DB, ClickHouse, and event-driven architectures.",
      "dotnet": "Senior .NET engineer with extensive experience in ASP.NET Core, Azure Functions, Cosmos DB, SQL Server, and Azure DevOps. Hybrid background also covers Node.js and modern frontend, giving full-stack range on .NET projects.",
      "js": "Senior JavaScript/TypeScript engineer with 11+ years across Node.js, React, Remix, Next.js, Astro, Lit, and the broader npm ecosystem. Experienced in both product engineering and platform/SDK work.",
      "golang": "Backend engineer with 11+ years of distributed-systems and platform experience. Go is part of my working toolbox; actively seeking Go-focused roles where deep service and infra background applies."
    }
  },

  "competencies": [
    { "category": "Architecture", "items": ["Microservices", "Serverless", "CQRS", "SaaS Platforms", "Edge-first Design"], "roles": ["architect", "backend", "fullstack", "dotnet", "js", "golang"] },
    { "category": "Cloud Platforms", "items": ["AWS (Lambda, EC2, S3, RDS, CloudFront, SNS, SES)", "Azure (Functions, Blob, Cosmos DB)", "Cloudflare (R2, KV, Durable Objects)"] },
    { "category": "Languages", "items": ["JavaScript", "TypeScript", "C#", "Python", "Java", "Go", "SQL"] },
    { "category": "Frontend", "items": ["React", "Remix", "Angular", "Lit", "Astro"], "roles": ["architect", "fullstack", "frontend", "js"] },
    { "category": "Backend", "items": ["Node.js", ".NET Core", "Express", "HonoJS", "Next.js", "FastAPI"], "roles": ["architect", "fullstack", "backend", "dotnet", "js", "golang"] },
    { "category": "Realtime", "items": ["Kafka", "Redis", "Supabase", "RabbitMQ", "Ably"], "roles": ["architect", "fullstack", "backend", "js", "golang"] },
    { "category": "Data", "items": ["Microsoft SQL Server", "PostgreSQL", "MySQL", "ClickHouse", "Cosmos DB", "DynamoDB"], "roles": ["architect", "fullstack", "backend", "dotnet"] },
    { "category": "DevOps & Observability", "items": ["CI/CD Pipelines", "Docker", "Terraform", "GitHub Actions", "Azure DevOps", "Datadog (RUM, Tracing)", "CloudWatch", "App Insights"], "roles": ["architect", "fullstack", "backend", "dotnet", "js", "golang"] },
    { "category": "Mobile", "items": ["Xamarin (Android)", "Flutter"], "roles": ["fullstack"] }
  ],

  "experience": [
    {
      "company": "AdoptSequence & AdoptIQ (Curtis Digital Inc.)",
      "location": "Remote",
      "role": "Solution Architect",
      "period": "Oct 2023 – May 2025",
      "summary": "Led architecture and platform engineering for two SaaS products: an onboarding/automation platform and an A/V enhancement workflow service.",
      "bullets": [
        { "text": "Led backend migration of AdoptSequence from AWS Lambda → Trigger.dev to support long-running video processing.", "roles": ["architect", "fullstack", "backend", "js"] },
        { "text": "Built a public content-sharing system with Astro + Cloudflare Durable Objects; optimized for SEO and low global latency.", "roles": ["architect", "fullstack", "frontend", "js"] },
        { "text": "Architected end-to-end audio/video enhancement workflows using FFmpeg, Whisper, and AI voice synthesis.", "roles": ["architect", "backend"] },
        { "text": "Integrated Supabase for real-time sync and Postgres storage; replaced Ably, lowering latency and cost.", "roles": ["architect", "fullstack", "backend", "js"] },
        { "text": "Operationalized RUM + APM in Datadog with CloudWatch signals; guided devs to review error patterns, improving iteration speed by ~50%.", "roles": ["architect", "fullstack", "backend"] },
        { "text": "Implemented PostHog-based interaction analytics with Kafka ingestion, ClickHouse OLAP, and Redis caching; authored the event schema and ETL, reducing time-to-activation and improving onboarding efficiency.", "roles": ["architect", "backend"] },
        { "text": "Developed a modular onboarding SDK (Shadow DOM → Lit Web Components) and a lightweight Chrome extension to test/debug onboarding flows.", "roles": ["architect", "fullstack", "frontend", "js"] },
        { "text": "Owned the full DevOps lifecycle: CI/CD pipelines, infrastructure automation, deployment strategy, monitoring, and cloud cost optimization across AWS and Cloudflare.", "roles": ["architect", "backend"] },
        { "text": "Managed multi-repo codebases on GitHub with standardized PR reviews and automation." },
        { "text": "Mentored junior developers, enforced best practices, and led roadmap execution with founders." },
        { "text": "Integrated Clerk authentication across multiple applications.", "roles": ["fullstack", "frontend", "backend", "js"] }
      ],
      "techStack": [
        { "items": ["TypeScript", "JavaScript", "Node.js", "React", "Remix", "Lit", "Astro", "Next.js"], "roles": ["architect", "fullstack", "frontend", "backend", "js"] },
        { "items": ["FFmpeg", "OpenAI Whisper", "Trigger.dev", "Clerk"], "roles": ["architect", "backend"] },
        { "items": ["Supabase (Postgres, Realtime)", "Kafka", "Redis", "ClickHouse"], "roles": ["architect", "backend"] },
        { "items": ["AWS (Lambda, EC2, S3, RDS, CloudFront)", "Cloudflare (Workers, Durable Objects, R2)"] },
        { "items": ["PostHog", "Datadog", "CloudWatch", "GitHub Actions", "Docker"] }
      ]
    },

    {
      "company": "Colliers International (via TopCoder)",
      "location": "Remote",
      "role": "Senior Full-stack Developer",
      "period": "Oct 2021 – Sep 2023",
      "summary": "Modernized internal apps for a global commercial real-estate firm, replacing third-party tools with Azure-native and AWS-native services.",
      "bullets": [
        { "text": "Replaced a 3rd-party valuation tool with an internal AWS solution (EC2, S3, SES, RDS) in 3 weeks; cut vendor cost ~60–80% and absorbed additional developer cost solo.", "roles": ["architect", "fullstack", "backend", "dotnet"] },
        { "text": "Architected microservices on Azure Functions backed by Cosmos DB + SQL Server; reduced API p95 latency ~30–50%.", "roles": ["architect", "backend", "dotnet"] },
        { "text": "Modernized Angular apps (major version upgrades + module refactors); build time reduced 25–40%, unit test coverage to 90%.", "roles": ["fullstack", "frontend", "js"] },
        { "text": "Implemented IaC + CI/CD with Terraform and Azure DevOps.", "roles": ["architect", "backend", "dotnet"] },
        { "text": "Migrated Google Maps → Mapbox, added static-map support for exported documents.", "roles": ["fullstack", "frontend", "js"] },
        { "text": "Mentored engineers and led POCs with architects/BAs; reduced new-hire ramp ~30–50% and accelerated concept-to-pilot ~2x." },
        { "text": "Drove code reviews and onboarding standards; PR cycle time −20–35%, post-release defects −20–40%." }
      ],
      "techStack": [
        { "items": ["Angular", "TypeScript"], "roles": ["fullstack", "frontend", "js"] },
        { "items": [".NET Core", "Azure Functions", "Cosmos DB", "SQL Server", "Service Bus"], "roles": ["architect", "backend", "dotnet"] },
        { "items": ["GraphQL", "Power BI", "Mapbox", "Syncfusion"] },
        { "items": ["AWS (RDS, EC2, S3, SES)", "Azure DevOps", "Terraform"], "roles": ["architect", "backend"] },
        { "items": ["NestJS", "MySQL"], "roles": ["backend", "js"] }
      ]
    },

    {
      "company": "Relisource Inc.",
      "location": "Dhaka, Bangladesh",
      "role": "Senior Software Engineer",
      "period": "Nov 2018 – Aug 2021",
      "bullets": [
        { "text": "Developed a Clinical Trial Management System for a global pharmaceutical client.", "roles": ["fullstack", "backend", "dotnet"] },
        { "text": "Built an enterprise LMS platform with mobile support for educational clients.", "roles": ["fullstack", "dotnet"] },
        { "text": "Actively mentored team members on architecture and clean code practices." }
      ],
      "techStack": [
        { "items": ["TypeScript", "Angular", "AngularJS"], "roles": ["fullstack", "frontend", "js"] },
        { "items": ["ASP.NET Core", "Azure Functions", "Azure Service Bus", "Microsoft SQL Server"], "roles": ["backend", "dotnet"] },
        { "items": ["Xamarin"], "roles": ["fullstack"] }
      ]
    },

    {
      "company": "Astha IT",
      "location": "Dhaka, Bangladesh",
      "role": "Senior Software Engineer",
      "period": "Mar 2014 – Oct 2018",
      "bullets": [
        { "text": "Led development for enterprise systems in logistics, education, and fintech." },
        { "text": "Mentored junior engineers and participated in system architecture, client demos, and delivery cycles." }
      ]
    },

    {
      "company": "Onnorokom Software Ltd",
      "location": "Dhaka, Bangladesh",
      "role": "Junior Software Engineer",
      "period": "Mar 2013 – Feb 2014",
      "bullets": []
    }
  ],

  "projects": [
    {
      "name": "FinSync — Personal Finance Intelligence",
      "description": "Elastic Serverless data streams + Vertex AI. Hybrid search (keyword + vector), monthly transforms, and a RAG chat layer. Pydantic-validated JSON ingestion.",
      "url": "https://devpost.com/software/finsync-ai-powered-financial-assistant",
      "roles": ["architect", "fullstack", "backend", "golang"]
    }
  ],

  "education": [
    {
      "degree": "Bachelor of Computer Science and Engineering",
      "institution": "Shahjalal University of Science and Technology",
      "year": "2013"
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is well-formed**

```bash
node -e "JSON.parse(require('fs').readFileSync('data/resume.json','utf8')); console.log('ok')"
```
Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add data/resume.json
git commit -m "feat: extract initial resume.json from source PDF"
```

---

## Task 2.3: Archive the original PDF and verify CNAME

**Files:**
- Move: `S_M_NOWSHADUR_RAHAMAN.pdf` → `public/S_M_NOWSHADUR_RAHAMAN.pdf`
- Verify: `public/CNAME`

- [ ] **Step 1: Move the PDF to public**

```bash
mv S_M_NOWSHADUR_RAHAMAN.pdf public/S_M_NOWSHADUR_RAHAMAN.pdf
```

- [ ] **Step 2: Verify location**

```bash
ls public/
```
Expected: shows `S_M_NOWSHADUR_RAHAMAN.pdf`, `CNAME`, `favicon.ico`.

- [ ] **Step 3: Commit**

```bash
git add public/S_M_NOWSHADUR_RAHAMAN.pdf
git commit -m "chore: archive source PDF as downloadable artifact in /public"
```

---

## Task 2.4: Resume loader + validation script

**Files:**
- Create: `src/lib/resume.ts`, `scripts/validate-resume.ts`

- [ ] **Step 1: Create `src/lib/resume.ts`**

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ResumeSchema, type Resume } from "./schema";

let cached: Resume | null = null;

export function loadResume(): Resume {
  if (cached) return cached;
  const file = readFileSync(join(process.cwd(), "data", "resume.json"), "utf8");
  const parsed = ResumeSchema.parse(JSON.parse(file));
  cached = parsed;
  return parsed;
}
```

- [ ] **Step 2: Create `scripts/validate-resume.ts`**

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ResumeSchema } from "../src/lib/schema";

const file = readFileSync(join(process.cwd(), "data", "resume.json"), "utf8");
const result = ResumeSchema.safeParse(JSON.parse(file));

if (!result.success) {
  console.error("resume.json failed validation:");
  for (const issue of result.error.issues) {
    console.error(`  • ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  process.exit(1);
}

console.log("✓ resume.json passes schema validation");
```

- [ ] **Step 3: Run validation**

```bash
npm run validate
```
Expected: `✓ resume.json passes schema validation`.

- [ ] **Step 4: Run a full build to confirm `prebuild` chain works**

```bash
npm run build
```
Expected: validation runs, type-check runs, build produces `out/`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/resume.ts scripts/validate-resume.ts
git commit -m "feat: add resume loader and prebuild validation"
```

---

# Phase 3 · Filtering Logic (TDD)

## Task 3.1: Write tests for `filter.ts`

**Files:**
- Create: `src/__tests__/filter.test.ts`

- [ ] **Step 1: Create `src/__tests__/filter.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { filterResumeForRole } from "@/lib/filter";
import type { Resume } from "@/lib/types";

const base: Resume = {
  meta: {
    name: "N",
    titles: { default: "Default Title", byRole: { architect: "Arch Title" } },
    contact: { phone: "+1", email: "a@b.com", location: "X", links: [] },
  },
  overview: { default: "Default overview.", byRole: { frontend: "Frontend overview." } },
  competencies: [
    { category: "Universal", items: ["a", "b"] },
    { category: "OnlyBackend", items: ["x"], roles: ["backend"] },
  ],
  experience: [
    {
      company: "CoA",
      role: "R",
      period: "2020",
      summary: "Worked.",
      bullets: [
        { text: "Visible to all." },
        { text: "Only for backend.", roles: ["backend"] },
      ],
    },
    {
      company: "CoB",
      role: "R",
      period: "2019",
      bullets: [{ text: "Only for frontend.", roles: ["frontend"] }],
    },
  ],
  projects: [
    { name: "P1", description: "d" },
    { name: "P2", description: "d", roles: ["js"] },
  ],
  education: [{ degree: "BSc", institution: "U", year: "2013" }],
};

describe("filterResumeForRole", () => {
  it("returns the byRole title when present", () => {
    const r = filterResumeForRole(base, "architect");
    expect(r.meta.title).toBe("Arch Title");
  });

  it("falls back to default title when no byRole entry", () => {
    const r = filterResumeForRole(base, "backend");
    expect(r.meta.title).toBe("Default Title");
  });

  it("returns the byRole overview when present", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.overview).toBe("Frontend overview.");
  });

  it("includes untagged competency categories", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.competencies.map((c) => c.category)).toContain("Universal");
  });

  it("excludes tagged competency categories when role does not match", () => {
    const r = filterResumeForRole(base, "frontend");
    expect(r.competencies.map((c) => c.category)).not.toContain("OnlyBackend");
  });

  it("keeps tagged competency categories when role matches", () => {
    const r = filterResumeForRole(base, "backend");
    expect(r.competencies.map((c) => c.category)).toContain("OnlyBackend");
  });

  it("filters bullets within an experience entry", () => {
    const r = filterResumeForRole(base, "frontend");
    const coA = r.experience.find((e) => e.company === "CoA");
    expect(coA?.bullets.map((b) => b.text)).toEqual(["Visible to all."]);
  });

  it("keeps an experience entry with no surviving bullets if it has a summary", () => {
    const r = filterResumeForRole(base, "js");
    const coA = r.experience.find((e) => e.company === "CoA");
    expect(coA?.bullets).toEqual([]);
    expect(coA?.summary).toBe("Worked.");
  });

  it("drops experience entries with no surviving bullets and no summary", () => {
    const r = filterResumeForRole(base, "backend");
    const coB = r.experience.find((e) => e.company === "CoB");
    expect(coB).toBeUndefined();
  });

  it("includes untagged projects and excludes mismatched tagged ones", () => {
    const r = filterResumeForRole(base, "architect");
    expect(r.projects.map((p) => p.name).sort()).toEqual(["P1"]);
  });

  it("includes tagged projects when role matches", () => {
    const r = filterResumeForRole(base, "js");
    expect(r.projects.map((p) => p.name).sort()).toEqual(["P1", "P2"]);
  });
});
```

- [ ] **Step 2: Run tests (expect failure — module does not exist)**

```bash
npm test
```
Expected: tests fail with "Cannot find module '@/lib/filter'".

---

## Task 3.2: Implement `filter.ts` to pass the tests

**Files:**
- Create: `src/lib/filter.ts`

- [ ] **Step 1: Create `src/lib/filter.ts`**

```ts
import type { Resume, Role } from "./types";

export interface FilteredResume {
  meta: {
    name: string;
    title: string;
    contact: Resume["meta"]["contact"];
  };
  overview: string;
  competencies: { category: string; items: string[] }[];
  experience: {
    company: string;
    location?: string;
    role: string;
    period: string;
    summary?: string;
    bullets: { text: string }[];
    techStack?: { items: string[] }[];
  }[];
  projects: { name: string; description: string; url?: string }[];
  education: Resume["education"];
}

const matches = (roles: readonly Role[] | undefined, current: Role) =>
  roles === undefined || roles.includes(current);

export function filterResumeForRole(resume: Resume, role: Role): FilteredResume {
  const title = resume.meta.titles.byRole?.[role] ?? resume.meta.titles.default;
  const overview = resume.overview.byRole?.[role] ?? resume.overview.default;

  const competencies = resume.competencies
    .filter((c) => matches(c.roles, role))
    .map(({ category, items }) => ({ category, items }));

  const experience = resume.experience
    .map((e) => {
      const bullets = e.bullets
        .filter((b) => matches(b.roles, role))
        .map(({ text }) => ({ text }));
      const techStack = e.techStack
        ?.filter((g) => matches(g.roles, role))
        .map(({ items }) => ({ items }));
      return {
        company: e.company,
        location: e.location,
        role: e.role,
        period: e.period,
        summary: e.summary,
        bullets,
        techStack: techStack && techStack.length > 0 ? techStack : undefined,
      };
    })
    .filter((e) => e.bullets.length > 0 || !!e.summary);

  const projects = resume.projects
    .filter((p) => matches(p.roles, role))
    .map(({ name, description, url }) => ({ name, description, url }));

  return {
    meta: { name: resume.meta.name, title, contact: resume.meta.contact },
    overview,
    competencies,
    experience,
    projects,
    education: resume.education,
  };
}
```

- [ ] **Step 2: Run tests**

```bash
npm test
```
Expected: 11 filter tests pass + 4 schema + 1 sanity = 16 total.

- [ ] **Step 3: Commit**

```bash
git add src/lib/filter.ts src/__tests__/filter.test.ts
git commit -m "feat: implement tag-based filterResumeForRole with TDD"
```

---

## Task 3.3: Smoke-test the filter against real data

**Files:**
- Create: `src/__tests__/filter-realdata.test.ts`

- [ ] **Step 1: Create `src/__tests__/filter-realdata.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { filterResumeForRole } from "@/lib/filter";
import { ROLES } from "@/lib/registry";
import { loadResume } from "@/lib/resume";

describe("filterResumeForRole · real data", () => {
  const resume = loadResume();

  for (const role of ROLES) {
    it(`produces a non-empty resume for /${role}`, () => {
      const filtered = filterResumeForRole(resume, role);
      expect(filtered.meta.name).toBeTruthy();
      expect(filtered.overview.length).toBeGreaterThan(20);
      // Should always have at least one job entry visible
      expect(filtered.experience.length).toBeGreaterThan(0);
    });
  }
});
```

- [ ] **Step 2: Run tests**

```bash
npm test
```
Expected: 7 new tests pass (one per role).

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/filter-realdata.test.ts
git commit -m "test: verify all 7 role filters produce non-empty resumes"
```

---

# Phase 4 · UI Components

## Task 4.1: Section primitives

**Files:**
- Create: `src/components/ui/SectionTitle.tsx`, `src/components/ui/BulletList.tsx`, `src/components/ui/TechPills.tsx`, `src/components/ui/ui.module.css`

- [ ] **Step 1: Create `src/components/ui/ui.module.css`**

```css
.sectionTitle {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: var(--color-ink);
  margin: 16px 0 6px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--color-rule);
}

.sectionTitleAccent { border-bottom-color: var(--color-accent); }

.bulletList { margin: 0; padding-left: 18px; }
.bulletList li { margin-bottom: 3px; line-height: 1.4; font-size: 11px; }

.pillRow { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  background: #eef0f4;
  color: var(--color-ink);
}
.pillDark { background: #2b3a52; color: #d6e0f0; }
```

- [ ] **Step 2: Create `src/components/ui/SectionTitle.tsx`**

```tsx
import styles from "./ui.module.css";

type Props = { children: React.ReactNode; accent?: boolean };

export function SectionTitle({ children, accent = false }: Props) {
  return (
    <h2 className={`${styles.sectionTitle} ${accent ? styles.sectionTitleAccent : ""}`}>
      {children}
    </h2>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/BulletList.tsx`**

```tsx
import styles from "./ui.module.css";

export function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className={styles.bulletList}>
      {items.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/TechPills.tsx`**

```tsx
import styles from "./ui.module.css";

type Props = { items: string[]; variant?: "light" | "dark" };

export function TechPills({ items, variant = "light" }: Props) {
  if (items.length === 0) return null;
  return (
    <div className={styles.pillRow}>
      {items.map((item) => (
        <span key={item} className={`${styles.pill} ${variant === "dark" ? styles.pillDark : ""}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add SectionTitle, BulletList, TechPills primitives"
```

---

## Task 4.2: Header section

**Files:**
- Create: `src/components/resume/sections/Header.tsx`, `src/components/resume/sections/Header.module.css`

- [ ] **Step 1: Create `src/components/resume/sections/Header.module.css`**

```css
.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.left { flex: 1; }
.headerCompact { display: block; }

.name { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.3px; line-height: 1.15; }
.nameCompact { font-size: 18px; color: inherit; }

.title { margin-top: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-muted); }
.titleCompact { color: var(--color-sidebar-muted); }

.contact { font-size: 10px; line-height: 1.55; text-align: right; }
.contactCompact { text-align: left; margin-top: 10px; }

.contactLine { display: block; }
.contactSep { margin: 0 4px; color: var(--color-rule); }
```

- [ ] **Step 2: Create `src/components/resume/sections/Header.tsx`**

```tsx
import styles from "./Header.module.css";
import type { FilteredResume } from "@/lib/filter";

type Variant = "default" | "compact";

export function Header({ data, variant = "default" }: { data: FilteredResume["meta"]; variant?: Variant }) {
  const compact = variant === "compact";
  const { name, title, contact } = data;

  return (
    <header className={`${styles.header} ${compact ? styles.headerCompact : ""}`}>
      <div className={styles.left}>
        <h1 className={`${styles.name} ${compact ? styles.nameCompact : ""}`}>{name}</h1>
        <div className={`${styles.title} ${compact ? styles.titleCompact : ""}`}>{title}</div>
      </div>
      <div className={`${styles.contact} ${compact ? styles.contactCompact : ""}`}>
        <span className={styles.contactLine}>{contact.phone}</span>
        <span className={styles.contactLine}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </span>
        <span className={styles.contactLine}>{contact.location}</span>
        {contact.links.length > 0 && (
          <span className={styles.contactLine}>
            {contact.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && <span className={styles.contactSep}>·</span>}
                <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
              </span>
            ))}
          </span>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/sections/Header.tsx src/components/resume/sections/Header.module.css
git commit -m "feat: add Header section with default and compact variants"
```

---

## Task 4.3: Overview section

**Files:**
- Create: `src/components/resume/sections/Overview.tsx`, `src/components/resume/sections/Overview.module.css`

- [ ] **Step 1: Create `src/components/resume/sections/Overview.module.css`**

```css
.body { font-size: 11px; line-height: 1.5; color: var(--color-ink); margin: 4px 0 0; }
```

- [ ] **Step 2: Create `src/components/resume/sections/Overview.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Overview.module.css";

export function Overview({ text, label = "Professional Overview" }: { text: string; label?: string }) {
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <p className={styles.body}>{text}</p>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/sections/Overview.tsx src/components/resume/sections/Overview.module.css
git commit -m "feat: add Overview section"
```

---

## Task 4.4: Competencies section

**Files:**
- Create: `src/components/resume/sections/Competencies.tsx`, `src/components/resume/sections/Competencies.module.css`

- [ ] **Step 1: Create `src/components/resume/sections/Competencies.module.css`**

```css
.list { margin: 4px 0 0; }
.row { font-size: 11px; line-height: 1.5; margin-bottom: 3px; }
.row b { color: var(--color-ink); margin-right: 4px; }
.empty { display: none; }
```

- [ ] **Step 2: Create `src/components/resume/sections/Competencies.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TechPills } from "@/components/ui/TechPills";
import styles from "./Competencies.module.css";
import type { FilteredResume } from "@/lib/filter";

type Variant = "rows" | "pills";

export function Competencies({
  data,
  variant = "rows",
  label = "Core Competencies",
  pillTheme = "light",
}: {
  data: FilteredResume["competencies"];
  variant?: Variant;
  label?: string;
  pillTheme?: "light" | "dark";
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <div className={styles.list}>
        {data.map((c) =>
          variant === "rows" ? (
            <div key={c.category} className={styles.row}>
              <b>{c.category}:</b>
              {c.items.join(", ")}
            </div>
          ) : (
            <div key={c.category} className={styles.row}>
              <b>{c.category}</b>
              <TechPills items={c.items} variant={pillTheme} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/sections/Competencies.tsx src/components/resume/sections/Competencies.module.css
git commit -m "feat: add Competencies section with rows/pills variants"
```

---

## Task 4.5: Experience section

**Files:**
- Create: `src/components/resume/sections/Experience.tsx`, `src/components/resume/sections/Experience.module.css`

- [ ] **Step 1: Create `src/components/resume/sections/Experience.module.css`**

```css
.list { display: flex; flex-direction: column; gap: 14px; }
.entry { /* keep together when printing */ }
.entryHead { display: flex; flex-direction: column; }
.company { font-size: 12px; font-weight: 700; color: var(--color-ink); }
.meta {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 11px; color: var(--color-muted); margin-top: 1px;
}
.role { font-style: italic; }
.summary { font-size: 11px; line-height: 1.45; margin: 4px 0 4px; color: var(--color-ink); }
.techHeader { font-size: 10px; color: var(--color-muted); margin-top: 6px; }
.techGroup { font-size: 10px; line-height: 1.45; color: var(--color-ink); margin-top: 2px; }
```

- [ ] **Step 2: Create `src/components/resume/sections/Experience.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BulletList } from "@/components/ui/BulletList";
import styles from "./Experience.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Experience({
  data,
  label = "Professional Experience",
  showTechStack = true,
}: {
  data: FilteredResume["experience"];
  label?: string;
  showTechStack?: boolean;
}) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      <div className={styles.list}>
        {data.map((e) => (
          <article key={`${e.company}-${e.period}`} className={`${styles.entry} break-avoid`}>
            <div className={styles.entryHead}>
              <div className={styles.company}>
                {e.company}
                {e.location ? ` — ${e.location}` : ""}
              </div>
              <div className={styles.meta}>
                <span className={styles.role}>{e.role}</span>
                <span>{e.period}</span>
              </div>
            </div>
            {e.summary && <p className={styles.summary}>{e.summary}</p>}
            <BulletList items={e.bullets.map((b) => b.text)} />
            {showTechStack && e.techStack && e.techStack.length > 0 && (
              <>
                <div className={styles.techHeader}>Tech Stack</div>
                {e.techStack.map((g, i) => (
                  <div key={i} className={styles.techGroup}>{g.items.join(", ")}</div>
                ))}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/sections/Experience.tsx src/components/resume/sections/Experience.module.css
git commit -m "feat: add Experience section with break-avoid for print"
```

---

## Task 4.6: Projects + Education sections

**Files:**
- Create: `src/components/resume/sections/Projects.tsx`, `src/components/resume/sections/Projects.module.css`, `src/components/resume/sections/Education.tsx`, `src/components/resume/sections/Education.module.css`

- [ ] **Step 1: Create `src/components/resume/sections/Projects.module.css`**

```css
.entry { margin-bottom: 8px; }
.name { font-size: 11px; font-weight: 700; color: var(--color-ink); }
.url { font-size: 10px; margin-left: 6px; }
.desc { font-size: 11px; line-height: 1.45; margin: 2px 0 0; }
```

- [ ] **Step 2: Create `src/components/resume/sections/Projects.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Projects.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Projects({
  data,
  label = "Projects",
}: { data: FilteredResume["projects"]; label?: string }) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      {data.map((p) => (
        <div key={p.name} className={`${styles.entry} break-avoid`}>
          <div>
            <span className={styles.name}>{p.name}</span>
            {p.url && (
              <a className={styles.url} href={p.url} target="_blank" rel="noopener noreferrer">
                ↗
              </a>
            )}
          </div>
          <p className={styles.desc}>{p.description}</p>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/resume/sections/Education.module.css`**

```css
.entry { font-size: 11px; line-height: 1.4; margin-bottom: 4px; }
.degree { font-weight: 700; color: var(--color-ink); }
.line { color: var(--color-muted); font-size: 10px; }
```

- [ ] **Step 4: Create `src/components/resume/sections/Education.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import styles from "./Education.module.css";
import type { FilteredResume } from "@/lib/filter";

export function Education({
  data,
  label = "Education",
}: { data: FilteredResume["education"]; label?: string }) {
  if (data.length === 0) return null;
  return (
    <section>
      <SectionTitle>{label}</SectionTitle>
      {data.map((e, i) => (
        <div key={i} className={styles.entry}>
          <div className={styles.degree}>{e.degree}</div>
          <div className={styles.line}>{e.institution} · {e.year}</div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/resume/sections/Projects.tsx src/components/resume/sections/Projects.module.css src/components/resume/sections/Education.tsx src/components/resume/sections/Education.module.css
git commit -m "feat: add Projects and Education sections"
```

---

## Task 4.7: Classic template (PDF replica)

**Files:**
- Create: `src/components/resume/templates/Classic.tsx`, `src/components/resume/templates/Classic.module.css`

- [ ] **Step 1: Create `src/components/resume/templates/Classic.module.css`**

```css
.page {
  width: 100%;
  max-width: var(--page-max-width);
  margin: 24px auto;
  padding: 28px 32px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-serif);
  font-size: 11px;
  line-height: 1.4;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.headerWrap {
  border-left: 4px solid var(--color-muted);
  padding-left: 10px;
}

@media print {
  .page { box-shadow: none; margin: 0; padding: 0; }
}

@media (max-width: 768px) {
  .page { padding: 18px 16px; margin: 8px; }
}
```

- [ ] **Step 2: Create `src/components/resume/templates/Classic.tsx`**

```tsx
import styles from "./Classic.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Classic({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <div className={styles.headerWrap}>
        <Header data={data.meta} />
      </div>
      <Overview text={data.overview} />
      <Competencies data={data.competencies} variant="rows" />
      <Experience data={data.experience} />
      <Projects data={data.projects} />
      <Education data={data.education} />
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/templates/Classic.tsx src/components/resume/templates/Classic.module.css
git commit -m "feat: add Classic template (PDF replica layout)"
```

---

## Task 4.8: Modern template (two-column, dark sidebar)

**Files:**
- Create: `src/components/resume/templates/Modern.tsx`, `src/components/resume/templates/Modern.module.css`

- [ ] **Step 1: Create `src/components/resume/templates/Modern.module.css`**

```css
.page {
  width: 100%;
  max-width: var(--page-max-width);
  margin: 24px auto;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 1.4;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 38% 62%;
  min-height: 600px;
}

.sidebar {
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-ink);
  padding: 28px 18px;
}

.main { padding: 28px 24px; }

.sidebar h2 { color: var(--color-sidebar-ink); border-bottom-color: rgba(255,255,255,0.2); }

@media print { .page { box-shadow: none; margin: 0; } }

@media (max-width: 768px) {
  .page { grid-template-columns: 1fr; }
  .sidebar, .main { padding: 18px 16px; }
}
```

- [ ] **Step 2: Create `src/components/resume/templates/Modern.tsx`**

```tsx
import styles from "./Modern.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Modern({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <aside className={styles.sidebar}>
        <Header data={data.meta} variant="compact" />
        <Competencies data={data.competencies} variant="pills" pillTheme="dark" />
        <Education data={data.education} />
      </aside>
      <main className={styles.main}>
        <Overview text={data.overview} />
        <Experience data={data.experience} showTechStack={false} />
        <Projects data={data.projects} />
      </main>
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/templates/Modern.tsx src/components/resume/templates/Modern.module.css
git commit -m "feat: add Modern template with dark sidebar"
```

---

## Task 4.9: Minimal template (airy editorial)

**Files:**
- Create: `src/components/resume/templates/Minimal.tsx`, `src/components/resume/templates/Minimal.module.css`

- [ ] **Step 1: Create `src/components/resume/templates/Minimal.module.css`**

```css
.page {
  width: 100%;
  max-width: 760px;
  margin: 24px auto;
  padding: 40px 44px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 1.55;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.banner { margin-bottom: 18px; }
.bigName { font-size: 22px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; }
.rule { width: 32px; height: 2px; background: var(--color-ink); margin: 8px 0; }

@media print { .page { box-shadow: none; margin: 0; padding: 0; } }
@media (max-width: 768px) { .page { padding: 22px 18px; margin: 8px; } }
```

- [ ] **Step 2: Create `src/components/resume/templates/Minimal.tsx`**

```tsx
import styles from "./Minimal.module.css";
import { Header } from "../sections/Header";
import { Overview } from "../sections/Overview";
import { Competencies } from "../sections/Competencies";
import { Experience } from "../sections/Experience";
import { Projects } from "../sections/Projects";
import { Education } from "../sections/Education";
import type { FilteredResume } from "@/lib/filter";

export function Minimal({ data }: { data: FilteredResume }) {
  return (
    <article className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bigName}>{data.meta.name}</div>
        <div className={styles.rule} />
        <Header data={{ ...data.meta, name: "" }} />
      </div>
      <Overview text={data.overview} label="Overview" />
      <Competencies data={data.competencies} variant="rows" label="Competencies" />
      <Experience data={data.experience} label="Experience" showTechStack={false} />
      <Projects data={data.projects} />
      <Education data={data.education} />
    </article>
  );
}
```

Note: the Header is rendered with a blank `name` because the big banner above already shows it.

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/templates/Minimal.tsx src/components/resume/templates/Minimal.module.css
git commit -m "feat: add Minimal template (airy editorial)"
```

---

# Phase 5 · Chrome and Routing

## Task 5.1: ResumeShell and template registry

**Files:**
- Create: `src/components/resume/ResumeShell.tsx`, `src/components/resume/templates/index.ts`

- [ ] **Step 1: Create `src/components/resume/templates/index.ts`**

```ts
import { Classic } from "./Classic";
import { Modern } from "./Modern";
import { Minimal } from "./Minimal";
import type { Template } from "@/lib/registry";
import type { FilteredResume } from "@/lib/filter";

export const templates: Record<Template, (props: { data: FilteredResume }) => JSX.Element> = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
};
```

- [ ] **Step 2: Create `src/components/resume/ResumeShell.tsx`**

```tsx
import { templates } from "./templates";
import type { Template } from "@/lib/registry";
import type { FilteredResume } from "@/lib/filter";

export function ResumeShell({ template, data }: { template: Template; data: FilteredResume }) {
  const Component = templates[template];
  return <Component data={data} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/ResumeShell.tsx src/components/resume/templates/index.ts
git commit -m "feat: add ResumeShell template dispatcher"
```

---

## Task 5.2: PrintButton client component

**Files:**
- Create: `src/components/chrome/PrintButton.tsx`, `src/components/chrome/chrome.module.css`

- [ ] **Step 1: Create `src/components/chrome/chrome.module.css`**

```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #e0e2e8;
}

.label { font-size: 12px; color: var(--color-muted); }

.select {
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #c9ccd4;
  background: #fff;
}

.spacer { flex: 1; }

.printBtn {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.printBtn:hover { filter: brightness(1.05); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  padding: 24px 16px;
  max-width: 980px;
  margin: 0 auto;
}
.card {
  display: block;
  padding: 18px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  color: inherit;
  text-decoration: none;
  transition: transform .12s;
}
.card:hover { transform: translateY(-2px); }
.cardTitle { font-weight: 700; font-size: 15px; color: var(--color-ink); }
.cardDesc { font-size: 12px; color: var(--color-muted); margin-top: 6px; line-height: 1.4; }
.cardLinks { margin-top: 10px; font-size: 11px; }
.cardLinks a { margin-right: 8px; }
```

- [ ] **Step 2: Create `src/components/chrome/PrintButton.tsx`**

```tsx
"use client";

import styles from "./chrome.module.css";

export function PrintButton() {
  return (
    <button
      type="button"
      className={styles.printBtn}
      onClick={() => window.print()}
    >
      Print / Save as PDF
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/PrintButton.tsx src/components/chrome/chrome.module.css
git commit -m "feat: add PrintButton client component"
```

---

## Task 5.3: TopBar with role/template dropdowns

**Files:**
- Create: `src/components/chrome/TopBar.tsx`

- [ ] **Step 1: Create `src/components/chrome/TopBar.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { ROLES, TEMPLATES, ROLE_LABELS, TEMPLATE_LABELS } from "@/lib/registry";
import type { Role, Template } from "@/lib/registry";
import { PrintButton } from "./PrintButton";
import styles from "./chrome.module.css";

export function TopBar({ role, template }: { role: Role; template: Template }) {
  const router = useRouter();

  return (
    <div className={`${styles.topbar} no-print`}>
      <span className={styles.label}>Role</span>
      <select
        className={styles.select}
        value={role}
        onChange={(e) => router.push(`/${e.target.value}/${template}/`)}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>

      <span className={styles.label}>Template</span>
      <select
        className={styles.select}
        value={template}
        onChange={(e) => router.push(`/${role}/${e.target.value}/`)}
      >
        {TEMPLATES.map((t) => (
          <option key={t} value={t}>{TEMPLATE_LABELS[t]}</option>
        ))}
      </select>

      <span className={styles.spacer} />
      <PrintButton />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chrome/TopBar.tsx
git commit -m "feat: add TopBar with role/template dropdowns and print button"
```

---

## Task 5.4: `[role]/[template]/page.tsx`

**Files:**
- Create: `src/app/[role]/[template]/page.tsx`

- [ ] **Step 1: Create `src/app/[role]/[template]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { ROLES, TEMPLATES, ROLE_LABELS } from "@/lib/registry";
import type { Role, Template } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";
import { TopBar } from "@/components/chrome/TopBar";

type Params = { role: string; template: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return ROLES.flatMap((role) => TEMPLATES.map((template) => ({ role, template })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { role, template } = await params;
  const r = role as Role;
  if (!ROLES.includes(r)) return {};
  const resume = loadResume();
  const filtered = filterResumeForRole(resume, r);
  return {
    title: `${ROLE_LABELS[r]} — ${resume.meta.name}`,
    description: filtered.overview.slice(0, 160),
    alternates: { canonical: `/${role}/${template}/` },
  };
}

export default async function RoleTemplatePage({ params }: { params: Promise<Params> }) {
  const { role, template } = await params;
  const r = role as Role;
  const t = template as Template;
  if (!ROLES.includes(r) || !TEMPLATES.includes(t)) notFound();

  const filtered = filterResumeForRole(loadResume(), r);
  return (
    <>
      <TopBar role={r} template={t} />
      <ResumeShell template={t} data={filtered} />
    </>
  );
}
```

- [ ] **Step 2: Run build to confirm static params generation**

```bash
npm run build
```
Expected: build emits 21 pages under `out/architect/classic/`, `out/architect/modern/`, etc.

```bash
ls out/architect/
```
Expected: `classic/`, `modern/`, `minimal/`.

- [ ] **Step 3: Commit**

```bash
git add src/app/[role]/[template]/page.tsx
git commit -m "feat: render /[role]/[template] pages with static params"
```

---

## Task 5.5: `[role]/page.tsx` default-template page

**Files:**
- Create: `src/app/[role]/page.tsx`

- [ ] **Step 1: Create `src/app/[role]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { ROLES, ROLE_LABELS, DEFAULT_TEMPLATE } from "@/lib/registry";
import type { Role } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";
import { TopBar } from "@/components/chrome/TopBar";

type Params = { role: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return ROLES.map((role) => ({ role }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { role } = await params;
  const r = role as Role;
  if (!ROLES.includes(r)) return {};
  const resume = loadResume();
  const filtered = filterResumeForRole(resume, r);
  return {
    title: `${ROLE_LABELS[r]} — ${resume.meta.name}`,
    description: filtered.overview.slice(0, 160),
    alternates: { canonical: `/${role}/${DEFAULT_TEMPLATE}/` },
  };
}

export default async function RoleDefaultPage({ params }: { params: Promise<Params> }) {
  const { role } = await params;
  const r = role as Role;
  if (!ROLES.includes(r)) notFound();
  const filtered = filterResumeForRole(loadResume(), r);
  return (
    <>
      <TopBar role={r} template={DEFAULT_TEMPLATE} />
      <ResumeShell template={DEFAULT_TEMPLATE} data={filtered} />
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
ls out/architect/
```
Expected: `index.html` plus the three template subfolders.

- [ ] **Step 3: Commit**

```bash
git add src/app/[role]/page.tsx
git commit -m "feat: render /[role] with default classic template"
```

---

## Task 5.6: Landing page with RoleGrid

**Files:**
- Create: `src/components/chrome/RoleGrid.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/chrome/RoleGrid.tsx`**

```tsx
import Link from "next/link";
import { ROLES, ROLE_LABELS, TEMPLATES } from "@/lib/registry";
import styles from "./chrome.module.css";

const ROLE_TAGLINES: Record<(typeof ROLES)[number], string> = {
  architect: "Architecture, distributed systems, leadership.",
  fullstack: "End-to-end product engineering across the stack.",
  backend: "APIs, services, data pipelines, infra.",
  frontend: "React, Remix, Angular, Astro, Web Components.",
  dotnet: "ASP.NET Core, Azure Functions, Cosmos DB, SQL Server.",
  js: "Node.js, React, Remix, Next.js, Astro, Lit.",
  golang: "Distributed-systems experience; open to Go-focused roles.",
};

export function RoleGrid() {
  return (
    <div className={styles.grid}>
      {ROLES.map((role) => (
        <Link key={role} href={`/${role}/`} className={styles.card}>
          <div className={styles.cardTitle}>{ROLE_LABELS[role]}</div>
          <div className={styles.cardDesc}>{ROLE_TAGLINES[role]}</div>
          <div className={styles.cardLinks}>
            {TEMPLATES.map((t) => (
              <Link key={t} href={`/${role}/${t}/`} onClick={(e) => e.stopPropagation()}>
                {t}
              </Link>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
```

Note: nested `<Link>` is technically invalid HTML; replace inner anchors with plain text or move them outside the outer card if any linter flags it. For v1 acceptable.

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import { loadResume } from "@/lib/resume";
import { RoleGrid } from "@/components/chrome/RoleGrid";

export default function Home() {
  const resume = loadResume();
  return (
    <main style={{ padding: "32px 16px", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>{resume.meta.name}</h1>
      <p style={{ fontSize: 14, color: "var(--color-muted)", marginTop: 0 }}>
        {resume.meta.titles.default} · pick a variant below.
      </p>
      <RoleGrid />
    </main>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
ls out/
```
Expected: `index.html` in the root, plus all role and template subfolders.

- [ ] **Step 4: Local preview**

```bash
npm run preview
```
Visit `http://localhost:3000`. Verify:
- Landing page shows 7 role cards.
- Clicking a card navigates to `/architect/` (and so on).
- Top dropdowns switch role/template.
- Print button triggers OS print dialog.

- [ ] **Step 5: Commit**

```bash
git add src/components/chrome/RoleGrid.tsx src/app/page.tsx
git commit -m "feat: add landing page with role/template grid"
```

---

## Task 5.7: 404 page

**Files:**
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create `src/app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 48, textAlign: "center" }}>
      <h1 style={{ fontSize: 32 }}>404</h1>
      <p>That route does not exist.</p>
      <p><Link href="/">← Back to start</Link></p>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
ls out/404.html
```
Expected: `out/404.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add 404 page"
```

---

# Phase 6 · Snapshot Tests

## Task 6.1: Component snapshots for every (role, template) combination

**Files:**
- Create: `src/__tests__/templates.snapshot.test.tsx`

- [ ] **Step 1: Create `src/__tests__/templates.snapshot.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ROLES, TEMPLATES } from "@/lib/registry";
import { loadResume } from "@/lib/resume";
import { filterResumeForRole } from "@/lib/filter";
import { ResumeShell } from "@/components/resume/ResumeShell";

describe("templates × roles snapshots", () => {
  const resume = loadResume();
  for (const role of ROLES) {
    for (const template of TEMPLATES) {
      it(`${role} / ${template} renders stable HTML`, () => {
        const filtered = filterResumeForRole(resume, role);
        const { container } = render(<ResumeShell template={template} data={filtered} />);
        expect(container.innerHTML).toMatchSnapshot();
      });
    }
  }
});
```

- [ ] **Step 2: Run tests (snapshots created on first run)**

```bash
npm test
```
Expected: 21 new snapshot tests pass, all others still pass.

- [ ] **Step 3: Inspect a few snapshots to sanity-check**

```bash
ls src/__tests__/__snapshots__/templates.snapshot.test.tsx.snap
```
Expected: file exists. Open it and skim — names, dates, key bullets appear correctly.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/templates.snapshot.test.tsx src/__tests__/__snapshots__/
git commit -m "test: snapshot all 21 role × template combinations"
```

---

# Phase 7 · Analytics, Deploy, Docs

## Task 7.1: Cloudflare Web Analytics integration

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `.env.example`

- [ ] **Step 1: Update `src/app/layout.tsx`**

```tsx
import "@/styles/globals.css";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata = {
  title: "S M Nowshadur Rahaman — Resume",
  description: "Resume of S M Nowshadur Rahaman",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  return (
    <html lang="en">
      <body>{children}</body>
      {cfToken && (
        <Script
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${cfToken}"}`}
        />
      )}
    </html>
  );
}
```

- [ ] **Step 2: Create `.env.example`**

```
# Cloudflare Web Analytics beacon token (https://dash.cloudflare.com → Web Analytics)
# Leave unset in development; set as repo secret CF_ANALYTICS_TOKEN for production builds.
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=
```

- [ ] **Step 3: Verify build still works without the env var (beacon should be absent)**

```bash
npm run build
grep -r "cloudflareinsights" out/ || echo "no beacon (expected without token)"
```
Expected: prints `no beacon (expected without token)`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx .env.example
git commit -m "feat: wire Cloudflare Web Analytics beacon (token-gated)"
```

---

## Task 7.2: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
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
    env:
      NEXT_PUBLIC_CF_ANALYTICS_TOKEN: ${{ secrets.CF_ANALYTICS_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

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

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow to deploy to Pages"
```

---

## Task 7.3: README and manual setup checklist

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# my-resume

Static, role-tailored resume site for S M Nowshadur Rahaman, deployed at https://resume.nowshad.dev.

## Stack
- Next.js 14 (App Router, `output: "export"`)
- TypeScript · CSS Modules · zod
- Vitest + Testing Library
- GitHub Pages + Cloudflare Web Analytics

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run tests
npm run validate   # validate data/resume.json against schema
npm run build      # static export to ./out
npm run preview    # serve ./out locally
```

## Editing the resume

- All content lives in `data/resume.json`. Edit there and commit.
- The original PDF is archived at `public/S_M_NOWSHADUR_RAHAMAN.pdf` and is not used to drive content.
- Each bullet/competency may carry a `roles: Role[]` tag. Omit the tag to make an item visible to every role.
- Single fields (`titles`, `overview`) accept a `byRole` override map.

## Architecture

See `docs/architecture.md` for the full design spec.

## One-time setup checklist (manual)

1. Push the repo to GitHub at `dashu-baba/my-resume`.
2. GitHub → Settings → Pages → Source = **GitHub Actions**.
3. GitHub → Settings → Pages → Custom domain = `resume.nowshad.dev`.
4. DNS provider: add a CNAME record `resume.nowshad.dev` → `dashu-baba.github.io`.
5. Wait 5–30 minutes for HTTPS certificate to provision, then enable "Enforce HTTPS".
6. Cloudflare → Web Analytics → add `resume.nowshad.dev` → copy the beacon token.
7. GitHub → Settings → Secrets and variables → Actions → add `CF_ANALYTICS_TOKEN` = (the token).
8. Push to `main`; the workflow builds, deploys, and the site goes live.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and editing instructions"
```

---

# Self-Review

**Spec coverage check (against `docs/architecture.md`):**

| Spec section | Implementation |
|---|---|
| §3 Data model + zod | Task 2.1 |
| §3 Filtering semantics | Tasks 3.1 / 3.2 |
| §3 Initial PDF extraction | Task 2.2 |
| §4 Custom domain CNAME | Task 1.2 |
| §4 `/[role]/[template]` routing | Task 5.4 |
| §4 `/[role]` default-template page | Task 5.5 |
| §4 Landing page | Task 5.6 |
| §4 not-found | Task 5.7 |
| §4 Per-page metadata + canonical | Tasks 5.4 / 5.5 |
| §5 Folder layout + two-layer split | Tasks 4.1–4.9 |
| §5 CSS Modules with tokens | Task 1.3 + per-component CSS modules |
| §5 Print rules | Task 1.3 |
| §6 next.config.mjs | Task 1.2 |
| §6 prebuild validation | Task 2.4 |
| §6 GitHub Actions workflow | Task 7.2 |
| §6 Cloudflare Web Analytics | Task 7.1 |
| §7 Snapshot tests | Task 6.1 |
| §7 filter unit tests | Tasks 3.1 / 3.2 / 3.3 |
| §7 Schema validation tests | Task 2.1 |

No gaps identified.

**Placeholder scan:** No TBD/TODO. All code blocks are complete; all commands are runnable.

**Type consistency:** `FilteredResume` is defined once in `src/lib/filter.ts` and imported by every section / template. `Role`, `Template` come from `src/lib/registry.ts`. `Resume` comes from `src/lib/schema.ts` via `src/lib/types.ts`. No duplicate definitions.

---

# Execution

Plan complete. After execution, the site:

- Renders 30 static HTML pages (1 landing + 7 role defaults + 21 role × template + 1 404).
- Reads from a single `data/resume.json`.
- Validates content at build time and during CI.
- Deploys automatically to `resume.nowshad.dev` on every push to `main`.
- Falls back gracefully when content is missing for a role.
