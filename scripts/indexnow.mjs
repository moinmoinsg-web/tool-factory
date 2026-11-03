#!/usr/bin/env node
// Submit URLs to IndexNow (Bing, Yandex, Seznam, etc.).
// Usage: node scripts/indexnow.mjs [url ...]   (no args = all URLs in live sitemap)
const HOST = 'tool-factory-one.vercel.app';
const KEY = 'f869bac94e0223feb0b44e1e01cc239c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'];

async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

let urlList = process.argv.slice(2);
if (urlList.length === 0) urlList = await sitemapUrls();
urlList = urlList.filter((u) => new URL(u).host === HOST);
if (urlList.length === 0) { console.error('No URLs for host', HOST); process.exit(1); }

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
let ok = false;
for (const ep of ENDPOINTS) {
  try {
    const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
    const text = await res.text();
    console.log(`${ep} -> ${res.status} ${text.slice(0, 200)}`);
    if (res.status === 200 || res.status === 202) { ok = true; break; }
  } catch (e) { console.log(`${ep} -> error ${e.message}`); }
}
console.log(`Submitted ${urlList.length} URL(s)`);
process.exit(ok ? 0 : 1);
