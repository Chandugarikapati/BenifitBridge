import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { queryAIAssistant } from "@/lib/ai/assistant";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const body = await req.json();

    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const response = await queryAIAssistant(
      message.trim(),
      Array.isArray(history) ? history : [],
      session?.id
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI assistant API error:", error);
    return NextResponse.json(
      { error: "AI Assistant is currently unavailable. Please consult verified scheme details directly." },
      { status: 500 }
    );
  }
}
