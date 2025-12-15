import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import type { WebsiteData } from "@/lib/websiteTypes";

type BrandData = {
  name?: string;
  slogan?: string;
  palette?: { primary: string; secondary: string };
  font?: { id: string; css: string };
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const websiteType =
      typeof body.websiteType === "string" ? body.websiteType : "product";

    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const brand = (body.brand ?? null) as BrandData | null;

    if (!idea) {
      return NextResponse.json({ error: "Missing idea" }, { status: 400 });
    }

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You generate website JSON. Return ONLY strict JSON. No markdown. No explanation.",
        },
        {
          role: "user",
          content: `
Create a website data JSON for a simple one-page website.

Rules:
- Return a single JSON object that matches this structure exactly:
{
  "type": "${websiteType}",
  "brandName": string,
  "hero": {
    "headline": string,
    "subheadline": string,
    "primaryCta": string,
    "primaryCtaLink": string,
    "secondaryCta": string,
    "secondaryCtaLink": string,
    "imageQuery": string
  },
  "about": { "title": string, "body": string, "imageQuery": string },
  "features": { "title": string, "items": [{ "label": string, "description": string }] },
  "offers": { "title": string, "items": [{ "name": string, "description": string, "priceLabel": string }] },
  "contact": {
    "title": string,
    "description": string,
    "email": string,
    "phone": string,
    "whatsapp": string
  },
  "finalCta": { "headline": string, "subheadline": string, "buttonLabel": string }
}

- Keep it realistic and short (no long paragraphs).
- Use this business idea: ${idea}

Brand (if present) must be reflected:
- brand name: ${brand?.name ?? ""}
- slogan: ${brand?.slogan ?? ""}
- palette primary: ${brand?.palette?.primary ?? ""}
- palette secondary: ${brand?.palette?.secondary ?? ""}
- font: ${brand?.font?.id ?? ""}

Links: use "#" for all links.
Email/phone/whatsapp: use placeholders like "hello@brand.com" / "+1 555..." if unknown.
          `.trim(),
        },
      ],
    });

    const text = resp.output_text || "";
    const parsed = JSON.parse(text) as WebsiteData;

    // light safety check
    if (!parsed || typeof parsed !== "object" || !("hero" in parsed)) {
      return NextResponse.json(
        { error: "Invalid website JSON returned", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("website/generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate website" },
      { status: 500 }
    );
  }
}
