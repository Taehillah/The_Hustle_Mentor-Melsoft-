import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Hustle Mentor | AI business copilot",
  description:
    "Launch and grow your hustle with AI playbooks, compliance checklists, branding kits, and WhatsApp-ready automations built for South African youth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
