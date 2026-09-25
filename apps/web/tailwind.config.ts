import type { Config } from "tailwindcss";
import preset from "@sadora/config/tailwind";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    // Pull class names from the shared UI package too.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
