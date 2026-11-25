import React, { useEffect, useRef, useState } from 'react';
import { VideoCard } from '../components/videos/VideoCard';
import { AdsterraSlot } from '../components/ads/AdsterraSlot';
import { Video } from '../types/video';
import { videoService } from '../services/videoService';

const PAGE_SIZE = 24;

export const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);

  const loadMore = async (initial = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (initial) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await videoService.getPublishedVideos(offsetRef.current, PAGE_SIZE);
      setVideos((current) => {
        const existingIds = new Set(current.map((video) => video.id));
        return [...current, ...data.filter((video) => !existingIds.has(video.id))];
      });
      offsetRef.current += data.length;
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load videos.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadMore(true);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore(false);
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, videos.length]);

  return (
    <main className="min-h-screen bg-black pb-10">
      <AdsterraSlot format="native" className="mx-auto w-full max-w-[1536px] px-3 pt-3 sm:px-5 lg:px-8" />

      <div className="mx-auto w-full max-w-[1536px] px-3 py-5 sm:px-5 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video rounded-md bg-neutral-900" />
                <div className="mt-2 h-4 w-4/5 rounded bg-neutral-900" />
              </div>
            ))}
          </div>
        ) : error && videos.length === 0 ? (
          <div className="rounded-md border border-neutral-800 py-16 text-center">
            <p className="font-bold text-neutral-100">Unable to load videos</p>
            <p className="mt-1 text-sm text-neutral-500">{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-md border border-neutral-800 py-16 text-center">
            <p className="font-bold text-neutral-100">No published videos</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {videos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
            {loadingMore && <div className="py-8 text-center text-sm text-neutral-500">Loading more videos...</div>}
            {!hasMore && <div className="py-8 text-center text-sm text-neutral-600">You have reached the end</div>}
            {error && <div className="py-4 text-center text-sm text-red-500">{error}</div>}
          </>
        )}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>
    </main>
  );
};
