import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * Typography: Inter for UI/display (with a tighter display weight range),
 * JetBrains Mono for figures/codes. Exposed as CSS variables consumed by the
 * Tailwind preset (--font-sans / --font-display / --font-mono).
 */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Convenience: all font variable classes for the <html>/<body> element. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`;
