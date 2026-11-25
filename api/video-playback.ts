import { createClient } from '@supabase/supabase-js';

const SIGNED_URL_EXPIRY_SECONDS = 300;
const MAX_SLUG_LENGTH = 200;

interface PlaybackRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface PlaybackResponse {
  status: (code: number) => PlaybackResponse;
  setHeader: (name: string, value: string) => PlaybackResponse;
  json: (body: unknown) => void;
}

function jsonError(
  response: PlaybackResponse,
  status: number,
  message: string
): void {
  response
    .setHeader('Cache-Control', 'no-store')
    .status(status)
    .json({ error: message });
}

export default async function handler(
  request: PlaybackRequest,
  response: PlaybackResponse
): Promise<void> {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    jsonError(response, 405, 'Method not allowed');
    return;
  }

  const rawSlug = request.query?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (
    !slug ||
    slug.trim() !== slug ||
    slug.length > MAX_SLUG_LENGTH ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)
  ) {
    jsonError(response, 400, 'Invalid video slug');
    return;
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    jsonError(response, 500, 'Video playback is not configured');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id, status, video_storage_path')
      .eq('slug', slug)
      .maybeSingle();

    if (videoError) {
      jsonError(response, 500, 'Unable to process playback request');
      return;
    }

    if (!video) {
      jsonError(response, 404, 'Video not found');
      return;
    }

    if (video.status !== 'published') {
      jsonError(response, 404, 'Video not found');
      return;
    }

    if (!video.video_storage_path) {
      jsonError(response, 404, 'Video not available');
      return;
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('videos')
      .createSignedUrl(
        video.video_storage_path,
        SIGNED_URL_EXPIRY_SECONDS
      );

    if (signedUrlError || !signedUrlData?.signedUrl) {
      jsonError(response, 500, 'Unable to create playback URL');
      return;
    }

    const expiresAt = new Date(
      Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000
    ).toISOString();

    response
      .setHeader('Cache-Control', 'no-store')
      .status(200)
      .json({
        signedUrl: signedUrlData.signedUrl,
        expiresIn: SIGNED_URL_EXPIRY_SECONDS,
        expiresAt,
      });
  } catch {
    jsonError(response, 500, 'Unable to process playback request');
  }
}
