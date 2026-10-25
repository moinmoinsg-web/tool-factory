import Link from "next/link";
import { AdUnit } from "@/components/AdSense";
import { getAllTools } from "@/content/tools";
import { SITE_NAME } from "@/lib/site";

export default function Home() {
  const tools = getAllTools();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Free utility tools
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {SITE_NAME}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Simple, fast online tools you can use without signing up. New tools
          publish regularly — pick one below to get started.
        </p>
      </div>

      <div className="mt-8">
        <AdUnit className="w-full" slot="1111111111" />
      </div>

      <section className="mt-12" aria-labelledby="tools-heading">
        <h2
          id="tools-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          All tools
        </h2>
        {tools.length === 0 ? (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No tools yet. Check back soon.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block h-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {tool.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    Open tool →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
