import { Card } from "@capita/ui";

/** Placeholder for screens landing in a later build phase. */
export function Wip({ title, note }: { title: string; note: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <Card className="mt-4 p-8 text-sm text-muted-foreground">{note}</Card>
    </div>
  );
}
