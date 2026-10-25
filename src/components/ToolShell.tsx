import type { ToolDefinition } from "@/content/tools";
import { WordCounterWidget } from "@/components/WordCounterWidget";

type ToolShellProps = {
  tool: ToolDefinition;
};

/**
 * Interactive widget area. Map slug → concrete widget.
 * New tools from Tool Factory Bot should register a widget here (or use the placeholder).
 */
export function ToolShell({ tool }: ToolShellProps) {
  if (tool.slug === "word-counter") {
    return <WordCounterWidget />;
  }

  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Tool widget placeholder
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Interactive UI for <code className="font-mono">{tool.slug}</code> goes
        here. Replace this shell when shipping the tool logic.
      </p>
    </div>
  );
}
