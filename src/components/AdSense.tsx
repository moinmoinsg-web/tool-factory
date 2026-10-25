import Script from "next/script";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** Loads the AdSense script when NEXT_PUBLIC_ADSENSE_CLIENT is set. */
export function AdSenseScript() {
  if (!clientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

type AdUnitProps = {
  slot?: string;
  className?: string;
  format?: string;
};

/**
 * Placeholder ad unit. Replace data-ad-slot with a real unit ID from AdSense.
 * Renders a visible placeholder when the client ID is missing (local/dev).
 */
export function AdUnit({
  slot = "0000000000",
  className = "",
  format = "auto",
}: AdUnitProps) {
  if (!clientId) {
    return (
      <div
        className={`flex min-h-[90px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 ${className}`}
        aria-label="AdSense placeholder"
      >
        AdSense placeholder — set NEXT_PUBLIC_ADSENSE_CLIENT
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <Script id={`adsense-push-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
