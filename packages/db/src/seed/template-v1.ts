import type {
  ConditionalLogic,
  QuestionOption,
  QuestionScoring,
  ResponseFeedback,
  AnalysisConfig,
} from "../types";
import type { questionTypeEnum } from "../schema/enums";

type QuestionType = (typeof questionTypeEnum.enumValues)[number];

export interface SeedQuestion {
  key: string;
  label: string;
  type: QuestionType;
  categoryKey?: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  options?: QuestionOption[];
  conditionalLogic?: ConditionalLogic;
  responseFeedback?: ResponseFeedback;
  scoring?: QuestionScoring;
}

export interface SeedSection {
  title: string;
  description?: string;
  intro?: string;
  questions: SeedQuestion[];
}

export interface SeedTemplate {
  slug: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  analysisConfig: AnalysisConfig;
  sections: SeedSection[];
}

/** Default AI analysis configuration for the Capital Readiness template. */
const defaultAnalysisConfig: AnalysisConfig = {
  enabled: true,
  model: "gpt-4o",
  temperature: 0.4,
  rubric:
    "You are a senior UK SME capital-readiness analyst. Assess the business exactly as a commercial lender, investor or grant panel would. Be specific, practical and honest, referencing the applicant's own answers. The deterministic engine has already scored each category — explain and build on those numbers, never contradict them.",
  rules: [
    {
      id: "tax",
      condition: "the business has outstanding tax liabilities",
      effect:
        "treat it as a credit risk, note lenders weigh HMRC obligations heavily, and recommend a documented HMRC time-to-pay arrangement",
    },
    {
      id: "mgmt-accounts",
      condition: "management accounts are prepared only annually or never",
      effect:
        "flag weak financial visibility and recommend moving to monthly management accounts",
    },
    {
      id: "concentration",
      condition: "the largest customer is more than 40% of revenue",
      effect: "flag customer-concentration risk and recommend diversification",
    },
    {
      id: "overdraft",
      condition: "the business has exceeded its overdraft limit",
      effect:
        "note this as a cash-flow warning sign lenders scrutinise and recommend tighter cash-flow forecasting",
    },
  ],
  outputSections: [
    {
      key: "executive_summary",
      title: "Executive Summary",
      guidance:
        "Two or three sentences summarising overall fundability and the single biggest lever to improve it.",
    },
    {
      key: "lender_perspective",
      title: "How a Lender Sees You",
      guidance:
        "Explain how a commercial lender would view this business right now, referencing specific answers (credit history, cash flow, governance).",
    },
    {
      key: "funding_fit",
      title: "Funding Fit",
      guidance:
        "Assess suitability for the funding type and amount they selected, including whether their timing expectation is realistic.",
    },
  ],
};

// Reusable yes/no options.
const yesNo: QuestionOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

// Common scoring shorthands.
const goodIfYes: QuestionScoring = {
  weight: 1,
  points: { yes: 100, no: 20, "*": 40 },
};
const goodIfNo: QuestionScoring = {
  weight: 1,
  points: { no: 100, yes: 15, "*": 50 },
};

/**
 * Capital Readiness v1 — the default onboarding assessment, expressed as data.
 * The engine reads `scoring` to compute category rollups; `responseFeedback`
 * powers the conversational "learn while you answer" microcopy.
 */
export const capitalReadinessV1: SeedTemplate = {
  slug: "capital-readiness",
  name: "Capital Readiness Assessment",
  description:
    "Assess your business the way a lender or investor would, across financial, credit, governance, compliance and operational factors.",
  estimatedMinutes: 18,
  analysisConfig: defaultAnalysisConfig,
  sections: [
    {
      title: "Business Profile",
      intro: "Tell us about your business so we can frame everything else.",
      questions: [
        { key: "business_name", label: "Business name", type: "short_text", required: true },
        { key: "registration_number", label: "Company registration number", type: "short_text", helpText: "Optional now — you can add it later." },
        { key: "trading_name", label: "Trading name", type: "short_text" },
        { key: "country", label: "Country", type: "short_text" },
        {
          key: "legal_structure",
          label: "Legal structure",
          type: "single_select",
          required: true,
          options: [
            { value: "sole_trader", label: "Sole Trader" },
            { value: "partnership", label: "Partnership" },
            { value: "ltd", label: "Limited Company" },
            { value: "llp", label: "LLP" },
            { value: "charity", label: "Charity" },
            { value: "cic", label: "CIC" },
          ],
        },
        {
          key: "years_trading",
          label: "How many years has the business been trading?",
          type: "number",
          categoryKey: "operational_readiness",
          scoring: {
            weight: 1,
            numericBands: [
              { upTo: 1, score: 30 },
              { upTo: 3, score: 60 },
              { upTo: 5, score: 80 },
              { upTo: null, score: 100 },
            ],
          },
        },
        { key: "employees", label: "Number of employees", type: "number" },
        { key: "annual_turnover", label: "Annual turnover", type: "currency", required: true },
        { key: "annual_profit", label: "Annual profit", type: "currency" },
        { key: "website", label: "Website", type: "short_text" },
      ],
    },
    {
      title: "Funding Objective",
      intro: "What are you looking to achieve? This shapes how we weight risk.",
      questions: [
        {
          key: "funding_type",
          label: "What type of funding are you seeking?",
          type: "single_select",
          required: true,
          categoryKey: "operational_readiness",
          options: [
            { value: "working_capital", label: "Working Capital" },
            { value: "business_loan", label: "Business Loan" },
            { value: "asset_finance", label: "Asset Finance" },
            { value: "commercial_mortgage", label: "Commercial Mortgage" },
            { value: "invoice_finance", label: "Invoice Finance" },
            { value: "growth_capital", label: "Growth Capital" },
            { value: "angel", label: "Angel Investment" },
            { value: "vc", label: "Venture Capital" },
            { value: "grant", label: "Grant Funding" },
          ],
        },
        { key: "funding_amount", label: "How much funding do you require?", type: "currency", required: true, categoryKey: "affordability" },
        {
          key: "funding_timing",
          label: "When do you need funding?",
          type: "single_select",
          options: [
            { value: "immediately", label: "Immediately" },
            { value: "3m", label: "Within 3 months" },
            { value: "6m", label: "Within 6 months" },
            { value: "12m", label: "Within 12 months" },
          ],
        },
        { key: "funding_purpose", label: "What will the funding be used for?", type: "long_text" },
      ],
    },
    {
      title: "Financial Health",
      intro: "A clear financial picture is the foundation of any funding decision.",
      questions: [
        { key: "cash_in_bank", label: "Cash in bank", type: "currency", categoryKey: "financial_health", scoring: { weight: 1, numericBands: [{ upTo: 5000, score: 25 }, { upTo: 25000, score: 55 }, { upTo: 100000, score: 80 }, { upTo: null, score: 100 }] } },
        { key: "monthly_expenses", label: "Average monthly expenses", type: "currency", categoryKey: "affordability" },
        { key: "existing_loans", label: "Existing loan balances", type: "currency", categoryKey: "affordability" },
        { key: "outstanding_debt", label: "Total outstanding debt", type: "currency", categoryKey: "affordability" },
        {
          key: "exceeded_overdraft",
          label: "Have you ever exceeded your overdraft limit?",
          type: "boolean",
          categoryKey: "financial_health",
          options: yesNo,
          scoring: goodIfNo,
          responseFeedback: {
            yes: { tone: "caution", message: "Lenders watch overdraft behaviour closely as a signal of cash-flow strain. We'll flag actions to reduce reliance on it." },
          },
        },
        {
          key: "management_accounts",
          label: "How regularly do you prepare management accounts?",
          type: "single_select",
          categoryKey: "financial_health",
          options: [
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "annually", label: "Annually" },
            { value: "never", label: "Never" },
          ],
          scoring: { weight: 1.2, points: { monthly: 100, quarterly: 75, annually: 45, never: 10 } },
          responseFeedback: {
            never: { tone: "info", message: "Regular management accounts are one of the strongest signals of a well-run business. Even quarterly accounts materially improve how lenders view you." },
          },
        },
        {
          key: "cashflow_forecast",
          label: "Do you have cash flow forecasts?",
          type: "boolean",
          categoryKey: "financial_health",
          options: yesNo,
          scoring: goodIfYes,
        },
      ],
    },
    {
      title: "Credit & Lending History",
      intro: "Your track record — the good and the bad. Honesty here makes your profile accurate.",
      questions: [
        {
          key: "knows_credit_score",
          label: "Do you know your business credit score?",
          type: "boolean",
          categoryKey: "credit_risk",
          options: yesNo,
          responseFeedback: {
            no: { tone: "reassure", message: "Many business owners aren't aware of their score. It's only one factor in a much broader assessment — let's keep evaluating the areas that also influence funding decisions." },
          },
        },
        {
          key: "credit_range",
          label: "How would you rate it?",
          type: "single_select",
          categoryKey: "credit_risk",
          conditionalLogic: { mode: "all", conditions: [{ questionKey: "knows_credit_score", operator: "eq", value: "yes" }] },
          options: [
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ],
          scoring: { weight: 1.3, points: { excellent: 100, good: 80, fair: 50, poor: 20 } },
        },
        { key: "missed_repayments", label: "Have you ever missed repayments?", type: "boolean", categoryKey: "credit_risk", options: yesNo, scoring: goodIfNo },
        { key: "late_supplier_payments", label: "Late supplier payments?", type: "boolean", categoryKey: "credit_risk", options: yesNo, scoring: { weight: 0.8, points: { no: 100, yes: 40 } } },
        { key: "any_defaults", label: "Any defaults?", type: "boolean", categoryKey: "credit_risk", options: yesNo, scoring: { weight: 1.4, points: { no: 100, yes: 10 } } },
        { key: "ccjs", label: "Any CCJs?", type: "boolean", categoryKey: "credit_risk", options: yesNo, scoring: { weight: 1.4, points: { no: 100, yes: 10 } } },
        {
          key: "outstanding_tax",
          label: "Outstanding tax liabilities?",
          type: "boolean",
          categoryKey: "credit_risk",
          options: yesNo,
          scoring: goodIfNo,
          responseFeedback: {
            yes: { tone: "caution", message: "This doesn't necessarily prevent funding, but lenders commonly consider outstanding tax obligations. We'll factor it in and suggest actions to strengthen your position." },
          },
        },
        { key: "hmrc_payment_plan", label: "Payment plan with HMRC?", type: "boolean", categoryKey: "credit_risk", options: yesNo, conditionalLogic: { mode: "all", conditions: [{ questionKey: "outstanding_tax", operator: "eq", value: "yes" }] } },
      ],
    },
    {
      title: "Governance",
      intro: "Lenders and investors look for clear ownership and sound oversight.",
      questions: [
        { key: "num_directors", label: "Number of directors", type: "number", categoryKey: "governance" },
        { key: "director_disqualified", label: "Has any director been disqualified?", type: "boolean", categoryKey: "governance", options: yesNo, scoring: { weight: 1.3, points: { no: 100, yes: 5 } } },
        { key: "director_bankrupt", label: "Has any director been bankrupt?", type: "boolean", categoryKey: "governance", options: yesNo, scoring: { weight: 1.2, points: { no: 100, yes: 15 } } },
        { key: "ownership_documented", label: "Is your ownership structure documented?", type: "boolean", categoryKey: "governance", options: yesNo, scoring: goodIfYes },
        {
          key: "governance_docs",
          label: "Which governance documents do you have?",
          type: "multi_select",
          categoryKey: "governance",
          options: [
            { value: "shareholders_agreement", label: "Shareholders Agreement" },
            { value: "articles", label: "Articles of Association" },
            { value: "board_minutes", label: "Board Minutes" },
            { value: "risk_register", label: "Risk Register" },
          ],
          scoring: { weight: 1, points: { shareholders_agreement: 25, articles: 25, board_minutes: 25, risk_register: 25 } },
        },
      ],
    },
    {
      title: "Compliance",
      intro: "Being current with filings and registrations removes easy objections.",
      questions: [
        { key: "companies_house_current", label: "Companies House filings up to date?", type: "boolean", categoryKey: "compliance", options: yesNo, scoring: goodIfYes },
        { key: "confirmation_statement", label: "Confirmation statement current?", type: "boolean", categoryKey: "compliance", options: yesNo, scoring: goodIfYes },
        { key: "accounts_filed", label: "Accounts filed?", type: "boolean", categoryKey: "compliance", options: yesNo, scoring: goodIfYes },
        { key: "vat_registered", label: "VAT registered?", type: "boolean", categoryKey: "compliance", options: yesNo },
        { key: "insurance", label: "Appropriate business insurance in place?", type: "boolean", categoryKey: "compliance", options: yesNo, scoring: goodIfYes },
        { key: "data_protection", label: "Data protection policies in place?", type: "boolean", categoryKey: "compliance", options: yesNo, scoring: { weight: 0.7, points: { yes: 100, no: 40 } } },
      ],
    },
    {
      title: "Operations",
      intro: "Resilience and dependency risks matter as much as the numbers.",
      questions: [
        { key: "business_plan", label: "Do you have a business plan?", type: "boolean", categoryKey: "operational_readiness", options: yesNo, scoring: goodIfYes },
        { key: "growth_strategy", label: "Do you have a growth strategy?", type: "boolean", categoryKey: "operational_readiness", options: yesNo, scoring: goodIfYes },
        {
          key: "customer_concentration",
          label: "What % of revenue comes from your largest customer?",
          type: "percent",
          categoryKey: "operational_readiness",
          scoring: { weight: 1.1, numericBands: [{ upTo: 15, score: 100 }, { upTo: 30, score: 75 }, { upTo: 50, score: 45 }, { upTo: null, score: 20 }] },
          responseFeedback: {
            "*": { tone: "info", message: "High reliance on one customer is a common concern for lenders. Diversifying revenue strengthens your resilience profile." },
          },
        },
        { key: "continuity_plan", label: "Do you have a business continuity plan?", type: "boolean", categoryKey: "operational_readiness", options: yesNo, scoring: { weight: 0.8, points: { yes: 100, no: 45 } } },
        { key: "key_person_dependency", label: "Is the business dependent on one key person?", type: "boolean", categoryKey: "operational_readiness", options: yesNo, scoring: { weight: 0.9, points: { no: 100, yes: 40 } } },
      ],
    },
    {
      title: "Documentation",
      intro: "Upload what you can now — strong evidence lifts your readiness score.",
      questions: [
        { key: "doc_business_plan", label: "Business plan", type: "file", categoryKey: "documentation", scoring: { weight: 1, presentScore: 100, missingScore: 0 } },
        { key: "doc_management_accounts", label: "Management accounts", type: "file", categoryKey: "documentation", scoring: { weight: 1.2, presentScore: 100, missingScore: 0 } },
        { key: "doc_annual_accounts", label: "Annual accounts", type: "file", categoryKey: "documentation", scoring: { weight: 1.2, presentScore: 100, missingScore: 0 } },
        { key: "doc_cashflow_forecast", label: "Cash flow forecast", type: "file", categoryKey: "documentation", scoring: { weight: 1, presentScore: 100, missingScore: 0 } },
        { key: "doc_bank_statements", label: "Bank statements", type: "file", categoryKey: "documentation", scoring: { weight: 1, presentScore: 100, missingScore: 0 } },
        { key: "doc_tax_returns", label: "Tax returns", type: "file", categoryKey: "documentation", scoring: { weight: 0.9, presentScore: 100, missingScore: 0 } },
      ],
    },
  ],
};
