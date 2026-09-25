import { UserButton } from "@neondatabase/auth-ui";
import { Badge } from "@sadora/ui";
import type { AppUser } from "@sadora/auth";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
};

export function AdminTopbar({ user }: { user: AppUser }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate font-display text-sm font-semibold">
          {user.displayName ?? user.email}
        </span>
        <Badge variant="outline" className="shrink-0">
          {ROLE_LABEL[user.role] ?? user.role}
        </Badge>
      </div>
      <div className="flex shrink-0 items-center justify-end pr-1">
        <UserButton />
      </div>
    </header>
  );
}
