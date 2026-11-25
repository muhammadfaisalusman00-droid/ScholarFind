import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowRight, CheckCircle2, Eye, Upload, Video as VideoIcon } from 'lucide-react';
import { Video } from '../../types/video';
import { videoService } from '../../services/videoService';

export const AdminDashboardVideo: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setVideos(await videoService.getAdminVideos());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load videos.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const published = videos.filter((video) => video.status === 'published').length;
  const archived = videos.filter((video) => video.status === 'archived').length;
  const views = videos.reduce((total, video) => total + (video.view_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Video dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and manage published Videra content.</p>
        </div>
        <Link to="/admin/videos/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-bold text-white">
          <Upload className="h-4 w-4" /> Upload video
        </Link>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-slate-500">Total</span><VideoIcon className="h-5 w-5 text-slate-500" /></div><p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '...' : videos.length}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-slate-500">Published</span><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div><p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '...' : published}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-slate-500">Archived</span><Archive className="h-5 w-5 text-slate-500" /></div><p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '...' : archived}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-slate-500">Views</span><Eye className="h-5 w-5 text-slate-500" /></div><p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '...' : views}</p></div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
        <div><h2 className="font-bold text-slate-950">Video library</h2><p className="mt-1 text-xs text-slate-500">Manage captions and publication status.</p></div>
        <Link to="/admin/videos" className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">Open library <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
};
