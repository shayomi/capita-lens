import Link from "next/link";
import { Button } from "@capita/ui";

export default function UnauthorisedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Access denied</h1>
      <p className="max-w-sm text-muted-foreground">
        You don&apos;t have permission to view this page.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
