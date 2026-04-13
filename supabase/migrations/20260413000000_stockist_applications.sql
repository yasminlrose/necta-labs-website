create table if not exists stockist_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_name text not null,
  business_type text not null,
  website text,
  instagram text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  city text,
  postcode text,
  vat_number text,
  monthly_units text,
  why_necta text,
  heard_about text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied'))
);

-- Disable RLS so service role key can read/write freely
alter table stockist_applications disable row level security;
