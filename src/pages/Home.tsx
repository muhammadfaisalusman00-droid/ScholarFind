import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { CategoryCard } from '../components/home/CategoryCard';
import { POPULAR_CATEGORIES } from '../data/scholarships';
import { Scholarship } from '../types/scholarship';
import { scholarshipService } from '../services/scholarshipService';
import { HomepageFieldsData } from '../data/fieldsData';
import { AdSlot } from '../components/ads/AdSlot';
import { AffiliatePromotionCard } from '../components/promotions/AffiliatePromotionCard';

export const Home: React.FC = () => {
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    scholarshipService.getPublicScholarships().then((data) => {
      setAllScholarships(data);
      setFeaturedScholarships(data.slice(0, 9));
    });
  }, []);

  const getDegreeCount = (degreeName: string) => {
    const norm = degreeName.toLowerCase().trim();
    const count = allScholarships.filter(s => s.degreeLevel && s.degreeLevel.toLowerCase().trim() === norm).length;
    return `${count} ${count === 1 ? 'Scholarship' : 'Scholarships'}`;
  };

  const getFieldCount = (fieldName: string, fieldTitle: string) => {
    const normName = fieldName.toLowerCase().trim();
    const normTitle = fieldTitle.toLowerCase().trim();
    const count = allScholarships.filter(s => {
      if (!s.fieldOfStudy) return false;
      const sField = s.fieldOfStudy.toLowerCase().trim();
      return sField === normName || sField === normTitle;
    }).length;
    return `${count} ${count === 1 ? 'Scholarship' : 'Scholarships'}`;
  };

  // Group categories into study levels (Undergraduate, Postgraduate, Master's, PhD)
  const levelCategories = [
    { ...POPULAR_CATEGORIES.find(c => c.id === 'undergraduate')!, count: getDegreeCount('Undergraduate') },
    { ...POPULAR_CATEGORIES.find(c => c.id === 'postgraduate')!, count: getDegreeCount('Postgraduate') },
    { ...POPULAR_CATEGORIES.find(c => c.id === 'masters')!, count: getDegreeCount("Master's") },
    { ...POPULAR_CATEGORIES.find(c => c.id === 'phd')!, count: getDegreeCount('PhD') },
  ].filter(Boolean);

  // Exactly 6 fields for Explore by field homepage section (3 columns x 2 rows)
  const homepage6Fields = HomepageFieldsData.HOMEPAGE_FIELDS.slice(0, 6).map((item) => ({
    id: item.id,
    label: item.title,
    count: getFieldCount(item.field, item.title),
    description: item.description,
    field: item.field,
    icon: item.icon
  }));

  return (
    <div className="space-y-0 bg-[#F8F9FE]">
      {/* 1. Hero / Search Area */}
      <Hero />

      {/* Ad Placement 1: After Hero / Search Section */}
      <AdSlot position="homepage-after-hero" className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4 pb-2" />

      {/* 2. Scholarships Worth Discovering Section */}
      <section className="bg-[#F8F9FE] py-12 sm:py-16">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Featured Opportunities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Scholarships worth discovering
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Explore opportunities from universities and organizations around the world.
              </p>
            </div>

            <Link
              to="/scholarships"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all shrink-0 self-start sm:self-auto"
            >
              <span>View all scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 9 Scholarship Cards (3x3 grid on desktop, 2 cols on tablet, 1 col on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredScholarships.map(scholarship => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>

          {/* View All Scholarships Button directly underneath the 9 cards */}
          <div className="pt-4 text-center">
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all group"
              id="home-view-all-scholarships-btn"
            >
              <span>View All Scholarships</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Browse Section */}
      <section className="bg-white py-12 sm:py-16 border-t border-slate-200/60">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-12">
          
          {/* Subsection A: Explore by study level */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Explore by study level
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Find degree-specific funding for Undergraduate, Postgraduate, Master's, and PhD programs.
                </p>
              </div>

              <Link
                to="/scholarships"
                className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Browse all degrees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Study Level Cards in 1 row on desktop (lg:grid-cols-4), 2 cols on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {levelCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Ad Placement 2: Before Explore by Field Section */}
          <AdSlot position="homepage-before-fields" className="my-8" />

          {/* Subsection B: Explore by field */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Explore by field
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Popular academic disciplines and research grants around the globe.
                </p>
              </div>

              <Link
                to="/fields"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all shrink-0"
              >
                <span>View All Fields</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 6 Field Cards (3 columns x 2 rows on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {homepage6Fields.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>

            {/* View All Fields Button directly underneath the 6 field cards with compact, balanced spacing */}
            <div className="pt-6 text-center">
              <Link
                to="/fields"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all group"
                id="home-view-all-fields-btn"
              >
                <span>View All Fields</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Affiliate Promotion Section (renders only if active promotion exists) */}
          <AffiliatePromotionCard placement="Homepage" className="pt-8" />

        </div>
      </section>
    </div>
  );
};


