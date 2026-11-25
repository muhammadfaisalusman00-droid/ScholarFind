export type VideoStatus = 'draft' | 'published' | 'archived';

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_storage_path: string;
  thumbnail_storage_path: string | null;
  category_id: string;
  duration: number | null;
  file_size: number | null;
  status: VideoStatus;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  video_categories?: VideoCategory | null;
}
