"use client";

import { useState } from "react";

const SAMPLE = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 16px; }
      h1 { color: #2563eb; }
    </style>
  </head>
  <body>
    <h1>Hello, HTML Viewer</h1>
    <p>Edit the code on the left and the preview updates as you type.</p>
    <ul><li>Fast</li><li>Private</li><li>Free</li></ul>
  </body>
</html>`;

const areaClass =
  "h-80 w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function HtmlViewerWidget() {
  const [code, setCode] = useState(SAMPLE);
  const [shown, setShown] = useState(SAMPLE);
  const [live, setLive] = useState(true);

  const update = (v: string) => {
    setCode(v);
    if (live) setShown(v);
  };

  const btn =
    "rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          HTML code
          <textarea className={areaClass} value={code} onChange={(e) => update(e.target.value)} spellCheck={false} />
        </label>
        <div className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Preview
          <iframe
            title="HTML preview"
            sandbox=""
            srcDoc={shown}
            className="h-80 w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={live}
            onChange={(e) => {
              setLive(e.target.checked);
              if (e.target.checked) setShown(code);
            }}
          />
          Live preview
        </label>
        {!live && (
          <button type="button" className={btn} onClick={() => setShown(code)}>
            Run
          </button>
        )}
        <button type="button" className={btn} onClick={() => navigator.clipboard?.writeText(code)}>
          Copy HTML
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setCode("");
            setShown("");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setCode(SAMPLE);
            setShown(SAMPLE);
          }}
        >
          Load sample
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        The preview runs in a sandboxed frame: scripts are disabled and nothing leaves your browser.
      </p>
    </div>
  );
}
