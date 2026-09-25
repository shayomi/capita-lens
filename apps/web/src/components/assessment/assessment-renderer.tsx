"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react";
import { isVisible } from "@sadora/core";
import { Button, Card, Progress, cn } from "@sadora/ui";
import type { AnswersByKey, AnswerValue, ClientSection } from "./types";
import { QuestionField } from "./question-field";
import { Analysing } from "./analysing";
import { saveAnswers, submitAssessment } from "@/app/(app)/assessment/actions";

interface Props {
  assessmentId: string;
  sections: ClientSection[];
  initialAnswersByQuestionId: Record<string, AnswerValue>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function hasValue(value: AnswerValue | undefined): boolean {
  if (!value) return false;
  switch (value.kind) {
    case "text":
      return value.value.trim() !== "";
    case "single":
    case "date":
      return value.value !== "";
    case "multi":
      return value.value.length > 0;
    case "file":
      return value.documentIds.length > 0;
    default:
      return true;
  }
}

export function AssessmentRenderer({
  assessmentId,
  sections,
  initialAnswersByQuestionId,
}: Props) {
  const router = useRouter();

  // id ↔ key maps for translating between DB rows and conditional logic.
  const { keyById, idByKey } = useMemo(() => {
    const keyById = new Map<string, string>();
    const idByKey = new Map<string, string>();
    for (const s of sections)
      for (const q of s.questions) {
        keyById.set(q.id, q.key);
        idByKey.set(q.key, q.id);
      }
    return { keyById, idByKey };
  }, [sections]);

  const [answers, setAnswers] = useState<AnswersByKey>(() => {
    const initial: AnswersByKey = {};
    for (const [qid, val] of Object.entries(initialAnswersByQuestionId)) {
      const key = keyById.get(qid);
      if (key) initial[key] = val;
    }
    return initial;
  });

  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [missing, setMissing] = useState(false);

  const section = sections[index]!;
  const isLast = index === sections.length - 1;
  const progress = ((index + (isLast ? 1 : 0)) / sections.length) * 100;

  const visibleQuestions = section.questions.filter((q) =>
    isVisible(q.conditionalLogic, answers),
  );

  function setAnswer(key: string, value: AnswerValue | undefined) {
    setMissing(false);
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  async function persist() {
    const entries: Array<{ questionId: string; value: AnswerValue }> = [];
    for (const [key, value] of Object.entries(answers)) {
      const id = idByKey.get(key);
      if (id && value) entries.push({ questionId: id, value });
    }
    if (entries.length) await saveAnswers(assessmentId, entries);
  }

  function requiredComplete(): boolean {
    return visibleQuestions
      .filter((q) => q.required)
      .every((q) => hasValue(answers[q.key]));
  }

  async function goNext() {
    if (!requiredComplete()) return setMissing(true);
    setSaving(true);
    await persist();
    setSaving(false);
    setIndex((i) => Math.min(i + 1, sections.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function goBack() {
    setSaving(true);
    await persist();
    setSaving(false);
    setIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveForLater() {
    setSaving(true);
    await persist();
    setSaving(false);
  }

  async function submit() {
    if (!requiredComplete()) return setMissing(true);
    setAnalysing(true);
    await persist();
    // Score on the server while the analysing animation plays (min ~2.6s).
    await Promise.all([submitAssessment(assessmentId), sleep(2600)]);
    router.push("/dashboard");
  }

  if (analysing) return <Analysing />;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {section.title}
          </span>
          <span className="tabular text-muted-foreground">
            Section {index + 1} of {sections.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 sm:p-8">
            {section.intro ? (
              <p className="mb-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                {section.intro}
              </p>
            ) : null}

            <div className="space-y-7">
              {visibleQuestions.map((q) => (
                <QuestionField
                  key={q.id}
                  question={q}
                  assessmentId={assessmentId}
                  value={answers[q.key]}
                  onChange={(v) => setAnswer(q.key, v)}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {missing ? (
        <p className="mt-3 text-sm text-danger">
          Please answer the required questions before continuing.
        </p>
      ) : null}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {index > 0 ? (
            <Button variant="ghost" onClick={goBack} disabled={saving}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveForLater}
            disabled={saving}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              saving && "opacity-60",
            )}
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Save & continue later
          </button>

          {isLast ? (
            <Button onClick={submit} disabled={saving}>
              <Check className="size-4" />
              See my results
            </Button>
          ) : (
            <Button onClick={goNext} disabled={saving}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
