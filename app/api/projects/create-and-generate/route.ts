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

//  output shape
type AiOut = {
  brand: { name: string; slogan: string };
  website: {
    type: string;
    hero: {
      subheadline: string;
      primaryCta: string;
      secondaryCta: string;
      imageQuery: string;
    };
    about: { title: string; body: string; imageQuery: string };
    features: {
      title: string;
      items: { label: string; description: string }[];
    };
    offers: {
      title: string;
      items: { name: string; description: string; priceLabel: string }[];
    };
    contact: {
      title: string;
      description: string;
      email: string;
      phone: string;
      whatsapp: string;
    };
    finalCta: { headline: string; subheadline: string; buttonLabel: string };
  };
};

function toWebsiteData(ai: AiOut, websiteType: string): WebsiteData {
  const brandName = ai.brand.name;
  const slogan = ai.brand.slogan;

  return {
    type: websiteType,
    brandName, // server-side
    hero: {
      headline: slogan, // server-side
      subheadline: ai.website.hero.subheadline ?? "",
      primaryCta: ai.website.hero.primaryCta ?? "",
      primaryCtaLink: "#", // server-side
      secondaryCta: ai.website.hero.secondaryCta ?? "",
      secondaryCtaLink: "#", // server-side
      imageQuery: ai.website.hero.imageQuery ?? "",
    },
    about: {
      title: ai.website.about.title ?? "",
      body: ai.website.about.body ?? "",
      imageQuery: ai.website.about.imageQuery ?? "",
    },
    features: {
      title: ai.website.features.title ?? "",
      items: Array.isArray(ai.website.features.items)
        ? ai.website.features.items.map((x) => ({
            label: String(x?.label ?? ""),
            description: String(x?.description ?? ""),
          }))
        : [],
    },
    offers: {
      title: ai.website.offers.title ?? "",
      items: Array.isArray(ai.website.offers.items)
        ? ai.website.offers.items.map((x) => ({
            name: String(x?.name ?? ""),
            description: String(x?.description ?? ""),
            priceLabel: String(x?.priceLabel ?? ""),
          }))
        : [],
    },
    contact: {
      title: ai.website.contact.title ?? "",
      description: ai.website.contact.description ?? "",
      email: ai.website.contact.email ?? "hello@brand.com",
      phone: ai.website.contact.phone ?? "+1 555 000 0000",
      whatsapp: ai.website.contact.whatsapp ?? "+1 555 000 0000",
    },
    finalCta: {
      headline: ai.website.finalCta.headline ?? "",
      subheadline: ai.website.finalCta.subheadline ?? "",
      buttonLabel: ai.website.finalCta.buttonLabel ?? "",
    },
  };
}

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
  const type = websiteType || "product";

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

  // 2) One OpenAI call (smaller prompt + smaller response)
  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "Return only valid JSON. No markdown. No extra text",
      },
      {
        role: "user",
        content: `
Idea: ${idea}

Return JSON EXACTLY:
{
  "brand": { "name": string, "slogan": string },
  "website": {
    "type": "${type}",
    "hero": { "subheadline": string, "primaryCta": string, "secondaryCta": string, "imageQuery": string },
    "about": { "title": string, "body": string, "imageQuery": string },
    "features": { "title": string, "items": [{ "label": string, "description": string }] },
    "offers": { "title": string, "items": [{ "name": string, "description": string, "priceLabel": string }] },
    "contact": { "title": string, "description": string, "email": string, "phone": string, "whatsapp": string },
    "finalCta": { "headline": string, "subheadline": string, "buttonLabel": string }
  }
}

Rules:
- Keep copy short.
- Use placeholders if unknown.
-imageQuery must be a short Unsplash search phrase (1–2 words), generic and visual
        `.trim(),
      },
    ],
  });

  const text = resp.output_text || "";
  console.log("usage: ", resp.usage);
  console.log("usage: ", resp.model);

  let ai: AiOut;

  try {
    ai = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid AI JSON", raw: text },
      { status: 500 }
    );
  }

  if (!ai?.brand?.name || !ai?.brand?.slogan || !ai?.website?.hero) {
    return NextResponse.json(
      { error: "Incomplete AI response", raw: ai },
      { status: 500 }
    );
  }

  // Server-side computed values
  const brand_data = {
    name: ai.brand.name.trim() || name,
    slogan: ai.brand.slogan.trim(),
    palette: null,
    font: null,
  };

  const websiteData = toWebsiteData(
    {
      ...ai,
      brand: { name: brand_data.name, slogan: brand_data.slogan },
    },
    type
  );

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
      { project_id: project.id, user_id: user.id, data: websiteData },
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
