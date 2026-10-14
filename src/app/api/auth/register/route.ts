import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth/session";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["CITIZEN", "NGO_WORKER", "ADMIN"]).default("CITIZEN"),
  phone: z.string().optional(),
  organizationName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, fullName, role, phone, organizationName } = parsed.data;

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role,
        phone,
      },
    });

    // Create initial profile if citizen
    if (role === "CITIZEN") {
      await prisma.beneficiaryProfile.create({
        data: {
          userId: user.id,
          hasAadhaarCard: true,
          hasBankPassbook: true,
        },
      });
    }

    // Link to organization if NGO worker
    if (role === "NGO_WORKER") {
      let org = await prisma.organization.findFirst();
      if (!org) {
        org = await prisma.organization.create({
          data: {
            name: organizationName || "Community Welfare Network",
            slug: (organizationName || "community-welfare-network")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
            contactEmail: email,
          },
        });
      }
      await prisma.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "CASE_WORKER",
        },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        detailsJson: JSON.stringify({ email: user.email, role: user.role }),
      },
    }).catch(() => {});

    // Set Session Cookie
    await setSessionCookie({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
