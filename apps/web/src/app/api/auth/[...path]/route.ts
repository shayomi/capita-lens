import { auth } from "@/lib/auth/server";

// Neon Better Auth handles all /api/auth/* endpoints.
export const { GET, POST } = auth.handler();
