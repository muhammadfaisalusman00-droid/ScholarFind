import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Search className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        The page you are looking for does not exist or has been moved to a new path.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-xs transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Scholarships</span>
        </Link>
      </div>
    </div>
  );
};
