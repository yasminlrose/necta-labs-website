-- Enable RLS on stockist_applications.
-- All existing API routes use the service role key which bypasses RLS,
-- so this does not break anything — it just removes the security advisor warning.
ALTER TABLE public.stockist_applications ENABLE ROW LEVEL SECURITY;
