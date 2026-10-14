import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../prisma";

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponsePayload {
  reply: string;
  groundedSchemeIds: string[];
  uncertaintyFlag: boolean;
  fallbackTriggered: boolean;
  sources: { title: string; url: string; issuingAuthority: string }[];
  modelUsed: string;
  disclaimer: string;
}

const AI_DISCLAIMER =
  "BenefitBridge AI Assistant provides explanations based on published official guidelines. It is not an official government authority and cannot guarantee scheme approval. Always verify final instructions on official government portals.";

/**
 * Deterministic fallback generator when Gemini API key is missing or external call fails
 */
function generateDeterministicFallback(
  userQuery: string,
  schemes: any[],
  userProfile?: any
): AIResponsePayload {
  const queryLower = userQuery.toLowerCase();

  // Find schemes mentioned or matching query keywords
  const matched = schemes.filter(
    (s) =>
      queryLower.includes(s.name.toLowerCase()) ||
      queryLower.includes(s.slug.toLowerCase()) ||
      queryLower.includes(s.category.toLowerCase()) ||
      (s.benefitType && queryLower.includes(s.benefitType.toLowerCase())) ||
      (queryLower.includes("farm") && s.category.includes("Agriculture")) ||
      (queryLower.includes("health") && s.category.includes("Health")) ||
      (queryLower.includes("scholarship") && s.category.includes("Education")) ||
      (queryLower.includes("pension") && s.category.includes("Pension")) ||
      (queryLower.includes("house") && s.category.includes("Housing")) ||
      (queryLower.includes("disabilit") && s.category.includes("Disability"))
  );

  const targetSchemes = matched.length > 0 ? matched : schemes.slice(0, 3);
  const groundedSchemeIds = targetSchemes.map((s) => s.id);
  const sources = targetSchemes.map((s) => ({
    title: s.name,
    url: s.officialUrl,
    issuingAuthority: s.ministryOrDepartment,
  }));

  let replyText = `### Verified Scheme Guidance\n\n`;

  if (targetSchemes.length > 0) {
    replyText += `Based on official records in the BenefitBridge verified catalog, here are relevant details regarding your inquiry:\n\n`;

    for (const s of targetSchemes) {
      replyText += `#### [${s.name}](${s.officialUrl})\n`;
      replyText += `- **Department / Ministry**: ${s.ministryOrDepartment}\n`;
      replyText += `- **Benefit**: ${s.estimatedBenefitAmount || s.benefitType}\n`;
      replyText += `- **Who Qualifies**: ${s.targetBeneficiaries}\n`;
      
      if (s.rules && s.rules.length > 0) {
        replyText += `- **Core Eligibility Rules**:\n`;
        s.rules.forEach((r: any) => {
          replyText += `  * *${r.criterionName}*: ${r.explanation}\n`;
        });
      }

      if (s.documents && s.documents.length > 0) {
        replyText += `- **Required Official Documents**:\n`;
        s.documents.forEach((d: any) => {
          replyText += `  * ${d.documentName} (Issued by: ${d.issuingAuthority})\n`;
        });
      }

      if (s.applicationPortalUrl) {
        replyText += `- **Official Filing Portal**: [Visit Official Application Website](${s.applicationPortalUrl})\n`;
      }
      replyText += `\n`;
    }

    replyText += `\n> **Missing Information Notice**: Official approvals require verified documents. If your household income or caste certificates are pending or expired, you must obtain renewal from the local Tehsildar or Revenue Inspector before submission.\n`;
  } else {
    replyText += `We searched the verified public welfare database but could not find a scheme matching your exact terms. Please specify if you are looking for health insurance, agriculture subsidies, higher education scholarships, senior pensions, or housing grants.`;
  }

  return {
    reply: replyText,
    groundedSchemeIds,
    uncertaintyFlag: targetSchemes.length === 0,
    fallbackTriggered: true,
    sources,
    modelUsed: "deterministic-verified-knowledge-base",
    disclaimer: AI_DISCLAIMER,
  };
}

/**
 * Server-side AI query handler using Google Gemini API with fallback to verified catalog
 */
export async function queryAIAssistant(
  userQuery: string,
  history: AIChatMessage[] = [],
  userId?: string
): Promise<AIResponsePayload> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  // Retrieve published schemes with rules, documents, and verified sources to ground the model
  const activeSchemes = await prisma.scheme.findMany({
    where: { status: "PUBLISHED" },
    include: {
      rules: true,
      documents: true,
      verifications: { where: { isConfirmedValid: true }, take: 1 },
    },
    take: 10,
  });

  // If no Gemini key is provided, execute deterministic grounded engine immediately
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    const fallbackRes = generateDeterministicFallback(userQuery, activeSchemes);
    const latency = Date.now() - startTime;

    // Log AI interaction metadata
    if (userId) {
      await prisma.aIInteractionMetadata.create({
        data: {
          userId,
          promptType: "ELIGIBILITY_ASSISTANCE",
          groundedSchemeIds: fallbackRes.groundedSchemeIds.join(","),
          uncertaintyFlag: fallbackRes.uncertaintyFlag,
          fallbackTriggered: true,
          modelUsed: fallbackRes.modelUsed,
          latencyMs: latency,
        },
      }).catch(() => {});
    }

    return fallbackRes;
  }

  // Gemini API integration
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

    // Prepare ground truth context from verified schemes
    const groundedContext = activeSchemes.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      category: s.category,
      ministry: s.ministryOrDepartment,
      targetGroup: s.targetBeneficiaries,
      benefit: s.estimatedBenefitAmount,
      officialUrl: s.officialUrl,
      applicationPortal: s.applicationPortalUrl,
      rules: s.rules.map((r) => ({
        rule: r.criterionName,
        condition: r.explanation,
        mandatory: r.isMandatory,
        source: r.sourceReferenceUrl,
      })),
      documents: s.documents.map((d) => ({
        document: d.documentName,
        issuingAuthority: d.issuingAuthority,
        mandatory: d.isMandatory,
        alternatives: d.alternativeDocuments,
      })),
    }));

    const systemPrompt = `You are BenefitBridge AI Assistant, an empathetic, highly accurate public welfare benefits guide for India.
You help citizens and community social workers discover welfare schemes, understand eligibility criteria in simple language, identify missing documents, and prepare applications.

CRITICAL OPERATIONAL RULES:
1. Grounding: You MUST ONLY refer to the verified scheme data provided below. Do not invent non-existent government programs or requirements.
2. Official Links: Always cite the provided official URLs when mentioning a scheme.
3. Language: Use clear, polite, jargon-free language accessible to citizens.
4. Transparency & Uncertainty: Never promise or guarantee eligibility or government approval. If a user has not provided their income or category, explicitly declare that information is missing.
5. Incomplete Documents: Highlight when issuing authorities (e.g. Tehsildar, Medical Board, Gram Panchayat) must be visited.

VERIFIED SCHEME KNOWLEDGE BASE:
${JSON.stringify(groundedContext, null, 2)}
`;

    const chatHistory = history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${chatHistory}\n\nCITIZEN QUERY: ${userQuery}\n\nProvide a structured, helpful, and source-grounded response:`;

    const result = await model.generateContent(fullPrompt);
    const replyText = result.response.text();
    const latency = Date.now() - startTime;

    const groundedSchemeIds = activeSchemes.map((s) => s.id);
    const sources = activeSchemes.map((s) => ({
      title: s.name,
      url: s.officialUrl,
      issuingAuthority: s.ministryOrDepartment,
    }));

    const uncertaintyFlag =
      replyText.toLowerCase().includes("unknown") ||
      replyText.toLowerCase().includes("missing information") ||
      replyText.toLowerCase().includes("cannot guarantee");

    if (userId) {
      await prisma.aIInteractionMetadata.create({
        data: {
          userId,
          promptType: "ELIGIBILITY_ASSISTANCE",
          groundedSchemeIds: groundedSchemeIds.join(","),
          uncertaintyFlag,
          fallbackTriggered: false,
          modelUsed: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          latencyMs: latency,
        },
      }).catch(() => {});
    }

    return {
      reply: replyText,
      groundedSchemeIds,
      uncertaintyFlag,
      fallbackTriggered: false,
      sources,
      modelUsed: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      disclaimer: AI_DISCLAIMER,
    };
  } catch (error) {
    console.warn("Gemini API call failed, falling back to verified deterministic engine:", error);
    const fallbackRes = generateDeterministicFallback(userQuery, activeSchemes);

    if (userId) {
      await prisma.aIInteractionMetadata.create({
        data: {
          userId,
          promptType: "ELIGIBILITY_ASSISTANCE",
          groundedSchemeIds: fallbackRes.groundedSchemeIds.join(","),
          uncertaintyFlag: true,
          fallbackTriggered: true,
          modelUsed: "gemini-fallback-mode",
          latencyMs: Date.now() - startTime,
        },
      }).catch(() => {});
    }

    return fallbackRes;
  }
}
