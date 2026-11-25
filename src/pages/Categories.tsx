import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Video, VideoCategory } from '../types/video';
import { videoService } from '../services/videoService';

export const Categories: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoryData, videoData] = await Promise.all([
          videoService.getCategories(),
          videoService.getPublishedVideos(),
        ]);
        setCategories(categoryData);
        setVideos(videoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load categories.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter((category) =>
      [category.name, category.description].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized))
    );
  }, [categories, query]);

  const countForCategory = (categoryId: string) => videos.filter((video) => video.category_id === categoryId).length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="mx-auto w-full max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-neutral-200 pb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Browse</p>
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">Categories</h1>
          <div className="relative mt-5 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className="h-12 w-full rounded-lg border border-neutral-300 bg-white pl-11 pr-10 text-sm outline-none focus:border-neutral-950" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-label="Clear search"><X className="h-4 w-4" /></button>}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><div className="h-32 animate-pulse rounded-lg bg-neutral-200" /></div>
        ) : error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-8 text-center"><p className="font-bold text-red-800">Unable to load categories</p><p className="mt-1 text-sm text-red-600">{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-lg border border-neutral-200 bg-white py-16 text-center"><p className="font-bold text-neutral-900">No categories found</p><p className="mt-1 text-sm text-neutral-500">Try another search.</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((category) => (
              <Link key={category.id} to={`/videos?category=${category.id}`} className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
                <h2 className="text-lg font-black text-neutral-950">{category.name}</h2>
                {category.description && <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{category.description}</p>}
                <p className="mt-5 text-xs font-bold text-neutral-500">{countForCategory(category.id)} {countForCategory(category.id) === 1 ? 'video' : 'videos'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
