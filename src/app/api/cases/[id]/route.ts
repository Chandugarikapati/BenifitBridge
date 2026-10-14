import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const applicationCase = await prisma.applicationCase.findUnique({
      where: { id },
      include: {
        scheme: {
          include: { rules: true, documents: true },
        },
        user: {
          select: { id: true, fullName: true, email: true, phone: true, profile: true },
        },
        checklist: {
          include: { documentRequirement: true },
          orderBy: { isMandatory: "desc" },
        },
        organization: true,
        assignments: {
          include: { assignedTo: { select: { fullName: true, email: true, phone: true } } },
        },
        events: {
          orderBy: { createdAt: "desc" },
          include: { actor: { select: { fullName: true, role: true } } },
        },
        tasks: {
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!applicationCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // RBAC: Citizens can only see their own cases
    if (session.role === "CITIZEN" && applicationCase.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ case: applicationCase });
  } catch (error) {
    console.error("Case query error:", error);
    return NextResponse.json({ error: "Failed to load case" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.applicationCase.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Role check
    if (session.role === "CITIZEN" && existing.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;
      if (body.status === "SUBMITTED" && !existing.submissionReportedAt) {
        updateData.submissionReportedAt = new Date();
      }
    }

    if (body.priority && session.role !== "CITIZEN") {
      updateData.priority = body.priority;
    }

    if (body.officialApplicationReference !== undefined) {
      updateData.officialApplicationReference = body.officialApplicationReference;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    if (body.reportedOutcome) {
      updateData.reportedOutcome = body.reportedOutcome;
      updateData.outcomeReportedAt = new Date();
      if (body.reportedOutcomeNotes) {
        updateData.reportedOutcomeNotes = body.reportedOutcomeNotes;
      }
    }

    if (body.verifiedOutcome && session.role !== "CITIZEN") {
      updateData.verifiedOutcome = body.verifiedOutcome;
    }

    const updatedCase = await prisma.applicationCase.update({
      where: { id },
      data: updateData,
    });

    // Record Event
    await prisma.caseEvent.create({
      data: {
        caseId: id,
        actorUserId: session.id,
        actorRole: session.role,
        eventType: body.reportedOutcome ? "OUTCOME_REPORTED" : "STATUS_CHANGE",
        detailsJson: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({ case: updatedCase, message: "Case updated successfully" });
  } catch (error) {
    console.error("Update case error:", error);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }
}
