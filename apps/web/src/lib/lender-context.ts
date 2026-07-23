/**
 * "Why this matters to lenders" copy per scoring category. Reinforces that
 * every score is tied to a real lender expectation (product requirement #3).
 */
export const LENDER_CONTEXT: Record<string, string> = {
  financial_health:
    "Lenders need to see the business can generate and hold enough cash to comfortably service repayments.",
  credit_risk:
    "Your repayment track record and risk profile shape how much a lender will offer, and on what terms.",
  affordability:
    "Lenders check you can service new debt on top of your existing commitments.",
  governance:
    "Clear ownership and sound oversight reduce a lender's perceived risk in backing you.",
  compliance:
    "Up-to-date filings, tax and policies remove easy reasons for a lender to decline.",
  operational_readiness:
    "Resilience and low dependency risk reassure lenders the business can keep trading through shocks.",
  documentation:
    "Strong evidence lets a lender verify everything else quickly, which speeds up a yes.",
};
