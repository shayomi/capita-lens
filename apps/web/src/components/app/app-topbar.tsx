import { UserButton } from "@neondatabase/auth-ui";
import type { AppUser } from "@capita/auth";

export function AppTopbar({ user }: { user: AppUser }) {
  const name = user.displayName ?? user.email.split("@")[0];
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 px-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <p className="truncate font-display text-sm font-semibold">{name}</p>
      </div>
      <div className="flex shrink-0 items-center justify-end pr-1">
        <UserButton size="icon" />
      </div>
    </header>
  );
}
