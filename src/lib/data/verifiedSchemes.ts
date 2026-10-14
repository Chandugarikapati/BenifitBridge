/**
 * Verified Real Public Schemes Catalog
 * Based on authentic Indian welfare schemes with actual eligibility criteria,
 * official government URLs, issuing departments, and document requirements.
 */

export interface VerifiedSchemeSeed {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  targetBeneficiaries: string;
  jurisdiction: string;
  stateOrUnionTerritory: string;
  ministryOrDepartment: string;
  officialUrl: string;
  applicationPortalUrl: string;
  helplineNumber: string;
  benefitType: string;
  estimatedBenefitAmount: string;
  applicationMode: string;
  processingTimeDays: number;
  isDemo: boolean;
  rules: {
    criterionName: string;
    operator: "EQUALS" | "NOT_EQUALS" | "GREATER_THAN_EQUAL" | "LESS_THAN_EQUAL" | "IN_LIST" | "BOOLEAN";
    fieldKey: string;
    expectedValue: string;
    explanation: string;
    isMandatory: boolean;
    sourceReferenceUrl: string;
    sourceReferenceText: string;
  }[];
  documents: {
    documentName: string;
    description: string;
    issuingAuthority: string;
    isMandatory: boolean;
    alternativeDocuments?: string;
    verificationMethod: string;
  }[];
}

export const VERIFIED_SCHEMES_SEED: VerifiedSchemeSeed[] = [
  {
    slug: "pm-kisan-samman-nidhi",
    name: "PM Kisan Samman Nidhi (PM-KISAN)",
    shortDescription: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    fullDescription: "Pradhan Mantri Kisan Samman Nidhi is a Central Sector scheme with 100% funding from Government of India. Under the scheme an income support of ₹6,000/- per year in three equal installments each of ₹2,000/- is provided to all landholding farmer families. The fund is transferred directly into the bank accounts of the beneficiaries.",
    category: "Agriculture & Farming",
    targetBeneficiaries: "Small & Marginal Farmers with cultivable landholding",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "Ministry of Agriculture & Farmers Welfare",
    officialUrl: "https://pmkisan.gov.in",
    applicationPortalUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    helplineNumber: "155261 / 011-24300606",
    benefitType: "Direct Cash Transfer",
    estimatedBenefitAmount: "₹6,000 / year (3 installments)",
    applicationMode: "ONLINE_OR_OFFLINE",
    processingTimeDays: 30,
    isDemo: false,
    rules: [
      {
        criterionName: "Occupation / Farmer Status",
        operator: "IN_LIST",
        fieldKey: "occupation",
        expectedValue: "farmer,agriculture,cultivator",
        explanation: "Must be an active cultivator or farmer family holding cultivable agricultural land.",
        isMandatory: true,
        sourceReferenceUrl: "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
        sourceReferenceText: "Section 2.1: Operational Guidelines for PM-KISAN, Ministry of Agriculture.",
      },
      {
        criterionName: "Aadhaar Card Requirement",
        operator: "BOOLEAN",
        fieldKey: "hasAadhaarCard",
        expectedValue: "true",
        explanation: "Mandatory Aadhaar authentication for direct benefit transfer into DBT-linked account.",
        isMandatory: true,
        sourceReferenceUrl: "https://pmkisan.gov.in",
        sourceReferenceText: "PM-KISAN notification requiring 100% Aadhaar-seeded bank accounts.",
      },
      {
        criterionName: "Bank Account with DBT Enabled",
        operator: "BOOLEAN",
        fieldKey: "hasBankPassbook",
        expectedValue: "true",
        explanation: "Active bank account required to receive direct benefit transfers via NPCI/PFMS.",
        isMandatory: true,
        sourceReferenceUrl: "https://pmkisan.gov.in",
        sourceReferenceText: "DBT operational guidelines under PFMS.",
      },
    ],
    documents: [
      {
        documentName: "Aadhaar Card",
        description: "Official identity proof with biometric verification.",
        issuingAuthority: "UIDAI",
        isMandatory: true,
        alternativeDocuments: "Masked e-Aadhaar with valid QR code",
        verificationMethod: "Online Aadhaar OTP / Biometric authentication",
      },
      {
        documentName: "Land Ownership Record (Khatauni / Patta)",
        description: "Certified land record showing cultivable land ownership.",
        issuingAuthority: "State Revenue Department / Tehsildar",
        isMandatory: true,
        alternativeDocuments: "Khasra/Khatauni or Registered Sale Deed",
        verificationMethod: "State Land Records Portal (Bhulekh)",
      },
      {
        documentName: "Bank Passbook with IFSC",
        description: "Bank account details linked with NPCI Aadhaar seeding for DBT.",
        issuingAuthority: "Scheduled Commercial Bank / Post Office",
        isMandatory: true,
        alternativeDocuments: "Cancelled Cheque leaf with printed name & account number",
        verificationMethod: "Penny-drop PFMS verification",
      },
    ],
  },
  {
    slug: "ayushman-bharat-pmjay",
    name: "Ayushman Bharat - PM-JAY",
    shortDescription: "Cashless health cover up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.",
    fullDescription: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) is the world's largest health assurance scheme. It provides a health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries) forming the bottom 40% of the Indian population.",
    category: "Health",
    targetBeneficiaries: "Deprived rural and specified occupational urban families under SECC 2011 & BPL",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "National Health Authority / MoHFW",
    officialUrl: "https://pmjay.gov.in",
    applicationPortalUrl: "https://beneficiary.nha.gov.in",
    helplineNumber: "14555",
    benefitType: "Health Insurance",
    estimatedBenefitAmount: "Up to ₹5,00,000 per family per year",
    applicationMode: "ONLINE_OR_OFFLINE",
    processingTimeDays: 7,
    isDemo: false,
    rules: [
      {
        criterionName: "Income or Deprivation Threshold",
        operator: "LESS_THAN_EQUAL",
        fieldKey: "annualIncome",
        expectedValue: "250000",
        explanation: "Household annual income must not exceed the economic vulnerability ceiling of ₹2,50,000.",
        isMandatory: true,
        sourceReferenceUrl: "https://nha.gov.in/PM-JAY",
        sourceReferenceText: "AB-PMJAY SECC 2011 deprivation criteria (D1 to D7).",
      },
      {
        criterionName: "Aadhaar Card Requirement",
        operator: "BOOLEAN",
        fieldKey: "hasAadhaarCard",
        expectedValue: "true",
        explanation: "Aadhaar card needed for instant e-KYC and Ayushman Card generation.",
        isMandatory: true,
        sourceReferenceUrl: "https://beneficiary.nha.gov.in",
        sourceReferenceText: "National Health Authority e-KYC mandate.",
      },
      {
        criterionName: "Ration Card or BPL Identification",
        operator: "BOOLEAN",
        fieldKey: "hasRationCard",
        expectedValue: "true",
        explanation: "Ration card (NFSA or State ration list) or BPL card needed to link family members.",
        isMandatory: true,
        sourceReferenceUrl: "https://nha.gov.in/PM-JAY",
        sourceReferenceText: "NHA Beneficiary Identification System guidelines.",
      },
    ],
    documents: [
      {
        documentName: "Aadhaar Card",
        description: "Identity verification for all family members requesting coverage.",
        issuingAuthority: "UIDAI",
        isMandatory: true,
        alternativeDocuments: "Aadhaar Enrolment Slip with photo ID",
        verificationMethod: "Instant Biometric / Iris / Facial e-KYC",
      },
      {
        documentName: "Ration Card (NFSA / State)",
        description: "Proof of family composition and economic entitlement.",
        issuingAuthority: "Department of Food & Civil Supplies",
        isMandatory: true,
        alternativeDocuments: "SECC Family Letter / BPL Certificate",
        verificationMethod: "RCMS (Ration Card Management System) database match",
      },
    ],
  },
  {
    slug: "post-matric-scholarship-sc-st",
    name: "Post-Matric Scholarship for SC/ST Students",
    shortDescription: "Complete tuition fee reimbursement and monthly maintenance allowance for post-secondary education.",
    fullDescription: "A centrally sponsored scheme implemented through state governments to support scheduled caste and scheduled tribe students studying at post-matriculation or post-secondary stage to enable them to complete their education. Covers compulsory non-refundable fees, study tours, thesis typing, and book allowances.",
    category: "Education & Scholarship",
    targetBeneficiaries: "SC & ST students enrolled in recognized post-secondary institutions",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "Ministry of Social Justice & Empowerment",
    officialUrl: "https://scholarships.gov.in",
    applicationPortalUrl: "https://scholarships.gov.in/applicant/login",
    helplineNumber: "0120-6619540",
    benefitType: "Scholarship",
    estimatedBenefitAmount: "Full tuition + up to ₹13,500/year allowance",
    applicationMode: "ONLINE",
    processingTimeDays: 45,
    isDemo: false,
    rules: [
      {
        criterionName: "Caste Category Requirement",
        operator: "IN_LIST",
        fieldKey: "casteCategory",
        expectedValue: "sc,st",
        explanation: "Beneficiary must belong to Scheduled Caste (SC) or Scheduled Tribe (ST) communities.",
        isMandatory: true,
        sourceReferenceUrl: "https://socialjustice.gov.in/schemes/post-matric-sc",
        sourceReferenceText: "Section 3.1: Eligibility Criteria, Ministry of Social Justice and Empowerment.",
      },
      {
        criterionName: "Annual Family Income Ceiling",
        operator: "LESS_THAN_EQUAL",
        fieldKey: "annualIncome",
        expectedValue: "250000",
        explanation: "Total family annual income from all sources must not exceed ₹2,50,000 per annum.",
        isMandatory: true,
        sourceReferenceUrl: "https://socialjustice.gov.in/schemes/post-matric-sc",
        sourceReferenceText: "Income ceiling guidelines revised December 2020.",
      },
      {
        criterionName: "Current Student Enrolment",
        operator: "BOOLEAN",
        fieldKey: "isStudent",
        expectedValue: "true",
        explanation: "Must be actively enrolled as a regular student in an AICTE/UGC/State-recognized post-matric institution.",
        isMandatory: true,
        sourceReferenceUrl: "https://scholarships.gov.in",
        sourceReferenceText: "NSP Institutional Verification guidelines.",
      },
    ],
    documents: [
      {
        documentName: "Caste Certificate (SC/ST)",
        description: "Official certificate issued by competent revenue authority.",
        issuingAuthority: "Tehsildar / Sub-Divisional Magistrate (SDM)",
        isMandatory: true,
        alternativeDocuments: "Digitally signed state caste certificate with barcode",
        verificationMethod: "Online State Revenue Portal Verification",
      },
      {
        documentName: "Income Certificate (Valid for Current FY)",
        description: "Certificate certifying total family income from all sources.",
        issuingAuthority: "Tehsildar / Competent Revenue Officer",
        isMandatory: true,
        alternativeDocuments: "Form 16 or ITR acknowledgement if formal salaried",
        verificationMethod: "State e-District portal cross-verification",
      },
      {
        documentName: "Fee Receipt & College Bonafide Certificate",
        description: "Proof of active enrollment and non-refundable tuition payment schedule.",
        issuingAuthority: "Principal / Registrar of Enrolled College",
        isMandatory: true,
        alternativeDocuments: "College ID Card + Admission Letter",
        verificationMethod: "Institute NSP Nodal Officer verification",
      },
      {
        documentName: "Bank Passbook Linked to Aadhaar",
        description: "Savings account in beneficiary's own name enabled for DBT.",
        issuingAuthority: "Bank / Post Office",
        isMandatory: true,
        alternativeDocuments: "Cancelled Cheque leaf",
        verificationMethod: "Aadhaar Seeding NPCI mapper check",
      },
    ],
  },
  {
    slug: "indira-gandhi-old-age-pension",
    name: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    shortDescription: "Monthly financial pension assistance for elderly senior citizens living below the poverty line.",
    fullDescription: "Under the National Social Assistance Programme (NSAP), IGNOAPS provides social security and monthly pension assistance to elderly citizens aged 60 years and above who belong to households living below the poverty line according to criteria prescribed by the Government of India.",
    category: "Pensions & Senior Citizens",
    targetBeneficiaries: "Senior citizens aged 60+ belonging to BPL households",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "Ministry of Rural Development",
    officialUrl: "https://nsap.nic.in",
    applicationPortalUrl: "https://nsap.nic.in/citizenApplication.do",
    helplineNumber: "1800-11-1967",
    benefitType: "Pension",
    estimatedBenefitAmount: "₹200 - ₹500/month (augmented by State toppings up to ₹2,500/month)",
    applicationMode: "ONLINE_OR_OFFLINE",
    processingTimeDays: 45,
    isDemo: false,
    rules: [
      {
        criterionName: "Minimum Age Requirement",
        operator: "GREATER_THAN_EQUAL",
        fieldKey: "age",
        expectedValue: "60",
        explanation: "Applicant must be 60 years of age or older on the date of application.",
        isMandatory: true,
        sourceReferenceUrl: "https://nsap.nic.in/guidelines.html",
        sourceReferenceText: "NSAP Guidelines Clause 3.1: Age criteria for IGNOAPS.",
      },
      {
        criterionName: "BPL Status Verification",
        operator: "BOOLEAN",
        fieldKey: "hasBPLCard",
        expectedValue: "true",
        explanation: "Must belong to a household listed in the Below Poverty Line (BPL) register.",
        isMandatory: true,
        sourceReferenceUrl: "https://nsap.nic.in/guidelines.html",
        sourceReferenceText: "Ministry of Rural Development BPL survey guidelines.",
      },
    ],
    documents: [
      {
        documentName: "Age Proof (Birth Certificate or Aadhaar Card)",
        description: "Official verification that the applicant is 60 years or older.",
        issuingAuthority: "UIDAI / Municipal Registrar / Chief Medical Officer",
        isMandatory: true,
        alternativeDocuments: "Voter ID Card (EPIC) / Medical Board Age Certificate",
        verificationMethod: "Verification against UIDAI database or CMO Medical assessment",
      },
      {
        documentName: "BPL Ration Card / BPL Survey Certificate",
        description: "Official certification of below-poverty-line family status.",
        issuingAuthority: "Panchayat Development Officer / Tehsildar / Food Dept",
        isMandatory: true,
        alternativeDocuments: "Antyodaya Anna Yojana (AAY) Ration Card",
        verificationMethod: "Gram Panchayat BPL register verification",
      },
      {
        documentName: "Bank / Post Office Passbook",
        description: "Account details for direct electronic pension credit every month.",
        issuingAuthority: "Bank / India Post Payments Bank",
        isMandatory: true,
        alternativeDocuments: "Post Office Savings Account Statement",
        verificationMethod: "DBT Direct Credit Validation",
      },
    ],
  },
  {
    slug: "pm-awas-yojana-gramin",
    name: "Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)",
    shortDescription: "Financial grant of ₹1,20,000 to ₹1,30,000 for constructing a permanent pucca house with basic amenities.",
    fullDescription: "PMAY-G aims to provide a pucca house with basic amenities to all houseless households and households living in kutcha and dilapidated houses in rural areas. Financial assistance of ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly, difficult areas, along with 90/95 person-days of unskilled labor through MGNREGS and ₹12,000 for toilet construction.",
    category: "Housing & Shelter",
    targetBeneficiaries: "Houseless rural families and those living in zero, one or two-room kutcha houses",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "Ministry of Rural Development",
    officialUrl: "https://pmayg.nic.in",
    applicationPortalUrl: "https://awaassoft.nic.in",
    helplineNumber: "1800-11-6446",
    benefitType: "Subsidy",
    estimatedBenefitAmount: "₹1,20,000 - ₹1,30,000 + MGNREGA labor",
    applicationMode: "ONLINE_OR_OFFLINE",
    processingTimeDays: 60,
    isDemo: false,
    rules: [
      {
        criterionName: "Rural Residency",
        operator: "BOOLEAN",
        fieldKey: "isRural",
        expectedValue: "true",
        explanation: "PMAY-Gramin is strictly applicable to designated rural areas and village panchayats.",
        isMandatory: true,
        sourceReferenceUrl: "https://pmayg.nic.in/netiay/Framework_English.pdf",
        sourceReferenceText: "PMAY-G Framework Implementation Guidelines.",
      },
      {
        criterionName: "Income / Deprivation Ceiling",
        operator: "LESS_THAN_EQUAL",
        fieldKey: "annualIncome",
        expectedValue: "200000",
        explanation: "Income ceiling to prioritize families lacking permanent shelter.",
        isMandatory: true,
        sourceReferenceUrl: "https://pmayg.nic.in",
        sourceReferenceText: "Gram Sabha prioritization matrix based on SECC 2011.",
      },
    ],
    documents: [
      {
        documentName: "Aadhaar Card",
        description: "Identity and biometric validation for all adult family members.",
        issuingAuthority: "UIDAI",
        isMandatory: true,
        alternativeDocuments: "e-Aadhaar",
        verificationMethod: "Aadhaar seeding with AwaasSoft",
      },
      {
        documentName: "Land Possession / House Site Certificate",
        description: "Proof of owning land or certificate of allotted plot from Gram Panchayat.",
        issuingAuthority: "Gram Panchayat / Patwari / Village Officer",
        isMandatory: true,
        alternativeDocuments: "NOC from Gram Sabha or Patta passbook",
        verificationMethod: "Geo-tagged photo verification by Gram Rozgar Sevak",
      },
      {
        documentName: "MGNREGA Job Card",
        description: "To link entitlement of 90/95 days of unskilled construction wages.",
        issuingAuthority: "Gram Panchayat",
        isMandatory: false,
        alternativeDocuments: "Application for fresh Job Card",
        verificationMethod: "Nrega.nic.in database matching",
      },
    ],
  },
  {
    slug: "national-disability-pension",
    name: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    shortDescription: "Monthly pension for persons with severe and multiple disabilities living below poverty line.",
    fullDescription: "Component of National Social Assistance Programme providing social safety net and monthly pension to persons with severe disabilities (disability level 80% or higher, or multiple disabilities) aged 18 to 79 years who belong to BPL families.",
    category: "Social Welfare & Disability",
    targetBeneficiaries: "Persons with severe disability (>=80%) from BPL households",
    jurisdiction: "Central",
    stateOrUnionTerritory: "All India",
    ministryOrDepartment: "Ministry of Social Justice & Empowerment / MoRD",
    officialUrl: "https://nsap.nic.in",
    applicationPortalUrl: "https://nsap.nic.in/citizenApplication.do",
    helplineNumber: "1800-11-1967",
    benefitType: "Pension",
    estimatedBenefitAmount: "₹300 - ₹2,500/month (varies by State top-up)",
    applicationMode: "ONLINE_OR_OFFLINE",
    processingTimeDays: 45,
    isDemo: false,
    rules: [
      {
        criterionName: "Disability Status Confirmation",
        operator: "BOOLEAN",
        fieldKey: "disabilityStatus",
        expectedValue: "true",
        explanation: "Applicant must have a recognized physical or mental disability.",
        isMandatory: true,
        sourceReferenceUrl: "https://nsap.nic.in/guidelines.html",
        sourceReferenceText: "IGNDPS Scheme Guidelines, Clause 4.1.",
      },
      {
        criterionName: "Disability Percentage Threshold",
        operator: "GREATER_THAN_EQUAL",
        fieldKey: "disabilityPercentage",
        expectedValue: "80",
        explanation: "Disability must be 80% or greater (severe or multiple disability) as per UDID card.",
        isMandatory: true,
        sourceReferenceUrl: "https://nsap.nic.in/guidelines.html",
        sourceReferenceText: "Guidelines under Rights of Persons with Disabilities Act.",
      },
      {
        criterionName: "Minimum Age Requirement",
        operator: "GREATER_THAN_EQUAL",
        fieldKey: "age",
        expectedValue: "18",
        explanation: "Applicant must be aged 18 years or older.",
        isMandatory: true,
        sourceReferenceUrl: "https://nsap.nic.in/guidelines.html",
        sourceReferenceText: "IGNDPS eligibility age bracket: 18-79 years.",
      },
    ],
    documents: [
      {
        documentName: "Unique Disability ID (UDID) Card or Disability Certificate",
        description: "Official certificate issued by competent Medical Board stating percentage.",
        issuingAuthority: "Department of Empowerment of Persons with Disabilities (DEPwD) / Medical Board",
        isMandatory: true,
        alternativeDocuments: "District Hospital Medical Superintendent Certificate",
        verificationMethod: "Online UDID portal verification (swavlambancard.gov.in)",
      },
      {
        documentName: "BPL Ration Card or Income Certificate",
        description: "Proof of household living below poverty line.",
        issuingAuthority: "Tehsildar / Food & Civil Supplies",
        isMandatory: true,
        alternativeDocuments: "Antyodaya Anna Yojana card",
        verificationMethod: "State e-District portal verification",
      },
      {
        documentName: "Bank Passbook with Aadhaar Seeding",
        description: "Bank account in beneficiary's name for direct pension credit.",
        issuingAuthority: "Bank",
        isMandatory: true,
        alternativeDocuments: "Post Office account passbook",
        verificationMethod: "PFMS penny-drop verification",
      },
    ],
  },
];
