import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeyGen — Password & API Key Generator",
  description:
    "Generate cryptographically secure passwords, API keys, and UUIDs in your browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
