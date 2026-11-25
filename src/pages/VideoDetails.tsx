import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Clock3, Eye, Share2 } from 'lucide-react';
import { VideoCard } from '../components/videos/VideoCard';
import { AdsterraSlot } from '../components/ads/AdsterraSlot';
import { Video } from '../types/video';
import { videoService } from '../services/videoService';

const ANONYMOUS_SESSION_KEY = 'v_public_session_id';

const getAnonymousSessionId = (): string => {
  try {
    const existing = localStorage.getItem(ANONYMOUS_SESSION_KEY);
    if (existing) return existing;

    const generated = crypto.randomUUID();
    localStorage.setItem(ANONYMOUS_SESSION_KEY, generated);
    return generated;
  } catch {
    return crypto.randomUUID();
  }
};

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

export const VideoDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playbackLoading, setPlaybackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setPlaybackLoading(true);
      setError(null);
      setNotFound(false);
      setVideo(null);
      setPlaybackUrl(null);

      try {
        const selectedVideo = await videoService.getVideoBySlug(slug);
        if (cancelled) return;

        if (!selectedVideo) {
          setNotFound(true);
          setLoading(false);
          setPlaybackLoading(false);
          return;
        }

        setVideo(selectedVideo);
        setLoading(false);

        const [related, playback] = await Promise.allSettled([
          videoService.getRelatedVideos(selectedVideo),
          videoService.getPlaybackUrl(selectedVideo.slug),
        ]);

        if (cancelled) return;

        if (related.status === 'fulfilled') setRelatedVideos(related.value);
        if (playback.status === 'fulfilled') {
          setPlaybackUrl(playback.value.signedUrl);
        } else {
          setError(playback.reason instanceof Error ? playback.reason.message : 'Unable to start playback.');
        }
        setPlaybackLoading(false);

        const sessionId = getAnonymousSessionId();
        const viewResult = await videoService.recordAnonymousView(selectedVideo.id, sessionId);
        if (viewResult?.error) {
          console.warn('View tracking was not recorded');
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load this video.');
        setLoading(false);
        setPlaybackLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const shareVideo = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1536px] animate-pulse">
          <div className="aspect-video rounded-lg bg-neutral-200" />
          <div className="mt-5 h-8 w-2/3 rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-1/2 rounded bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[60vh] bg-neutral-50 px-4 py-16 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-neutral-500">Unavailable</p>
        <h1 className="mt-2 text-3xl font-black text-white">Video not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This video may be unpublished or unavailable.</p>
        <Link to="/videos" className="mt-6 inline-flex rounded-lg bg-neutral-950 px-5 py-3 text-sm font-bold text-white">Browse videos</Link>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-[60vh] bg-black px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-white">Unable to load video</h1>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  const duration = formatDuration(video.duration);

  return (
    <div className="min-h-screen bg-black pb-16">
      <div className="mx-auto w-full max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <div className="overflow-hidden rounded-lg bg-black">
              {playbackLoading ? (
                <div className="flex aspect-video items-center justify-center bg-neutral-900 text-sm text-neutral-400">Loading player...</div>
              ) : playbackUrl ? (
                <video
                  key={playbackUrl}
                  src={playbackUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                >
                  Your browser does not support HTML video playback.
                </video>
              ) : (
                <div className="flex aspect-video items-center justify-center px-6 text-center">
                  <div>
                    <p className="font-bold text-white">Playback unavailable</p>
                    {error && <p className="mt-1 text-sm text-neutral-400">{error}</p>}
                  </div>
                </div>
              )}
            </div>

            <AdsterraSlot format="banner" className="my-5 w-full" />

            <div className="border-b border-neutral-200 pb-6">
              <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">{video.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
                <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatViews(video.view_count || 0)}</span>
                {duration && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{duration}</span>}
                <button onClick={shareVideo} className="ml-auto inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 hover:border-neutral-950">
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Share'}
                </button>
              </div>
              {video.description && <p className="mt-5 whitespace-pre-line text-sm leading-6 text-neutral-300 sm:text-base">{video.description}</p>}
            </div>
          </main>

          <aside className="min-w-0">
            <h2 className="mb-4 text-lg font-black text-white">Related videos</h2>
            {relatedVideos.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                {relatedVideos.map((related) => <VideoCard key={related.id} video={related} />)}
              </div>
            ) : (
              <p className="rounded-lg border border-neutral-200 bg-white p-5 text-sm text-neutral-500">No related videos available.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
