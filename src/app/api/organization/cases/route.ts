import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "NGO_WORKER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access to organization workspace" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("q");

    const where: any = {};

    if (session.role === "NGO_WORKER") {
      const membership = await prisma.organizationMembership.findFirst({
        where: { userId: session.id },
      });
      if (membership) {
        where.organizationId = membership.organizationId;
      }
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { caseNumber: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { scheme: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const cases = await prisma.applicationCase.findMany({
      where,
      include: {
        scheme: { select: { name: true, category: true, benefitType: true } },
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        assignments: {
          where: { status: "ACTIVE" },
          include: { assignedTo: { select: { id: true, fullName: true, email: true } } },
        },
        checklist: {
          select: { id: true, isMandatory: true, isCompleted: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = cases.map((c) => {
      const totalDocs = c.checklist.length;
      const completedDocs = c.checklist.filter((i) => i.isCompleted).length;
      const mandatoryDocs = c.checklist.filter((i) => i.isMandatory);
      const mandatoryCompleted = mandatoryDocs.filter((i) => i.isCompleted).length;

      return {
        id: c.id,
        caseNumber: c.caseNumber,
        citizenName: c.user.fullName,
        citizenPhone: c.user.phone,
        schemeName: c.scheme.name,
        category: c.scheme.category,
        status: c.status,
        priority: c.priority,
        reportedOutcome: c.reportedOutcome,
        verifiedOutcome: c.verifiedOutcome,
        assignedWorker: c.assignments[0]?.assignedTo?.fullName || "Unassigned",
        assignedWorkerId: c.assignments[0]?.assignedTo?.id || null,
        totalDocs,
        completedDocs,
        isReadyToSubmit: mandatoryDocs.length === mandatoryCompleted,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json({ cases: formatted });
  } catch (error) {
    console.error("Organization cases query error:", error);
    return NextResponse.json({ error: "Failed to load organization cases" }, { status: 500 });
  }
}
