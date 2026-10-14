import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { evaluateScheme, CriterionRule } from "@/lib/eligibility/engine";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const body = await req.json().catch(() => ({}));

    let profileData: Record<string, any> = {};

    if (session) {
      const dbProfile = await prisma.beneficiaryProfile.findUnique({
        where: { userId: session.id },
      });
      if (dbProfile) {
        profileData = { ...dbProfile };
      }
    }

    // Merge any override or anonymous profile fields provided in body
    if (body.profile) {
      profileData = { ...profileData, ...body.profile };
    }

    // Retrieve schemes to evaluate
    const schemeWhere: any = { status: "PUBLISHED" };
    if (body.schemeId) {
      schemeWhere.id = body.schemeId;
    }

    const schemes = await prisma.scheme.findMany({
      where: schemeWhere,
      include: {
        rules: true,
        documents: true,
        verifications: { where: { isConfirmedValid: true }, take: 1 },
      },
    });

    const evaluations = [];

    for (const s of schemes) {
      const rules: CriterionRule[] = s.rules.map((r) => ({
        id: r.id,
        criterionName: r.criterionName,
        fieldKey: r.fieldKey,
        operator: r.operator as any,
        expectedValue: r.expectedValue,
        explanation: r.explanation,
        isMandatory: r.isMandatory,
        sourceReferenceUrl: r.sourceReferenceUrl,
        sourceReferenceText: r.sourceReferenceText,
      }));

      const result = evaluateScheme(s.id, rules, profileData);

      // Persist in SchemeMatch table if user is authenticated
      if (session) {
        await prisma.schemeMatch.upsert({
          where: {
            id: `${session.id}-${s.id}`, // using a composite deterministic key or lookup
          },
          update: {
            overallMatchStatus: result.overallStatus as any,
            matchScore: result.matchScore,
            matchedCriteriaCount: result.matchedCriteriaCount,
            totalCriteriaCount: result.totalCriteriaCount,
            missingInformationKeys: JSON.stringify(result.missingInformationKeys),
            criteriaEvaluationJson: JSON.stringify(result.criteria),
            officialSourceUrl: s.officialUrl,
            evaluatedAt: new Date(),
          },
          create: {
            id: `${session.id}-${s.id}`,
            userId: session.id,
            schemeId: s.id,
            overallMatchStatus: result.overallStatus as any,
            matchScore: result.matchScore,
            matchedCriteriaCount: result.matchedCriteriaCount,
            totalCriteriaCount: result.totalCriteriaCount,
            missingInformationKeys: JSON.stringify(result.missingInformationKeys),
            criteriaEvaluationJson: JSON.stringify(result.criteria),
            officialSourceUrl: s.officialUrl,
          },
        }).catch(() => {});
      }

      evaluations.push({
        scheme: {
          id: s.id,
          slug: s.slug,
          name: s.name,
          category: s.category,
          jurisdiction: s.jurisdiction,
          estimatedBenefitAmount: s.estimatedBenefitAmount,
          benefitType: s.benefitType,
          officialUrl: s.officialUrl,
          ministryOrDepartment: s.ministryOrDepartment,
          documentsCount: s.documents.length,
        },
        evaluation: result,
      });
    }

    return NextResponse.json({
      evaluations,
      assessedCount: evaluations.length,
      evaluatedProfile: {
        age: profileData.age,
        state: profileData.state,
        annualIncome: profileData.annualIncome,
        occupation: profileData.occupation,
        casteCategory: profileData.casteCategory,
        disabilityStatus: profileData.disabilityStatus,
      },
    });
  } catch (error) {
    console.error("Eligibility assessment error:", error);
    return NextResponse.json({ error: "Eligibility evaluation failed" }, { status: 500 });
  }
}
