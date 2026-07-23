"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileStack,
  Users,
  Inbox,
  SlidersHorizontal,
  Mails,
} from "lucide-react";
import { Logo, cn, Badge } from "@capita/ui";

const NAV = [
  { label: "Overview", href: "/", icon: LayoutGrid },
  { label: "Templates", href: "/templates", icon: FileStack },
  { label: "Submissions", href: "/submissions", icon: Inbox },
  { label: "Users", href: "/users", icon: Users },
  { label: "Waitlist", href: "/waitlist", icon: Mails },
  { label: "Categories", href: "/categories", icon: SlidersHorizontal },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-card lg:flex">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/">
          <Logo />
        </Link>
        <Badge variant="brand">Admin</Badge>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-brand-muted text-brand shadow-sm ring-1 ring-brand/20 before:absolute before:left-0 before:top-2 before:h-5 before:w-1 before:rounded-r-full before:bg-brand"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-brand" : "text-muted-foreground",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
