import React, { useEffect, useState } from 'react';
import { Check, Edit3, EyeOff, RefreshCw, Trash2, Upload, Video as VideoIcon, X } from 'lucide-react';
import { Video } from '../../types/video';
import { getThumbnailUrl, prepareVideo, PreparedVideo, videoService } from '../../services/videoService';

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds < 0) return '-';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = Math.floor(seconds % 60);
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '-';
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
};

export const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [prepared, setPrepared] = useState<PreparedVideo | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const loadVideos = async () => {
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

  useEffect(() => {
    loadVideos();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
    setPrepared(null);
    setError(null);

    if (!file) return;

    setPreparing(true);
    setUploadStage('Reading video metadata');
    try {
      const result = await prepareVideo(file);
      setPrepared(result);
      setUploadStage('Ready to upload');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to prepare video.');
      setUploadStage('');
    } finally {
      setPreparing(false);
    }
  };

  const submitUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!videoFile) {
      setError('Select a video file.');
      return;
    }
    if (!caption.trim()) {
      setError('Enter a caption.');
      return;
    }

    setUploading(true);
    setUploadStage('Preparing upload');

    try {
      let preparedVideo = prepared;
      if (!preparedVideo) preparedVideo = await prepareVideo(videoFile);

      await videoService.uploadVideo(videoFile, caption, preparedVideo, setUploadStage);
      setVideoFile(null);
      setCaption('');
      setPrepared(null);
      setUploadStage('Video published');
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setUploadStage('');
    } finally {
      setUploading(false);
    }
  };

  const saveCaption = async (video: Video) => {
    if (!editingCaption.trim()) {
      setError('Caption is required.');
      return;
    }

    setActionId(video.id);
    setError(null);
    try {
      await videoService.updateVideoCaption(video, editingCaption);
      setEditingId(null);
      setEditingCaption('');
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update caption.');
    } finally {
      setActionId(null);
    }
  };

  const setPublished = async (video: Video, published: boolean) => {
    setActionId(video.id);
    setError(null);
    try {
      await videoService.setVideoPublished(video.id, published);
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update publication status.');
    } finally {
      setActionId(null);
    }
  };

  const deleteVideo = async (video: Video) => {
    if (!window.confirm(`Delete "${video.title}"? This also removes its video and thumbnail files.`)) return;

    setActionId(video.id);
    setError(null);
    try {
      await videoService.deleteVideo(video);
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete video.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Videos</h1>
        <p className="mt-1 text-sm text-slate-500">Upload and manage Videra content.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={submitUpload} className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-slate-950">Upload video</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,420px)_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-slate-500">Video file</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              disabled={uploading || preparing}
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-200 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-slate-500">Caption</span>
            <input
              type="text"
              value={caption}
              disabled={uploading}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Enter a video caption"
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-neutral-950"
            />
          </label>

          <button
            type="submit"
            disabled={uploading || preparing || !videoFile || !caption.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading' : 'Upload'}
          </button>
        </div>

        {(prepared || preparing || uploadStage) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <span className="font-bold text-slate-950">{uploadStage || 'Preparing video'}</span>
            {prepared && <span>{formatDuration(prepared.duration)}</span>}
            {prepared && <span>{formatFileSize(prepared.fileSize)}</span>}
          </div>
        )}
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Video library</h2></div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No videos uploaded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {videos.map((video) => {
              const thumbnail = getThumbnailUrl(video.thumbnail_storage_path);
              const isEditing = editingId === video.id;
              const busy = actionId === video.id;

              return (
                <div key={video.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-32">
                    {thumbnail ? <img src={thumbnail} alt="" className="h-full w-full object-cover" /> : <VideoIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-slate-400" />}
                    {video.duration ? <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">{formatDuration(video.duration)}</span> : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input value={editingCaption} onChange={(event) => setEditingCaption(event.target.value)} className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm" />
                        <button disabled={busy} onClick={() => saveCaption(video)} className="rounded-lg bg-neutral-950 px-3 text-white"><Check className="h-4 w-4" /></button>
                        <button onClick={() => { setEditingId(null); setEditingCaption(''); }} className="rounded-lg border border-slate-200 px-3 text-slate-600"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <h3 className="truncate font-bold text-slate-950">{video.title}</h3>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500">
                      <span>{video.status === 'published' ? 'Published' : 'Unpublished'}</span>
                      <span>{formatFileSize(video.file_size)}</span>
                      <span>{video.view_count || 0} views</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!isEditing && (
                      <button disabled={busy} onClick={() => { setEditingId(video.id); setEditingCaption(video.title); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700"><Edit3 className="h-3.5 w-3.5" />Edit</button>
                    )}
                    {video.status === 'published' ? (
                      <button disabled={busy} onClick={() => setPublished(video, false)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700"><EyeOff className="h-3.5 w-3.5" />Unpublish</button>
                    ) : (
                      <button disabled={busy} onClick={() => setPublished(video, true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700"><RefreshCw className="h-3.5 w-3.5" />Publish</button>
                    )}
                    <button disabled={busy} onClick={() => deleteVideo(video)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-700"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
