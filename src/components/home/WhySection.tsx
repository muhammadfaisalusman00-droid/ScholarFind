import React from 'react';
import { CheckCircle2, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

export const WhySection: React.FC = () => {
  const points = [
    {
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Clear eligibility information',
      description: 'Find requirement breakdowns, eligible nationalities, and academic thresholds clearly outlined.'
    },
    {
      icon: ExternalLink,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Official application links',
      description: 'Connect directly to official university and foundation application portals with zero middleman.'
    },
    {
      icon: Calendar,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Scholarship deadlines',
      description: 'Stay updated on key deadlines with live countdown indicators for active application windows.'
    }
  ];

  return (
    <section className="py-14 bg-indigo-50/50 border-y border-indigo-100/80">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
            <span>Official Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your next opportunity could be here.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            ScholarFind brings scholarship opportunities together in one simple place and connects you directly to official application websites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all text-left space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs ${item.color}`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  ✓ {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

