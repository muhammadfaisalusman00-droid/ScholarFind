import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters?: () => void;
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onResetFilters,
  title = 'No scholarships found',
  message = 'Try changing your filters or search term to discover more opportunities.'
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
      
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
