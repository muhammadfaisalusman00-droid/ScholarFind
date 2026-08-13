import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, Check, Building2, MapPin, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { Scholarship } from '../../types/scholarship';
import { formatDate } from '../../utils/dateUtils';
import { shareScholarship } from '../../utils/shareScholarship';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  showDateAdded?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const result = await shareScholarship(scholarship);
    if (result.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Cover image helper - Priority 1: Admin-uploaded imageUrl, Priority 2: Fallbacks
  const getScholarshipImage = (item: Scholarship) => {
    if (item.imageUrl && item.imageUrl.trim() !== '') {
      return item.imageUrl;
    }
    const { id, country } = item;
    if (id === 'sf-001') return 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80'; // Toronto skyline
    if (id === 'sf-002') return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'; // Germany university
    if (id === 'sf-003') return 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80'; // UK campus
    if (id === 'sf-004') return 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80'; // Canada campus
    if (id === 'sf-005') return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'; // Switzerland
    if (country.includes('United States')) return 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80';
    if (country.includes('United Kingdom')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80';
    if (country.includes('Australia')) return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80';
    if (country.includes('Japan')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
  };

  const coverImage = getScholarshipImage(scholarship);

  // Funding badge colors matching screenshot
  const isFully = scholarship.fundingType.toLowerCase().includes('fully');

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
      id={`scholarship-card-${scholarship.id}`}
    >
      {/* 1. Cover Image Banner */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={coverImage}
          alt={scholarship.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Left Funding Badge Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
            isFully 
              ? 'bg-emerald-500' 
              : 'bg-amber-500'
          }`}>
            {scholarship.fundingType}
          </span>
        </div>

        {/* Top Right Share Action Button */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 z-10 px-2.5 py-1.5 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          aria-label="Share Scholarship"
          title={copied ? "Link Copied!" : "Share Scholarship"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span className="text-[11px] font-bold text-white">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="text-[11px] font-bold text-white hidden sm:inline">Share</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
            <Link to={`/scholarships/${scholarship.slug}`} className="focus:outline-none">
              {scholarship.title}
            </Link>
          </h3>

          {/* Organization */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{scholarship.organization}</span>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{scholarship.country}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>{scholarship.degreeLevel}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{scholarship.fieldOfStudy}</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold ${
              isFully ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
            }`}>
              <span>{scholarship.fundingType}</span>
            </span>
          </div>
        </div>

        {/* Footer: Deadline & Action Link */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Deadline: <strong className="text-rose-600 font-bold">{formatDate(scholarship.deadline)}</strong></span>
          </div>

          <button
            onClick={() => navigate(`/scholarships/${scholarship.slug}`)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            aria-label={`View scholarship ${scholarship.title}`}
          >
            <span>View Scholarship</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


