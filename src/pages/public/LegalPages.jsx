import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
              <p className="text-xs text-slate-400">Last updated: October 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information necessary to provide educational courses, internship placement tracking, and mentorship services. This includes student name, email address, contact numbers, college/university affiliation, educational background, technical skills, resume files, and project repositories.
            </p>

            <h2 className="text-base font-bold text-slate-900">2. How We Protect Student Data</h2>
            <p>
              Student resumes and personal contact details are shared only with verified hiring partners for opportunities the student explicitly applies to. We do not sell student data to third-party advertisers. Backend records are protected via Supabase Row-Level Security (RLS) policies.
            </p>

            <h2 className="text-base font-bold text-slate-900">3. Cookies & Local Storage</h2>
            <p>
              Our application uses local storage and secure session cookies to remember authentication state, course progress, and saved opportunity preferences.
            </p>

            <h2 className="text-base font-bold text-slate-900">4. Your Data Rights</h2>
            <p>
              Students may update or request deletion of their profile, uploaded resumes, and application history at any time by navigating to their Student Profile settings or contacting our support team at support@edugrowth.example.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsConditions = () => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms and Conditions</h1>
              <p className="text-xs text-slate-400">Effective Date: October 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the EduGrowth platform, courses, study notes, mentorship bookings, and placement boards, you agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="text-base font-bold text-slate-900">2. Student Code of Conduct & Academic Integrity</h2>
            <p>
              Students agree that all code submissions, capstones, and project repositories represent their own authentic work or credited open-source contributions. Plagiarized submissions will result in immediate disqualification from placement services.
            </p>

            <h2 className="text-base font-bold text-slate-900">3. Course Enrollments & Certifications</h2>
            <p>
              Enrollment grants single-user access to course lessons, lecture notes, and community Q&A. Certificates of completion are awarded based on satisfactory capstone evaluation and progress milestones.
            </p>

            <h2 className="text-base font-bold text-slate-900">4. Placement & Internship Applications</h2>
            <p>
              EduGrowth facilitates direct interview connections with verified hiring organizations. Hiring decisions, offer terms, and compensation packages are finalized directly between the candidate and the prospective employer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
