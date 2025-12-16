import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import type { WebsiteData } from "@/lib/types/websiteTypes";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const websiteType =
      typeof body.websiteType === "string" ? body.websiteType : "product";
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";

    if (!idea) {
      return NextResponse.json({ error: "Missing idea" }, { status: 400 });
    }

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Return ONLY strict JSON. No markdown. No explanation. Output must match the required schema exactly.",
        },
        {
          role: "user",
          content: `
Generate BOTH brand data and website data for this business idea.

Business idea: ${idea}

Return a single JSON object with EXACT shape:
{
  "brand": {
    "name": string,
    "slogan": string,
    "palette": { "primary": string, "secondary": string } | null,
    "font": { "id": string, "css": string } | null
  },
  "website": {
    "type": "${websiteType}",
    "brandName": string,
    "hero": {
      "headline": string,
      "subheadline": string,
      "primaryCta": string,
      "primaryCtaLink": "#",
      "secondaryCta": string,
      "secondaryCtaLink": "#",
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
}

Rules:
- Keep text short and realistic.
- Use placeholders for email/phone/whatsapp if unknown.
- palette/font can be null for now (or provide if confident).
- website.brandName MUST equal brand.name.
          `.trim(),
        },
      ],
    });

    const text = resp.output_text || "";
    const parsed = JSON.parse(text) as {
      brand: {
        name: string;
        slogan: string;
        palette: { primary: string; secondary: string } | null;
        font: { id: string; css: string } | null;
      };
      website: WebsiteData;
    };

    if (!parsed?.brand?.name || !parsed?.website?.hero) {
      return NextResponse.json(
        { error: "Invalid JSON returned", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ brand: parsed.brand, data: parsed.website });
  } catch (err) {
    console.error("website/generate-with-brand error:", err);
    return NextResponse.json(
      { error: "Failed to generate brand+website" },
      { status: 500 }
    );
  }
}
