import type { CategoryThresholds } from "../types";

export interface SeedCategory {
  key: string;
  label: string;
  description: string;
  weight: number;
  displayOrder: number;
  thresholds: CategoryThresholds;
}

const defaultThresholds: CategoryThresholds = {
  critical: 40,
  attention: 60,
  onTrack: 80,
};

/**
 * The scoring dimensions of the Decision Intelligence Framework. Weights are
 * relative — the engine normalises them when computing the overall score.
 * Admins can edit all of this later in the dashboard.
 */
export const seedCategories: SeedCategory[] = [
  {
    key: "financial_health",
    label: "Financial Health",
    description: "Profitability, cash position and financial disciplines.",
    weight: 1.4,
    displayOrder: 1,
    thresholds: defaultThresholds,
  },
  {
    key: "credit_risk",
    label: "Credit & Risk",
    description: "Repayment history, defaults, CCJs and tax obligations.",
    weight: 1.3,
    displayOrder: 2,
    thresholds: defaultThresholds,
  },
  {
    key: "affordability",
    label: "Affordability",
    description: "Ability to service new debt against existing commitments.",
    weight: 1.2,
    displayOrder: 3,
    thresholds: defaultThresholds,
  },
  {
    key: "governance",
    label: "Governance",
    description: "Directors, ownership clarity and board documentation.",
    weight: 1.0,
    displayOrder: 4,
    thresholds: defaultThresholds,
  },
  {
    key: "compliance",
    label: "Compliance",
    description: "Companies House filings, tax registration and policies.",
    weight: 1.0,
    displayOrder: 5,
    thresholds: defaultThresholds,
  },
  {
    key: "operational_readiness",
    label: "Operational Readiness",
    description: "Planning, resilience and customer/supplier concentration.",
    weight: 0.9,
    displayOrder: 6,
    thresholds: defaultThresholds,
  },
  {
    key: "documentation",
    label: "Documentation",
    description: "Quality and completeness of supporting evidence.",
    weight: 1.1,
    displayOrder: 7,
    thresholds: defaultThresholds,
  },
];
