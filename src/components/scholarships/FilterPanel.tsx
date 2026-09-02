import React, { useState, useEffect } from 'react';
import { RotateCcw, Filter, Globe, GraduationCap, DollarSign, BookOpen, Check } from 'lucide-react';
import { FilterState } from '../../types/scholarship';
import { ALL_FIELDS, HomepageFieldsData } from '../../data/fieldsData';

interface FilterPanelProps {
  appliedFilters: FilterState;
  onApply: (newFilters: FilterState) => void;
  onReset: () => void;
  resultsCount?: number;
  className?: string;
  isDark?: boolean;
}

const COUNTRIES = [
  'Any country',
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'Australia',
  'Switzerland',
  'Japan',
  'International'
];

const DEGREES = [
  'Any degree',
  'Undergraduate',
  "Master's",
  'Postgraduate',
  'PhD'
];

const FUNDINGS = [
  'Any funding',
  'Fully funded',
  'Partially funded',
  'Tuition only'
];

const FIELDS = [
  'Any field',
  ALL_FIELDS,
  ...HomepageFieldsData.HOMEPAGE_FIELDS.map((field) => field.field)
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  appliedFilters,
  onApply,
  onReset,
  resultsCount,
  className = '',
  isDark = false
}) => {
  // Temporary filter selections before user clicks "Apply Filters"
  const [tempFilters, setTempFilters] = useState<FilterState>(appliedFilters);

  // Keep tempFilters in sync if appliedFilters change externally (e.g., active chip removed or reset)
  useEffect(() => {
    setTempFilters(appliedFilters);
  }, [appliedFilters]);

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    onReset();
  };

  const handleApply = () => {
    onApply(tempFilters);
  };

  const activeAppliedCount = [
    appliedFilters.country !== 'Any country' && appliedFilters.country !== '',
    appliedFilters.degree !== 'Any degree' && appliedFilters.degree !== '',
    appliedFilters.funding !== 'Any funding' && appliedFilters.funding !== '',
    appliedFilters.field !== 'Any field' && appliedFilters.field !== ''
  ].filter(Boolean).length;

  // Check if temp selections differ from applied state
  const hasUnappliedChanges =
    tempFilters.country !== appliedFilters.country ||
    tempFilters.degree !== appliedFilters.degree ||
    tempFilters.funding !== appliedFilters.funding ||
    tempFilters.field !== appliedFilters.field;

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Filter Header Banner */}
      <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-blue-900/60' : 'border-slate-200/90'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl flex items-center justify-center shadow-xs ${isDark ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-amber-400'}`}>
            <Filter className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Filter Directory
            </h2>
            <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              Refine scholarship results
            </p>
          </div>
          {activeAppliedCount > 0 && (
            <span className="ml-1 px-2.5 py-0.5 text-xs font-extrabold bg-amber-400 text-slate-950 rounded-full shadow-2xs">
              {activeAppliedCount}
            </span>
          )}
        </div>

        {(activeAppliedCount > 0 || hasUnappliedChanges) && (
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
              isDark 
                ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30' 
                : 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-800'
            }`}
            id="reset-filters-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Country Filter */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
          <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-800 flex items-center justify-center border border-sky-200">
            <Globe className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>Country / Destination</span>
        </label>
        <select
          value={tempFilters.country}
          onChange={(e) => handleSelectChange('country', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-2xs focus:outline-none ${
            isDark
              ? 'bg-slate-900 border-blue-800 text-white focus:border-amber-400'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          id="filter-country"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 2. Degree Filter */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
          <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center border border-indigo-200">
            <GraduationCap className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>Degree Level</span>
        </label>
        <select
          value={tempFilters.degree}
          onChange={(e) => handleSelectChange('degree', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-2xs focus:outline-none ${
            isDark
              ? 'bg-slate-900 border-blue-800 text-white focus:border-amber-400'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          id="filter-degree"
        >
          {DEGREES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* 3. Field of Study Filter */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
          <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-200">
            <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>Field of Study</span>
        </label>
        <select
          value={tempFilters.field}
          onChange={(e) => handleSelectChange('field', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-2xs focus:outline-none ${
            isDark
              ? 'bg-slate-900 border-blue-800 text-white focus:border-amber-400'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          id="filter-field"
        >
          {FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* 4. Funding Type Filter */}
      <div className="space-y-1.5">
        <label className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <DollarSign className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span>Funding Type</span>
        </label>
        <select
          value={tempFilters.funding}
          onChange={(e) => handleSelectChange('funding', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-2xs focus:outline-none ${
            isDark
              ? 'bg-slate-900 border-blue-800 text-white focus:border-amber-400'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
          id="filter-funding"
        >
          {FUNDINGS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Apply Filters CTA Button */}
      <div className={`pt-3 border-t ${isDark ? 'border-blue-900/60' : 'border-slate-200/90'}`}>
        <button
          type="button"
          onClick={handleApply}
          className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isDark
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          id="apply-filters-btn"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Apply Filters</span>
        </button>
      </div>

      {resultsCount !== undefined && (
        <div className={`pt-1 text-center text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Showing <span className={isDark ? 'text-amber-300' : 'text-slate-950'}>{resultsCount}</span> {resultsCount === 1 ? 'scholarship' : 'scholarships'}
        </div>
      )}
    </div>
  );
};
