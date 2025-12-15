// app/api/website/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { WebsiteData } from "@/lib/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";

const postSchema = z.object({
  projectId: z.string().uuid(),
  data: z.custom<WebsiteData>(),
});

// GET /api/website?projectId=...
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // not "no rows"
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load website" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: data?.data ?? null });
}

// POST /api/website
export async function POST(req: Request) {
  //   console.log("website route");
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  //   console.log("backend parsed:", parsed);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { projectId, data } = parsed.data;

  const { data: upserted, error } = await supabase
    .from("websites")
    .upsert(
      {
        project_id: projectId,
        user_id: user.id,
        data,
      },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  const heroQuery = data.hero?.imageQuery ?? "";
  const heroUrl = heroQuery ? await fetchUnsplashImage(heroQuery) : null;

  await supabase
    .from("projects")
    .update({ thumbnail_url: heroUrl })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: upserted });
}
