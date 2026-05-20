# my-resume

Static, role-tailored resume site for S M Nowshadur Rahaman, deployed at https://resume.nowshad.dev.

## Stack

- Next.js 14 (App Router, `output: "export"`)
- TypeScript, CSS Modules, zod
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
2. GitHub -> Settings -> Pages -> Source = **GitHub Actions**.
3. GitHub -> Settings -> Pages -> Custom domain = `resume.nowshad.dev`.
4. DNS provider: add a CNAME record `resume.nowshad.dev` -> `dashu-baba.github.io`.
5. Wait 5-30 minutes for HTTPS certificate to provision, then enable "Enforce HTTPS".
6. Cloudflare -> Web Analytics -> add `resume.nowshad.dev` -> copy the beacon token.
7. GitHub -> Settings -> Secrets and variables -> Actions -> add `CF_ANALYTICS_TOKEN` = (the token).
8. Push to `main`; the workflow builds, deploys, and the site goes live.
