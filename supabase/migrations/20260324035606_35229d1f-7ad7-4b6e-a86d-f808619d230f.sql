-- Create product_reviews table
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  product text NOT NULL,
  reviewer_name text NOT NULL,
  reviewer_initial text NOT NULL,
  rating integer NOT NULL,
  review_text text NOT NULL,
  verified_purchase boolean NOT NULL DEFAULT false,
  helpful_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'
);

-- RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON public.product_reviews FOR SELECT
  TO public
  USING (status = 'approved');

-- Anyone can submit a review
CREATE POLICY "Anyone can submit a review"
  ON public.product_reviews FOR INSERT
  TO public
  WITH CHECK (true);

-- Function to increment helpful count
CREATE OR REPLACE FUNCTION public.increment_helpful_count(review_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.product_reviews SET helpful_count = helpful_count + 1 WHERE id = review_id AND status = 'approved';
$$;