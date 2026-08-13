import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Search, ShieldCheck, Filter, ExternalLink, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = 'About ScholarFind';
  }, []);

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <Breadcrumbs items={[{ label: 'About' }]} />

        {/* Page Header */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs my-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Scholarship Discovery Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            About ScholarFind
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl font-normal">
            ScholarFind is a dedicated scholarship discovery website designed to help students worldwide locate, evaluate, and access international higher education funding opportunities more easily.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            Finding higher education funding can be fragmented, confusing, and time-consuming. ScholarFind brings together undergraduate, Master’s, PhD, and research opportunities into one clean, organized discovery platform—helping students spend less time searching and more time preparing quality applications.
          </p>
        </div>

        {/* Core Platform Capabilities */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs my-6 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            What You Can Do on ScholarFind
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Browse Available Scholarships</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore curated listings of university, foundation, and government scholarships around the globe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <Search className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Search Opportunities</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quickly search by scholarship title, university name, country, or specific academic major.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <Filter className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Filter by Relevant Criteria</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Narrow down results by study level, degree type, funding coverage (fully funded, partial, tuition only), and country.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Explore by Study Level & Major</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Navigate opportunities tailored specifically for Undergraduate, Master's, PhD, or specific academic disciplines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Review Detailed Eligibility Info</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Read organized breakdowns of award amounts, required qualifications, application deadlines, and benefits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Apply Directly via Official Links</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Follow direct links to official university and organization application portals to submit your official application.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Role Disclaimer & Limitations */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs my-6 space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Important Information About Our Platform
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
            <p>
              To maintain absolute transparency with our users, please keep the following guidelines in mind while using ScholarFind:
            </p>

            <ul className="list-disc list-inside space-y-2 text-slate-600 font-normal pl-2">
              <li>
                <strong className="text-slate-900">ScholarFind is a discovery platform:</strong> We organize and present scholarship information to help students locate opportunities.
              </li>
              <li>
                <strong className="text-slate-900">We do NOT award scholarships:</strong> All selection decisions, award distributions, and evaluations are conducted solely by the offering universities, foundations, or government entities.
              </li>
              <li>
                <strong className="text-slate-900">We are NOT a university or government agency:</strong> ScholarFind operates as an independent informational resource.
              </li>
              <li>
                <strong className="text-slate-900">We do NOT guarantee scholarship awards:</strong> Admission and scholarship funding depend entirely on meeting the official provider's criteria and deadline requirements.
              </li>
              <li>
                <strong className="text-slate-900">Always verify with the official provider:</strong> Scholarship details (deadlines, funding amounts, eligibility rules) can change. Students should always confirm current details on the official university portal before submitting an application.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Call-to-Action */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xs my-8">
          <h2 className="text-xl sm:text-2xl font-extrabold">Start Discovering Scholarships Today</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Search hundreds of verified undergraduate, Master’s, and doctoral opportunities worldwide.
          </p>
          <div className="pt-2">
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl transition-colors shadow-2xs"
            >
              <span>Explore All Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
