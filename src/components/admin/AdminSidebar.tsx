import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  PlusCircle,
  Layers,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Scholarships',
      path: '/admin/scholarships',
      icon: GraduationCap,
      exact: true,
      subItems: [
        { label: 'All Scholarships', path: '/admin/scholarships' },
        { label: 'Add Scholarship', path: '/admin/scholarships/new', icon: PlusCircle },
      ]
    },
    {
      label: 'Fields',
      path: '/admin/fields',
      icon: Layers,
    },
    {
      label: 'Affiliate Promotions',
      path: '/admin/affiliate-promotions',
      icon: Sparkles,
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-900/50">
            SF
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
              ScholarFind
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                CMS
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Admin Management</div>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Platform Operations
          </div>

          {navItems.map((item) => (
            <div key={item.path} className="space-y-1">
              <NavLink
                to={item.path}
                end={item.exact}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                <span className="flex-1">{item.label}</span>
              </NavLink>

              {item.subItems && (
                <div className="pl-9 pr-2 space-y-1 pt-1">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      end
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center justify-between text-xs py-1.5 px-2.5 rounded-md transition-colors ${
                          isActive
                            ? 'text-indigo-400 font-semibold bg-indigo-950/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <span>{sub.label}</span>
                      {sub.icon && <sub.icon className="w-3.5 h-3.5 opacity-70" />}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Public Site Quick Link */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
            Public Website
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>View Live Site</span>
          </a>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-white truncate">
                {currentUser?.email || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {currentUser?.role || 'Administrator'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
