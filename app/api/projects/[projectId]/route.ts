// app/api/projects/[projectId]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function PATCH(req: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));

  const updates: { name?: string; status?: string } = {};
  if (typeof body.name === "string") updates.name = body.name;
  if (typeof body.status === "string") updates.status = body.status;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .eq("user_id", user.id)
    .select("id, name, status, thumbnail_url, updated_at")
    .single();

  if (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }

  // IMPORTANT: match your frontend expectation: { project: ... }
  return NextResponse.json({ project: data });
}

export async function GET(req: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, name, status, description, brand_data, thumbnail_url, updated_at"
    )
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  // If you want simple behavior, keep your 404:
  if (error || !data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    console.error("DELETE projects error:", error);
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
