// DATABASE TABLE LIST

// profiles
// user_id (uuid, pk) (fk(users.id))
// full_name (text)
// avatar_url (text)
// locale (text)
// plan_tier (text)
// created_at (timestamptz)
// updated_at (timestamptz)

// projects
// id (uuid, pk)
// user_id (uuid)
// project_name (text)
// context (jsonb)
// lang (text)
// status (text)
// thumbnail_url (text)
// created_at (timestamptz)
// updated_at (timestamptz)

// brand_data
// id (uuid, pk)
// project_id (uuid)
// brand_json (jsonb)
// manual_brand_name (boolean)
// brand_source (text)
// created_at (timestamptz)
// updated_at (timestamptz)

// website_data
// id (uuid, pk)
// project_id (uuid)
// layout_type (text)
// website_json (jsonb)
// published_url (text)
// is_published (boolean)
// created_at (timestamptz)
// updated_at (timestamptz)

// marketing_data
// id (uuid, pk)
// project_id (uuid)
// marketing_json (jsonb)
// created_at (timestamptz)
// updated_at (timestamptz)

// ai_cache
// id (uuid, pk)
// project_id (uuid)
// module (text)
// prompt_hash (text)
// response_en (text)
// response_id (text)
// expires_at (timestamptz)
// created_at (timestamptz)

// ai_logs
// id (uuid, pk)
// user_id (uuid)
// project_id (uuid)
// module (text)
// action (text)
// tokens_in (int)
// tokens_out (int)
// cost_usd (numeric)
// status (text)
// created_at (timestamptz)

// usage_limits
// id (uuid, pk)
// user_id (uuid)
// plan_tier (text)
// month_start (date)
// brand_regens_used (int)
// website_regens_used (int)
// marketing_regens_used (int)
// created_at (timestamptz)

// assets
// id (uuid, pk)
// project_id (uuid)
// module (text)
// file_path (text)
// file_type (text)
// size_bytes (bigint)
// created_at (timestamptz)

// domains

// id (uuid, pk)
// project_id (uuid)
// subdomain (text)
// custom_domain (text)
// vercel_deploy_id (text)
// activated_at (timestamptz)

// temporary_sessions
// id (uuid, pk)
// temp_user_token (text)
// context (jsonb)
// expires_at (timestamptz)

// plans
// id (uuid, pk)
// code (text)
// brand_limit (int)
// site_limit (int)
// regen_limit (int)
// marketing_limit (int)
// price_monthly (numeric)
// created_at (timestamptz)

// subscriptions
// id (uuid, pk)
// user_id (uuid)
// plan_id (uuid)
// stripe_sub_id (text)
// status (text)
// current_period_start (timestamptz)
// current_period_end (timestamptz)
// created_at (timestamptz)
