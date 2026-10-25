import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        That tool or page does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
      >
        ← Back home
      </Link>
    </main>
  );
}
