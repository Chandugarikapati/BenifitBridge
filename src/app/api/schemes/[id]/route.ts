import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scheme = await prisma.scheme.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        rules: { orderBy: { isMandatory: "desc" } },
        documents: { orderBy: { isMandatory: "desc" } },
        verifications: { orderBy: { verificationDate: "desc" } },
        versions: { orderBy: { versionNumber: "desc" }, take: 3 },
      },
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    return NextResponse.json({ scheme });
  } catch (error) {
    console.error("Scheme details query error:", error);
    return NextResponse.json({ error: "Failed to load scheme details" }, { status: 500 });
  }
}
