import "@/styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "S M Nowshadur Rahaman — Resume",
  description: "Resume of S M Nowshadur Rahaman",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
