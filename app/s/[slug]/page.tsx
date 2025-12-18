import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createPublicSupabaseClient();

  const { data: project, error: pErr } = await supabase
    .from("projects")
    .select("id, published, brand_data, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (pErr) console.error("PUBLIC SITE: project query error:", pErr);
  if (!project) console.error("PUBLIC SITE: project not found for slug:", slug);
  if (project && !project.published)
    console.error("PUBLIC SITE: project not published:", slug);

  if (!project || !project.published) return notFound();

  const { data: website, error: websiteErr } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", project.id)
    .maybeSingle();

  if (websiteErr)
    console.error("PUBLIC SITE: website query error:", websiteErr);
  if (!website?.data)
    console.error("PUBLIC SITE: website row missing for project:", project.id);

  if (!website?.data) return notFound();

  const theme =
    project.brand_data?.theme ??
    (project.brand_data
      ? {
          primary: project.brand_data.palette?.primary,
          secondary: project.brand_data.palette?.secondary,

          fontFamily: project.brand_data.font?.css,
        }
      : undefined);

  return <WebsiteTemplateBasic data={website.data} theme={theme} />;
}
