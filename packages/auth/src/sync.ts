import "server-only";
import { db, schema, eq } from "@sadora/db";
import type { Role } from "./roles";

/**
 * Emails that should always be super_admins, from SUPER_ADMIN_EMAILS
 * (comma-separated). This is how you "seed" an admin with Better Auth: the
 * listed accounts are promoted automatically the first time they sign in.
 */
function superAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: Role;
  isActive: boolean;
}

/** Minimal shape we read from a Neon Better Auth session user. */
export interface AuthUserLike {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

/**
 * Upsert the authenticated user into our `users` table and return the
 * app-side record (which carries the role). Role is never overwritten on
 * subsequent logins — it's owned by our app / admins, not the auth provider.
 */
export async function syncUser(authUser: AuthUserLike): Promise<AppUser> {
  const email = authUser.email ?? `${authUser.id}@no-email.sadora`;

  const [row] = await db
    .insert(schema.users)
    .values({
      id: authUser.id,
      email,
      displayName: authUser.name ?? null,
      avatarUrl: authUser.image ?? null,
      lastSeenAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.users.id,
      set: {
        email,
        displayName: authUser.name ?? null,
        avatarUrl: authUser.image ?? null,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();

  // Promote allowlisted emails to super_admin (never demote).
  if (
    row!.role !== "super_admin" &&
    superAdminEmails().includes(email.toLowerCase())
  ) {
    const [promoted] = await db
      .update(schema.users)
      .set({ role: "super_admin", updatedAt: new Date() })
      .where(eq(schema.users.id, row!.id))
      .returning();
    return toAppUser(promoted!);
  }

  return toAppUser(row!);
}

/** Look up an app user by id without touching the auth provider. */
export async function getAppUserById(id: string): Promise<AppUser | null> {
  const row = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });
  return row ? toAppUser(row) : null;
}

function toAppUser(row: typeof schema.users.$inferSelect): AppUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    role: row.role as Role,
    isActive: row.isActive,
  };
}
