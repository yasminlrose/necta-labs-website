-- Create wholesale_applications table
CREATE TABLE public.wholesale_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  business_name TEXT NOT NULL,
  venue_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  instagram_handle TEXT,
  website TEXT,
  daily_coffee_sales TEXT NOT NULL,
  products_interested TEXT[] NOT NULL DEFAULT '{}',
  referral_source TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  follow_up_date DATE
);

-- Enable RLS
ALTER TABLE public.wholesale_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form)
CREATE POLICY "Anyone can submit a wholesale application"
  ON public.wholesale_applications
  FOR INSERT
  WITH CHECK (true);