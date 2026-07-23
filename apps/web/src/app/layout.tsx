import type { Metadata } from "next";
import { fontVariables } from "@capita/ui/fonts";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Capita-Lens · Capital Readiness for UK SMEs",
    template: "%s · Capita-Lens",
  },
  description:
    "Assess your business against factors commonly considered by lenders and investors. Understand your capital readiness, close evidence gaps and approach funding with confidence.",
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
