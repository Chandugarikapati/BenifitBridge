import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: caseId } = await params;
    const { checklistItemId, isCompleted, notes } = await req.json();

    if (!checklistItemId) {
      return NextResponse.json({ error: "checklistItemId is required" }, { status: 400 });
    }

    const applicationCase = await prisma.applicationCase.findUnique({
      where: { id: caseId },
      include: { checklist: true },
    });

    if (!applicationCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    if (session.role === "CITIZEN" && applicationCase.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update item
    const updatedItem = await prisma.checklistItem.update({
      where: { id: checklistItemId },
      data: {
        isCompleted: Boolean(isCompleted),
        completedAt: isCompleted ? new Date() : null,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    // Fetch all current items to check readiness
    const allItems = await prisma.checklistItem.findMany({
      where: { caseId },
    });

    const mandatoryItems = allItems.filter((i) => i.isMandatory);
    const allMandatoryCompleted = mandatoryItems.every((i) => i.isCompleted);

    // Auto-update case status if in preparation
    if (allMandatoryCompleted && applicationCase.status === "PREPARING_DOCUMENTS") {
      await prisma.applicationCase.update({
        where: { id: caseId },
        data: { status: "READY_TO_SUBMIT" },
      });
      await prisma.caseEvent.create({
        data: {
          caseId,
          actorUserId: session.id,
          actorRole: session.role,
          eventType: "STATUS_CHANGE",
          detailsJson: JSON.stringify({
            from: "PREPARING_DOCUMENTS",
            to: "READY_TO_SUBMIT",
            reason: "All mandatory documents completed.",
          }),
        },
      });
    } else if (!allMandatoryCompleted && applicationCase.status === "READY_TO_SUBMIT") {
      await prisma.applicationCase.update({
        where: { id: caseId },
        data: { status: "PREPARING_DOCUMENTS" },
      });
    }

    // Record Event
    await prisma.caseEvent.create({
      data: {
        caseId,
        actorUserId: session.id,
        actorRole: session.role,
        eventType: "CHECKLIST_UPDATE",
        detailsJson: JSON.stringify({
          itemTitle: updatedItem.title,
          isCompleted: updatedItem.isCompleted,
        }),
      },
    });

    return NextResponse.json({
      item: updatedItem,
      allMandatoryCompleted,
      message: "Checklist updated successfully",
    });
  } catch (error) {
    console.error("Checklist update error:", error);
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 });
  }
}
