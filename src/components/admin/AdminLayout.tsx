import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Menu, ExternalLink, ChevronRight } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Generate simple breadcrumbs based on pathname
  const pathParts = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbTitle = (part: string, index: number) => {
    if (part === 'admin' && index === 0) return 'Admin';
    if (part === 'scholarships') return 'Scholarships';
    if (part === 'new') return 'Add New Scholarship';
    if (part === 'edit') return 'Edit Scholarship';
    if (part === 'fields') return 'Academic Fields';
    if (part === 'affiliate-promotions') return 'Affiliate Promotions';
    if (part === 'settings') return 'Site Settings';
    return part;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800">
      {/* Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 font-medium overflow-x-auto py-1">
              {pathParts.map((part, index) => {
                const url = '/' + pathParts.slice(0, index + 1).join('/');
                const isLast = index === pathParts.length - 1;
                const title = getBreadcrumbTitle(part, index);

                return (
                  <React.Fragment key={url}>
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                    {isLast ? (
                      <span className="font-semibold text-slate-900 truncate">
                        {title}
                      </span>
                    ) : (
                      <Link
                        to={url}
                        className="hover:text-indigo-600 transition-colors shrink-0"
                      >
                        {title}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">View Public Site</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
