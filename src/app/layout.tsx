import "@/styles/globals.css";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata = {
  title: "S M Nowshadur Rahaman — Resume",
  description: "Resume of S M Nowshadur Rahaman",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  return (
    <html lang="en">
      <body>{children}</body>
      {cfToken && (
        <Script
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${cfToken}"}`}
        />
      )}
    </html>
  );
}
