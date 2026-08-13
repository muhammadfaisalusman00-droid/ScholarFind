import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, GraduationCap, BookOpen, DollarSign, RotateCcw, ArrowRight, ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../../constants/siteConfig';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('Any country');
  const [degree, setDegree] = useState('Any degree');
  const [field, setField] = useState('Any field');
  const [funding, setFunding] = useState('Any funding');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (country && country !== 'Any country') params.append('country', country);
    if (degree && degree !== 'Any degree') params.append('degree', degree);
    if (field && field !== 'Any field') params.append('field', field);
    if (funding && funding !== 'Any funding') params.append('funding', funding);

    navigate(`/scholarships?${params.toString()}`);
  };

  const resetHeroFilters = () => {
    setSearchQuery('');
    setCountry('Any country');
    setDegree('Any degree');
    setField('Any field');
    setFunding('Any funding');
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#070E20] text-white min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-center py-12 sm:py-16 lg:py-20">
      {/* Background Image - Historic Academic Architecture from Supabase Storage */}
      <img 
        src={SITE_CONFIG.heroBgUrl} 
        alt="Historic Academic Campus Architecture"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = SITE_CONFIG.fallbackHeroBgUrl;
        }}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
      />

      {/* Dark Overlay - Ensures high legibility of headline and search controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070E20]/80 via-[#070E20]/55 to-[#070E20]/85 backdrop-brightness-[0.9]" />

      {/* Foreground Hero Content Container */}
      <div className="relative z-10 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-8">
        
        {/* Main Hero Headline & Subtitle */}
        <div className="text-left space-y-3 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
            Find the right <br className="hidden sm:block" />
            scholarship <br className="hidden sm:block" />
            for <span className="text-amber-400">your future.</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-medium leading-relaxed max-w-2xl drop-shadow-sm">
            Discover scholarships opportunities from universities and organizations around the world.
          </p>
        </div>

        {/* Search & Filter Controls Floating Directly on Hero (NO OUTER CARD) */}
        <form onSubmit={handleSearchSubmit} className="space-y-3 w-full max-w-6xl">
          
          {/* Row 1: Standalone Search Input Bar with Embedded Button */}
          <div className="relative flex items-center bg-[#070F26]/85 backdrop-blur-md rounded-2xl border border-slate-700/80 p-1.5 sm:p-2 shadow-2xl">
            <div className="pl-3 sm:pl-4 text-slate-300 pointer-events-none">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships, universities, countries..."
              className="w-full pl-3 sm:pl-4 pr-3 py-2.5 sm:py-3 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-none"
              id="hero-search-input"
            />

            <button
              type="submit"
              id="hero-cta-button"
              className="shrink-0 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer transform active:scale-98"
            >
              <span>Search Scholarships</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Row 2: 4 Standalone Filter Controls Floating Over Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Filter 1: Country */}
            <div className="relative bg-[#070F26]/85 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all cursor-pointer shadow-md">
              <Globe className="w-4 h-4 text-sky-400 shrink-0 stroke-[2]" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none truncate p-0 pr-4"
                  id="hero-filter-country"
                >
                  <option value="Any country" className="bg-slate-900 text-white">Any country</option>
                  <option value="United States" className="bg-slate-900 text-white">United States</option>
                  <option value="Canada" className="bg-slate-900 text-white">Canada</option>
                  <option value="United Kingdom" className="bg-slate-900 text-white">United Kingdom</option>
                  <option value="Germany" className="bg-slate-900 text-white">Germany</option>
                  <option value="Australia" className="bg-slate-900 text-white">Australia</option>
                  <option value="Switzerland" className="bg-slate-900 text-white">Switzerland</option>
                  <option value="Japan" className="bg-slate-900 text-white">Japan</option>
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter 2: Degree */}
            <div className="relative bg-[#070F26]/85 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all cursor-pointer shadow-md">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 stroke-[2]" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none truncate p-0 pr-4"
                  id="hero-filter-degree"
                >
                  <option value="Any degree" className="bg-slate-900 text-white">Any degree</option>
                  <option value="Undergraduate" className="bg-slate-900 text-white">Undergraduate</option>
                  <option value="Master's" className="bg-slate-900 text-white">Master's</option>
                  <option value="Postgraduate" className="bg-slate-900 text-white">Postgraduate</option>
                  <option value="PhD" className="bg-slate-900 text-white">PhD</option>
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter 3: Field */}
            <div className="relative bg-[#070F26]/85 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all cursor-pointer shadow-md">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0 stroke-[2]" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Field</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none truncate p-0 pr-4"
                  id="hero-filter-field"
                >
                  <option value="Any field" className="bg-slate-900 text-white">Any field of study</option>
                  <option value="Computer Science" className="bg-slate-900 text-white">Computer Science</option>
                  <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
                  <option value="Business" className="bg-slate-900 text-white">Business</option>
                  <option value="Medicine" className="bg-slate-900 text-white">Medicine</option>
                  <option value="Arts" className="bg-slate-900 text-white">Arts</option>
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter 4: Funding */}
            <div className="relative bg-[#070F26]/85 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 rounded-xl px-3 py-2 flex items-center gap-2.5 transition-all cursor-pointer shadow-md">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2]" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Funding</label>
                <select
                  value={funding}
                  onChange={(e) => setFunding(e.target.value)}
                  className="w-full bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none truncate p-0 pr-4"
                  id="hero-filter-funding"
                >
                  <option value="Any funding" className="bg-slate-900 text-white">Any funding type</option>
                  <option value="Fully Funded" className="bg-slate-900 text-white">Fully Funded</option>
                  <option value="Partial Funding" className="bg-slate-900 text-white">Partial Funding</option>
                  <option value="Tuition Waiver" className="bg-slate-900 text-white">Tuition Waiver</option>
                </select>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Clear All Filters Button */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={resetHeroFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};



