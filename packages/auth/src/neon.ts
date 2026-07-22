import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Factory for a Neon Managed Better Auth server instance. Each Next.js app
 * creates one (in `src/lib/auth/server.ts`) so they can share cookies across
 * the same parent domain in production while reading one config from env.
 */
export function createAuth(options?: { cookieDomain?: string }) {
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: {
      secret: process.env.NEON_AUTH_COOKIE_SECRET!,
      ...(options?.cookieDomain ? { domain: options.cookieDomain } : {}),
    },
  });
}

export type CapitaAuth = ReturnType<typeof createAuth>;
