import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Load shared env from the monorepo root so both apps read one .env file.
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
config({ path: join(root, ".env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: root,
  transpilePackages: [
    "@capita/ui",
    "@capita/ai",
    "@capita/auth",
    "@capita/core",
    "@capita/db",
    "@capita/storage",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
