// app/dashboard/_types.ts

export type ProjectRow = {
  id: string;
  name: string | null;
  status: string | null;
  thumbnail_url: string | null;
  updated_at: string | null;
};

export type DashboardStats = {
  totalProjects: number;
  publishedSites: number;
  campaignsCreated: number;
};
