import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdSense";
import { FaqSection } from "@/components/FaqSection";
import { ToolShell } from "@/components/ToolShell";
import {
  getAllTools,
  getRelatedTools,
  getToolBySlug,
} from "@/content/tools";
import { SITE_NAME } from "@/lib/site";

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return { title: "Tool not found" };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(tool);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          Home
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-zinc-800 dark:text-zinc-200">{tool.title}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {tool.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tool.description}
        </p>
      </header>

      <section className="mt-8" aria-label="Tool">
        <ToolShell tool={tool} />
      </section>

      <FaqSection items={tool.faq} />

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Related tools
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/tools/${item.slug}`}
                  className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-600"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12">
        <AdUnit className="w-full" slot="3333333333" />
      </div>

      <p className="mt-12 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
        >
          ← Back to all {SITE_NAME} tools
        </Link>
      </p>
    </main>
  );
}
