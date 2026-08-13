-- ScholarFind Supabase Production Database Schema
-- Run this script in the Supabase SQL Editor (https://app.supabase.com)

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function to check if current user is an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. SCHOLARSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  country TEXT NOT NULL,
  study_destination TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('Undergraduate', 'Postgraduate', 'Master''s', 'PhD')),
  field_of_study TEXT NOT NULL,
  funding_type TEXT NOT NULL CHECK (funding_type IN ('Fully Funded', 'Partially Funded', 'Tuition Only')),
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  eligible_countries TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  eligibility JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  application_instructions JSONB DEFAULT '[]'::jsonb,
  application_url TEXT NOT NULL,
  source_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Published', 'Draft', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON public.scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_field ON public.scholarships(field_of_study);
CREATE INDEX IF NOT EXISTS idx_scholarships_degree ON public.scholarships(degree_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_funding ON public.scholarships(funding_type);

-- 3. ACADEMIC FIELDS TABLE
CREATE TABLE IF NOT EXISTS public.fields (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT NOT NULL DEFAULT 'ScholarFind',
  contact_email TEXT NOT NULL DEFAULT 'Muhammadfaisalusman00@gmail.com',
  maintenance_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AFFILIATE PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.affiliate_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT,
  destination_url TEXT,
  placement TEXT NOT NULL DEFAULT 'Homepage' CHECK (placement IN ('Homepage', 'Scholarship Details', 'Both')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast status & placement querying
CREATE INDEX IF NOT EXISTS idx_affiliate_promotions_placement ON public.affiliate_promotions(placement, status);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_promotions ENABLE ROW LEVEL SECURITY;

-- Admin Users RLS: Admin can view self
CREATE POLICY "Admins can view own admin status"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Public READ access to Published scholarships (Authorized Admin can read all)
CREATE POLICY "Public read published, Admin read all scholarships"
  ON public.scholarships FOR SELECT
  USING (status = 'Published' OR public.is_admin());

-- Admin FULL access for scholarships
CREATE POLICY "Authorized admin full access to scholarships"
  ON public.scholarships FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Public READ access for fields
CREATE POLICY "Allow public read access to fields"
  ON public.fields FOR SELECT
  USING (true);

-- Admin FULL access for fields
CREATE POLICY "Allow authorized admin write access to fields"
  ON public.fields FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Public READ access for site settings
CREATE POLICY "Allow public read access to settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Admin FULL access for site settings
CREATE POLICY "Allow authorized admin write access to settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Public READ access for active affiliate promotions (Admin can read all)
CREATE POLICY "Public read active affiliate promotions"
  ON public.affiliate_promotions FOR SELECT
  USING (status = 'Active' OR public.is_admin());

-- Admin FULL access for affiliate promotions
CREATE POLICY "Authorized admin full access to affiliate promotions"
  ON public.affiliate_promotions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. STORAGE BUCKET FOR COVER IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('scholarship-covers', 'scholarship-covers', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access on Covers" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'scholarship-covers');

CREATE POLICY "Authorized Admin Upload Access on Covers" 
  ON storage.objects FOR ALL 
  TO authenticated 
  USING (bucket_id = 'scholarship-covers' AND public.is_admin())
  WITH CHECK (bucket_id = 'scholarship-covers' AND public.is_admin());

