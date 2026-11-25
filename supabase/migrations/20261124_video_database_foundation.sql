-- Stage 1: Video database and security foundation
-- Additive migration only. Existing scholarship tables and integrations are unchanged.

CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT video_categories_name_not_empty CHECK (btrim(name) <> ''),
  CONSTRAINT video_categories_slug_not_empty CHECK (btrim(slug) <> '')
);

CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.video_categories(id) ON DELETE RESTRICT,
  video_storage_path TEXT NOT NULL,
  thumbnail_storage_path TEXT,
  duration INTEGER,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  CONSTRAINT videos_title_not_empty CHECK (btrim(title) <> ''),
  CONSTRAINT videos_slug_not_empty CHECK (btrim(slug) <> ''),
  CONSTRAINT videos_video_storage_path_not_empty CHECK (btrim(video_storage_path) <> ''),
  CONSTRAINT videos_duration_not_negative CHECK (duration IS NULL OR duration >= 0),
  CONSTRAINT videos_file_size_not_negative CHECK (file_size IS NULL OR file_size >= 0)
);

CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON public.videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_status_category ON public.videos(status, category_id);

CREATE OR REPLACE FUNCTION public.set_video_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS videos_set_updated_at ON public.videos;
CREATE TRIGGER videos_set_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.set_video_updated_at();

ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active video categories" ON public.video_categories;
CREATE POLICY "Public read active video categories"
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

DROP POLICY IF EXISTS "Public read published videos, admins read all videos" ON public.videos;
CREATE POLICY "Public read published videos, admins read all videos"
  ON public.videos
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

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

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  false,
  NULL,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails',
  'thumbnails',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read thumbnails" ON storage.objects;
CREATE POLICY "Public read thumbnails"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Authorized admins insert thumbnails" ON storage.objects;
CREATE POLICY "Authorized admins insert thumbnails"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Authorized admins update thumbnails" ON storage.objects;
CREATE POLICY "Authorized admins update thumbnails"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Authorized admins delete thumbnails" ON storage.objects;
CREATE POLICY "Authorized admins delete thumbnails"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Authorized admins manage videos" ON storage.objects;
CREATE POLICY "Authorized admins manage videos"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'videos'
    AND public.is_admin()
  );
