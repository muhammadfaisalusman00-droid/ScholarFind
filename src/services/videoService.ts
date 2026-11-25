import { supabase } from '../lib/supabase';
import { Video, VideoCategory } from '../types/video';

export const getThumbnailUrl = (path: string | null): string | null => {
  if (!path || !supabase) return null;
  return supabase.storage.from('thumbnails').getPublicUrl(path).data.publicUrl;
};

export const videoService = {
  async getPublishedVideos(offset = 0, limit = 1000): Promise<Video[]> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('videos')
      .select('*, video_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + Math.max(0, limit - 1));

    if (error) throw new Error(error.message);
    return (data || []) as Video[];
  },

  async getVideoBySlug(slug: string): Promise<Video | null> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('videos')
      .select('*, video_categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Video | null;
  },

  async getRelatedVideos(video: Video, limit = 8): Promise<Video[]> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('videos')
      .select('*, video_categories(*)')
      .eq('status', 'published')
      .eq('category_id', video.category_id)
      .neq('id', video.id)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data || []) as Video[];
  },

  async getPlaybackUrl(slug: string): Promise<{ signedUrl: string; expiresIn: number; expiresAt: string }> {
    const response = await fetch(`/api/video-playback?slug=${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    const body = await response.json().catch(() => null) as
      | { signedUrl?: string; expiresIn?: number; expiresAt?: string; error?: string }
      | null;

    if (!response.ok || !body?.signedUrl) {
      throw new Error(body?.error || 'Unable to start video playback.');
    }

    return {
      signedUrl: body.signedUrl,
      expiresIn: body.expiresIn || 300,
      expiresAt: body.expiresAt || '',
    };
  },

  async recordAnonymousView(
    videoId: string,
    sessionId: string
  ): Promise<{ error: unknown } | null> {
    if (!supabase) return null;

    const { error } = await supabase.rpc('record_video_view', {
      p_video_id: videoId,
      p_anonymous_session_id: sessionId,
    });

    return error ? { error } : null;
  },

  async getCategories(): Promise<VideoCategory[]> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('video_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as VideoCategory[];
  },
};
