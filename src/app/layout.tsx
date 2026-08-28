import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PF Compass — PF Transfer Preflight",
  description:
    "Know what needs fixing before you submit. PF Compass helps you understand and prepare for a PF transfer journey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
