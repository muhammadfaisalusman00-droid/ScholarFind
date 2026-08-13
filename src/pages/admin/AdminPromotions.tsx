import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Info
} from 'lucide-react';
import { AffiliatePromotion, PromotionPlacement } from '../../types/scholarship';
import { promotionService, normalizeDestinationUrl } from '../../services/promotionService';

export const AdminPromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<AffiliatePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AffiliatePromotion | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDestinationUrl, setFormDestinationUrl] = useState('');
  const [formPlacement, setFormPlacement] = useState<PromotionPlacement>('Homepage');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await promotionService.getPromotions();
      setPromotions(data);
    } catch {
      setErrorMsg('Failed to load affiliate promotions.');
    } finally {
      setLoading(false);
    }
  };

  const homepagePromo = promotions.find((p) => p.placement === 'Homepage' || p.placement === 'Both');
  const detailsPromo = promotions.find((p) => p.placement === 'Scholarship Details' || p.placement === 'Both');

  const openCreateModal = (defaultPlacement: PromotionPlacement = 'Homepage') => {
    setEditingPromo(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setFormDestinationUrl('');
    setFormPlacement(defaultPlacement);
    setFormDisplayOrder(0);
    setSelectedFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promo: AffiliatePromotion) => {
    setEditingPromo(promo);
    setFormTitle(promo.title || '');
    setFormDescription(promo.description || '');
    setFormImageUrl(promo.imageUrl || '');
    setFormDestinationUrl(promo.destinationUrl || '');
    setFormPlacement(promo.placement);
    setFormDisplayOrder(promo.displayOrder || 0);
    setSelectedFile(null);
    setImagePreview(promo.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await promotionService.savePromotion(
        {
          id: editingPromo?.id,
          title: formTitle,
          description: formDescription,
          imageUrl: formImageUrl,
          destinationUrl: formDestinationUrl,
          placement: formPlacement,
          status: 'Active',
          displayOrder: formDisplayOrder,
        },
        selectedFile
      );

      showTemporarySuccess(editingPromo ? 'Promotion updated successfully!' : 'Promotion created successfully!');
      setIsModalOpen(false);
      loadPromotions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save promotion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await promotionService.deletePromotion(deletingId);
      setPromotions((prev) => prev.filter((p) => p.id !== deletingId));
      showTemporarySuccess('Promotion deleted successfully.');
      setDeletingId(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete promotion.');
      setDeletingId(null);
    }
  };

  const showTemporarySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>Affiliate Promotions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the two public promotion placement slots across ScholarFind.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <button
            onClick={() => openCreateModal('Homepage')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Replace Promotion</span>
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-600 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Explanatory Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900 font-medium">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          ScholarFind features <strong>2 public promotion slots</strong>: <strong>Homepage</strong> and <strong>Scholarship Details</strong>. When you create or update a promotion, its placement determines which slot is updated. Preserved promotions in other slots remain unchanged.
        </p>
      </div>

      {/* Placement Slots Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs font-medium">Loading promotion slots...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slot 1: Homepage Placement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <h3 className="text-base font-bold text-slate-900">Homepage Slot</h3>
                </div>
                {homepagePromo && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {homepagePromo.placement === 'Both' ? 'Both Locations' : 'Homepage Only'}
                  </span>
                )}
              </div>

              {homepagePromo ? (
                <div className="mt-4 space-y-3">
                  {homepagePromo.imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={homepagePromo.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {homepagePromo.title || <span className="text-slate-400 italic">No Title</span>}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {homepagePromo.description || <span className="text-slate-400 italic">No Description</span>}
                    </p>
                  </div>
                  {homepagePromo.destinationUrl && (
                    <div className="pt-1">
                      <a
                        href={normalizeDestinationUrl(homepagePromo.destinationUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium truncate max-w-full"
                      >
                        <span className="truncate">{normalizeDestinationUrl(homepagePromo.destinationUrl)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-6 py-8 px-4 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs font-medium text-slate-500">No promotion assigned to Homepage slot</span>
                  <button
                    onClick={() => openCreateModal('Homepage')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Configure Homepage Slot</span>
                  </button>
                </div>
              )}
            </div>

            {homepagePromo && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(homepagePromo)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit / Replace</span>
                </button>
                <button
                  onClick={() => setDeletingId(homepagePromo.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Slot 2: Scholarship Details Placement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <h3 className="text-base font-bold text-slate-900">Scholarship Details Slot</h3>
                </div>
                {detailsPromo && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {detailsPromo.placement === 'Both' ? 'Both Locations' : 'Scholarship Details Only'}
                  </span>
                )}
              </div>

              {detailsPromo ? (
                <div className="mt-4 space-y-3">
                  {detailsPromo.imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={detailsPromo.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {detailsPromo.title || <span className="text-slate-400 italic">No Title</span>}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {detailsPromo.description || <span className="text-slate-400 italic">No Description</span>}
                    </p>
                  </div>
                  {detailsPromo.destinationUrl && (
                    <div className="pt-1">
                      <a
                        href={normalizeDestinationUrl(detailsPromo.destinationUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium truncate max-w-full"
                      >
                        <span className="truncate">{normalizeDestinationUrl(detailsPromo.destinationUrl)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-6 py-8 px-4 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs font-medium text-slate-500">No promotion assigned to Scholarship Details slot</span>
                  <button
                    onClick={() => openCreateModal('Scholarship Details')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Configure Details Slot</span>
                  </button>
                </div>
              )}
            </div>

            {detailsPromo && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(detailsPromo)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit / Replace</span>
                </button>
                <button
                  onClick={() => setDeletingId(detailsPromo.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROMOTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{editingPromo ? 'Edit Promotion' : 'Create New Promotion'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromotion} className="p-6 overflow-y-auto space-y-5">
              {/* Title (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Promotion Title <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Text <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter description text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-y"
                />
              </div>

              {/* Image Upload & URL Options */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Promotion Image <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>

                {/* File Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs shrink-0">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400">or enter image URL below</span>
                </div>

                {/* External Image URL Alternative */}
                <div>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      if (!selectedFile) setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Image Preview Box */}
                {imagePreview && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFormImageUrl('');
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Destination URL <span className="text-slate-400 font-normal lowercase">(optional link on click)</span>
                </label>
                <input
                  type="text"
                  value={formDestinationUrl}
                  onChange={(e) => setFormDestinationUrl(e.target.value)}
                  placeholder="e.g. https://website.com, mailto:info@example.com, affiliate links..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Placement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Placement
                </label>
                <select
                  value={formPlacement}
                  onChange={(e) => setFormPlacement(e.target.value as PromotionPlacement)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Homepage">Homepage Only</option>
                  <option value="Scholarship Details">Scholarship Details Only</option>
                  <option value="Both">Both Locations</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-normal">
                  Saving will update the selected slot and preserve promotions assigned to other placements.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPromo ? 'Save Changes' : 'Create Promotion'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Affiliate Promotion?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to delete this promotion? It will immediately disappear from the website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
