import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '../../types/scholarship';
import { scholarshipService } from '../../services/scholarshipService';
import {
  GraduationCap,
  CheckCircle2,
  FileEdit,
  Archive,
  PlusCircle,
  Layers,
  Settings,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await scholarshipService.getAdminScholarships();
    setScholarships(data);
    setLoading(false);
  };

  const totalCount = scholarships.length;
  const publishedCount = scholarships.filter((s) => (s.status || 'Published') === 'Published').length;
  const draftCount = scholarships.filter((s) => s.status === 'Draft').length;
  const archivedCount = scholarships.filter((s) => s.status === 'Archived').length;

  const recentScholarships = scholarships.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage scholarship opportunities, publish drafts, and control platform settings.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/scholarships/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Scholarship</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scholarships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Managed
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? '...' : totalCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            All records in database
          </div>
        </div>

        {/* Published */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Published Live
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? '...' : publishedCount}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            Visible on public website
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Draft Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? '...' : draftCount}
          </div>
          <div className="mt-1 text-xs text-amber-600 font-medium">
            Unpublished work in progress
          </div>
        </div>

        {/* Archived */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Archived
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? '...' : archivedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Hidden from public directory
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/scholarships"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Scholarships Directory</div>
              <div className="text-xs text-slate-500">View, edit or status manage</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/admin/fields"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Academic Fields</div>
              <div className="text-xs text-slate-500">Manage study categories</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Site Settings</div>
              <div className="text-xs text-slate-500">Email & maintenance config</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Recent Scholarships Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Recently Added Scholarships</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest 5 scholarship records in the repository</p>
          </div>
          <Link
            to="/admin/scholarships"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading scholarships...</div>
        ) : recentScholarships.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No scholarships found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Scholarship Title</th>
                  <th className="py-3 px-5">Field & Level</th>
                  <th className="py-3 px-5">Deadline</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentScholarships.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 line-clamp-1">{s.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {s.organization}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {s.country}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-xs font-medium text-slate-800">{s.fieldOfStudy}</div>
                      <div className="text-[11px] text-slate-500">{s.degreeLevel}</div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-xs text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {s.deadline}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          (s.status || 'Published') === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : s.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.status || 'Published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/scholarships/${s.id}/edit`}
                          className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                        >
                          Edit
                        </Link>
                        {(s.status || 'Published') === 'Published' && (
                          <a
                            href={`/scholarships/${s.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
