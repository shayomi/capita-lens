"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input, Textarea, Label, cn } from "@sadora/ui";
import type { AnswerValue, ClientQuestion } from "./types";
import { FileUpload } from "./file-upload";

const FEEDBACK_STYLE = {
  info: { icon: Info, cls: "border-info/30 bg-info/10 text-info" },
  reassure: {
    icon: ShieldCheck,
    cls: "border-success/30 bg-success/10 text-success",
  },
  caution: {
    icon: AlertTriangle,
    cls: "border-warning/30 bg-warning/10 text-warning",
  },
} as const;

interface Props {
  question: ClientQuestion;
  assessmentId: string;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue | undefined) => void;
}

export function QuestionField({ question, assessmentId, value, onChange }: Props) {
  const feedback = resolveFeedback(question, value);

  return (
    <div className="space-y-2.5">
      <div>
        <Label className="text-[0.95rem] font-medium">
          {question.label}
          {question.required ? (
            <span className="ml-1 text-danger">*</span>
          ) : null}
        </Label>
        {question.helpText ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {question.helpText}
          </p>
        ) : null}
      </div>

      <Control question={question} assessmentId={assessmentId} value={value} onChange={onChange} />

      <AnimatePresence>
        {feedback ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className={cn(
                "flex gap-2.5 rounded-lg border p-3 text-sm",
                FEEDBACK_STYLE[feedback.tone].cls,
              )}
            >
              {(() => {
                const Icon = FEEDBACK_STYLE[feedback.tone].icon;
                return <Icon className="mt-0.5 size-4 shrink-0" />;
              })()}
              <span className="text-foreground/90">{feedback.message}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ── Individual input controls ────────────────────────────────────────

function Control({ question, assessmentId, value, onChange }: Props) {
  switch (question.type) {
    case "long_text":
      return (
        <Textarea
          placeholder={question.placeholder ?? ""}
          value={value?.kind === "text" ? value.value : ""}
          onChange={(e) => onChange({ kind: "text", value: e.target.value })}
        />
      );

    case "short_text":
      return (
        <Input
          placeholder={question.placeholder ?? ""}
          value={value?.kind === "text" ? value.value : ""}
          onChange={(e) => onChange({ kind: "text", value: e.target.value })}
        />
      );

    case "number":
    case "currency":
    case "percent":
      return (
        <NumberInput question={question} value={value} onChange={onChange} />
      );

    case "date":
      return (
        <Input
          type="date"
          value={value?.kind === "date" ? value.value : ""}
          onChange={(e) => onChange({ kind: "date", value: e.target.value })}
        />
      );

    case "boolean":
      return (
        <Segmented
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          selected={value?.kind === "boolean" ? (value.value ? "yes" : "no") : null}
          onSelect={(v) => onChange({ kind: "boolean", value: v === "yes" })}
        />
      );

    case "single_select":
      return (
        <Segmented
          options={(question.options ?? []).map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          selected={value?.kind === "single" ? value.value : null}
          onSelect={(v) => onChange({ kind: "single", value: v })}
          wrap
        />
      );

    case "multi_select":
      return (
        <MultiSelect question={question} value={value} onChange={onChange} />
      );

    case "file":
      return (
        <FileUpload
          assessmentId={assessmentId}
          questionId={question.id}
          documentIds={value?.kind === "file" ? value.documentIds : []}
          onChange={(documentIds) => onChange({ kind: "file", documentIds })}
        />
      );

    default:
      return (
        <Input
          value={value?.kind === "text" ? value.value : ""}
          onChange={(e) => onChange({ kind: "text", value: e.target.value })}
        />
      );
  }
}

function NumberInput({
  question,
  value,
  onChange,
}: Omit<Props, "assessmentId">) {
  const prefix = question.type === "currency" ? "£" : null;
  const suffix = question.type === "percent" ? "%" : null;
  return (
    <div className="relative">
      {prefix ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {prefix}
        </span>
      ) : null}
      <Input
        type="number"
        inputMode="decimal"
        placeholder={question.placeholder ?? "0"}
        className={cn(prefix && "pl-7", suffix && "pr-8")}
        value={value?.kind === "number" ? String(value.value) : ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(undefined);
          const num = Number(raw);
          if (!Number.isNaN(num)) onChange({ kind: "number", value: num });
        }}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function MultiSelect({ question, value, onChange }: Omit<Props, "assessmentId">) {
  const selected = value?.kind === "multi" ? value.value : [];
  const toggle = (v: string) => {
    const next = selected.includes(v)
      ? selected.filter((x) => x !== v)
      : [...selected, v];
    onChange({ kind: "multi", value: next });
  };
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {(question.options ?? []).map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              active
                ? "border-brand bg-brand-muted text-foreground"
                : "border-input hover:bg-accent",
            )}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded border",
                active ? "border-brand bg-brand text-brand-foreground" : "border-muted-foreground/40",
              )}
            >
              {active ? "✓" : ""}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Segmented({
  options,
  selected,
  onSelect,
  wrap,
}: {
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
  wrap?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", wrap ? "flex-wrap" : "")}>
      {options.map((o) => {
        const active = selected === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-brand bg-brand text-brand-foreground shadow-sm"
                : "border-input hover:bg-accent",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Conversational feedback resolver ─────────────────────────────────

function resolveFeedback(question: ClientQuestion, value: AnswerValue | undefined) {
  if (!question.responseFeedback || !value) return null;
  const fb = question.responseFeedback;
  let key: string | null = null;
  switch (value.kind) {
    case "boolean":
      key = value.value ? "yes" : "no";
      break;
    case "single":
      key = value.value;
      break;
    default:
      key = null;
  }
  const match = (key && fb[key]) || fb["*"];
  return match ?? null;
}
