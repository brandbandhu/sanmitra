create table public.user_roles (
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;
grant execute on function public.has_role(uuid, text) to authenticated;
create policy "Users read their own role" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text check (phone is null or char_length(phone) <= 30),
  service_interest text check (service_interest is null or char_length(service_interest) <= 80),
  monthly_bill integer check (monthly_bill is null or monthly_bill between 0 and 100000000),
  message text not null check (char_length(trim(message)) between 1 and 3000),
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);
grant insert on public.contact_requests to anon, authenticated;
grant select, update on public.contact_requests to authenticated;
grant all on public.contact_requests to service_role;
alter table public.contact_requests enable row level security;
create policy "Visitors submit contact requests" on public.contact_requests for insert to anon, authenticated with check (true);
create policy "Admins read contact requests" on public.contact_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update contact requests" on public.contact_requests for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 1 and 100),
  title text not null check (char_length(title) between 1 and 140),
  summary text not null check (char_length(summary) <= 500),
  body text not null default '',
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public read published services" on public.services for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage services" on public.services for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 1 and 100),
  name text not null check (char_length(name) between 1 and 140),
  location text not null default '',
  category text not null default 'Residential' check (category in ('Residential', 'Commercial', 'Industrial')),
  capacity_kw numeric(10,2) check (capacity_kw is null or capacity_kw >= 0),
  description text not null default '',
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Public read published projects" on public.projects for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage projects" on public.projects for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  category text not null default 'Residential',
  image_url text not null,
  alt_text text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
grant all on public.gallery_items to service_role;
alter table public.gallery_items enable row level security;
create policy "Public read published gallery items" on public.gallery_items for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage gallery items" on public.gallery_items for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 1 and 120),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "Public read published blog posts" on public.blog_posts for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage blog posts" on public.blog_posts for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  location text not null default '',
  project_type text not null default '',
  quote text not null check (char_length(quote) between 1 and 2000),
  rating smallint check (rating is null or rating between 1 and 5),
  published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "Public read published testimonials" on public.testimonials for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.site_settings (
  setting_key text primary key check (char_length(setting_key) between 1 and 80),
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public read website settings" on public.site_settings for select to anon, authenticated using (setting_key in ('brand', 'contact', 'homepage', 'social'));
create policy "Admins manage website settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
