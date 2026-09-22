import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../src/Shared/styles.css";

export const metadata: Metadata = {
  title: "Team Tools",
  description: "Anonymous live team sense-making for comfort/stretch and Tuckman models.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
