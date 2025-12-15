import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";

    if (!idea) {
      return NextResponse.json({ error: "Missing idea" }, { status: 400 });
    }

    // Responses API (recommended for new projects) :contentReference[oaicite:3]{index=3}
    const resp = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Generate brand options. Return STRICT JSON only. No markdown, no explanations.",
        },
        {
          role: "user",
          content: `
                Business idea: ${idea}

                    Return JSON with this exact shape:
                    {
                        "brands": [
                         { "name": "...", "slogan": "..." },
                         { "name": "...", "slogan": "..." },
                         { "name": "...", "slogan": "..." }
                ]
                }
          `.trim(),
        },
      ],
    });

    const text = resp.output_text || "";
    const parsed = JSON.parse(text);

    if (!parsed?.brands || !Array.isArray(parsed.brands)) {
      return NextResponse.json(
        { error: "Model returned invalid format", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("brand/generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate brands" },
      { status: 500 }
    );
  }
}
