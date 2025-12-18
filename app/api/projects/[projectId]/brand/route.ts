// app/api/projects/[projectId]/brand/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type BrandData = {
  name: string;
  slogan: string;
  palette: { primary: string; secondary: string } | null;
  font: { id: string; css: string } | null;
};

function parseIncoming(body: any): Partial<BrandData> {
  const incoming: Partial<BrandData> = {};

  if (typeof body?.name === "string") incoming.name = body.name;
  if (typeof body?.slogan === "string") incoming.slogan = body.slogan;

  if (
    body?.palette &&
    typeof body.palette.primary === "string" &&
    typeof body.palette.secondary === "string"
  ) {
    incoming.palette = {
      primary: body.palette.primary,
      secondary: body.palette.secondary,
    };
  }

  if (
    body?.font &&
    typeof body.font.id === "string" &&
    typeof body.font.css === "string"
  ) {
    incoming.font = { id: body.font.id, css: body.font.css };
  }

  return incoming;
}

function mergeBrand(
  existing: Partial<BrandData>,
  incoming: Partial<BrandData>
) {
  const merged: BrandData = {
    name: incoming.name ?? existing.name ?? "",
    slogan: incoming.slogan ?? existing.slogan ?? "",
    palette: incoming.palette ?? existing.palette ?? null,
    font: incoming.font ?? existing.font ?? null,
  };
  return merged;
}

async function getAuthedSupabaseAndProject(
  projectId: string
): Promise<
  | { ok: true; supabase: any; userId: string; existing: Partial<BrandData> }
  | { ok: false; res: NextResponse }
> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("brand_data")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  // More accurate error handling (optional but good)
  if (error) {
    console.error("Read brand error:", error);
    const status = error.code === "PGRST116" ? 404 : 500; // no rows vs real error
    return {
      ok: false,
      res: NextResponse.json(
        {
          error:
            status === 404 ? "Project not found" : "Failed to read project",
        },
        { status }
      ),
    };
  }

  return {
    ok: true,
    supabase,
    userId: user.id,
    existing: (project?.brand_data ?? {}) as Partial<BrandData>,
  };
}

// POST = strict finalize (requires palette + font)
export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  const auth = await getAuthedSupabaseAndProject(projectId);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const incoming = parseIncoming(body);
  const merged = mergeBrand(auth.existing, incoming);

  if (!merged.palette || !merged.font) {
    return NextResponse.json(
      { error: "Invalid brand data (palette & font required)" },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("projects")
    .update({ brand_data: merged })
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .select("brand_data")
    .single();

  if (error) {
    console.error("Save brand error:", error);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, brand_data: data.brand_data });
}

// PATCH = draft save (partial allowed)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  const auth = await getAuthedSupabaseAndProject(projectId);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const incoming = parseIncoming(body);

  // If user sends palette/font keys but invalid shape, catch it here (optional strictness)
  if (body?.palette && !incoming.palette) {
    return NextResponse.json({ error: "Invalid palette" }, { status: 400 });
  }
  if (body?.font && !incoming.font) {
    return NextResponse.json({ error: "Invalid font" }, { status: 400 });
  }

  const merged = mergeBrand(auth.existing, incoming);

  const { data, error } = await auth.supabase
    .from("projects")
    .update({ brand_data: merged })
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .select("brand_data")
    .single();

  if (error) {
    console.error("Patch brand error:", error);
    return NextResponse.json(
      { error: "Failed to patch brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, brand_data: data.brand_data });
}
