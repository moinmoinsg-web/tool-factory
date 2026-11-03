# IndexNow

- Key: `f869bac94e0223feb0b44e1e01cc239c` (public by design)
- Key file: https://tool-factory-one.vercel.app/f869bac94e0223feb0b44e1e01cc239c.txt (public/f869bac94e0223feb0b44e1e01cc239c.txt)
- Submit new URL(s): `node scripts/indexnow.mjs https://tool-factory-one.vercel.app/tools/<slug>`
- Submit whole sitemap: `node scripts/indexnow.mjs`
- Tries api.indexnow.org, falls back to www.bing.com/indexnow. 200/202 = accepted, 403 = key not yet verified, 422 = URL/host mismatch.
- Only submit tool-factory-one.vercel.app URLs (the -moinmoin alias is noindex).
