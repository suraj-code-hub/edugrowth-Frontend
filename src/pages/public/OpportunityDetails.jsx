import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/CommonUI';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Send,
  AlertCircle,
  Bookmark,
} from 'lucide-react';

export const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveOpportunity } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingApp, setExistingApp] = useState(null);

  // Application form state
  const [form, setForm] = useState({
    applicantName: user?.fullName || '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phone || '',
    college: user?.college || '',
    resumeName: user?.resumeFileName || 'Resume_Attached.pdf',
    coverLetter: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isSaved = user?.savedOpportunityIds?.includes(opportunity?.id);

  useEffect(() => {
    fetchOpportunity();
  }, [id, user]);

  const fetchOpportunity = async () => {
    setLoading(true);
    try {
      const opp = await jobService.getOpportunityById(id);
      setOpportunity(opp);

      if (user?.email && opp) {
        const apps = await applicationService.getApplications({
          applicantEmail: user.email,
        });
        const found = apps.find((a) => a.opportunityId === opp.id);
        if (found) setExistingApp(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!form.applicantName || !form.applicantEmail || !form.applicantPhone || !form.college) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const newApp = await applicationService.submitApplication({
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        organization: opportunity.organization,
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        applicantPhone: form.applicantPhone,
        college: form.college,
        resumeName: form.resumeName,
        coverLetter: form.coverLetter,
      });

      setExistingApp(newApp);
      setSuccessMessage('Your application has been submitted successfully! You can track its live status in your Student Dashboard.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 mt-2">Loading opening details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">This opening may have expired or been fulfilled.</p>
        <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
          ← Back to Openings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          to={opportunity.type === 'JOB' ? '/jobs' : '/internships'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {opportunity.type === 'JOB' ? 'Jobs' : 'Internships'}</span>
        </Link>

        {/* Opportunity Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={opportunity.type} />
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {opportunity.workMode}
              </span>
              <span className="text-xs text-slate-400">
                Deadline: {opportunity.deadline}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {opportunity.title}
            </h1>

            <p className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>{opportunity.organization}</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm font-normal text-slate-500 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" /> {opportunity.location}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <span className="text-xl sm:text-2xl font-black text-indigo-700">
              {opportunity.salary}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveOpportunity(opportunity.id)}
                className={`p-2.5 rounded-xl border transition ${
                  isSaved
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
                title="Save opportunity"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              {existingApp && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Application Status:</span>
                  <StatusBadge status={existingApp.status} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details & Application Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Job Description & Eligibility */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Role Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{opportunity.description}</p>
              </div>

              {opportunity.responsibilities && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {opportunity.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">Required Technical Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills?.map((sk) => (
                    <span
                      key={sk}
                      className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <p className="font-semibold text-slate-800">Batch & Eligibility</p>
                  <p className="mt-1">{opportunity.eligibility}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Experience Required</p>
                  <p className="mt-1">{opportunity.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {existingApp ? 'Your Submitted Application' : 'Submit Application'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {existingApp
                  ? 'Your application is on file and active in placement tracking.'
                  : 'Direct application forwarded to the placement team.'}
              </p>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs leading-relaxed">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {existingApp ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <StatusBadge status={existingApp.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applied On:</span>
                    <span className="font-bold text-slate-700">{existingApp.appliedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resume Attached:</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">
                      {existingApp.resumeName || user?.resumeFileName || 'Resume.pdf'}
                    </span>
                  </div>
                  {existingApp.notes && (
                    <div className="pt-2 border-t border-slate-200 text-slate-600">
                      <span className="font-semibold block text-slate-700">Placement Notes:</span>
                      <p className="italic mt-0.5">{existingApp.notes}</p>
                    </div>
                  )}
                </div>

                <Link
                  to="/student/applications"
                  className="w-full block text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                >
                  View in My Applications →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.applicantName}
                    onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.applicantEmail}
                    onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.applicantPhone}
                    onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College / University *</label>
                  <input
                    type="text"
                    required
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resume File</label>
                  <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">
                        {form.resumeName}
                      </span>
                    </div>
                    <label className="cursor-pointer text-[11px] font-bold text-indigo-600 hover:underline">
                      Change
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setForm({ ...form, resumeName: e.target.files[0].name });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brief Introduction / Cover Note</label>
                  <textarea
                    rows={3}
                    placeholder="Why are you a great match for this position?"
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
