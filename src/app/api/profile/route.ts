import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.beneficiaryProfile.findUnique({
      where: { userId: session.id },
    });

    const consents = await prisma.consentRecord.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ profile, consents });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const profile = await prisma.beneficiaryProfile.upsert({
      where: { userId: session.id },
      update: {
        age: data.age !== undefined && data.age !== "" ? Number(data.age) : null,
        gender: data.gender || null,
        state: data.state || null,
        district: data.district || null,
        pinCode: data.pinCode || null,
        annualIncome: data.annualIncome !== undefined && data.annualIncome !== "" ? Number(data.annualIncome) : null,
        employmentStatus: data.employmentStatus || null,
        occupation: data.occupation || null,
        casteCategory: data.casteCategory || null,
        disabilityStatus: Boolean(data.disabilityStatus),
        disabilityPercentage: data.disabilityPercentage ? Number(data.disabilityPercentage) : null,
        isStudent: Boolean(data.isStudent),
        educationLevel: data.educationLevel || null,
        maritalStatus: data.maritalStatus || null,
        householdSize: data.householdSize ? Number(data.householdSize) : null,
        isRural: Boolean(data.isRural),
        hasBPLCard: Boolean(data.hasBPLCard),
        hasAadhaarCard: Boolean(data.hasAadhaarCard),
        hasRationCard: Boolean(data.hasRationCard),
        hasIncomeCertificate: Boolean(data.hasIncomeCertificate),
        hasDisabilityCertificate: Boolean(data.hasDisabilityCertificate),
        hasCasteCertificate: Boolean(data.hasCasteCertificate),
        hasBankPassbook: Boolean(data.hasBankPassbook),
      },
      create: {
        userId: session.id,
        age: data.age ? Number(data.age) : null,
        gender: data.gender || null,
        state: data.state || null,
        district: data.district || null,
        pinCode: data.pinCode || null,
        annualIncome: data.annualIncome ? Number(data.annualIncome) : null,
        employmentStatus: data.employmentStatus || null,
        occupation: data.occupation || null,
        casteCategory: data.casteCategory || null,
        disabilityStatus: Boolean(data.disabilityStatus),
        disabilityPercentage: data.disabilityPercentage ? Number(data.disabilityPercentage) : null,
        isStudent: Boolean(data.isStudent),
        educationLevel: data.educationLevel || null,
        maritalStatus: data.maritalStatus || null,
        householdSize: data.householdSize ? Number(data.householdSize) : null,
        isRural: Boolean(data.isRural),
        hasBPLCard: Boolean(data.hasBPLCard),
        hasAadhaarCard: Boolean(data.hasAadhaarCard),
        hasRationCard: Boolean(data.hasRationCard),
        hasIncomeCertificate: Boolean(data.hasIncomeCertificate),
        hasDisabilityCertificate: Boolean(data.hasDisabilityCertificate),
        hasCasteCertificate: Boolean(data.hasCasteCertificate),
        hasBankPassbook: Boolean(data.hasBankPassbook),
      },
    });

    // Record or update consent
    if (data.consentGiven) {
      await prisma.consentRecord.create({
        data: {
          userId: session.id,
          purpose: "ELIGIBILITY_ASSESSMENT",
          granted: true,
          consentText: "I explicitly grant consent for my demographic and socioeconomic attributes to be evaluated against verified public welfare rules.",
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent") || undefined,
        },
      });
    }

    // Log in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        userRole: session.role,
        action: "PROFILE_UPDATED",
        entityType: "BeneficiaryProfile",
        entityId: profile.id,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        detailsJson: JSON.stringify({ state: profile.state, occupation: profile.occupation }),
      },
    }).catch(() => {});

    return NextResponse.json({ profile, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
