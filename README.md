# Tool Factory — utility site starter

Next.js (App Router) template for a daily SEO utility-tool site. Tools live in a TypeScript content registry; each tool page ships H1, description, interactive shell, FAQ + **FAQPage JSON-LD**, meta title/description, internal links, and AdSense placeholders.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Content registry: `src/content/tools/index.ts`
- Dynamic routes: `/tools/[slug]`
- `sitemap.ts` / `robots.ts` for Search Console

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sample tool: [/tools/word-counter](http://localhost:3000/tools/word-counter).

```bash
npm run build
npm start
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical origin for sitemap, robots, `metadataBase` (no trailing slash) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | For ads | AdSense client ID (`ca-pub-…`). Without it, ad units show a dashed placeholder |

Copy `.env.example` → `.env.local` (or set the same keys in Vercel → Project → Settings → Environment Variables).

## Deploy on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket (or import the folder).
2. In [Vercel](https://vercel.com/new), import the project — framework preset **Next.js**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://tools.example.com`).
4. Optionally set `NEXT_PUBLIC_ADSENSE_CLIENT` after AdSense approval.
5. Deploy. Submit `https://your-domain.com/sitemap.xml` in Google Search Console.

## How Tool Factory Bot adds a tool daily

1. **Keyword gate** — call `listExistingKeywords()` (or read the Daily Log spreadsheet). If the keyword already exists, **do not publish**.
2. **Append content** — add one `ToolDefinition` to the `tools` array in `src/content/tools/index.ts`:
   - `slug`, `keyword`, `title`, `description`
   - `metaTitle`, `metaDescription`
   - `faq` — **required**, ≥2 Q&A pairs (drives visible FAQ + FAQPage JSON-LD)
   - `relatedSlugs` — existing tool slugs for internal links
3. **Widget (optional)** — for a real interactive tool, add a client component and map it in `src/components/ToolShell.tsx`. Until then the dashed placeholder shell is fine.
4. **Commit & deploy** — push so Vercel builds. `generateStaticParams` picks up the new slug automatically.
5. **Search Console** — submit `https://<site>/tools/<slug>`.
6. **Log** — tool name, keyword, URL, date in the publish spreadsheet.

### STOP rules (charter)

- Never publish if the keyword already exists on the site.
- Never skip FAQ schema — every tool page must include `FaqSection` / FAQPage JSON-LD.
- If DataForSEO errors, report and move on; do not invent a keyword.

## Key files

```
src/content/tools/index.ts     ToolDefinition + registry + helpers
src/app/page.tsx               Home / tool index + AdSense placeholder
src/app/tools/[slug]/page.tsx  Tool page (metadata, FAQ, links, ads)
src/components/FaqSection.tsx  FAQ UI + JSON-LD
src/components/AdSense.tsx     Script + ad unit placeholders
src/components/ToolShell.tsx   Interactive widget router
src/app/sitemap.ts
src/app/robots.ts
```

## Helpers

- `getAllTools()` — full registry
- `getToolBySlug(slug)` — single tool or `undefined`
- `listExistingKeywords()` — lowercase keywords for duplicate checks
- `getRelatedTools(tool)` — resolved related definitions
