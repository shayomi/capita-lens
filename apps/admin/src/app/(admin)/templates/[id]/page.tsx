import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card, Badge, Button } from "@sadora/ui";
import { getTemplateDetail } from "@/lib/queries";

export const metadata = { title: "Template" };

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplateDetail(id);
  if (!template) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/templates"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All templates
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">
              {template.name}
            </h1>
            <Badge variant={template.status === "published" ? "success" : "warning"}>
              {template.status}
            </Badge>
          </div>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/templates/${template.id}/analysis`}>
              <Sparkles className="size-4" />
              Analysis Studio
            </Link>
          </Button>
          <Button disabled variant="outline">
            Edit builder
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {template.sections.map((section, i) => (
          <Card key={section.id} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="tabular font-mono text-xs text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-sm font-semibold">
                  {section.title}
                </span>
              </div>
              <span className="text-2xs text-muted-foreground">
                {section.questions.length} questions
              </span>
            </div>
            <ul className="divide-y divide-border/60">
              {section.questions.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between px-5 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{q.label}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{q.type}</Badge>
                      {q.required ? (
                        <Badge variant="danger">required</Badge>
                      ) : null}
                      {q.category?.label ? (
                        <Badge variant="info">{q.category.label}</Badge>
                      ) : null}
                      {q.scoring ? (
                        <span className="text-2xs text-muted-foreground">
                          weight ×{q.scoring.weight}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <code className="ml-3 shrink-0 text-2xs text-muted-foreground">
                    {q.key}
                  </code>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
