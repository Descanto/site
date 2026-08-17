# Descanto/site

descanto.com — marketing site for Descanto (Botto + Canto). Vite + React 19 + Tailwind v4, dark-only, deployed to Cloudflare Pages.

## Develop

```sh
bun install
bun run dev
```

## Publishing a news article

Drop a markdown file in `src/content/news/`:

```md
---
title: My post title
description: One-line summary shown on cards and at the top of the post.
category: Botto | Canto | Company | Engineering
date: 2026-09-01
featured: false
---

Body in markdown. `## headings`, links, code, bold all render.
```

The filename becomes the URL slug (`my-post.md` → `/news/my-post`). Posts sort newest-first automatically; `featured: true` pins one to the big card on `/news`. Read time is computed from word count. Commit + deploy — nothing else to update.

## Deploy

Pushing to `main` deploys to production automatically (GitHub Actions → Cloudflare Pages project `descanto-www`, custom domain descanto.com). PRs get preview deployments on the same project. The workflow needs the `CLOUDFLARE_API_TOKEN` repo secret (Cloudflare token with the "Cloudflare Pages: Edit" permission).

Manual escape hatch: `bun run deploy` (uses your local wrangler auth).

## Structure

- `src/pages/` — one file per route (`/`, `/botto`, `/canto`, `/canto/pricing`, `/news`, `/news/:slug`, `/about`)
- `src/content/news/` — markdown articles (the news system)
- `src/components/` — Nav (with dropdown menus), Footer, Mascot, ui/button
- `src/styles.css` — Tailwind v4 theme tokens (colors, fonts) — single source of truth for the design system
