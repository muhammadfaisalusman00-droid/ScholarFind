import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Scholarship } from '../../types/scholarship';
import { formatDate } from '../../utils/dateUtils';

interface ScholarshipRowProps {
  scholarship: Scholarship;
}

export const ScholarshipRow: React.FC<ScholarshipRowProps> = ({ scholarship }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group bg-white hover:bg-slate-50/80 p-4 sm:p-5 transition-colors border-b border-slate-200/80 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      id={`scholarship-row-${scholarship.id}`}
    >
      <div className="space-y-1 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {scholarship.organization}
        </p>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
          <Link to={`/scholarships/${scholarship.slug}`} className="focus:outline-hidden">
            {scholarship.title}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 font-medium pt-0.5">
          <span>{scholarship.country}</span>
          <span className="text-slate-300">•</span>
          <span>{scholarship.degreeLevel}</span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-900 font-semibold">{scholarship.fundingType}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right">
          <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Deadline</span>
          <span className="text-xs font-bold text-slate-800">
            {formatDate(scholarship.deadline)}
          </span>
        </div>

        <button
          onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 group-hover:text-indigo-950 bg-slate-100 group-hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
          aria-label={`View ${scholarship.title}`}
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
