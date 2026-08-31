import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scholarship, ScholarshipStatus, DegreeLevel } from '../../types/scholarship';
import { scholarshipService } from '../../services/scholarshipService';
import { HomepageFieldsData } from '../../data/fieldsData';
import {
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Archive,
  CheckCircle2,
  FileEdit,
  Calendar,
  Building2,
  MapPin,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedField, setSelectedField] = useState<string>('All');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    scholarship: Scholarship | null;
    action: 'archive' | 'delete';
  }>({
    isOpen: false,
    scholarship: null,
    action: 'archive',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await scholarshipService.getAdminScholarships();
    setScholarships(data);
    setLoading(false);
  };

  const handleAction = async () => {
    if (!confirmModal.scholarship || actionLoading) return;

    setActionLoading(true);
    setActionError(null);

    try {
      await scholarshipService.archiveOrDeleteScholarship(
        confirmModal.scholarship.id,
        confirmModal.action
      );
      setConfirmModal({ isOpen: false, scholarship: null, action: 'archive' });
      await loadData();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to complete this action.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter((s) => {
    const status = s.status || 'Published';
    if (selectedStatus !== 'All' && status !== selectedStatus) return false;
    if (selectedDegree !== 'All' && s.degreeLevel !== selectedDegree) return false;
    if (selectedField !== 'All' && s.fieldOfStudy !== selectedField) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = s.title.toLowerCase().includes(q);
      const orgMatch = s.organization.toLowerCase().includes(q);
      const countryMatch = s.country.toLowerCase().includes(q);
      return titleMatch || orgMatch || countryMatch;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Scholarship Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, publish, and manage all scholarship listings across the platform.
          </p>
        </div>
        <Link
          to="/admin/scholarships/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Scholarship</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          {['All', 'Published', 'Draft', 'Archived'].map((status) => {
            const count =
              status === 'All'
                ? scholarships.length
                : scholarships.filter((s) => (s.status || 'Published') === status).length;

            const isActive = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                    isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, university, country..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Degree Filter */}
          <div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              <option value="All">All Degree Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Master's">Master's</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Field Filter */}
          <div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              <option value="All">All Academic Fields</option>
              {HomepageFieldsData.HOMEPAGE_FIELDS.map((f) => (
                <option key={f.id} value={f.field}>
                  {f.field}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scholarship Data Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading scholarship records...</span>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">No scholarships match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords, degree level, or status filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5">Scholarship</th>
                    <th className="py-3.5 px-5">Location</th>
                    <th className="py-3.5 px-5">Field & Level</th>
                    <th className="py-3.5 px-5">Funding</th>
                    <th className="py-3.5 px-5">Deadline</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredScholarships.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{s.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{s.organization}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{s.country}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-900">{s.fieldOfStudy}</div>
                        <div className="text-[11px] text-slate-500">{s.degreeLevel}</div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-md border border-indigo-100">
                          {s.fundingType}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                          {s.amount}
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-xs text-slate-800 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.deadline}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
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
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/scholarships/${s.id}/edit`}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Scholarship"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {(s.status || 'Published') === 'Published' && (
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  scholarship: s,
                                  action: 'archive',
                                })
                              }
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Archive Scholarship"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                scholarship: s,
                                action: 'delete',
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Scholarship"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {(s.status || 'Published') === 'Published' && (
                            <a
                              href={`/scholarships/${s.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredScholarships.map((s) => (
                <div key={s.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-1.5 ${
                          (s.status || 'Published') === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : s.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.status || 'Published'}
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">{s.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">{s.organization} • {s.country}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Field & Level</span>
                      <span className="font-medium text-slate-800">{s.fieldOfStudy} ({s.degreeLevel})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Deadline</span>
                      <span className="font-medium text-slate-800">{s.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {s.fundingType}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/scholarships/${s.id}/edit`}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                      >
                        Edit
                      </Link>
                      {(s.status || 'Published') === 'Published' && (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              scholarship: s,
                              action: 'archive',
                            })
                          }
                          className="px-2.5 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            scholarship: s,
                            action: 'delete',
                          })
                        }
                        className="px-2.5 py-1.5 text-xs font-medium bg-rose-50 text-rose-700 rounded-lg"
                      >
                        Delete
                      </button>
                      {(s.status || 'Published') === 'Published' && (
                        <a
                          href={`/scholarships/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.scholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {confirmModal.action === 'archive' ? 'Archive Scholarship' : 'Delete Scholarship'}
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmModal.action} <strong>"{confirmModal.scholarship.title}"</strong>?
              {confirmModal.action === 'archive'
                ? ' It will be hidden from the public directory but preserved in admin records.'
                : ' This action cannot be undone and permanently removes the scholarship from the database.'}
            </p>
            {actionError && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {actionError}
              </p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActionError(null);
                  setConfirmModal({ isOpen: false, scholarship: null, action: 'archive' });
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                  actionLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  confirmModal.action === 'archive'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionLoading ? 'Processing...' : `Confirm ${confirmModal.action === 'archive' ? 'Archive' : 'Delete'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
