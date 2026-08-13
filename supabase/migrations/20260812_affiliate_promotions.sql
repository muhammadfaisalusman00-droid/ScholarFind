-- Migration: Add Affiliate Promotions table and RLS policies
-- Execute this script in your Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS public.affiliate_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT,
  destination_url TEXT,
  placement TEXT NOT NULL DEFAULT 'Homepage' CHECK (placement IN ('Homepage', 'Scholarship Details', 'Both')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast status & placement querying
CREATE INDEX IF NOT EXISTS idx_affiliate_promotions_placement ON public.affiliate_promotions(placement, status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.affiliate_promotions ENABLE ROW LEVEL SECURITY;

-- Public SELECT policy (allows public to read Active promotions, and admins to read all)
CREATE POLICY "Public read active affiliate promotions"
  ON public.affiliate_promotions FOR SELECT
  USING (status = 'Active' OR public.is_admin());

-- Authorized Admin full-access policy
CREATE POLICY "Authorized admin full access to affiliate promotions"
  ON public.affiliate_promotions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
