"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Check, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Textarea,
  Label,
  Separator,
  Badge,
  cn,
} from "@capita/ui";
import type { AnalysisConfig } from "@capita/db";
import { saveAnalysisConfig } from "@/app/(admin)/templates/[id]/analysis/actions";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

export function AnalysisStudio({
  templateId,
  initial,
}: {
  templateId: string;
  initial: AnalysisConfig;
}) {
  const [config, setConfig] = useState<AnalysisConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch(p: Partial<AnalysisConfig>) {
    setSaved(false);
    setConfig((c) => ({ ...c, ...p }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await saveAnalysisConfig(templateId, config);
      setSaved(true);
    } catch {
      setError("Could not save. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Rules ──
  const addRule = () =>
    patch({
      rules: [
        ...config.rules,
        { id: crypto.randomUUID().slice(0, 8), condition: "", effect: "" },
      ],
    });
  const updateRule = (id: string, field: "condition" | "effect", v: string) =>
    patch({
      rules: config.rules.map((r) => (r.id === id ? { ...r, [field]: v } : r)),
    });
  const removeRule = (id: string) =>
    patch({ rules: config.rules.filter((r) => r.id !== id) });

  // ── Output sections ──
  const addSection = () =>
    patch({
      outputSections: [
        ...config.outputSections,
        { key: "", title: "", guidance: "" },
      ],
    });
  const updateSection = (
    i: number,
    field: "key" | "title" | "guidance",
    v: string,
  ) =>
    patch({
      outputSections: config.outputSections.map((s, idx) =>
        idx === i
          ? { ...s, [field]: field === "key" ? slug(v) : v }
          : s,
      ),
    });
  const removeSection = (i: number) =>
    patch({
      outputSections: config.outputSections.filter((_, idx) => idx !== i),
    });

  return (
    <div className="space-y-6">
      {/* Model + toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand" />
              <CardTitle>AI analysis</CardTitle>
            </div>
            <button
              type="button"
              onClick={() => patch({ enabled: !config.enabled })}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                config.enabled ? "bg-brand" : "bg-secondary",
              )}
              aria-pressed={config.enabled}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                  config.enabled ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
          <CardDescription>
            When enabled, submissions are analysed by the model using the rubric
            and rules below. The deterministic engine always owns the scores.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Input
              value={config.model}
              onChange={(e) => patch({ model: e.target.value })}
              placeholder="gpt-4o"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Temperature ({config.temperature.toFixed(1)})</Label>
            <Input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={config.temperature}
              onChange={(e) =>
                patch({ temperature: Number(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Rubric */}
      <Card>
        <CardHeader>
          <CardTitle>Rubric</CardTitle>
          <CardDescription>
            The analyst&apos;s persona and overall instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={config.rubric}
            onChange={(e) => patch({ rubric: e.target.value })}
            placeholder="You are a UK SME capital-readiness analyst…"
          />
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assessment rules</CardTitle>
              <CardDescription>
                Condition → effect rules the model must apply.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addRule}>
              <Plus className="size-4" />
              Add rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rules yet.</p>
          ) : (
            config.rules.map((r) => (
              <div
                key={r.id}
                className="grid gap-2 rounded-lg border border-border/60 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div className="space-y-1">
                  <Label className="text-2xs uppercase text-muted-foreground">
                    If
                  </Label>
                  <Textarea
                    rows={2}
                    value={r.condition}
                    onChange={(e) =>
                      updateRule(r.id, "condition", e.target.value)
                    }
                    placeholder="the business has outstanding tax liabilities"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-2xs uppercase text-muted-foreground">
                    Then
                  </Label>
                  <Textarea
                    rows={2}
                    value={r.effect}
                    onChange={(e) => updateRule(r.id, "effect", e.target.value)}
                    placeholder="flag as credit risk and recommend HMRC time-to-pay"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRule(r.id)}
                  className="self-start rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-danger"
                  aria-label="Remove rule"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Output sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Output sections</CardTitle>
              <CardDescription>
                Narrative blocks the model writes and the dashboard renders.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addSection}>
              <Plus className="size-4" />
              Add section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.outputSections.map((s, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-border/60 p-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  className="max-w-xs"
                  value={s.title}
                  onChange={(e) => updateSection(i, "title", e.target.value)}
                  placeholder="Executive Summary"
                />
                <Badge variant="outline">
                  {s.key || slug(s.title) || "key"}
                </Badge>
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-danger"
                  aria-label="Remove section"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <Textarea
                rows={2}
                value={s.guidance}
                onChange={(e) => updateSection(i, "guidance", e.target.value)}
                placeholder="What the model should write in this section…"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 flex items-center justify-end gap-3">
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {saved ? (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <Check className="size-4" /> Saved
          </span>
        ) : null}
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
          Save configuration
        </Button>
      </div>
      <Separator />
    </div>
  );
}
