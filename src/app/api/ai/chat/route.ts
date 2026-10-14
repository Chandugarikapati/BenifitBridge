import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { queryAIAssistant } from "@/lib/ai/assistant";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitKey = session ? `user-${session.id}` : `ip-${ip}`;

    const limitStatus = checkRateLimit(rateLimitKey, 20, 60000);
    if (!limitStatus.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${limitStatus.resetInSec} seconds before asking again.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(limitStatus.resetInSec),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

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

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Remaining": String(limitStatus.remaining),
      },
    });
  } catch (error) {
    console.error("AI assistant API error:", error);
    return NextResponse.json(
      { error: "AI Assistant is currently unavailable. Please consult verified scheme details directly." },
      { status: 500 }
    );
  }
}
