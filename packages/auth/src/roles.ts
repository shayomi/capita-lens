/** Role model. Pure — safe to import anywhere (client or server). */

export type Role = "user" | "admin" | "super_admin";

const RANK: Record<Role, number> = {
  user: 0,
  admin: 1,
  super_admin: 2,
};

/** True when `role` meets or exceeds `required` in the hierarchy. */
export function hasRole(role: Role, required: Role): boolean {
  return RANK[role] >= RANK[required];
}

/** admins and super_admins may access the admin app. */
export function canAccessAdmin(role: Role): boolean {
  return hasRole(role, "admin");
}

/** Only super_admins may manage other users' roles. */
export function canManageRoles(role: Role): boolean {
  return hasRole(role, "super_admin");
}
