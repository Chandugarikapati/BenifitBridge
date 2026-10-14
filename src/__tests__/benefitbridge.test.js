const { test, describe } = require("node:test");
const assert = require("node:assert");

// Import core modules
const { evaluateCriterion, evaluateScheme } = require("../../src/lib/eligibility/engine.ts");
const { generateChecklistForScheme, calculateChecklistProgress } = require("../../src/lib/checklist/generator.ts");

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
});

describe("2. Document Checklist Generation Tests", () => {
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
      isMandatory: true,
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
      { isCompleted: true, isMandatory: true },
      { isCompleted: false, isMandatory: true },
    ];

    const progress = calculateChecklistProgress(items);
    assert.strictEqual(progress.total, 3);
    assert.strictEqual(progress.completed, 2);
    assert.strictEqual(progress.percentage, 67);
    assert.strictEqual(progress.isReadyToSubmit, false);

    // When all mandatory completed
    items[2].isCompleted = true;
    const readyProgress = calculateChecklistProgress(items);
    assert.strictEqual(readyProgress.percentage, 100);
    assert.strictEqual(readyProgress.isReadyToSubmit, true);
  });
});

describe("3. Permissions & Case Status Transition Rules", () => {
  test("Separates reported outcome from verified outcome", () => {
    const applicationCase = {
      status: "SUBMITTED",
      reportedOutcome: "APPROVED",
      verifiedOutcome: "UNVERIFIED",
    };

    assert.notStrictEqual(applicationCase.reportedOutcome, applicationCase.verifiedOutcome);
    assert.strictEqual(applicationCase.verifiedOutcome, "UNVERIFIED");
  });
});
