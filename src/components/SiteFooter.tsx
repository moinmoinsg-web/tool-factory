import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <p>© {SITE_NAME}. Free online utility tools.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
