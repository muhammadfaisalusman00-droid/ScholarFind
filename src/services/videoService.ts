import { supabase } from '../lib/supabase';
import { Video, VideoCategory } from '../types/video';

export const getThumbnailUrl = (path: string | null): string | null => {
  if (!path || !supabase) return null;
  return supabase.storage.from('thumbnails').getPublicUrl(path).data.publicUrl;
};

const slugify = (value: string): string => {
  const slug = value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'video';
};

const generateVideoId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getSafeExtension = (file: File): string => {
  const nameExtension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';
  if (nameExtension && /^[a-z0-9]{2,5}$/.test(nameExtension)) return nameExtension;
  if (file.type === 'video/mp4') return 'mp4';
  if (file.type === 'video/webm') return 'webm';
  if (file.type === 'video/ogg') return 'ogg';
  if (file.type === 'video/quicktime') return 'mov';
  return 'mp4';
};

export interface PreparedVideo {
  duration: number;
  fileSize: number;
  thumbnail: Blob;
}

export const prepareVideo = (file: File): Promise<PreparedVideo> => {
  const allowedTypes = new Set([
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
  ]);

  if (!allowedTypes.has(file.type)) {
    return Promise.reject(new Error('Please select an MP4, WebM, OGG, or MOV video file.'));
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const element = document.createElement('video');
    element.preload = 'metadata';
    element.muted = true;
    element.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      element.removeAttribute('src');
      element.load();
    };

    element.onerror = () => {
      cleanup();
      reject(new Error('The selected video could not be read.'));
    };

    element.onloadedmetadata = () => {
      if (!Number.isFinite(element.duration) || element.duration <= 0) {
        cleanup();
        reject(new Error('The video duration could not be detected.'));
        return;
      }

      const targetTime = Math.min(Math.max(element.duration * 0.1, 1), Math.max(element.duration - 0.1, 1));
      element.currentTime = targetTime;
    };

    element.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxWidth = 1280;
        const scale = Math.min(1, maxWidth / element.videoWidth);
        canvas.width = Math.max(1, Math.round(element.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(element.videoHeight * scale));

        const context = canvas.getContext('2d');
        if (!context) {
          cleanup();
          reject(new Error('Thumbnail generation is not supported by this browser.'));
          return;
        }

        context.drawImage(element, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            cleanup();
            reject(new Error('The thumbnail could not be generated.'));
            return;
          }

          resolve({
            duration: Math.round(element.duration),
            fileSize: file.size,
            thumbnail: blob,
          });
          cleanup();
        }, 'image/jpeg', 0.85);
      } catch {
        cleanup();
        reject(new Error('The thumbnail could not be generated.'));
      }
    };

    element.src = objectUrl;
  });
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

  async getAdminVideos(): Promise<Video[]> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('videos')
      .select('*, video_categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as Video[];
  },

  async ensureUncategorizedCategory(): Promise<VideoCategory> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data: existing, error: existingError } = await supabase
      .from('video_categories')
      .select('*')
      .eq('slug', 'uncategorized')
      .maybeSingle();

    if (existingError) throw new Error(existingError.message);
    if (existing) return existing as VideoCategory;

    const { data: created, error: createError } = await supabase
      .from('video_categories')
      .insert([{ name: 'Uncategorized', slug: 'uncategorized', description: null }])
      .select('*')
      .single();

    if (createError) throw new Error(createError.message);
    return created as VideoCategory;
  },

  async generateUniqueSlug(caption: string): Promise<string> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const base = slugify(caption);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
      const { data, error } = await supabase
        .from('videos')
        .select('id')
        .eq('slug', candidate)
        .limit(1);

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return candidate;
    }

    return `${base}-${generateVideoId()}`;
  },

  async uploadVideo(
    file: File,
    caption: string,
    prepared: PreparedVideo,
    onStage: (stage: string) => void
  ): Promise<Video> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const category = await this.ensureUncategorizedCategory();
    const slug = await this.generateUniqueSlug(caption);
    const videoId = generateVideoId();
    const extension = getSafeExtension(file);
    const videoPath = `videos/${slug}-${videoId}.${extension}`;
    const thumbnailPath = `thumbnails/${slug}-${videoId}.jpg`;

    onStage('Uploading video');
    const { error: videoUploadError } = await supabase.storage
      .from('videos')
      .upload(videoPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'video/mp4',
      });

    if (videoUploadError) throw new Error(videoUploadError.message);

    onStage('Generating and uploading thumbnail');
    const { error: thumbnailUploadError } = await supabase.storage
      .from('thumbnails')
      .upload(thumbnailPath, prepared.thumbnail, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (thumbnailUploadError) {
      await supabase.storage.from('videos').remove([videoPath]);
      throw new Error(thumbnailUploadError.message);
    }

    onStage('Publishing video');
    const now = new Date().toISOString();
    const { data: created, error: insertError } = await supabase
      .from('videos')
      .insert([{
        title: caption.trim(),
        slug,
        description: caption.trim(),
        category_id: category.id,
        video_storage_path: videoPath,
        thumbnail_storage_path: thumbnailPath,
        duration: prepared.duration,
        file_size: prepared.fileSize,
        status: 'published',
        view_count: 0,
        published_at: now,
      }])
      .select('*, video_categories(*)')
      .single();

    if (insertError) {
      await supabase.storage.from('videos').remove([videoPath]);
      await supabase.storage.from('thumbnails').remove([thumbnailPath]);
      throw new Error(insertError.message);
    }

    onStage('Complete');
    return created as Video;
  },

  async updateVideoCaption(video: Video, caption: string): Promise<Video> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const trimmed = caption.trim();
    if (!trimmed) throw new Error('Caption is required.');

    const updates: Record<string, unknown> = {
      title: trimmed,
      description: trimmed,
      updated_at: new Date().toISOString(),
    };

    if (trimmed !== video.title) {
      updates.slug = await this.generateUniqueSlug(trimmed);
    }

    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', video.id)
      .select('*, video_categories(*)')
      .single();

    if (error) throw new Error(error.message);
    return data as Video;
  },

  async setVideoPublished(videoId: string, published: boolean): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase
      .from('videos')
      .update({
        status: published ? 'published' : 'archived',
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    if (error) throw new Error(error.message);
  },

  async deleteVideo(video: Video): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured.');

    const objectPaths: string[] = [];
    if (video.thumbnail_storage_path) objectPaths.push(video.thumbnail_storage_path);

    if (objectPaths.length > 0) {
      const { error } = await supabase.storage.from('thumbnails').remove(objectPaths);
      if (error) throw new Error(error.message);
    }

    const { error: videoRemoveError } = await supabase.storage
      .from('videos')
      .remove([video.video_storage_path]);

    if (videoRemoveError) throw new Error(videoRemoveError.message);

    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', video.id);

    if (deleteError) throw new Error(deleteError.message);
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
