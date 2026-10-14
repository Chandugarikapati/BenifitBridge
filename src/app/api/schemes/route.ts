import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const jurisdiction = searchParams.get("jurisdiction") || "";
    const state = searchParams.get("state") || "";

    const where: any = {
      status: "PUBLISHED",
    };

    if (category && category !== "All") {
      where.category = category;
    }

    if (jurisdiction && jurisdiction !== "All") {
      where.jurisdiction = jurisdiction;
    }

    if (state && state !== "All") {
      where.OR = [
        { stateOrUnionTerritory: "All India" },
        { stateOrUnionTerritory: { contains: state, mode: "insensitive" } },
      ];
    }

    if (search.trim()) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { shortDescription: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { ministryOrDepartment: { contains: search, mode: "insensitive" } },
            { targetBeneficiaries: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    const schemes = await prisma.scheme.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        rules: { select: { id: true, criterionName: true } },
        documents: { select: { id: true, documentName: true, isMandatory: true } },
        verifications: {
          where: { isConfirmedValid: true },
          take: 1,
          orderBy: { verificationDate: "desc" },
        },
      },
    });

    return NextResponse.json({ schemes });
  } catch (error) {
    console.error("Schemes query error:", error);
    return NextResponse.json({ error: "Failed to retrieve schemes" }, { status: 500 });
  }
}
