import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}: free in-browser utility tools with no signup, run by an independent operator in Singapore.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        About {SITE_NAME}
      </h1>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          {SITE_NAME} builds simple, free online utility tools that run
          entirely in your browser. Our goal is to give writers, students,
          developers, and everyday users reliable helpers—word counters,
          formatters, calculators, and more—without forcing an account or a
          download.
        </p>
        <p>
          Each tool is designed to be fast and self-contained. When you open a
          page, your input stays on your device for the work that tool does.
          We publish new tools regularly and keep the interface uncluttered so
          you can get an answer and move on.
        </p>
        <p>
          {SITE_NAME} is operated independently from Singapore. We are not a
          large platform; we are a focused site that prefers useful pages over
          growth hacks. Advertising (when approved) helps cover hosting and
          development so the tools can stay free to use.
        </p>
        <p>
          Questions, feedback, or corrections are welcome. Reach us at{" "}
          <a
            href="mailto:moinmoinsg@gmail.com"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            moinmoinsg@gmail.com
          </a>
          , or see the{" "}
          <Link
            href="/contact"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            contact page
          </Link>{" "}
          for more detail. You can also read our{" "}
          <Link
            href="/privacy"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>

      <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
        >
          ← Back to all tools
        </Link>
      </p>
    </main>
  );
}
