import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, BookOpen, Code, Cpu, Activity, Briefcase, Scale, TrendingUp, Sparkles, Globe, Palette, GraduationCap, ArrowRight, Layers } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { HomepageFieldsData, FieldCategory } from '../data/fieldsData';
import { scholarshipService } from '../services/scholarshipService';
import { Scholarship } from '../types/scholarship';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Cpu,
  Activity,
  Briefcase,
  Scale,
  TrendingUp,
  Sparkles,
  Globe,
  Palette,
  BookOpen,
  GraduationCap
};

export const Fields: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedCount, setPublishedCount] = useState<number>(0);

  useEffect(() => {
    scholarshipService.getPublicScholarships().then((data) => {
      setPublishedCount(data.length);
    });
  }, []);

  const categories = HomepageFieldsData.ALL_CATEGORIES;

  // Filter categories and majors based on search query
  const filteredCategories = categories.map((cat) => {
    if (!searchQuery.trim()) return cat;

    const query = searchQuery.toLowerCase().trim();
    const categoryNameMatches = cat.name.toLowerCase().includes(query);
    const categoryDescMatches = cat.description.toLowerCase().includes(query);

    const matchingMajors = cat.majors.filter((m) => m.name.toLowerCase().includes(query));

    if (categoryNameMatches || categoryDescMatches) {
      return cat; // Keep all majors if category matches
    }

    if (matchingMajors.length > 0) {
      return {
        ...cat,
        majors: matchingMajors
      };
    }

    return null;
  }).filter(Boolean) as FieldCategory[];

  const handleMajorClick = (majorName: string, fieldFilter: string) => {
    const params = new URLSearchParams();
    params.append('field', fieldFilter);
    params.append('searchQuery', majorName);
    navigate(`/scholarships?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    params.append('searchQuery', categoryName);
    navigate(`/scholarships?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <Breadcrumbs items={[{ label: 'Academic Fields' }]} />

        {/* Page Title & Intro */}
        <div className="my-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Field Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Academic Fields & Majors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
            Browse our comprehensive catalog of university majors and academic disciplines to discover tailored scholarship opportunities around the world.
          </p>
        </div>

        {/* Standalone Search Bar */}
        <div className="relative mb-6 max-w-5xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields or majors (e.g., Cybersecurity, Biomedical Engineering, Nursing)..."
            className="w-full pl-12 pr-10 py-3.5 bg-white text-slate-900 placeholder-slate-400 font-semibold text-sm sm:text-base rounded-2xl border border-slate-200/90 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-xs"
            id="fields-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Shortcut Badges */}
        <div className="mb-10 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 mr-1 font-medium">Popular Quick Filters:</span>
          {['Computer Science', 'Engineering', 'Medicine', 'Business', 'Law', 'Economics', 'Psychology', 'Architecture'].map((q) => {
            const isActive = searchQuery.toLowerCase() === q.toLowerCase();
            return (
              <button
                key={q}
                onClick={() => setSearchQuery(isActive ? '' : q)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white hover:bg-blue-50/80 hover:text-blue-700 hover:border-blue-300 text-slate-700 border-slate-200/90 shadow-2xs'
                }`}
              >
                {q}
              </button>
            );
          })}
        </div>

        {/* Categories & Majors Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No fields or majors found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any majors matching "<span className="font-semibold">{searchQuery}</span>". Try searching for another keyword or clear your filter.
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredCategories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || BookOpen;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all"
                  id={`field-category-${cat.id}`}
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                            {cat.name}
                          </h2>
                          <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-slate-100 text-slate-600 rounded-full border border-slate-200/70">
                            {cat.majors.length} {cat.majors.length === 1 ? 'Major' : 'Majors'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Browse all in {cat.name.split('&')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Majors List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {cat.majors.map((major) => (
                      <button
                        key={major.slug}
                        onClick={() => handleMajorClick(major.name, major.fieldFilter)}
                        className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-white hover:shadow-2xs border border-slate-200/70 hover:border-blue-400 transition-all text-left cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                          {major.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold">Can't find your exact specialization?</h3>
            <p className="text-xs text-slate-300 font-medium">
              Explore our full directory of {publishedCount} {publishedCount === 1 ? 'scholarship opportunity' : 'scholarship opportunities'} across all degree levels.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-extrabold text-xs sm:text-sm shrink-0 transition-colors"
          >
            Browse All Scholarships
          </Link>
        </div>

      </div>
    </div>
  );
};
