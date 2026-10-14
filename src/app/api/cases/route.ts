import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { generateChecklistForScheme } from "@/lib/checklist/generator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cases;
    if (session.role === "CITIZEN") {
      cases = await prisma.applicationCase.findMany({
        where: { userId: session.id },
        include: {
          scheme: true,
          checklist: true,
          organization: true,
          assignments: {
            where: { status: "ACTIVE" },
            include: { assignedTo: { select: { fullName: true, email: true, phone: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } else {
      // Worker or Admin
      const membership = await prisma.organizationMembership.findFirst({
        where: { userId: session.id },
      });

      const whereClause = session.role === "ADMIN" ? {} : { organizationId: membership?.organizationId || undefined };

      cases = await prisma.applicationCase.findMany({
        where: whereClause,
        include: {
          scheme: true,
          user: { select: { fullName: true, email: true, phone: true, profile: true } },
          checklist: true,
          organization: true,
          assignments: {
            where: { status: "ACTIVE" },
            include: { assignedTo: { select: { fullName: true, email: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Cases query error:", error);
    return NextResponse.json({ error: "Failed to load cases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { schemeId, notes, requestNgoAssistance } = await req.json();

    if (!schemeId) {
      return NextResponse.json({ error: "Scheme ID is required" }, { status: 400 });
    }

    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
      include: { documents: true },
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const userProfile = await prisma.beneficiaryProfile.findUnique({
      where: { userId: session.id },
    });

    // Check if default organization exists for assistance request
    let orgId: string | null = null;
    if (requestNgoAssistance) {
      const defaultOrg = await prisma.organization.findFirst();
      if (defaultOrg) {
        orgId = defaultOrg.id;
      }
    }

    // Generate unique case number
    const count = await prisma.applicationCase.count();
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(count + 101).padStart(5, "0")}`;

    // Create case
    const applicationCase = await prisma.applicationCase.create({
      data: {
        caseNumber,
        userId: session.id,
        schemeId: scheme.id,
        organizationId: orgId,
        status: "PREPARING_DOCUMENTS",
        priority: "MEDIUM",
        notes: notes || null,
      },
    });

    // Generate checklist items
    const generatedItems = generateChecklistForScheme(
      scheme.documents.map((d) => ({
        id: d.id,
        schemeId: d.schemeId,
        documentName: d.documentName,
        description: d.description,
        issuingAuthority: d.issuingAuthority,
        isMandatory: d.isMandatory,
        alternativeDocuments: d.alternativeDocuments,
        sampleDocumentUrl: d.sampleDocumentUrl,
        verificationMethod: d.verificationMethod,
      })),
      userProfile || undefined
    );

    for (const item of generatedItems) {
      await prisma.checklistItem.create({
        data: {
          caseId: applicationCase.id,
          documentRequirementId: item.documentRequirementId,
          title: item.title,
          description: item.description,
          issuingAuthority: item.issuingAuthority,
          isMandatory: item.isMandatory,
          isCompleted: item.isCompleted,
          completedAt: item.isCompleted ? new Date() : null,
          notes: item.notes,
        },
      });
    }

    // Create Case Event
    await prisma.caseEvent.create({
      data: {
        caseId: applicationCase.id,
        actorUserId: session.id,
        actorRole: session.role,
        eventType: "STATUS_CHANGE",
        detailsJson: JSON.stringify({
          action: "CASE_CREATED",
          caseNumber,
          schemeName: scheme.name,
          documentsRequired: generatedItems.length,
        }),
      },
    });

    return NextResponse.json(
      { case: applicationCase, message: "Application case created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create case error:", error);
    return NextResponse.json({ error: "Failed to create application case" }, { status: 500 });
  }
}
