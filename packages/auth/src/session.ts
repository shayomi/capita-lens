import "server-only";
import { redirect } from "next/navigation";
import { canAccessAdmin, type Role, hasRole } from "./roles";
import { syncUser, type AppUser } from "./sync";
import type { CapitaAuth } from "./neon";

/**
 * Resolve the current app user (or null) from a Neon Better Auth instance,
 * syncing the auth record into our DB on the way. Use in server components /
 * actions. Pass the app's `auth` instance (from src/lib/auth/server.ts).
 */
export async function getCurrentUser(auth: CapitaAuth): Promise<AppUser | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  return syncUser({
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  });
}

/** Require any authenticated user; redirect to sign-in otherwise. */
export async function requireUser(auth: CapitaAuth): Promise<AppUser> {
  const user = await getCurrentUser(auth);
  if (!user) redirect("/auth/sign-in");
  return user;
}

/** Require a minimum role; redirect (unauthorised) otherwise. */
export async function requireRole(
  auth: CapitaAuth,
  required: Role,
): Promise<AppUser> {
  const user = await requireUser(auth);
  if (!hasRole(user.role, required)) redirect("/unauthorised");
  return user;
}

/** Require admin-app access (admin or super_admin). */
export async function requireAdmin(auth: CapitaAuth): Promise<AppUser> {
  const user = await requireUser(auth);
  if (!canAccessAdmin(user.role)) redirect("/unauthorised");
  return user;
}
