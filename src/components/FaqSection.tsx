import type { FaqItem } from "@/content/tools";

type FaqSectionProps = {
  items: FaqItem[];
};

/** Visible FAQ + FAQPage JSON-LD (required on every tool page). */
export function FaqSection({ items }: FaqSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h2
        id="faq-heading"
        className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        Frequently asked questions
      </h2>
      <dl className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-zinc-900 dark:text-zinc-100">
              {item.question}
            </dt>
            <dd className="mt-2 text-zinc-600 dark:text-zinc-400">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
