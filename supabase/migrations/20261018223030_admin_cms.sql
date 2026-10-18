-- Admin content and configuration schema. All administrative writes are made by
-- the Vercel server functions after verified Supabase Auth MFA and role checks.

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  provisioned_at timestamptz not null default now()
);

create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug not in ('admin','api','sitemap','robots')),
  title text not null check (char_length(title) between 1 and 180),
  body text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 500),
  answer text not null check (char_length(answer) between 1 and 8000),
  category text check (category is null or char_length(category) <= 80),
  display_order integer not null default 0 check (display_order >= 0),
  status text not null default 'draft' check (status in ('draft','published')),
  anchor text unique check (anchor is null or anchor ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index faq_public_order_idx on public.faq_items(status, display_order, created_at);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('page','faq')),
  entity_id uuid not null,
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index content_revisions_entity_idx on public.content_revisions(entity_type, entity_id, created_at desc);

create table public.site_settings (
  key text primary key check (key in ('site_name','contact_email','footer_text','maintenance_notice','sitemap_last_generated_at')),
  value text not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.seo_settings (
  singleton boolean primary key default true check (singleton),
  title text not null default 'Rooftop Drive — Electric Escape' check (char_length(title) <= 70),
  description text not null default 'A cinematic endless rooftop driving game.' check (char_length(description) <= 180),
  canonical_base_url text,
  og_title text not null default '' check (char_length(og_title) <= 70),
  og_description text not null default '' check (char_length(og_description) <= 200),
  og_image text,
  noindex boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.ad_settings (
  singleton boolean primary key default true check (singleton),
  enabled boolean not null default false,
  publisher_id text check (publisher_id is null or publisher_id ~ '^ca-pub-[0-9]{16}$'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.ad_placements (
  placement text primary key check (placement in ('above_game','below_game','between_sections','near_footer')),
  name text not null check (char_length(name) between 1 and 80),
  slot_id text check (slot_id is null or slot_id ~ '^[0-9]{6,20}$'),
  enabled boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Only provider identifiers and non-executable settings are stored here.
-- This schema has no arbitrary source-code/script-body field by design.
create table public.script_integrations (
  integration text primary key check (integration in ('google_adsense','google_site_verification')),
  purpose text not null,
  placement text not null check (placement in ('head','body_end')),
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  environment text not null default 'preview' check (environment in ('preview','production')),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.script_revisions (
  id uuid primary key default gen_random_uuid(),
  integration text not null check (integration in ('google_adsense','google_site_verification')),
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index script_revisions_integration_idx on public.script_revisions(integration, created_at desc);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  event_type text not null check (char_length(event_type) <= 100),
  target text check (target is null or char_length(target) <= 240),
  result text not null default 'success' check (result in ('success','warning','failure')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs(created_at desc);
create index audit_logs_type_created_idx on public.audit_logs(event_type, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.touch_updated_at() from public, anon, authenticated;

create trigger site_content_touch_updated_at before update on public.site_content for each row execute function public.touch_updated_at();
create trigger faq_items_touch_updated_at before update on public.faq_items for each row execute function public.touch_updated_at();
create trigger site_settings_touch_updated_at before update on public.site_settings for each row execute function public.touch_updated_at();
create trigger seo_settings_touch_updated_at before update on public.seo_settings for each row execute function public.touch_updated_at();
create trigger ad_settings_touch_updated_at before update on public.ad_settings for each row execute function public.touch_updated_at();
create trigger ad_placements_touch_updated_at before update on public.ad_placements for each row execute function public.touch_updated_at();
create trigger script_integrations_touch_updated_at before update on public.script_integrations for each row execute function public.touch_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.faq_items enable row level security;
alter table public.content_revisions enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.ad_settings enable row level security;
alter table public.ad_placements enable row level security;
alter table public.script_integrations enable row level security;
alter table public.script_revisions enable row level security;
alter table public.audit_logs enable row level security;

revoke all on public.admin_profiles, public.site_content, public.faq_items, public.content_revisions,
  public.site_settings, public.seo_settings, public.ad_settings, public.ad_placements,
  public.script_integrations, public.script_revisions, public.audit_logs from anon, authenticated;
grant all on public.admin_profiles, public.site_content, public.faq_items, public.content_revisions,
  public.site_settings, public.seo_settings, public.ad_settings, public.ad_placements,
  public.script_integrations, public.script_revisions, public.audit_logs to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Anonymous reads are limited to published public content/config. No public write grants.
-- Column grants also keep internal actor IDs, admin timestamps, and provider metadata
-- out of direct Data API reads, even when a caller asks for select=*.
grant select (id, slug, title, body, status, updated_at) on public.site_content to anon, authenticated;
grant select (id, question, answer, category, display_order, status, anchor) on public.faq_items to anon, authenticated;
grant select (singleton, title, description, canonical_base_url, og_title, og_description, og_image, noindex) on public.seo_settings to anon, authenticated;
grant select (singleton, enabled, publisher_id) on public.ad_settings to anon, authenticated;
grant select (placement, name, slot_id, enabled) on public.ad_placements to anon, authenticated;
grant select (integration, config, enabled, environment) on public.script_integrations to anon, authenticated;

create policy published_site_content_read on public.site_content for select to anon, authenticated using (status = 'published');
create policy published_faq_read on public.faq_items for select to anon, authenticated using (status = 'published');
create policy public_seo_read on public.seo_settings for select to anon, authenticated using (singleton = true);
create policy enabled_ads_read on public.ad_settings for select to anon, authenticated using (singleton = true and enabled = true);
create policy enabled_ad_placements_read on public.ad_placements for select to anon, authenticated using (enabled = true);
create policy enabled_production_integration_read on public.script_integrations for select to anon, authenticated
  using (enabled = true and environment = 'production' and integration in ('google_site_verification','google_adsense'));

insert into public.seo_settings(singleton, noindex) values (true, true) on conflict (singleton) do nothing;
insert into public.ad_settings(singleton, enabled) values (true, false) on conflict (singleton) do nothing;
