// app/api/projects/create-and-generate/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchUnsplashImage } from "@/lib/unsplash";
import { openai } from "@/lib/openai";
import type { WebsiteData } from "@/lib/types/websiteTypes";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  idea: z.string().min(1, "Idea is required"),
  websiteType: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, idea, websiteType } = parsed.data;

  // 1) Create project
  const { data: project, error: createErr } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      description: idea,
      status: "draft",
    })
    .select("id, name, description, status")
    .single();

  if (createErr || !project) {
    console.error("Create project error:", createErr);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }

  // 2) ONE OpenAI call → brand + website together
  const resp = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Return ONLY strict JSON. No markdown. No explanation. Follow the schema exactly.",
      },
      {
        role: "user",
        content: `
Business idea: ${idea}

Return JSON with EXACT shape:
{
  "brand": {
    "name": string,
    "slogan": string,
    "palette": { "primary": string, "secondary": string } | null,
    "font": { "id": string, "css": string } | null
  },
  "website": {
    "type": "${websiteType || "product"}",
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
- website.brandName MUST equal brand.name
- Keep text short and realistic
- Use placeholders for email/phone if unknown
        `.trim(),
      },
    ],
  });

  const text = resp.output_text || "";
  let parsedAI: {
    brand: {
      name: string;
      slogan: string;
      palette: { primary: string; secondary: string } | null;
      font: { id: string; css: string } | null;
    };
    website: WebsiteData;
  };

  try {
    parsedAI = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid AI JSON", raw: text },
      { status: 500 }
    );
  }

  if (!parsedAI?.brand?.name || !parsedAI?.website?.hero) {
    return NextResponse.json(
      { error: "Incomplete AI response", raw: parsedAI },
      { status: 500 }
    );
  }

  const brand_data = parsedAI.brand;
  const websiteData = parsedAI.website;

  // 3) Save brand
  const { error: saveBrandErr } = await supabase
    .from("projects")
    .update({ brand_data })
    .eq("id", project.id)
    .eq("user_id", user.id);

  if (saveBrandErr) {
    console.error("Save brand error:", saveBrandErr);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 }
    );
  }

  // 4) Save website
  const { data: upsertedWebsite, error: upsertErr } = await supabase
    .from("websites")
    .upsert(
      {
        project_id: project.id,
        user_id: user.id,
        data: websiteData,
      },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  if (upsertErr) {
    console.error("Website upsert error:", upsertErr);
    return NextResponse.json(
      { error: "Failed to save website" },
      { status: 500 }
    );
  }

  // 5) Thumbnail
  try {
    const heroQuery = websiteData?.hero?.imageQuery ?? "";
    const heroUrl = heroQuery ? await fetchUnsplashImage(heroQuery) : null;

    if (heroUrl) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: heroUrl })
        .eq("id", project.id)
        .eq("user_id", user.id);
    }
  } catch {}

  return NextResponse.json({
    success: true,
    project,
    brand_data,
    website: { data: upsertedWebsite },
  });
}
