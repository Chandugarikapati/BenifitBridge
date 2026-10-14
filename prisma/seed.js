const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting BenefitBridge database seeding...");

  // Clean existing demonstration data
  await prisma.auditLog.deleteMany({});
  await prisma.aIInteractionMetadata.deleteMany({});
  await prisma.followUpTask.deleteMany({});
  await prisma.caseEvent.deleteMany({});
  await prisma.caseAssignment.deleteMany({});
  await prisma.checklistItem.deleteMany({});
  await prisma.applicationCase.deleteMany({});
  await prisma.schemeMatch.deleteMany({});
  await prisma.documentRequirement.deleteMany({});
  await prisma.eligibilityRule.deleteMany({});
  await prisma.sourceVerification.deleteMany({});
  await prisma.schemeVersion.deleteMany({});
  await prisma.scheme.deleteMany({});
  await prisma.consentRecord.deleteMany({});
  await prisma.beneficiaryProfile.deleteMany({});
  await prisma.organizationMembership.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Seva Community Welfare Foundation",
      slug: "seva-community-foundation",
      registrationNumber: "NGO-MH-2019-4821",
      contactEmail: "contact@sevafoundation.org",
      contactPhone: "+91 98201 12345",
      address: "Plot 42, Bandra East, Mumbai, Maharashtra 400051",
      isVerified: true,
    },
  });
  console.log("✅ Created Organization:", org.name);

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@benefitbridge.org",
      fullName: "Ananya Deshmukh (Admin)",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      phone: "+91 98111 00001",
    },
  });

  const workerUser = await prisma.user.create({
    data: {
      email: "worker@benefitbridge.org",
      fullName: "Priya Sharma (Social Worker)",
      passwordHash: defaultPasswordHash,
      role: "NGO_WORKER",
      phone: "+91 98111 00002",
    },
  });

  const citizenUser1 = await prisma.user.create({
    data: {
      email: "citizen@benefitbridge.org",
      fullName: "Rajesh Kisan Patil",
      passwordHash: defaultPasswordHash,
      role: "CITIZEN",
      phone: "+91 98111 00003",
    },
  });

  const citizenUser2 = await prisma.user.create({
    data: {
      email: "student@benefitbridge.org",
      fullName: "Sunita Kumari",
      passwordHash: defaultPasswordHash,
      role: "CITIZEN",
      phone: "+91 98111 00004",
    },
  });
  console.log("✅ Created 4 standard demo users (Admin, Worker, Citizen-Farmer, Citizen-Student)");

  // Link Worker to Organization
  await prisma.organizationMembership.create({
    data: {
      userId: workerUser.id,
      organizationId: org.id,
      role: "CASE_WORKER",
    },
  });

  // 3. Create Beneficiary Profiles
  await prisma.beneficiaryProfile.create({
    data: {
      userId: citizenUser1.id,
      age: 44,
      gender: "male",
      state: "Maharashtra",
      district: "Nashik",
      pinCode: "422003",
      annualIncome: 140000,
      employmentStatus: "farmer",
      occupation: "farmer",
      casteCategory: "obc",
      disabilityStatus: false,
      isStudent: false,
      educationLevel: "secondary",
      maritalStatus: "married",
      householdSize: 4,
      isRural: true,
      hasBPLCard: true,
      hasAadhaarCard: true,
      hasRationCard: true,
      hasIncomeCertificate: true,
      hasDisabilityCertificate: false,
      hasCasteCertificate: true,
      hasBankPassbook: true,
    },
  });

  await prisma.beneficiaryProfile.create({
    data: {
      userId: citizenUser2.id,
      age: 19,
      gender: "female",
      state: "Bihar",
      district: "Patna",
      pinCode: "800001",
      annualIncome: 120000,
      employmentStatus: "student",
      occupation: "student",
      casteCategory: "sc",
      disabilityStatus: false,
      isStudent: true,
      educationLevel: "graduate",
      maritalStatus: "single",
      householdSize: 5,
      isRural: false,
      hasBPLCard: false,
      hasAadhaarCard: true,
      hasRationCard: true,
      hasIncomeCertificate: true,
      hasDisabilityCertificate: false,
      hasCasteCertificate: true,
      hasBankPassbook: true,
    },
  });

  // Record Citizen Consents
  await prisma.consentRecord.createMany({
    data: [
      {
        userId: citizenUser1.id,
        purpose: "ELIGIBILITY_ASSESSMENT",
        granted: true,
        consentText: "I agree to have my demographic and income profile evaluated against public welfare scheme rules.",
      },
      {
        userId: citizenUser1.id,
        purpose: "NGO_CASE_MANAGEMENT",
        granted: true,
        consentText: "I authorize Seva Community Welfare Foundation caseworkers to review my document preparation progress.",
      },
      {
        userId: citizenUser2.id,
        purpose: "ELIGIBILITY_ASSESSMENT",
        granted: true,
        consentText: "I agree to have my education and caste profile evaluated for scholarship opportunities.",
      },
    ],
  });

  // 4. Create Schemes, Rules, Documents, and Verifications
  const { VERIFIED_SCHEMES_SEED } = require("../src/lib/data/verifiedSchemes.ts");

  for (const item of VERIFIED_SCHEMES_SEED) {
    const scheme = await prisma.scheme.create({
      data: {
        slug: item.slug,
        name: item.name,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        category: item.category,
        targetBeneficiaries: item.targetBeneficiaries,
        jurisdiction: item.jurisdiction,
        stateOrUnionTerritory: item.stateOrUnionTerritory,
        ministryOrDepartment: item.ministryOrDepartment,
        officialUrl: item.officialUrl,
        applicationPortalUrl: item.applicationPortalUrl,
        helplineNumber: item.helplineNumber,
        benefitType: item.benefitType,
        estimatedBenefitAmount: item.estimatedBenefitAmount,
        applicationMode: item.applicationMode,
        processingTimeDays: item.processingTimeDays,
        status: "PUBLISHED",
        isDemo: item.isDemo,
        lastVerifiedAt: new Date(),
      },
    });

    // Create Scheme Version
    await prisma.schemeVersion.create({
      data: {
        schemeId: scheme.id,
        versionNumber: 1,
        changeSummary: "Initial official verified publication under BenefitBridge catalog.",
        snapshotJson: JSON.stringify(item),
        publishedByUserId: adminUser.id,
      },
    });

    // Create Rules
    for (const rule of item.rules) {
      await prisma.eligibilityRule.create({
        data: {
          schemeId: scheme.id,
          criterionName: rule.criterionName,
          operator: rule.operator,
          fieldKey: rule.fieldKey,
          expectedValue: rule.expectedValue,
          explanation: rule.explanation,
          isMandatory: rule.isMandatory,
          sourceReferenceUrl: rule.sourceReferenceUrl,
          sourceReferenceText: rule.sourceReferenceText,
        },
      });
    }

    // Create Documents
    const createdDocs = [];
    for (const doc of item.documents) {
      const d = await prisma.documentRequirement.create({
        data: {
          schemeId: scheme.id,
          documentName: doc.documentName,
          description: doc.description,
          issuingAuthority: doc.issuingAuthority,
          isMandatory: doc.isMandatory,
          alternativeDocuments: doc.alternativeDocuments,
          verificationMethod: doc.verificationMethod,
        },
      });
      createdDocs.push(d);
    }

    // Create Source Verification
    await prisma.sourceVerification.create({
      data: {
        schemeId: scheme.id,
        verifiedByUserId: adminUser.id,
        verificationDate: new Date(),
        verificationNotes: `Verified against official portal ${item.officialUrl} and current departmental notification guidelines.`,
        sourceUrl: item.officialUrl,
        isConfirmedValid: true,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // in 90 days
      },
    });

    // If PM Kisan, create an Application Case for Rajesh (citizen 1)
    if (item.slug === "pm-kisan-samman-nidhi") {
      const pmCase = await prisma.applicationCase.create({
        data: {
          caseNumber: "CASE-2026-00101",
          userId: citizenUser1.id,
          schemeId: scheme.id,
          organizationId: org.id,
          status: "READY_TO_SUBMIT",
          priority: "HIGH",
          notes: "Beneficiary has all land records verified by village Patwari. Ready for direct online portal filing.",
          reportedOutcome: "PENDING",
          verifiedOutcome: "UNVERIFIED",
        },
      });

      // Assign to Worker Priya Sharma
      await prisma.caseAssignment.create({
        data: {
          caseId: pmCase.id,
          assignedToUserId: workerUser.id,
          assignedByUserId: adminUser.id,
          status: "ACTIVE",
          notes: "Assisting beneficiary with CSC digital application entry.",
        },
      });

      // Create Checklist Items
      for (const d of createdDocs) {
        await prisma.checklistItem.create({
          data: {
            caseId: pmCase.id,
            documentRequirementId: d.id,
            title: d.documentName,
            description: d.description,
            issuingAuthority: d.issuingAuthority,
            isMandatory: d.isMandatory,
            isCompleted: true,
            completedAt: new Date(),
            notes: "Document verified and physical copy checked.",
          },
        });
      }

      // Create Case Events
      await prisma.caseEvent.createMany({
        data: [
          {
            caseId: pmCase.id,
            actorUserId: citizenUser1.id,
            actorRole: "CITIZEN",
            eventType: "STATUS_CHANGE",
            detailsJson: JSON.stringify({ from: "DRAFT", to: "PREPARING_DOCUMENTS", note: "Case initiated by citizen" }),
          },
          {
            caseId: pmCase.id,
            actorUserId: workerUser.id,
            actorRole: "NGO_WORKER",
            eventType: "CHECKLIST_UPDATE",
            detailsJson: JSON.stringify({ item: "Land Ownership Record", status: "VERIFIED" }),
          },
          {
            caseId: pmCase.id,
            actorUserId: workerUser.id,
            actorRole: "NGO_WORKER",
            eventType: "STATUS_CHANGE",
            detailsJson: JSON.stringify({ from: "PREPARING_DOCUMENTS", to: "READY_TO_SUBMIT", note: "All documents in order" }),
          },
        ],
      });

      // Create FollowUpTask
      await prisma.followUpTask.create({
        data: {
          caseId: pmCase.id,
          organizationId: org.id,
          assignedToUserId: workerUser.id,
          title: "Accompany Rajesh to Common Service Centre (CSC) for Biometric e-KYC",
          description: "Verify Aadhaar OTP or perform fingerprint scan at local CSC kiosk in Nashik.",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          priority: "HIGH",
        },
      });
    }

    // If Post-Matric Scholarship, create an Application Case for Sunita (citizen 2)
    if (item.slug === "post-matric-scholarship-sc-st") {
      const scCase = await prisma.applicationCase.create({
        data: {
          caseNumber: "CASE-2026-00102",
          userId: citizenUser2.id,
          schemeId: scheme.id,
          organizationId: org.id,
          status: "PREPARING_DOCUMENTS",
          priority: "MEDIUM",
          notes: "Waiting for current academic year fee receipt and bonafide certificate from college registrar.",
          reportedOutcome: "PENDING",
          verifiedOutcome: "UNVERIFIED",
        },
      });

      // Assign to Worker Priya Sharma
      await prisma.caseAssignment.create({
        data: {
          caseId: scCase.id,
          assignedToUserId: workerUser.id,
          assignedByUserId: adminUser.id,
          status: "ACTIVE",
          notes: "Tracking college bonafide certificate issuance.",
        },
      });

      // Create Checklist items (caste & income complete, college receipt incomplete)
      for (const d of createdDocs) {
        const isCollegeDoc = d.documentName.toLowerCase().includes("college") || d.documentName.toLowerCase().includes("receipt");
        await prisma.checklistItem.create({
          data: {
            caseId: scCase.id,
            documentRequirementId: d.id,
            title: d.documentName,
            description: d.description,
            issuingAuthority: d.issuingAuthority,
            isMandatory: d.isMandatory,
            isCompleted: !isCollegeDoc,
            completedAt: isCollegeDoc ? null : new Date(),
            notes: isCollegeDoc ? "Awaiting issuance from college registrar." : "Verified valid certificate.",
          },
        });
      }

      await prisma.followUpTask.create({
        data: {
          caseId: scCase.id,
          organizationId: org.id,
          assignedToUserId: workerUser.id,
          title: "Check with Patna College Registrar regarding Bonafide Certificate dispatch",
          description: "Follow up with scholarship desk at college.",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          priority: "MEDIUM",
        },
      });
    }
  }

  // 5. Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        userRole: "ADMIN",
        action: "SCHEME_CATALOG_INITIALIZED",
        entityType: "Scheme",
        detailsJson: JSON.stringify({ schemeCount: VERIFIED_SCHEMES_SEED.length, status: "PUBLISHED" }),
      },
      {
        userId: workerUser.id,
        userRole: "NGO_WORKER",
        action: "CASE_ONBOARDED",
        entityType: "ApplicationCase",
        detailsJson: JSON.stringify({ caseNumber: "CASE-2026-00101", citizen: "Rajesh Kisan Patil" }),
      },
    ],
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
