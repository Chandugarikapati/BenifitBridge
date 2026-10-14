import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can publish schemes" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      category,
      targetBeneficiaries,
      jurisdiction,
      stateOrUnionTerritory,
      ministryOrDepartment,
      officialUrl,
      applicationPortalUrl,
      helplineNumber,
      benefitType,
      estimatedBenefitAmount,
      processingTimeDays,
      status,
      rules,
      documents,
    } = body;

    if (!name || !category || !ministryOrDepartment || !officialUrl) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const schemeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const scheme = await prisma.scheme.create({
      data: {
        name,
        slug: schemeSlug,
        shortDescription: shortDescription || name,
        fullDescription: fullDescription || shortDescription || name,
        category,
        targetBeneficiaries: targetBeneficiaries || "All eligible citizens",
        jurisdiction: jurisdiction || "Central",
        stateOrUnionTerritory: stateOrUnionTerritory || "All India",
        ministryOrDepartment,
        officialUrl,
        applicationPortalUrl: applicationPortalUrl || null,
        helplineNumber: helplineNumber || null,
        benefitType: benefitType || "Financial Assistance",
        estimatedBenefitAmount: estimatedBenefitAmount || null,
        processingTimeDays: processingTimeDays ? Number(processingTimeDays) : 30,
        status: status || "PUBLISHED",
        isDemo: false,
      },
    });

    // Create rules if provided
    if (Array.isArray(rules)) {
      for (const r of rules) {
        if (r.criterionName && r.fieldKey && r.expectedValue) {
          await prisma.eligibilityRule.create({
            data: {
              schemeId: scheme.id,
              criterionName: r.criterionName,
              operator: r.operator || "EQUALS",
              fieldKey: r.fieldKey,
              expectedValue: String(r.expectedValue),
              explanation: r.explanation || r.criterionName,
              isMandatory: r.isMandatory !== false,
              sourceReferenceUrl: r.sourceReferenceUrl || officialUrl,
              sourceReferenceText: r.sourceReferenceText || null,
            },
          });
        }
      }
    }

    // Create documents if provided
    if (Array.isArray(documents)) {
      for (const d of documents) {
        if (d.documentName) {
          await prisma.documentRequirement.create({
            data: {
              schemeId: scheme.id,
              documentName: d.documentName,
              description: d.description || d.documentName,
              issuingAuthority: d.issuingAuthority || "Competent Authority",
              isMandatory: d.isMandatory !== false,
              alternativeDocuments: d.alternativeDocuments || null,
              verificationMethod: d.verificationMethod || null,
            },
          });
        }
      }
    }

    // Scheme Version
    await prisma.schemeVersion.create({
      data: {
        schemeId: scheme.id,
        versionNumber: 1,
        changeSummary: "Admin manual addition",
        snapshotJson: JSON.stringify(body),
        publishedByUserId: session.id,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        userRole: session.role,
        action: "SCHEME_CREATED",
        entityType: "Scheme",
        entityId: scheme.id,
        detailsJson: JSON.stringify({ schemeName: scheme.name, status: scheme.status }),
      },
    });

    return NextResponse.json({ scheme, message: "Scheme created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Admin scheme create error:", error);
    return NextResponse.json({ error: "Failed to create scheme" }, { status: 500 });
  }
}
