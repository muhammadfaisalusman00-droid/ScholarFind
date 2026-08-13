import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { SITE_CONFIG } from '../constants/siteConfig';

export const Terms: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions | ScholarFind';
  }, []);

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs my-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-950 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-xs text-slate-500 mt-1">Last updated: August 11, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
            {/* 1. Acceptance of Terms */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the ScholarFind website ("Service"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree to these Terms, please do not access or use our website.
              </p>
            </section>

            {/* 2. About ScholarFind */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">2. About ScholarFind</h2>
              <p>
                ScholarFind is an independent scholarship discovery and information directory. Our platform compiles and organizes public scholarship opportunities offered by universities, government departments, and non-profit organizations to assist students in finding higher education funding.
              </p>
              <p className="font-semibold text-slate-900">
                ScholarFind is NOT a scholarship provider, university, educational institution, or government entity. We do not evaluate applications, conduct selections, or distribute monetary awards.
              </p>
            </section>

            {/* 3. Scholarship Information & Accuracy Disclaimer */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">3. Scholarship Information & Accuracy</h2>
              <p>
                ScholarFind provides scholarship information strictly for discovery and informational purposes. While we endeavor to maintain accurate and up-to-date listings:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                <li>Scholarship details, deadlines, eligibility requirements, award amounts, and application criteria are determined solely by official scholarship organizations and may change without notice.</li>
                <li>ScholarFind does NOT guarantee that any scholarship listing is complete, current, or error-free at any given time.</li>
                <li>Students are strictly required to verify all requirements, deadlines, and guidelines directly on the official university or provider portal before submitting an application.</li>
              </ul>
            </section>

            {/* 4. External Links & Applications */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">4. External Links & Applications</h2>
              <p>
                ScholarFind contains outbound links to external third-party websites. These links are provided solely for user convenience.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>ScholarFind does not control, endorse, or accept responsibility for the content, privacy policies, or practices of external websites.</li>
                <li>Submitting an application or personal information on a third-party website is done entirely at your own risk.</li>
                <li>ScholarFind is not responsible for decisions made by scholarship committees or educational institutions.</li>
              </ul>
            </section>

            {/* 5. User Responsibilities */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">5. User Responsibilities</h2>
              <p>
                When using ScholarFind, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>Use the website strictly for lawful, personal, non-commercial informational purposes.</li>
                <li>Not attempt to disrupt, compromise, or overload website infrastructure.</li>
                <li>Independently verify all scholarship requirements before taking action or applying.</li>
              </ul>
            </section>

            {/* 6. Intellectual Property */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">6. Intellectual Property</h2>
              <p>
                All original branding, interface design, layout, code, and curated database structure on ScholarFind are owned by or licensed to ScholarFind. Official university logos, institutional names, and scholarship trademarks belong to their respective copyright holders and are referenced under nominative fair use for identification purposes.
              </p>
            </section>

            {/* 7. Website Availability */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">7. Website Availability</h2>
              <p>
                We strive to maintain continuous website availability. However, ScholarFind reserves the right to modify, suspend, or discontinue any part of the service at any time without notice for maintenance or updates.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, ScholarFind and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, the platform or reliance on any information provided on the website.
              </p>
            </section>

            {/* 9. Changes to the Website & Terms */}
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-slate-900">9. Changes to These Terms</h2>
              <p>
                ScholarFind reserves the right to revise these Terms at any time. Continued use of the website following any changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* 10. Contact Information */}
            <section className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-base font-extrabold text-slate-900">10. Contact Information</h2>
              <p>
                For questions regarding these Terms & Conditions, please contact us by email:
              </p>
              <p className="font-semibold text-slate-900">
                Email: {' '}
                <a
                  href={SITE_CONFIG.mailtoUrl}
                  className="text-indigo-900 underline hover:text-indigo-700 transition-colors"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </p>
              <p className="pt-2">
                You can also reach out via our <Link to="/contact" className="text-indigo-900 underline font-semibold hover:text-indigo-700">Contact Page</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
