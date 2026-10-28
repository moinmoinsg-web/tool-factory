import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}: client-side tools, no accounts, AdSense and cookie disclosure, and how to contact us.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Last updated: October 28, 2026
      </p>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          This privacy policy explains how {SITE_NAME} (“we”, “us”) handles
          information when you use{" "}
          <Link
            href="/"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            tool-factory-one.vercel.app
          </Link>{" "}
          and related pages.
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tools run in your browser
        </h2>
        <p>
          Our utility tools are designed to process data on your device in the
          browser. We do not require you to create an account, and we do not
          ask you to upload tool input to our servers as a condition of using
          a tool. What you type or paste into a tool generally stays on your
          machine for that session unless you choose to copy or share it
          yourself.
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          No sale of personal data
        </h2>
        <p>
          We do not sell your personal information. We do not operate a user
          account database for these tools, and we do not build marketing
          profiles from the content you enter into a calculator or formatter.
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hosting and technical logs
        </h2>
        <p>
          The site is hosted on infrastructure such as Vercel. Like most
          websites, hosting providers may automatically collect standard
          request data (for example IP address, user agent, and timestamps)
          for security, reliability, and performance. We use that kind of
          operational data only to keep the site working and secure.
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Advertising (Google AdSense)
        </h2>
        <p>
          We use Google AdSense to display ads. Google and its partners may use
          cookies and similar technologies to serve ads based on your prior
          visits to this site or other sites. Third-party vendors, including
          Google, use cookies to serve ads based on a user&apos;s prior visits
          to this and other websites.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners
          to serve ads based on your visit to this site and/or other sites on
          the Internet. You can opt out of personalized advertising by
          visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          . You can also learn more in{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&apos;s advertising policies
          </a>
          .
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Cookies
        </h2>
        <p>
          Besides advertising cookies from AdSense and partners, the site may
          use cookies or local storage that are needed for basic functionality
          or analytics provided by the host. You can control cookies through
          your browser settings; blocking some cookies may affect ad delivery
          or other features.
        </p>

        <h2 className="pt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Contact
        </h2>
        <p>
          For privacy questions, email{" "}
          <a
            href="mailto:moinmoinsg@gmail.com"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            moinmoinsg@gmail.com
          </a>
          . More ways to reach us are on the{" "}
          <Link
            href="/contact"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            contact page
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
