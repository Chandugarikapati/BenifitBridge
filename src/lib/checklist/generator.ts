/**
 * BenefitBridge Document Checklist Generator
 * Generates personalized, actionable checklists from scheme document requirements.
 * Cross-references known user certificates to provide accurate starting states.
 */

export interface DocumentRequirementInput {
  id: string;
  schemeId: string;
  documentName: string;
  description: string;
  issuingAuthority: string;
  isMandatory: boolean;
  alternativeDocuments?: string | null;
  sampleDocumentUrl?: string | null;
  verificationMethod?: string | null;
}

export interface GeneratedChecklistItem {
  documentRequirementId: string;
  title: string;
  description: string;
  issuingAuthority: string;
  isMandatory: boolean;
  isCompleted: boolean;
  notes?: string;
  alternativeDocuments?: string | null;
  verificationMethod?: string | null;
}

/**
 * Maps common document names to user profile possession flags
 */
function isDocumentPossessedByProfile(docName: string, profile?: Record<string, any>): boolean {
  if (!profile) return false;

  const normalized = docName.toLowerCase();

  if (normalized.includes("aadhaar") && profile.hasAadhaarCard) return true;
  if (normalized.includes("ration") && profile.hasRationCard) return true;
  if (normalized.includes("income") && profile.hasIncomeCertificate) return true;
  if (normalized.includes("bank") && profile.hasBankPassbook) return true;
  if (normalized.includes("caste") && profile.hasCasteCertificate) return true;
  if (normalized.includes("disability") && profile.hasDisabilityCertificate) return true;
  if (normalized.includes("bpl") && profile.hasBPLCard) return true;

  return false;
}

/**
 * Generates structured checklist items for a given application case
 */
export function generateChecklistForScheme(
  requirements: DocumentRequirementInput[],
  profile?: Record<string, any>
): GeneratedChecklistItem[] {
  return requirements.map((req) => {
    const alreadyPossessed = isDocumentPossessedByProfile(req.documentName, profile);

    return {
      documentRequirementId: req.id,
      title: req.documentName,
      description: req.description,
      issuingAuthority: req.issuingAuthority,
      isMandatory: req.isMandatory,
      isCompleted: alreadyPossessed,
      notes: alreadyPossessed
        ? "Pre-marked from your verified profile credentials. Please confirm document is currently valid."
        : `Acquire from ${req.issuingAuthority}.`,
      alternativeDocuments: req.alternativeDocuments,
      verificationMethod: req.verificationMethod,
    };
  });
}

/**
 * Calculates readiness percentage and incomplete items summary
 */
export function calculateChecklistProgress(items: { isCompleted: boolean; isMandatory: boolean }[]) {
  if (!items || items.length === 0) {
    return {
      total: 0,
      completed: 0,
      mandatoryTotal: 0,
      mandatoryCompleted: 0,
      percentage: 100,
      isReadyToSubmit: true,
    };
  }

  const total = items.length;
  const completed = items.filter((i) => i.isCompleted).length;
  const mandatory = items.filter((i) => i.isMandatory);
  const mandatoryCompleted = mandatory.filter((i) => i.isCompleted).length;

  const percentage = Math.round((completed / total) * 100);
  const isReadyToSubmit = mandatoryCompleted === mandatory.length;

  return {
    total,
    completed,
    mandatoryTotal: mandatory.length,
    mandatoryCompleted,
    percentage,
    isReadyToSubmit,
  };
}
