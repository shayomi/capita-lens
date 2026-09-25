import { requireUser } from "@sadora/auth";
import { Card } from "@sadora/ui";
import { auth } from "@/lib/auth/server";
import {
  getPublishedTemplate,
  getOrCreateAssessment,
} from "@/lib/queries/assessment";
import { AssessmentRenderer } from "@/components/assessment/assessment-renderer";
import type { ClientSection } from "@/components/assessment/types";

export const metadata = { title: "Assessment" };
export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const user = await requireUser(auth);
  const template = await getPublishedTemplate();

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold">Assessment</h1>
        <Card className="mt-4 p-8 text-sm text-muted-foreground">
          No published assessment is available yet. Please check back shortly.
        </Card>
      </div>
    );
  }

  const { assessment, answersByQuestionId } = await getOrCreateAssessment(
    user.id,
    template.id,
    template.version,
  );

  // Shape into serializable data for the client renderer.
  const sections: ClientSection[] = template.sections.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    intro: s.intro,
    questions: s.questions.map((q) => ({
      id: q.id,
      key: q.key,
      label: q.label,
      helpText: q.helpText,
      placeholder: q.placeholder,
      type: q.type,
      options: q.options,
      required: q.required,
      conditionalLogic: q.conditionalLogic,
      responseFeedback: q.responseFeedback,
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold">{template.name}</h1>
        <p className="text-sm text-muted-foreground">
          {template.estimatedMinutes} min · Your progress saves automatically.
        </p>
      </div>
      <AssessmentRenderer
        assessmentId={assessment.id}
        sections={sections}
        initialAnswersByQuestionId={answersByQuestionId}
      />
    </div>
  );
}
