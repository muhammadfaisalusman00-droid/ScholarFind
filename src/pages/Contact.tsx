import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, AlertCircle, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { SITE_CONFIG } from '../constants/siteConfig';

export const Contact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Contact ScholarFind';
  }, []);

  const faqs = [
    {
      q: 'Does ScholarFind charge any fee to use?',
      a: 'No. ScholarFind is 100% free for all students. You do not need to register an account, pay a subscription, or enter credit card information.'
    },
    {
      q: 'Do I submit scholarship applications directly on ScholarFind?',
      a: 'ScholarFind is a discovery directory. To submit an official application, click "Apply on Official Website" on any scholarship page to be directed to the university or foundation portal.'
    },
    {
      q: 'What should I do if I find an incorrect deadline or broken link?',
      a: 'Please send us an email at ' + SITE_CONFIG.contactEmail + ' with the scholarship title and details. Our team will review and update the listing.'
    },
    {
      q: 'Does ScholarFind award scholarships directly or influence selection decisions?',
      a: 'No. ScholarFind does not award scholarships, evaluate candidates, or influence selection decisions. All awards are determined solely by official scholarship committees.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4">
        <Breadcrumbs items={[{ label: 'Contact' }]} />

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs my-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Get in Touch</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact ScholarFind
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Have a question, feedback, or need to report an error with a scholarship listing? We welcome your messages and suggestions to improve ScholarFind.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Direct Email Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-8 border border-slate-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Email Us Directly</h2>
                  <p className="text-xs text-slate-500">Official contact address</p>
                </div>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
                  Official Contact Email
                </span>
                <a
                  href={SITE_CONFIG.mailtoUrl}
                  className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-indigo-900 transition-colors break-all block"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  You Can Contact Us For:
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 shrink-0 mt-2" />
                    <span>General questions or inquiries about ScholarFind</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 shrink-0 mt-2" />
                    <span>Reporting incorrect scholarship information or changed deadlines</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 shrink-0 mt-2" />
                    <span>Reporting broken application links</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 shrink-0 mt-2" />
                    <span>Website performance issues or bug reports</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 shrink-0 mt-2" />
                    <span>Suggestions or feedback to improve scholarship discovery</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a
                href={SITE_CONFIG.mailtoUrl}
                className="w-full py-3.5 bg-indigo-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Us an Email</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* FAQs & Note Section */}
          <div className="lg:col-span-6 space-y-6">
            {/* FAQ Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle className="w-4 h-4 text-indigo-900" />
                <span>Frequently Asked Questions</span>
              </h2>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-100/80 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note Box */}
            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-800" />
                <span>Important Reminder for Applicants</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed text-[11px]">
                ScholarFind is an informational index. Please do not send application documents, transcripts, or personal identity materials to our email address. All official scholarship applications must be submitted directly to the university or scholarship organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
