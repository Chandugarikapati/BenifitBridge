/**
 * BenefitBridge Community Problem Evaluation & Metric Definitions
 * Evaluates whether public benefits access barriers exist and measures real platform efficacy.
 * Every metric has an explicit formula: Numerator, Denominator, and Primary Data Source.
 */

export interface MetricDefinition {
  id: string;
  name: string;
  category: "PROBLEM_AWARENESS" | "APPLICATION_BARRIER" | "PLATFORM_EFFECTIVENESS" | "AI_RELIABILITY";
  numerator: string;
  denominator: string;
  dataSource: string;
  description: string;
}

export const COMMUNITY_METRICS_REGISTRY: Record<string, MetricDefinition> = {
  AWARENESS_DEFICIT_RATE: {
    id: "AWARENESS_DEFICIT_RATE",
    name: "Unassisted Awareness Deficit Rate",
    category: "PROBLEM_AWARENESS",
    numerator: "Beneficiaries who qualify for >= 1 scheme but had zero prior awareness of it before onboarding",
    denominator: "Total evaluated beneficiaries with matched schemes",
    dataSource: "Beneficiary onboarding survey & first-time scheme match logs",
    description: "Measures the baseline information gap in marginalized communities for public schemes.",
  },
  POTENTIALLY_ELIGIBLE_UNSERVED_RATE: {
    id: "POTENTIALLY_ELIGIBLE_UNSERVED_RATE",
    name: "Eligible Unserved Population Share",
    category: "PROBLEM_AWARENESS",
    numerator: "Beneficiaries with MATCH status who have not previously submitted an official application",
    denominator: "Total beneficiaries with MATCH status",
    dataSource: "ApplicationCase records with status DRAFT / PREPARING vs prior history",
    description: "Quantifies the eligible population not currently receiving entitled support.",
  },
  MISSING_DOCUMENT_BOTTLENECK_RATE: {
    id: "MISSING_DOCUMENT_BOTTLENECK_RATE",
    name: "Document Acquisition Bottleneck Rate",
    category: "APPLICATION_BARRIER",
    numerator: "Checklist items marked incomplete due to missing authority certificates (Income, Caste, BPL)",
    denominator: "Total required mandatory checklist items across all active cases",
    dataSource: "ChecklistItem table joined with DocumentRequirement",
    description: "Highlights which specific civil certificates cause the highest barrier to filing.",
  },
  CHECKLIST_COMPLETION_RATE: {
    id: "CHECKLIST_COMPLETION_RATE",
    name: "Checklist Readiness Completion Rate",
    category: "PLATFORM_EFFECTIVENESS",
    numerator: "Cases that reach 100% completed mandatory checklist items",
    denominator: "Total initiated ApplicationCases",
    dataSource: "ApplicationCase status transitions to READY_TO_SUBMIT",
    description: "Evaluates how effectively the platform guides citizens from discovery to submission readiness.",
  },
  HUMAN_WORKER_ASSISTANCE_REQUEST_RATE: {
    id: "HUMAN_WORKER_ASSISTANCE_REQUEST_RATE",
    name: "NGO / Community Worker Assistance Rate",
    category: "PLATFORM_EFFECTIVENESS",
    numerator: "Cases where a citizen requested NGO case worker assignment",
    denominator: "Total active citizen cases",
    dataSource: "ApplicationCase records with organizationId NOT NULL or CaseAssignment records",
    description: "Measures reliance on community intermediaries for vulnerable or low-literacy citizens.",
  },
  FOLLOW_UP_COMPLETION_RATE: {
    id: "FOLLOW_UP_COMPLETION_RATE",
    name: "Follow-up Task Timely Completion Rate",
    category: "PLATFORM_EFFECTIVENESS",
    numerator: "FollowUpTasks completed on or before dueDate",
    denominator: "Total assigned FollowUpTasks with due dates",
    dataSource: "FollowUpTask table where isCompleted = true and completedAt <= dueDate",
    description: "Tracks caseworker accountability and speed in unblocking beneficiary cases.",
  },
  REPORTED_OUTCOME_SUCCESS_RATE: {
    id: "REPORTED_OUTCOME_SUCCESS_RATE",
    name: "Citizen-Reported Approval Rate",
    category: "PLATFORM_EFFECTIVENESS",
    numerator: "Cases with reportedOutcome = 'APPROVED'",
    denominator: "Cases with reportedOutcome in ['APPROVED', 'REJECTED']",
    dataSource: "ApplicationCase.reportedOutcome field",
    description: "Measures application success rate as reported directly by beneficiaries.",
  },
  AI_GROUNDING_FIDELITY_RATE: {
    id: "AI_GROUNDING_FIDELITY_RATE",
    name: "AI Verified Source Grounding Rate",
    category: "AI_RELIABILITY",
    numerator: "AI queries where verified scheme context was injected and zero hallucinated citations occurred",
    denominator: "Total AI assistant queries executed",
    dataSource: "AIInteractionMetadata table (groundedSchemeIds NOT NULL and uncertaintyFlag = false)",
    description: "Guarantees AI explanations stay strictly tethered to published official criteria.",
  },
  AI_UNCERTAINTY_DISCLOSURE_RATE: {
    id: "AI_UNCERTAINTY_DISCLOSURE_RATE",
    name: "AI Uncertainty & Limitation Disclosure Rate",
    category: "AI_RELIABILITY",
    numerator: "Queries where AI flagged missing information or advised human caseworker review",
    denominator: "Total complex eligibility inquiries to AI assistant",
    dataSource: "AIInteractionMetadata.uncertaintyFlag count",
    description: "Ensures the AI assistant never makes false guarantees and proactively highlights gaps.",
  },
};
