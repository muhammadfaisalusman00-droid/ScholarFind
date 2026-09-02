import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Scholarship, DegreeLevel, FundingType, ScholarshipStatus } from '../../types/scholarship';
import { scholarshipService } from '../../services/scholarshipService';
import { ALL_FIELDS, HomepageFieldsData } from '../../data/fieldsData';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileEdit,
  Globe,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Upload,
  Loader2
} from 'lucide-react';

export const AdminScholarshipForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('');
  const [studyDestination, setStudyDestination] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('Undergraduate');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');
  const [fundingType, setFundingType] = useState<FundingType>('Fully Funded');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [eligibleCountries, setEligibleCountries] = useState('');
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [eligibilityText, setEligibilityText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<ScholarshipStatus>('Published');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadScholarship(id);
    } else {
      // Create mode - start with a completely empty and clean form, defaulting status to Published
      setTitle('');
      setOrganization('');
      setCountry('');
      setStudyDestination('');
      setDegreeLevel('Undergraduate');
      setFieldOfStudy(HomepageFieldsData.HOMEPAGE_FIELDS[0]?.field || 'Computer Science');
      setFundingType('Fully Funded');
      setAmount('');
      setDeadline('');
      setEligibleCountries('');
      setDescription('');
      setBenefitsText('');
      setEligibilityText('');
      setRequirementsText('');
      setInstructionsText('');
      setApplicationUrl('');
      setImageUrl('');
      setStatus('Published');
      setFeatured(false);
    }
  }, [id, isEditing]);

  const loadScholarship = async (scholarshipId: string) => {
    setLoading(true);
    const existing = await scholarshipService.getAdminScholarshipById(scholarshipId);
    if (!existing) {
      setError('Scholarship record not found.');
      setLoading(false);
      return;
    }

    setTitle(existing.title || '');
    setOrganization(existing.organization || '');
    setCountry(existing.country || 'United States');
    setStudyDestination(existing.studyDestination || existing.country || 'United States');
    setDegreeLevel(existing.degreeLevel || 'Master\'s');
    setFieldOfStudy(existing.fieldOfStudy || 'Computer Science');
    setFundingType(existing.fundingType || 'Fully Funded');
    setAmount(existing.amount || '');
    setDeadline(existing.deadline || '');
    setEligibleCountries(existing.eligibleCountries || 'International (All Countries)');
    setDescription(existing.description || '');
    setBenefitsText(existing.benefits ? existing.benefits.join('\n') : '');
    setEligibilityText(existing.eligibility ? existing.eligibility.join('\n') : '');
    setRequirementsText(existing.requirements ? existing.requirements.join('\n') : '');
    setInstructionsText(existing.applicationInstructions ? existing.applicationInstructions.join('\n') : '');
    setApplicationUrl(existing.applicationUrl || '');
    setImageUrl(existing.imageUrl || '');
    setStatus(existing.status || 'Published');
    setFeatured(existing.featured || false);

    setLoading(false);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const publicUrl = await scholarshipService.uploadCoverImage(file);
      setImageUrl(publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload cover image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (targetStatus: ScholarshipStatus) => {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Scholarship title is required.');
      return;
    }
    if (!organization.trim()) {
      setError('University / Organization name is required.');
      return;
    }
    if (!deadline) {
      setError('Deadline date is required.');
      return;
    }
    if (!applicationUrl.trim() || !validateUrl(applicationUrl)) {
      setError('Please provide a valid official application URL.');
      return;
    }

    setSaving(true);

    const formattedAppUrl = applicationUrl.startsWith('http')
      ? applicationUrl.trim()
      : `https://${applicationUrl.trim()}`;

    const benefits = benefitsText.split('\n').map((s) => s.trim()).filter(Boolean);
    const eligibility = eligibilityText.split('\n').map((s) => s.trim()).filter(Boolean);
    const requirements = requirementsText.split('\n').map((s) => s.trim()).filter(Boolean);
    const applicationInstructions = instructionsText.split('\n').map((s) => s.trim()).filter(Boolean);

    const scholarshipData = {
      title: title.trim(),
      organization: organization.trim(),
      country: country.trim(),
      studyDestination: studyDestination.trim() || country.trim(),
      degreeLevel,
      fieldOfStudy,
      fundingType,
      amount: amount.trim(),
      deadline,
      eligibleCountries: eligibleCountries.trim(),
      description: description.trim(),
      benefits,
      eligibility,
      requirements,
      applicationInstructions,
      applicationUrl: formattedAppUrl,
      imageUrl: imageUrl.trim(),
      status: targetStatus,
      featured,
    };

    try {
      let savedRecord: Scholarship | null = null;
      if (isEditing && id) {
        savedRecord = await scholarshipService.updateScholarship(id, scholarshipData);
      } else {
        savedRecord = await scholarshipService.createScholarship(scholarshipData);
      }

      if (!savedRecord) {
        throw new Error('Database operation failed to return a saved scholarship record.');
      }

      navigate('/admin/scholarships');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save scholarship record.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Loading scholarship details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/scholarships"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Scholarship' : 'Add New Scholarship'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details below to publish or update this opportunity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving || uploadingImage}
            onClick={() => handleSubmit('Draft')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving || uploadingImage}
            onClick={() => handleSubmit('Published')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : uploadingImage ? 'Uploading Image...' : 'Publish Scholarship'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(status); }} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Basic Information</span>
            </h2>
            <span className="text-xs text-slate-400">Required fields *</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Scholarship Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Global STEM Leaders Excellence Fellowship 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Organization / University */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                University / Organization *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Stanford University / DAAD"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Location / Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Country *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (!studyDestination) setStudyDestination(e.target.value);
                  }}
                  placeholder="e.g. United States, Germany, UK"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Field of Study *
              </label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value={ALL_FIELDS}>{ALL_FIELDS}</option>
                {HomepageFieldsData.HOMEPAGE_FIELDS.map((f) => (
                  <option key={f.id} value={f.field}>
                    {f.field}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Study Level *
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Master's">Master's</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Funding Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Funding Type *
              </label>
              <select
                value={fundingType}
                onChange={(e) => setFundingType(e.target.value as FundingType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Fully Funded">Fully Funded</option>
                <option value="Partially Funded">Partially Funded</option>
                <option value="Tuition Only">Tuition Only</option>
              </select>
            </div>

            {/* Award Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Award Amount / Value
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. $45,000 / year + Stipend"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Deadline *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Eligible Countries */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Eligible Countries
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={eligibleCountries}
                  onChange={(e) => setEligibleCountries(e.target.value)}
                  placeholder="e.g. International (All Countries)"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Cover Image URL & Storage Upload */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cover Image
                </label>
                <label className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... or upload file above"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              {imageUrl && (
                <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="Cover Preview"
                    className="w-16 h-12 object-cover rounded-lg border border-slate-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs text-slate-600 truncate flex-1 font-mono">
                    {imageUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: About / Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            About & Description
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Scholarship Summary / Overview
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of this scholarship program, host institution, and target audience..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Section 3: Criteria & Benefits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Eligibility, Benefits & Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Eligibility */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligibility Criteria
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Enter each criterion on a new line</p>
              <textarea
                rows={4}
                value={eligibilityText}
                onChange={(e) => setEligibilityText(e.target.value)}
                placeholder="e.g. Minimum GPA of 3.5 on 4.0 scale&#10;Bachelor's degree in related domain&#10;IELTS 7.0 or equivalent"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scholarship Benefits / Coverage
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Enter each benefit on a new line</p>
              <textarea
                rows={4}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder="e.g. 100% Tuition coverage&#10;Monthly living stipend of $2,000&#10;International flight allowance"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required Documents
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Enter each required document on a new line</p>
              <textarea
                rows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="e.g. Official academic transcripts&#10;Statement of purpose&#10;Two recommendation letters"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Application Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Instructions
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Enter each step on a new line</p>
              <textarea
                rows={3}
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                placeholder="e.g. Step 1: Complete online portal application&#10;Step 2: Upload certified credentials"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Official Link & Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Application Link & Publishing Status
          </h2>

          <div className="space-y-4">
            {/* Application URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Application Portal URL *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  placeholder="https://university.edu/scholarships/apply"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Featured toggle & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Highlight as Featured Scholarship on Homepage
                </span>
              </label>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Publication Status:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setStatus('Published')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      status === 'Published'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Draft')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      status === 'Draft'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/scholarships"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving || uploadingImage}
            onClick={() => handleSubmit('Draft')}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving || uploadingImage}
            onClick={() => handleSubmit(isEditing ? status : 'Published')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {saving
                ? 'Saving Record...'
                : uploadingImage
                ? 'Uploading Image...'
                : isEditing
                ? 'Update Scholarship'
                : 'Publish Scholarship'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
