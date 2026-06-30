import { supabase } from "@/integrations/supabase/client";

export async function getDashboardStats() {
  const [
    transformations,
    videos,
    services,
    locations,
    recentUploads,
  ] = await Promise.all([
    supabase.from("transformations").select("id", { count: "exact", head: true }),
    supabase.from("videos").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("locations").select("id", { count: "exact", head: true }),
supabase
  .from("media_library")
  .select("id, filename, url, category, created_at")
  .order("created_at", { ascending: false })
  .limit(6),
  ]);

  return {
    transformations: transformations.count ?? 0,
    videos: videos.count ?? 0,
    services: services.count ?? 0,
    locations: locations.count ?? 0,
    recentActivity: [],
    recentUploads: recentUploads.data ?? [],
  };
}