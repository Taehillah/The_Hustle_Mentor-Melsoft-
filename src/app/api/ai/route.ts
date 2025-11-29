import OpenAI from "openai";
import { NextResponse } from "next/server";

const systemPrompt = `You are The Hustle Mentor, a concise, practical business coach for South African youth.
- Give clear, actionable steps with bullet points.
- Keep the tone encouraging but direct.
- Assume low budget, mobile-first, and WhatsApp-friendly tactics.
- When suggesting pricing, include quick sanity checks.
- Keep answers short (under 180 words) unless more detail is clearly needed.`;

const defaultModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const { stageId, stageTitle, prompt, note, previousNotes } = await req.json();

  if (!stageId || typeof note !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: defaultModel,
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Stage: ${stageTitle || stageId}\nPrompt: ${prompt || ""}\nCurrent note: ${
            note || "None provided"
          }\nPrevious notes: ${previousNotes || "None provided"}`,
        },
      ],
      max_output_tokens: 400,
      temperature: 0.5,
    });

    let aiText = response.output_text;

    if (!aiText && Array.isArray(response.output)) {
      const parts = response.output
        .map((item: any) => {
          if (Array.isArray(item?.content)) {
            const match = item.content.find((c: any) => typeof c?.text === "string");
            return match?.text || "";
          }
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
      if (parts) aiText = parts;
    }

    if (!aiText) aiText = "No response generated.";

    return NextResponse.json({ message: aiText });
  } catch (error) {
    console.error("OpenAI error", error);
    return NextResponse.json({ error: "Failed to fetch AI guidance" }, { status: 500 });
  }
}
