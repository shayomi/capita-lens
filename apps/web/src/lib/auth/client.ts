"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Browser auth client used by the Neon Auth UI provider + components. */
export const authClient = createAuthClient();
