import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, AlertCircle, Clock, Share2, Check } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Scholarship } from '../types/scholarship';
import { scholarshipService } from '../services/scholarshipService';
import { formatDate, getDeadlineInfo } from '../utils/dateUtils';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { AdSlot } from '../components/ads/AdSlot';
import { shareScholarship } from '../utils/shareScholarship';
import { AffiliatePromotionCard } from '../components/promotions/AffiliatePromotionCard';

const FIELD_COVER_IMAGES: Record<string, string> = {
  'Computer Science': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
  'Engineering': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
  'Business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
  'Medicine': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
  'Environmental Science': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
  'Arts & Humanities': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
  'Law': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
  'Social Sciences': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
};

const DEFAULT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200'
];

function getScholarshipCoverImage(scholarship: Scholarship): string {
  if (scholarship.imageUrl && scholarship.imageUrl.trim() !== '') return scholarship.imageUrl;
  if (FIELD_COVER_IMAGES[scholarship.fieldOfStudy]) return FIELD_COVER_IMAGES[scholarship.fieldOfStudy];
  
  let hash = 0;
  for (let i = 0; i < scholarship.id.length; i++) {
    hash += scholarship.id.charCodeAt(i);
  }
  return DEFAULT_COVER_IMAGES[hash % DEFAULT_COVER_IMAGES.length];
}

export const ScholarshipDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [related, setRelated] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e?: React.MouseEvent) => {
    if (!scholarship) return;
    const res = await shareScholarship(scholarship, e);
    if (res.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      setLoading(true);
      scholarshipService.getPublicScholarshipBySlug(slug).then((found) => {
        setScholarship(found);
        if (found) {
          scholarshipService.getPublicScholarships().then((all) => {
            const rel = all
              .filter(s => s.id !== found.id && (s.degreeLevel === found.degreeLevel || s.fieldOfStudy === found.fieldOfStudy))
              .slice(0, 3);
            setRelated(rel);
          });
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <div className="text-sm text-slate-500 font-medium">Loading scholarship details...</div>
      </div>
    );
  }

  if (!scholarship) {

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Scholarship Not Found</h1>
        <p className="text-sm text-slate-600 mb-6 max-w-sm">
          The requested opportunity could not be found in our directory.
        </p>
        <Link
          to="/scholarships"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          Return to Scholarships
        </Link>
      </div>
    );
  }

  const deadlineInfo = getDeadlineInfo(scholarship.deadline);
  const coverImageUrl = getScholarshipCoverImage(scholarship);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Scholarships', path: '/scholarships' },
            { label: scholarship.title }
          ]}
        />

        {/* Active Affiliate Promotion (renders above Cover Image if active) */}
        <AffiliatePromotionCard placement="Scholarship Details" />

        {/* 1. COVER IMAGE WITH TITLE OVERLAY & SHARE BUTTON */}
        <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md bg-slate-900">
          <img
            src={coverImageUrl}
            alt={scholarship.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          
          {/* Top Right Share Button */}
          <button
            onClick={(e) => handleShare(e)}
            className="absolute top-4 right-4 z-10 px-3.5 py-2 rounded-xl bg-slate-950/75 hover:bg-blue-600 text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 shadow-lg border border-white/20"
            aria-label="Share Scholarship"
            title={copied ? "Link Copied!" : "Share Scholarship"}
            id="details-share-top-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span className="text-xs font-bold text-white">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 stroke-[2.2]" />
                <span className="text-xs font-bold text-white">Share</span>
              </>
            )}
          </button>

          {/* SCHOLARSHIP TITLE OVERLAY ONLY */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug text-white drop-shadow-sm max-w-5xl">
              {scholarship.title}
            </h1>
          </div>
        </div>

        {/* 2. UNIVERSITY & METADATA BELOW THE COVER IMAGE (Human-Designed Editorial Style) */}
        <div className="space-y-4 pt-1">
          {/* University / Organization Name */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Host University / Organization
            </span>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              {scholarship.organization}
            </p>
          </div>

          {/* Clean Editorial Metadata Line */}
          <div className="py-4 border-y border-slate-200/80 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-700 font-medium">
            {scholarship.country && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Location</span>
                <span className="font-bold text-slate-900">{scholarship.country}</span>
              </div>
            )}
            {scholarship.fieldOfStudy && (
              <>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Field</span>
                  <span className="font-bold text-slate-900">{scholarship.fieldOfStudy}</span>
                </div>
              </>
            )}
            {scholarship.degreeLevel && (
              <>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Study Level</span>
                  <span className="font-bold text-slate-900">{scholarship.degreeLevel}</span>
                </div>
              </>
            )}
            {scholarship.fundingType && (
              <>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Funding</span>
                  <span className="font-bold text-slate-900">{scholarship.fundingType}</span>
                </div>
              </>
            )}
            {scholarship.amount && (
              <>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Value</span>
                  <span className="font-bold text-slate-900">{scholarship.amount}</span>
                </div>
              </>
            )}
            {scholarship.deadline && (
              <>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Deadline</span>
                  <span className="font-bold text-amber-800">{formatDate(scholarship.deadline)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. ABOUT THIS SCHOLARSHIP (Normal Document Layout) */}
        {scholarship.description && scholarship.description.trim() ? (
          <section className="space-y-3 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-200/80 pb-2">
              About This Scholarship
            </h2>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal max-w-5xl">
              <p className="whitespace-pre-line">{scholarship.description}</p>
            </div>
          </section>
        ) : null}

        {/* 4. ELIGIBILITY & REQUIREMENTS */}
        {((scholarship.eligibility && scholarship.eligibility.length > 0) || (scholarship.requirements && scholarship.requirements.length > 0)) && (
          <section className="space-y-5 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-200/80 pb-2">
              Eligibility & Requirements
            </h2>

            <div className="space-y-6 max-w-5xl">
              {/* Eligibility Criteria */}
              {scholarship.eligibility && scholarship.eligibility.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Eligibility Criteria
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {scholarship.eligibility.map((item, idx) => (
                      <li key={idx} className="marker:text-blue-600">
                        <span className="pl-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Documents */}
              {scholarship.requirements && scholarship.requirements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Required Documents
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {scholarship.requirements.map((req, idx) => (
                      <li key={idx} className="marker:text-indigo-600">
                        <span className="pl-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. OTHER IMPORTANT INFORMATION */}
        {((scholarship.benefits && scholarship.benefits.length > 0) || (scholarship.applicationInstructions && scholarship.applicationInstructions.length > 0) || scholarship.eligibleCountries) && (
          <section className="space-y-5 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-200/80 pb-2">
              Important Information & Benefits
            </h2>

            <div className="space-y-6 max-w-5xl text-sm sm:text-base">
              {/* Benefits */}
              {scholarship.benefits && scholarship.benefits.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Benefits Covered
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-normal">
                    {scholarship.benefits.map((benefit, idx) => (
                      <li key={idx} className="marker:text-emerald-600">
                        <span className="pl-1">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application Steps */}
              {scholarship.applicationInstructions && scholarship.applicationInstructions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    How to Apply
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 font-normal">
                    {scholarship.applicationInstructions.map((step, idx) => (
                      <li key={idx} className="marker:font-bold marker:text-slate-900">
                        <span className="pl-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {(scholarship.eligibleCountries || scholarship.lastVerified) && (
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  {scholarship.eligibleCountries && (
                    <>Eligible applicants: <strong className="text-slate-800">{scholarship.eligibleCountries}</strong>. </>
                  )}
                  {scholarship.lastVerified && (
                    <>Information last verified on <strong className="text-slate-800">{scholarship.lastVerified}</strong>.</>
                  )}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Ad Placement 4: Between Requirements and Apply Section */}
        <AdSlot position="scholarship-before-apply" className="my-6" />

        {/* 6. PROMINENT APPLY SECTION (BEFORE RELATED SCHOLARSHIPS) */}
        <section className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-slate-800 text-center space-y-5 shadow-lg my-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
              Ready to Apply?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Apply through the official scholarship application page
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              ScholarFind connects you directly with the official award provider. No registration required.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href={scholarship.applicationUrl || scholarship.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="details-apply-for-scholarship-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-md transition-all cursor-pointer transform hover:scale-[1.01] active:scale-98 group w-full sm:w-auto"
              >
                <span>Apply for this Scholarship</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                onClick={(e) => handleShare(e)}
                id="details-share-apply-section-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer border border-slate-700 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 stroke-[2.2]" />
                    <span>Share Opportunity</span>
                  </>
                )}
              </button>
            </div>

            {deadlineInfo.daysRemaining >= 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {formatDate(scholarship.deadline)} ({deadlineInfo.badgeLabel})</span>
              </div>
            )}
          </div>
        </section>

        {/* Ad Placement 5: Around Lower Portion Near Related Scholarships */}
        <AdSlot position="scholarship-related" className="my-6" />

        {/* 7. RELATED SCHOLARSHIPS (AFTER APPLY SECTION) */}
        {related.length > 0 && (
          <section className="pt-6 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Related Scholarships
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                You may also be interested in these scholarships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rel => (
                <ScholarshipCard key={rel.id} scholarship={rel} />
              ))}
            </div>

            {/* VIEW MORE SCHOLARSHIPS BUTTON */}
            <div className="pt-4 text-center">
              <Link
                to="/scholarships"
                id="view-more-scholarships-btn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-blue-700 border border-slate-200/90 rounded-xl font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all group"
              >
                <span>View More Scholarships</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
