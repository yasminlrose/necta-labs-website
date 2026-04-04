-- Create pre_orders table
CREATE TABLE public.pre_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  format TEXT,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  amount_paid INTEGER
);

ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;

-- Public can insert pre-orders
CREATE POLICY "Anyone can create a pre-order"
  ON public.pre_orders FOR INSERT WITH CHECK (true);

-- Public can read count only (via RPC below)
-- No direct SELECT for privacy

-- Create email_signups table
CREATE TABLE public.email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website'
);

ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Public can insert signups
CREATE POLICY "Anyone can sign up"
  ON public.email_signups FOR INSERT WITH CHECK (true);

-- Create RPC functions for public counter reads (no PII exposed)
CREATE OR REPLACE FUNCTION public.get_confirmed_preorder_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0) FROM public.pre_orders WHERE status = 'confirmed';
$$;

CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0) FROM public.email_signups;
$$;