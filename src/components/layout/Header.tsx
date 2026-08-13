import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Compass } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070E20] text-white border-b border-slate-800/80 shadow-md">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-16 flex items-center justify-between">
        {/* Left: ScholarFind Logo */}
        <Link 
          to="/" 
          id="header-logo-link"
          className="flex items-center gap-2.5 focus:outline-none group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Scholar<span className="text-amber-400 font-black">Find</span>
          </span>
        </Link>

        {/* Center/Right Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6" aria-label="Main Navigation">
            <Link
              to="/scholarships"
              id="nav-link-scholarships"
              className={`text-sm font-bold transition-all py-1 ${
                isActive('/scholarships')
                  ? 'text-white border-b-2 border-amber-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Scholarships
            </Link>
            <Link
              to="/fields"
              id="nav-link-fields"
              className={`text-sm font-bold transition-all py-1 ${
                isActive('/fields') 
                  ? 'text-white border-b-2 border-amber-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fields
            </Link>
            <Link
              to="/about"
              id="nav-link-about"
              className={`text-sm font-bold transition-all py-1 ${
                isActive('/about') 
                  ? 'text-white border-b-2 border-amber-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              About
            </Link>
          </nav>

          <Link
            to="/scholarships"
            id="nav-browse-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer transform active:scale-95"
          >
            <Compass className="w-4 h-4 stroke-[2.2]" />
            <span>Browse All Scholarships</span>
          </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/scholarships"
            className="p-1.5 bg-blue-600 text-white rounded-full text-xs font-bold"
            aria-label="Browse Scholarships"
          >
            <Compass className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="p-2 text-slate-200 hover:text-white rounded-lg border border-slate-700 bg-slate-900 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070E20] px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          <Link
            to="/scholarships"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all ${
              isActive('/scholarships')
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Scholarships
          </Link>
          <Link
            to="/fields"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all ${
              isActive('/fields')
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            Fields
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all ${
              isActive('/about')
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            About
          </Link>
          <Link
            to="/scholarships"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 text-white rounded-full text-sm font-bold"
          >
            <Compass className="w-4 h-4" />
            <span>Browse All Scholarships</span>
          </Link>
        </div>
      )}
    </header>
  );
};


