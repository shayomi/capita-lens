import type {
  AnswerValue,
  ConditionalLogic,
  QuestionOption,
  ResponseFeedback,
} from "@sadora/db";

export type { AnswerValue };

/** Serializable question shape passed from the server page to the renderer. */
export interface ClientQuestion {
  id: string;
  key: string;
  label: string;
  helpText: string | null;
  placeholder: string | null;
  type: string;
  options: QuestionOption[] | null;
  required: boolean;
  conditionalLogic: ConditionalLogic | null;
  responseFeedback: ResponseFeedback | null;
}

export interface ClientSection {
  id: string;
  title: string;
  description: string | null;
  intro: string | null;
  questions: ClientQuestion[];
}

/** Answers held in the client, keyed by question key (for conditional logic). */
export type AnswersByKey = Record<string, AnswerValue | undefined>;
