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
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
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
    .eq("id", projectId) // ⬅️ use the unwrapped value
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

  return NextResponse.json(data);
}
