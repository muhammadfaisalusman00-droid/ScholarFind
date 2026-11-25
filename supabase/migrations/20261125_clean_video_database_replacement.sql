-- Stage 1 replacement plan: clean video database
-- DO NOT execute until the backup and dependency review below are approved.
-- This migration is intentionally destructive after transaction-level SQL backups.
-- It removes ScholarFind infrastructure and preserves admin_users / auth.users.

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. SQL DATA BACKUPS
-- -----------------------------------------------------------------------------
-- Never overwrite an existing verified backup. The static backup names make
-- reruns fail explicitly instead of silently replacing prior evidence.
DO $$
BEGIN
  IF to_regclass('public.__backup_scholarships_20261125') IS NOT NULL
     OR to_regclass('public.__backup_fields_20261125') IS NOT NULL
     OR to_regclass('public.__backup_affiliate_promotions_20261125') IS NOT NULL
     OR to_regclass('public.__backup_site_settings_20261125') IS NOT NULL
  THEN
    RAISE EXCEPTION 'Migration stopped: a video-platform replacement backup already exists. Review and preserve it before rerunning.';
  END IF;
END;
$$;

CREATE TABLE public.__backup_scholarships_20261125
AS TABLE public.scholarships;

CREATE TABLE public.__backup_fields_20261125
AS TABLE public.fields;

CREATE TABLE public.__backup_affiliate_promotions_20261125
AS TABLE public.affiliate_promotions;

CREATE TABLE public.__backup_site_settings_20261125
AS TABLE public.site_settings;

ALTER TABLE public.__backup_scholarships_20261125 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.__backup_fields_20261125 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.__backup_affiliate_promotions_20261125 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.__backup_site_settings_20261125 ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.__backup_scholarships_20261125 FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.__backup_fields_20261125 FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.__backup_affiliate_promotions_20261125 FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.__backup_site_settings_20261125 FROM PUBLIC, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. DEPENDENCY PREFLIGHT
-- -----------------------------------------------------------------------------
-- Refuse to perform the drop silently if any live constraint still depends on
-- the scholarship tables. This catches unexpected application/FK dependencies.
DO $$
DECLARE
  unexpected_dependencies TEXT;
BEGIN
  SELECT string_agg(
           format('%I.%I -> %I.%I', referencing_ns.nspname, referencing.relname,
                  referenced_ns.nspname, referenced.relname),
           ', '
         )
  INTO unexpected_dependencies
  FROM pg_constraint constraint_definition
  JOIN pg_class referencing
    ON referencing.oid = constraint_definition.conrelid
  JOIN pg_namespace referencing_ns
    ON referencing_ns.oid = referencing.relnamespace
  JOIN pg_class referenced
    ON referenced.oid = constraint_definition.confrelid
  JOIN pg_namespace referenced_ns
    ON referenced_ns.oid = referenced.relnamespace
  WHERE constraint_definition.contype = 'f'
    AND referenced_ns.nspname = 'public'
    AND referenced.relname IN ('scholarships', 'fields', 'affiliate_promotions', 'site_settings');

  IF unexpected_dependencies IS NOT NULL THEN
    RAISE EXCEPTION 'Replacement blocked by foreign-key dependencies: %', unexpected_dependencies;
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. REMOVE SCHOLARSHIP-SPECIFIC POLICIES AND STORAGE POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read published, Admin read all scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Authorized admin full access to scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Allow public read access to fields" ON public.fields;
DROP POLICY IF EXISTS "Allow authorized admin write access to fields" ON public.fields;
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authorized admin write access to settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read active affiliate promotions" ON public.affiliate_promotions;
DROP POLICY IF EXISTS "Authorized admin full access to affiliate promotions" ON public.affiliate_promotions;
DROP POLICY IF EXISTS "Public Read Access on Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authorized Admin Upload Access on Covers" ON storage.objects;

-- -----------------------------------------------------------------------------
-- 4. REMOVE SCHOLARSHIP-SPECIFIC DATABASE OBJECTS
-- -----------------------------------------------------------------------------
-- Drops are intentionally without CASCADE. The preflight catches live FK edges,
-- and this statement will abort the whole transaction for unknown dependencies.
DROP TABLE public.scholarships;
DROP TABLE public.fields;
DROP TABLE public.affiliate_promotions;
DROP TABLE public.site_settings;

-- -----------------------------------------------------------------------------
-- 5. PRESERVE AND HARDEN ADMIN AUTHORIZATION
-- -----------------------------------------------------------------------------
-- admin_users is intentionally not dropped. It retains existing Auth user IDs,
-- emails, roles, and administrator accounts.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own admin status" ON public.admin_users;
CREATE POLICY "Admins can view own admin status"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. CREATE VIDEO CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT video_categories_name_not_empty CHECK (btrim(name) <> ''),
  CONSTRAINT video_categories_slug_not_empty CHECK (btrim(slug) <> '')
);

ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;

-- Remove policies created by the November 24 foundation migration before
-- creating the final policy set.
DROP POLICY IF EXISTS "Public read active video categories" ON public.video_categories;
DROP POLICY IF EXISTS "Authorized admins manage video categories" ON public.video_categories;

DROP POLICY IF EXISTS "Public read video categories" ON public.video_categories;
CREATE POLICY "Public read video categories"
  ON public.video_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authorized admins manage video categories" ON public.video_categories;
CREATE POLICY "Authorized admins manage video categories"
  ON public.video_categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. CREATE CLEAN VIDEOS TABLE
-- -----------------------------------------------------------------------------
-- If Stage 1 already created this table, convert it into the exact replacement
-- shape before enabling RLS.
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  video_storage_path TEXT NOT NULL,
  thumbnail_storage_path TEXT,
  category_id UUID NOT NULL REFERENCES public.video_categories(id) ON DELETE RESTRICT,
  duration INTEGER,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'draft',
  view_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  CONSTRAINT videos_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT videos_title_not_empty CHECK (btrim(title) <> ''),
  CONSTRAINT videos_slug_not_empty CHECK (btrim(slug) <> ''),
  CONSTRAINT videos_video_storage_path_not_empty CHECK (btrim(video_storage_path) <> ''),
  CONSTRAINT videos_duration_not_negative CHECK (duration IS NULL OR duration >= 0),
  CONSTRAINT videos_file_size_not_negative CHECK (file_size IS NULL OR file_size >= 0),
  CONSTRAINT videos_view_count_not_negative CHECK (view_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON public.videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_status_category ON public.videos(status, category_id);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Remove policies created by the November 24 foundation migration before
-- creating the final public/admin policy set.
DROP POLICY IF EXISTS "Public read published videos, admins read all videos" ON public.videos;
DROP POLICY IF EXISTS "Authorized admins insert videos" ON public.videos;
DROP POLICY IF EXISTS "Authorized admins update videos" ON public.videos;
DROP POLICY IF EXISTS "Authorized admins delete videos" ON public.videos;

DROP POLICY IF EXISTS "Public read published videos" ON public.videos;
CREATE POLICY "Public read published videos"
  ON public.videos
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins read all videos" ON public.videos;
CREATE POLICY "Admins read all videos"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Authorized admins insert videos" ON public.videos;
CREATE POLICY "Authorized admins insert videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authorized admins update videos" ON public.videos;
CREATE POLICY "Authorized admins update videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authorized admins delete videos" ON public.videos;
CREATE POLICY "Authorized admins delete videos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Keep exactly one updated_at trigger. Remove the foundation trigger/function
-- before creating the replacement trigger.
DROP TRIGGER IF EXISTS videos_set_updated_at ON public.videos;
DROP FUNCTION IF EXISTS public.set_video_updated_at();

-- Keep updated_at and published_at consistent.
CREATE OR REPLACE FUNCTION public.set_video_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();

  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS videos_set_timestamps ON public.videos;
CREATE TRIGGER videos_set_timestamps
BEFORE INSERT OR UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.set_video_timestamps();

-- -----------------------------------------------------------------------------
-- 8. CREATE VIDEO VIEWS AND VIEW-COUNT PROTECTION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  anonymous_session_id_hash TEXT,
  deduplication_window_start TIMESTAMPTZ
);

ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authorized admins read video views" ON public.video_views;
CREATE POLICY "Authorized admins read video views"
  ON public.video_views
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON public.video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON public.video_views(video_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_views_session
  ON public.video_views(video_id, anonymous_session_id_hash, viewed_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_video_views_session_window
  ON public.video_views(video_id, anonymous_session_id_hash, deduplication_window_start)
  WHERE anonymous_session_id_hash IS NOT NULL AND deduplication_window_start IS NOT NULL;

-- Admin updates/deletes are intentionally blocked. Only the SECURITY DEFINER
-- function below can insert and increment a published video's counter.
CREATE OR REPLACE FUNCTION public.prevent_direct_video_view_count_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.view_count IS DISTINCT FROM OLD.view_count
     AND COALESCE(current_setting('app.allow_video_view_count_update', true), '') <> 'on'
  THEN
    RAISE EXCEPTION 'view_count can only be changed through public.record_video_view';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_direct_video_view_count_update ON public.videos;
CREATE TRIGGER prevent_direct_video_view_count_update
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.prevent_direct_video_view_count_update();

CREATE OR REPLACE FUNCTION public.record_video_view(
  p_video_id UUID,
  p_anonymous_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_hash TEXT;
  published_video_exists BOOLEAN;
  view_window_start TIMESTAMPTZ;
BEGIN
  IF p_anonymous_session_id IS NULL
     OR char_length(p_anonymous_session_id) < 16
     OR char_length(p_anonymous_session_id) > 128
  THEN
    RETURN FALSE;
  END IF;

  session_hash := md5(p_anonymous_session_id);

  SELECT EXISTS (
    SELECT 1
    FROM public.videos
    WHERE id = p_video_id
      AND status = 'published'
  ) INTO published_video_exists;

  IF NOT published_video_exists THEN
    RETURN FALSE;
  END IF;

  -- Fixed 24-hour window: every browser session can add at most one view to
  -- a given video in each window.
  view_window_start := to_timestamp(
    floor(extract(epoch FROM now()) / 86400) * 86400
  );

  INSERT INTO public.video_views (
    video_id,
    viewed_at,
    anonymous_session_id_hash,
    deduplication_window_start
  ) VALUES (
    p_video_id,
    now(),
    session_hash,
    view_window_start
  )
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  PERFORM set_config('app.allow_video_view_count_update', 'on', true);

  UPDATE public.videos
  SET view_count = view_count + 1
  WHERE id = p_video_id
    AND status = 'published';

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.record_video_view(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_video_view(UUID, TEXT) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 9. CREATE NEW SITE SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_key_not_empty CHECK (btrim(setting_key) <> '')
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read public site settings" ON public.site_settings;
CREATE POLICY "Public read public site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (setting_key IN ('site_name', 'tagline', 'contact_email'));

DROP POLICY IF EXISTS "Authorized admins manage site settings" ON public.site_settings;
CREATE POLICY "Authorized admins manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_site_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_set_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_set_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_site_settings_updated_at();

-- -----------------------------------------------------------------------------
-- 10. STORAGE BUCKETS AND POLICIES
-- -----------------------------------------------------------------------------
-- Scholarship-specific Storage cleanup is deliberately excluded. The existing
-- scholarship-covers bucket and every object in it remain untouched and pending
-- manual cleanup only after external backup verification.
DROP POLICY IF EXISTS "Public read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authorized admins insert thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authorized admins update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authorized admins delete thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authorized admins manage videos" ON storage.objects;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  false,
  NULL,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET
  public = false,
  file_size_limit = NULL,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails',
  'thumbnails',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read thumbnails"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authorized admins insert thumbnails"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails' AND public.is_admin());

CREATE POLICY "Authorized admins update thumbnails"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND public.is_admin())
  WITH CHECK (bucket_id = 'thumbnails' AND public.is_admin());

CREATE POLICY "Authorized admins delete thumbnails"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND public.is_admin());

-- The videos bucket intentionally has NO public Storage SELECT policy.
-- Playback will require a server-side Edge Function that verifies published
-- status and creates a short-lived signed URL using the Supabase service role.
CREATE POLICY "Authorized admins manage videos"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'videos' AND public.is_admin())
  WITH CHECK (bucket_id = 'videos' AND public.is_admin());

COMMIT;
