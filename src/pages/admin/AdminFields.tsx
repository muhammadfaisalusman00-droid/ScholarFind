import React, { useEffect, useState } from 'react';
import { FieldItem, Scholarship } from '../../types/scholarship';
import { scholarshipService } from '../../services/scholarshipService';
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';

export const AdminFields: React.FC = () => {
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldDesc, setFieldDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fieldsData, scholarshipsData] = await Promise.all([
      scholarshipService.getFields(),
      scholarshipService.getAdminScholarships(),
    ]);

    setFields(fieldsData);
    setScholarships(scholarshipsData);
    setLoading(false);
  };

  const getCountForField = (fieldNameStr: string) => {
    return scholarships.filter(
      (s) => s.fieldOfStudy.toLowerCase() === fieldNameStr.toLowerCase()
    ).length;
  };

  const handleToggleStatus = async (id: string) => {
    await scholarshipService.toggleFieldStatus(id);
    loadData();
  };

  const handleOpenModal = (item?: FieldItem) => {
    if (item) {
      setEditingField(item);
      setFieldName(item.name);
      setFieldDesc(item.description || '');
    } else {
      setEditingField(null);
      setFieldName('');
      setFieldDesc('');
    }
    setModalOpen(true);
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    await scholarshipService.saveField({
      id: editingField?.id,
      name: fieldName.trim(),
      description: fieldDesc.trim(),
      status: editingField ? editingField.status : 'Active',
    });

    setModalOpen(false);
    loadData();
  };

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Fields Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage study disciplines and academic categories for scholarship indexing.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs shadow-indigo-600/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search academic field..."
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredFields.length}</span> active categories
        </div>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading academic fields...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Academic Field</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Scholarship Count</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFields.map((field) => {
                  const count = getCountForField(field.name);
                  return (
                    <tr key={field.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>{field.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {field.description || 'No description provided.'}
                        </p>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                          {count} Scholarships
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(field.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                            field.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {field.status === 'Active' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{field.status}</span>
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(field)}
                          className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Field Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editingField ? 'Edit Field' : 'Add New Academic Field'}
            </h3>
            <form onSubmit={handleSaveField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Field Name *
                </label>
                <input
                  type="text"
                  required
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Robotics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={fieldDesc}
                  onChange={(e) => setFieldDesc(e.target.value)}
                  placeholder="Short description of discipline..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  {editingField ? 'Save Changes' : 'Create Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
