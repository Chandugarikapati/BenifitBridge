/**
 * BenefitBridge Deterministic Eligibility Evaluation Engine
 * Evaluates individual criteria and scheme-level suitability based on transparent rules.
 * Never silently assumes missing data.
 * Always links evaluations to official rules and gazette sources.
 */

export type CriterionMatchStatus = "MATCH" | "DOES_NOT_MATCH" | "UNKNOWN" | "REQUIRES_HUMAN_REVIEW";

export interface CriterionRule {
  id: string;
  criterionName: string;
  fieldKey: string;
  operator: "EQUALS" | "NOT_EQUALS" | "GREATER_THAN_EQUAL" | "LESS_THAN_EQUAL" | "IN_LIST" | "BOOLEAN";
  expectedValue: string;
  explanation: string;
  isMandatory: boolean;
  sourceReferenceUrl?: string | null;
  sourceReferenceText?: string | null;
}

export interface CriterionEvaluationResult {
  ruleId: string;
  criterionName: string;
  fieldKey: string;
  userValue: any;
  expectedValue: string;
  status: CriterionMatchStatus;
  reason: string;
  isMandatory: boolean;
  sourceUrl?: string | null;
  sourceText?: string | null;
}

export interface SchemeEvaluationResult {
  schemeId: string;
  overallStatus: CriterionMatchStatus;
  matchScore: number; // 0 to 100
  matchedCriteriaCount: number;
  totalCriteriaCount: number;
  missingInformationKeys: string[];
  reasons: string[];
  criteria: CriterionEvaluationResult[];
  disclaimer: string;
}

export const LEGAL_DISCLAIMER =
  "BenefitBridge is an independent community assistance platform, not an official government authority. Eligibility assessments are preliminary guides based on current published criteria and do NOT constitute government approval or entitlement.";

/**
 * Evaluates a single criterion rule against a beneficiary profile
 */
export function evaluateCriterion(
  rule: CriterionRule,
  profile: Record<string, any>
): CriterionEvaluationResult {
  const userVal = profile[rule.fieldKey];

  // 1. Missing information check (Never assume missing data)
  if (userVal === undefined || userVal === null || userVal === "") {
    return {
      ruleId: rule.id,
      criterionName: rule.criterionName,
      fieldKey: rule.fieldKey,
      userValue: null,
      expectedValue: rule.expectedValue,
      status: "UNKNOWN",
      reason: `Information not provided for '${rule.criterionName}'. Please update your profile to confirm eligibility.`,
      isMandatory: rule.isMandatory,
      sourceUrl: rule.sourceReferenceUrl,
      sourceText: rule.sourceReferenceText,
    };
  }

  // 2. Operator evaluation
  switch (rule.operator) {
    case "EQUALS": {
      const match = String(userVal).trim().toLowerCase() === String(rule.expectedValue).trim().toLowerCase();
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match
          ? `Meets requirement: ${rule.explanation}`
          : `Does not match: Required '${rule.expectedValue}', found '${userVal}'.`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    case "NOT_EQUALS": {
      const match = String(userVal).trim().toLowerCase() !== String(rule.expectedValue).trim().toLowerCase();
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match ? `Meets requirement: ${rule.explanation}` : `Ineligible under rule: ${rule.explanation}`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    case "LESS_THAN_EQUAL": {
      const userNum = Number(userVal);
      const limitNum = Number(rule.expectedValue);
      if (isNaN(userNum) || isNaN(limitNum)) {
        return {
          ruleId: rule.id,
          criterionName: rule.criterionName,
          fieldKey: rule.fieldKey,
          userValue: userVal,
          expectedValue: rule.expectedValue,
          status: "REQUIRES_HUMAN_REVIEW",
          reason: `Numerical comparison requires verification (${userVal} vs ${rule.expectedValue}).`,
          isMandatory: rule.isMandatory,
          sourceUrl: rule.sourceReferenceUrl,
          sourceText: rule.sourceReferenceText,
        };
      }
      const match = userNum <= limitNum;
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match
          ? `Meets ceiling requirement: ${userNum} is within the limit of ${limitNum}.`
          : `Exceeds upper limit: ${userNum} is higher than allowed ${limitNum}.`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    case "GREATER_THAN_EQUAL": {
      const userNum = Number(userVal);
      const minNum = Number(rule.expectedValue);
      if (isNaN(userNum) || isNaN(minNum)) {
        return {
          ruleId: rule.id,
          criterionName: rule.criterionName,
          fieldKey: rule.fieldKey,
          userValue: userVal,
          expectedValue: rule.expectedValue,
          status: "REQUIRES_HUMAN_REVIEW",
          reason: `Numerical comparison requires verification (${userVal} vs ${rule.expectedValue}).`,
          isMandatory: rule.isMandatory,
          sourceUrl: rule.sourceReferenceUrl,
          sourceText: rule.sourceReferenceText,
        };
      }
      const match = userNum >= minNum;
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match
          ? `Meets threshold requirement: ${userNum} meets or exceeds ${minNum}.`
          : `Below minimum threshold: ${userNum} is below minimum ${minNum}.`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    case "IN_LIST": {
      const allowedList = rule.expectedValue
        .split(",")
        .map((s) => s.trim().toLowerCase());
      const userStr = String(userVal).trim().toLowerCase();
      const match = allowedList.includes(userStr) || allowedList.includes("all");
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match
          ? `Category matches eligible group: ${userVal}.`
          : `Category '${userVal}' is not in published eligible list [${rule.expectedValue}].`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    case "BOOLEAN": {
      const boolVal = userVal === true || String(userVal).toLowerCase() === "true" || userVal === 1;
      const expectedBool = rule.expectedValue.toLowerCase() === "true";
      const match = boolVal === expectedBool;
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: match ? "MATCH" : "DOES_NOT_MATCH",
        reason: match ? `Criterion satisfied: ${rule.explanation}` : `Criterion not satisfied: ${rule.explanation}`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
    }

    default:
      return {
        ruleId: rule.id,
        criterionName: rule.criterionName,
        fieldKey: rule.fieldKey,
        userValue: userVal,
        expectedValue: rule.expectedValue,
        status: "REQUIRES_HUMAN_REVIEW",
        reason: `Operator '${rule.operator}' requires manual assessment.`,
        isMandatory: rule.isMandatory,
        sourceUrl: rule.sourceReferenceUrl,
        sourceText: rule.sourceReferenceText,
      };
  }
}

/**
 * Evaluates a scheme against a beneficiary profile
 */
export function evaluateScheme(
  schemeId: string,
  rules: CriterionRule[],
  profile: Record<string, any>
): SchemeEvaluationResult {
  if (!rules || rules.length === 0) {
    return {
      schemeId,
      overallStatus: "UNKNOWN",
      matchScore: 50,
      matchedCriteriaCount: 0,
      totalCriteriaCount: 0,
      missingInformationKeys: [],
      reasons: ["No active eligibility rules configured for this scheme."],
      criteria: [],
      disclaimer: LEGAL_DISCLAIMER,
    };
  }

  const evaluatedCriteria = rules.map((r) => evaluateCriterion(r, profile));
  const missingKeys: string[] = [];
  const reasons: string[] = [];

  let matchedCount = 0;
  let hasMandatoryFailure = false;
  let hasUnknown = false;
  let hasHumanReview = false;

  for (const c of evaluatedCriteria) {
    if (c.status === "MATCH") {
      matchedCount++;
    } else if (c.status === "DOES_NOT_MATCH") {
      if (c.isMandatory) {
        hasMandatoryFailure = true;
      }
      reasons.push(c.reason);
    } else if (c.status === "UNKNOWN") {
      hasUnknown = true;
      if (!missingKeys.includes(c.fieldKey)) {
        missingKeys.push(c.fieldKey);
      }
      reasons.push(c.reason);
    } else if (c.status === "REQUIRES_HUMAN_REVIEW") {
      hasHumanReview = true;
      reasons.push(c.reason);
    }
  }

  // Determine overall status
  let overallStatus: CriterionMatchStatus;
  if (hasMandatoryFailure) {
    overallStatus = "DOES_NOT_MATCH";
  } else if (hasUnknown) {
    overallStatus = "UNKNOWN";
  } else if (hasHumanReview) {
    overallStatus = "REQUIRES_HUMAN_REVIEW";
  } else if (matchedCount === rules.length) {
    overallStatus = "MATCH";
  } else {
    overallStatus = "REQUIRES_HUMAN_REVIEW";
  }

  const matchScore = Math.round((matchedCount / rules.length) * 100);

  return {
    schemeId,
    overallStatus,
    matchScore,
    matchedCriteriaCount: matchedCount,
    totalCriteriaCount: rules.length,
    missingInformationKeys: missingKeys,
    reasons,
    criteria: evaluatedCriteria,
    disclaimer: LEGAL_DISCLAIMER,
  };
}
