import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-slate-300 py-12 border-t border-blue-900/40">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-blue-900/60">
          
          {/* Brand Info */}
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:bg-blue-500 transition-colors">
                <GraduationCap className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Scholar<span className="text-amber-400">Find</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium max-w-sm">
              Connecting students worldwide with official higher education scholarship opportunities.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-300" aria-label="Footer Navigation">
            <Link to="/scholarships" className="hover:text-amber-300 transition-colors">
              Scholarships Directory
            </Link>
            <Link to="/fields" className="hover:text-amber-300 transition-colors">
              Academic Fields
            </Link>
            <Link to="/about" className="hover:text-amber-300 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-amber-300 transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-amber-300 transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} ScholarFind. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">Connecting students directly to official university portals.</p>
        </div>
      </div>
    </footer>
  );
};

