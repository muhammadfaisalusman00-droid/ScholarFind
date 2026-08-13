import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterPanel } from '../components/scholarships/FilterPanel';
import { ScholarshipGrid } from '../components/scholarships/ScholarshipGrid';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Scholarship, FilterState } from '../types/scholarship';
import { scholarshipService } from '../services/scholarshipService';
import { filterScholarships } from '../utils/filterUtils';
import { AdSlot } from '../components/ads/AdSlot';

const ITEMS_PER_PAGE = 15;

export const Scholarships: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scholarshipsList, setScholarshipsList] = useState<Scholarship[]>([]);

  useEffect(() => {
    scholarshipService.getPublicScholarships().then(setScholarshipsList);
  }, []);

  // Initialize applied filters from URL search params
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    searchQuery: searchParams.get('q') || searchParams.get('searchQuery') || '',
    country: searchParams.get('country') || 'Any country',
    degree: searchParams.get('degree') || 'Any degree',
    funding: searchParams.get('funding') || 'Any funding',
    field: searchParams.get('field') || 'Any field'
  });

  // Keep appliedFilters in sync if URL search params change externally (e.g. navigation from Hero or Fields)
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('searchQuery') || '';
    const country = searchParams.get('country') || 'Any country';
    const degree = searchParams.get('degree') || 'Any degree';
    const funding = searchParams.get('funding') || 'Any funding';
    const field = searchParams.get('field') || 'Any field';

    setAppliedFilters({ searchQuery: q, country, degree, funding, field });
    setCurrentPage(1);
  }, [searchParams]);

  // Sync appliedFilters state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (appliedFilters.searchQuery.trim()) params.set('q', appliedFilters.searchQuery.trim());
    if (appliedFilters.country && appliedFilters.country !== 'Any country') params.set('country', appliedFilters.country);
    if (appliedFilters.degree && appliedFilters.degree !== 'Any degree') params.set('degree', appliedFilters.degree);
    if (appliedFilters.funding && appliedFilters.funding !== 'Any funding') params.set('funding', appliedFilters.funding);
    if (appliedFilters.field && appliedFilters.field !== 'Any field') params.set('field', appliedFilters.field);

    setSearchParams(params, { replace: true });
  }, [appliedFilters, setSearchParams]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    const defaults: FilterState = {
      searchQuery: '',
      country: 'Any country',
      degree: 'Any degree',
      funding: 'Any funding',
      field: 'Any field'
    };
    setAppliedFilters(defaults);
    setCurrentPage(1);
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const filteredScholarships = filterScholarships(scholarshipsList, appliedFilters);
  const totalPages = Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedScholarships = filteredScholarships.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Active filter chips representing currently applied filters
  const activeChips = [
    appliedFilters.searchQuery ? { key: 'searchQuery', label: `Keyword: "${appliedFilters.searchQuery}"` } : null,
    appliedFilters.country !== 'Any country' ? { key: 'country', label: appliedFilters.country } : null,
    appliedFilters.degree !== 'Any degree' ? { key: 'degree', label: appliedFilters.degree } : null,
    appliedFilters.funding !== 'Any funding' ? { key: 'funding', label: appliedFilters.funding } : null,
    appliedFilters.field !== 'Any field' ? { key: 'field', label: appliedFilters.field } : null
  ].filter(Boolean) as { key: keyof FilterState; label: string }[];

  const removeChip = (key: keyof FilterState) => {
    setAppliedFilters(prev => ({
      ...prev,
      [key]: key === 'searchQuery' ? '' : key === 'country' ? 'Any country' : key === 'degree' ? 'Any degree' : key === 'funding' ? 'Any funding' : 'Any field'
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <Breadcrumbs items={[{ label: 'Scholarships' }]} />

        {/* Page Title & Intro - directly on page background */}
        <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <span>Official Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Scholarships Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-xl">
              Discover fully-funded, partial, and merit-based international scholarships.
            </p>
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            id="mobile-filter-open-btn"
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Filters {activeChips.length > 0 && `(${activeChips.length})`}</span>
          </button>
        </div>

        {/* Standalone Floating Search Bar directly on page background */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2.2]" />
          <input
            type="text"
            value={appliedFilters.searchQuery}
            onChange={(e) => {
              setAppliedFilters(prev => ({ ...prev, searchQuery: e.target.value }));
              setCurrentPage(1);
            }}
            placeholder="Search by keyword, university, study field, or host country..."
            className="w-full pl-12 pr-10 py-3.5 bg-white text-slate-900 placeholder-slate-400 font-semibold text-sm sm:text-base rounded-xl border border-slate-200/80 focus:border-blue-500 focus:outline-none transition-all shadow-xs"
            id="scholarship-listing-search-input"
          />
          {appliedFilters.searchQuery && (
            <button
              onClick={() => {
                setAppliedFilters(prev => ({ ...prev, searchQuery: '' }));
                setCurrentPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Filter Chips directly on page background */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider mr-1">Active Filters:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white text-xs font-bold rounded-xl border border-slate-950/40 shadow-xs"
              >
                <span className="text-amber-300">{chip.label}</span>
                <button
                  onClick={() => removeChip(chip.key)}
                  className="p-0.5 hover:bg-white/20 rounded text-amber-300 transition-colors cursor-pointer"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-xs font-extrabold text-blue-800 hover:text-slate-950 underline underline-offset-4 ml-2 transition-colors cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Ad Placement 3: Scholarship Directory (After Search/Filters, Before Results Grid) */}
        <AdSlot position="scholarship-directory" className="my-6" />

        {/* 2-Column Desktop Grid directly on page background */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters - Standalone controls directly on page background */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel
                appliedFilters={appliedFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                resultsCount={filteredScholarships.length}
              />
            </div>
          </div>

          {/* Main Results Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-950 px-1 pb-1">
              <span>
                Found <span className="text-blue-800 font-extrabold text-sm">{filteredScholarships.length}</span> {filteredScholarships.length === 1 ? 'opportunity' : 'opportunities'}
                {totalPages > 1 && (
                  <span className="text-slate-500 font-normal ml-2">
                    (Page {validCurrentPage} of {totalPages})
                  </span>
                )}
              </span>
            </div>

            <ScholarshipGrid
              scholarships={paginatedScholarships}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex flex-wrap items-center justify-center gap-2" id="scholarships-pagination">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    validCurrentPage === 1
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-slate-200/90 shadow-xs'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[38px] h-9 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        pageNum === validCurrentPage
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/90 shadow-xs'
                      }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={pageNum === validCurrentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    validCurrentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-slate-200/90 shadow-xs'
                  }`}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-white h-full overflow-y-auto p-6 space-y-6 shadow-2xl border-l border-blue-900/50">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Filter Directory</h2>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-white/10 cursor-pointer"
                aria-label="Close Filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <FilterPanel
              appliedFilters={appliedFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              resultsCount={filteredScholarships.length}
              isDark={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
