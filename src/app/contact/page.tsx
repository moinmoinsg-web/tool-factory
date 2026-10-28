import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} at moinmoinsg@gmail.com for feedback, corrections, partnership questions, or privacy requests.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Contact
      </h1>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          We read every message we can. The best way to reach {SITE_NAME} is
          by email.
        </p>

        <p>
          Email:{" "}
          <a
            href="mailto:moinmoinsg@gmail.com"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            moinmoinsg@gmail.com
          </a>
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          What to write about
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Bug reports or incorrect results in a tool</li>
          <li>Suggestions for new utilities or clearer copy</li>
          <li>Privacy or advertising questions</li>
          <li>Partnership or content-correction requests</li>
        </ul>

        <p>
          Please include the tool URL (if relevant), what you expected, and
          what you saw. We operate from Singapore and typically reply within a
          few business days.
        </p>

        <p>
          For how we handle information, see the{" "}
          <Link
            href="/privacy"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            privacy policy
          </Link>
          . Learn more about the project on the{" "}
          <Link
            href="/about"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            about page
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
