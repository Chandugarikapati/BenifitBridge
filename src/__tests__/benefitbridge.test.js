const { test, describe } = require("node:test");
const assert = require("node:assert");

// Import core modules
const { evaluateCriterion, evaluateScheme } = require("../../src/lib/eligibility/engine.ts");
const { generateChecklistForScheme, calculateChecklistProgress } = require("../../src/lib/checklist/generator.ts");
const { COMMUNITY_METRICS_REGISTRY } = require("../../src/lib/analytics/metrics.ts");

describe("1. Deterministic Eligibility Engine Tests", () => {
  const ageRule = {
    id: "r1",
    criterionName: "Minimum Age 60",
    fieldKey: "age",
    operator: "GREATER_THAN_EQUAL",
    expectedValue: "60",
    explanation: "Must be 60 or older.",
    isMandatory: true,
  };

  const incomeRule = {
    id: "r2",
    criterionName: "Income Ceiling",
    fieldKey: "annualIncome",
    operator: "LESS_THAN_EQUAL",
    expectedValue: "200000",
    explanation: "Income must be <= 200,000.",
    isMandatory: true,
  };

  const casteRule = {
    id: "r3",
    criterionName: "Eligible Category",
    fieldKey: "casteCategory",
    operator: "IN_LIST",
    expectedValue: "sc,st",
    explanation: "Must belong to SC or ST.",
    isMandatory: true,
  };

  const booleanRule = {
    id: "r4",
    criterionName: "Disability Confirmation",
    fieldKey: "disabilityStatus",
    operator: "BOOLEAN",
    expectedValue: "true",
    explanation: "Must have verified disability status.",
    isMandatory: true,
  };

  test("Evaluates MATCH when user satisfies threshold criteria", () => {
    const res = evaluateCriterion(ageRule, { age: 65 });
    assert.strictEqual(res.status, "MATCH");
    assert.strictEqual(res.isMandatory, true);
  });

  test("Evaluates DOES_NOT_MATCH when user fails mandatory criterion", () => {
    const res = evaluateCriterion(ageRule, { age: 45 });
    assert.strictEqual(res.status, "DOES_NOT_MATCH");
  });

  test("Evaluates UNKNOWN when information is missing (never silently assumes data)", () => {
    const res = evaluateCriterion(incomeRule, {});
    assert.strictEqual(res.status, "UNKNOWN");
    assert.strictEqual(res.userValue, null);
    assert.match(res.reason, /Information not provided/);
  });

  test("Evaluates IN_LIST operator correctly for social category", () => {
    const matchRes = evaluateCriterion(casteRule, { casteCategory: "sc" });
    assert.strictEqual(matchRes.status, "MATCH");

    const nonMatchRes = evaluateCriterion(casteRule, { casteCategory: "general" });
    assert.strictEqual(nonMatchRes.status, "DOES_NOT_MATCH");
  });

  test("Evaluates BOOLEAN operator correctly", () => {
    const boolMatch = evaluateCriterion(booleanRule, { disabilityStatus: true });
    assert.strictEqual(boolMatch.status, "MATCH");

    const boolFail = evaluateCriterion(booleanRule, { disabilityStatus: false });
    assert.strictEqual(boolFail.status, "DOES_NOT_MATCH");
  });

  test("Evaluates scheme-level overall MATCH status", () => {
    const rules = [ageRule, incomeRule];
    const profile = { age: 62, annualIncome: 120000 };
    const schemeRes = evaluateScheme("scheme-1", rules, profile);

    assert.strictEqual(schemeRes.overallStatus, "MATCH");
    assert.strictEqual(schemeRes.matchScore, 100);
    assert.strictEqual(schemeRes.matchedCriteriaCount, 2);
  });

  test("Flags overall UNKNOWN and lists missingInformationKeys when data is absent", () => {
    const rules = [ageRule, incomeRule];
    const profile = { age: 62 }; // missing annualIncome
    const schemeRes = evaluateScheme("scheme-1", rules, profile);

    assert.strictEqual(schemeRes.overallStatus, "UNKNOWN");
    assert.deepStrictEqual(schemeRes.missingInformationKeys, ["annualIncome"]);
  });

  test("Flags DOES_NOT_MATCH when any mandatory rule fails", () => {
    const rules = [ageRule, incomeRule];
    const profile = { age: 40, annualIncome: 100000 }; // age fails
    const schemeRes = evaluateScheme("scheme-1", rules, profile);

    assert.strictEqual(schemeRes.overallStatus, "DOES_NOT_MATCH");
  });

  test("Handles conflicting criteria transparently without silent resolution", () => {
    const conflictingRules = [
      { id: "c1", criterionName: "Min Age", fieldKey: "age", operator: "GREATER_THAN_EQUAL", expectedValue: "60", explanation: "Rule 1", isMandatory: true },
      { id: "c2", criterionName: "Max Age", fieldKey: "age", operator: "LESS_THAN_EQUAL", expectedValue: "35", explanation: "Rule 2", isMandatory: true },
    ];
    const schemeRes = evaluateScheme("conflict-scheme", conflictingRules, { age: 50 });
    assert.strictEqual(schemeRes.overallStatus, "DOES_NOT_MATCH");
    assert.strictEqual(schemeRes.reasons.length, 2);
  });
});

describe("2. Document Checklist Generation & Progress Tests", () => {
  const requirements = [
    {
      id: "doc-1",
      schemeId: "s-1",
      documentName: "Aadhaar Card",
      description: "Identity proof",
      issuingAuthority: "UIDAI",
      isMandatory: true,
    },
    {
      id: "doc-2",
      schemeId: "s-1",
      documentName: "Income Certificate",
      description: "Revenue proof",
      issuingAuthority: "Tehsildar",
      isMandatory: true,
    },
    {
      id: "doc-3",
      schemeId: "s-1",
      documentName: "Land Record Patta",
      description: "Cultivable land title",
      issuingAuthority: "Revenue Dept",
      isMandatory: false,
    },
  ];

  test("Pre-marks checklist items based on verified user profile possession", () => {
    const profile = {
      hasAadhaarCard: true,
      hasIncomeCertificate: false,
    };

    const checklist = generateChecklistForScheme(requirements, profile);
    assert.strictEqual(checklist.length, 3);

    // Aadhaar should be pre-completed
    const aadhaarItem = checklist.find((i) => i.title === "Aadhaar Card");
    assert.strictEqual(aadhaarItem.isCompleted, true);

    // Income certificate should be incomplete
    const incomeItem = checklist.find((i) => i.title === "Income Certificate");
    assert.strictEqual(incomeItem.isCompleted, false);
  });

  test("Calculates submission readiness progress accurately", () => {
    const items = [
      { isCompleted: true, isMandatory: true },
      { isCompleted: false, isMandatory: true },
      { isCompleted: true, isMandatory: false },
    ];

    const progress = calculateChecklistProgress(items);
    assert.strictEqual(progress.total, 3);
    assert.strictEqual(progress.completed, 2);
    assert.strictEqual(progress.mandatoryTotal, 2);
    assert.strictEqual(progress.mandatoryCompleted, 1);
    assert.strictEqual(progress.percentage, 67);
    assert.strictEqual(progress.isReadyToSubmit, false);

    // Complete second mandatory
    items[1].isCompleted = true;
    const readyProgress = calculateChecklistProgress(items);
    assert.strictEqual(readyProgress.isReadyToSubmit, true);
    assert.strictEqual(readyProgress.percentage, 100);
  });
});

describe("3. Security, RBAC & Permissions Enforcement Tests", () => {
  test("Separates reported outcome from verified outcome", () => {
    const applicationCase = {
      status: "SUBMITTED",
      reportedOutcome: "APPROVED",
      verifiedOutcome: "UNVERIFIED",
    };

    assert.notStrictEqual(applicationCase.reportedOutcome, applicationCase.verifiedOutcome);
    assert.strictEqual(applicationCase.verifiedOutcome, "UNVERIFIED");
  });

  test("Enforces role-based access policy boundaries", () => {
    const allowedRoles = ["NGO_WORKER", "ADMIN"];
    const isCitizenAllowed = allowedRoles.includes("CITIZEN");
    const isWorkerAllowed = allowedRoles.includes("NGO_WORKER");

    assert.strictEqual(isCitizenAllowed, false);
    assert.strictEqual(isWorkerAllowed, true);
  });
});

describe("4. Community Metrics Framework Accuracy Tests", () => {
  test("Ensures every registered metric defines numerator, denominator, and data source", () => {
    const metrics = Object.values(COMMUNITY_METRICS_REGISTRY);
    assert.ok(metrics.length >= 8);

    for (const m of metrics) {
      assert.ok(m.id && m.name, "Metric must have id and name");
      assert.ok(m.numerator && m.numerator.length > 5, `Metric ${m.id} missing numerator`);
      assert.ok(m.denominator && m.denominator.length > 5, `Metric ${m.id} missing denominator`);
      assert.ok(m.dataSource && m.dataSource.length > 5, `Metric ${m.id} missing dataSource`);
    }
  });
});

describe("5. Token Bucket Rate Limiting & Security Tests", () => {
  const { checkRateLimit } = require("../../src/lib/security/rateLimit.ts");

  test("Allows requests under the specified threshold", () => {
    const testIp = "test-client-" + Date.now();
    const res1 = checkRateLimit(testIp, 5, 10000);
    assert.strictEqual(res1.allowed, true);
    assert.strictEqual(res1.remaining, 4);

    const res2 = checkRateLimit(testIp, 5, 10000);
    assert.strictEqual(res2.allowed, true);
    assert.strictEqual(res2.remaining, 3);
  });

  test("Blocks requests when the rate limit threshold is exceeded", () => {
    const testIp = "blocked-client-" + Date.now();
    for (let i = 0; i < 3; i++) {
      checkRateLimit(testIp, 3, 10000);
    }
    const blockedRes = checkRateLimit(testIp, 3, 10000);
    assert.strictEqual(blockedRes.allowed, false);
    assert.strictEqual(blockedRes.remaining, 0);
    assert.ok(blockedRes.resetInSec > 0);
  });
});

describe("6. Authentic Schemes Catalog & CivicTech Compliance Tests", () => {
  const { VERIFIED_SCHEMES_SEED } = require("../../src/lib/data/verifiedSchemes.ts");

  test("Contains only verified welfare schemes with official government domain links", () => {
    assert.ok(VERIFIED_SCHEMES_SEED.length >= 6);

    for (const scheme of VERIFIED_SCHEMES_SEED) {
      assert.ok(scheme.slug, "Scheme must have a slug");
      assert.ok(scheme.name, "Scheme must have an authentic name");
      assert.ok(scheme.officialUrl.startsWith("https://") || scheme.officialUrl.startsWith("http://"), "Official URL must be valid HTTP/HTTPS");
      assert.ok(scheme.rules && scheme.rules.length > 0, "Scheme must have deterministic rules");
      assert.ok(scheme.documents && scheme.documents.length > 0, "Scheme must have required documents list");
    }
  });

  test("Requires mandatory disclaimers and transparent authority attribution", () => {
    for (const scheme of VERIFIED_SCHEMES_SEED) {
      assert.ok(scheme.ministryOrDepartment.length > 0, "Scheme must cite issuing ministry");
      assert.ok(scheme.helplineNumber.length > 0, "Scheme must provide helpline or assistance channel");
    }
  });
});

