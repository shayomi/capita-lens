import type { Metadata } from "next";
import { fontVariables } from "@capita/ui/fonts";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Capita-Lens Admin",
    template: "%s · Capita-Lens Admin",
  },
  description: "Capita-Lens administration console.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
