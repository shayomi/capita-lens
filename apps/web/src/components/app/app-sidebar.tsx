"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  ListChecks,
  FolderOpen,
  Settings,
} from "lucide-react";
import { Logo, cn } from "@sadora/ui";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assessment", href: "/assessment", icon: ClipboardCheck },
  { label: "Roadmap", href: "/roadmap", icon: ListChecks },
  { label: "Documents", href: "/documents", icon: FolderOpen },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-muted/20 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
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
