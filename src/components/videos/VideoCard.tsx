import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { Video } from '../../types/video';
import { getThumbnailUrl } from '../../services/videoService';

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds < 0) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = Math.floor(seconds % 60);
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
};

const formatViews = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K views`;
  return `${count} ${count === 1 ? 'view' : 'views'}`;
};

export const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  const thumbnail = getThumbnailUrl(video.thumbnail_storage_path);
  const duration = formatDuration(video.duration);

  return (
    <article className="group min-w-0">
      <Link to={`/videos/${video.slug}`} className="block focus:outline-none">
        <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-900">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-500">
              <Play className="h-8 w-8" />
            </div>
          )}
          {duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold text-white">
              {duration}
            </span>
          )}
        </div>
        <div className="pt-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-100 sm:text-base">
            {video.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(video.view_count || 0)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};
