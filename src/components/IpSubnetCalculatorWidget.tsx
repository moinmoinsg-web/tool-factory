"use client";

import { useMemo, useState } from "react";

function parseIp(s: string): number | null {
  const p = s.trim().split(".");
  if (p.length !== 4) return null;
  let n = 0;
  for (const x of p) {
    if (!/^\d{1,3}$/.test(x)) return null;
    const v = Number(x);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

function fmt(n: number): string {
  return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join(".");
}

function maskFor(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff - (Math.pow(2, 32 - prefix) - 1)) >>> 0;
}

function parseMask(s: string): number | null {
  const t = s.trim().replace(/^\//, "");
  if (/^\d{1,2}$/.test(t)) {
    const p = Number(t);
    return p >= 0 && p <= 32 ? p : null;
  }
  const m = parseIp(t);
  if (m === null) return null;
  for (let p = 0; p <= 32; p++) if (maskFor(p) === m) return p;
  return null;
}

function ipClass(n: number): string {
  const a = Math.floor(n / 16777216);
  if (a < 128) return "A";
  if (a < 192) return "B";
  if (a < 224) return "C";
  if (a < 240) return "D (multicast)";
  return "E (reserved)";
}

function isPrivate(n: number): boolean {
  const a = Math.floor(n / 16777216);
  const b = Math.floor(n / 65536) % 256;
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white p-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function IpSubnetCalculatorWidget() {
  const [ip, setIp] = useState("192.168.1.10");
  const [mask, setMask] = useState("/24");

  const res = useMemo(() => {
    const addr = parseIp(ip);
    const prefix = parseMask(mask);
    if (addr === null) return { error: "Enter a valid IPv4 address such as 192.168.1.10." };
    if (prefix === null) return { error: "Enter a prefix like /24 or a mask like 255.255.255.0." };
    const m = maskFor(prefix);
    const network = (addr & m) >>> 0;
    const wildcard = (~m) >>> 0;
    const broadcast = (network + wildcard) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    let hosts: number;
    let first: number;
    let last: number;
    if (prefix === 32) {
      hosts = 1; first = network; last = network;
    } else if (prefix === 31) {
      hosts = 2; first = network; last = broadcast;
    } else {
      hosts = total - 2; first = network + 1; last = broadcast - 1;
    }
    return {
      prefix, rows: [
        ["Network address", fmt(network)],
        ["Broadcast address", fmt(broadcast)],
        ["First usable host", fmt(first)],
        ["Last usable host", fmt(last)],
        ["Usable hosts", hosts.toLocaleString("en-US")],
        ["Total addresses", total.toLocaleString("en-US")],
        ["Subnet mask", fmt(m)],
        ["Wildcard mask", fmt(wildcard)],
        ["CIDR notation", fmt(network) + "/" + prefix],
        ["IP class", ipClass(addr)],
        ["Address type", isPrivate(addr) ? "Private (RFC 1918)" : "Public / other"],
        ["Binary mask", [24, 16, 8, 0].map((s) => (Math.floor(m / Math.pow(2, s)) % 256).toString(2).padStart(8, "0")).join(".")],
      ] as string[][],
    };
  }, [ip, mask]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          IP address
          <input className={inputClass} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Prefix or subnet mask
          <input className={inputClass} value={mask} onChange={(e) => setMask(e.target.value)} placeholder="/24 or 255.255.255.0" />
        </label>
      </div>
      {"error" in res ? (
        <p className="text-sm text-red-600">{res.error}</p>
      ) : (
        <dl className="grid gap-px overflow-hidden rounded-lg border border-zinc-300 bg-zinc-300 text-sm dark:border-zinc-700 dark:bg-zinc-700 sm:grid-cols-2">
          {res.rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 bg-white p-2 dark:bg-zinc-950">
              <dt className="text-zinc-600 dark:text-zinc-400">{k}</dt>
              <dd className="break-all text-right font-mono text-zinc-900 dark:text-zinc-100">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
