import React, { useState, useEffect } from 'react';
import { mentorshipService } from '../../services/mentorshipService';
import { StatusBadge } from '../../components/CommonUI';
import {
  Users2,
  CheckCircle2,
  Sparkles,
  Linkedin,
  Github,
  Clock,
  Send,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const Mentorship = () => {
  const [mentorApps, setMentorApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'apply'

  // Mentor Application Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    organization: '',
    skills: '',
    experience: '',
    topics: '',
    linkedIn: '',
    github: '',
    reason: '',
    availability: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadMentorData();
  }, []);

  const loadMentorData = async () => {
    setLoading(true);
    try {
      const data = await mentorshipService.getMentorApplications();
      setMentorApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMentor = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.currentRole || !form.organization) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const skillsArr = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const topicsArr = form.topics.split(',').map((t) => t.trim()).filter(Boolean);

      const newApp = await mentorshipService.submitMentorApplication({
        ...form,
        skills: skillsArr,
        topics: topicsArr,
      });

      setMentorApps((prev) => [newApp, ...prev]);
      setSuccessMsg('Your application to become an EduGrowth Mentor has been submitted! Our team will review your profile within 48 hours.');
      setForm({
        name: '',
        email: '',
        phone: '',
        currentRole: '',
        organization: '',
        skills: '',
        experience: '',
        topics: '',
        linkedIn: '',
        github: '',
        reason: '',
        availability: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            <Users2 className="w-4 h-4" />
            <span>1-on-1 Engineering Mentorship</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Guidance from Seasoned Tech Leaders
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Get personalized code reviews, career path clarity, and mock technical interview rounds with mentors who have scaled large systems.
          </p>

          {/* Toggle between Active Mentors and Apply as Mentor */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'browse'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Verified Mentors & Statuses
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'apply'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Apply to Become a Mentor
            </button>
          </div>
        </div>

        {/* Tab 1: Browse Mentors & Community Applications */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Active Mentors & Applications</h2>
              <span className="text-xs text-slate-500">{mentorApps.length} Mentors Listed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorApps.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-purple-200 transition space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{mentor.name}</h3>
                        <StatusBadge status={mentor.status} />
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {mentor.currentRole} at <span className="text-indigo-600">{mentor.organization}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Experience: {mentor.experience}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {mentor.linkedIn && (
                        <a
                          href={mentor.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {mentor.github && (
                        <a
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="GitHub Profile"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{mentor.reason}"
                  </p>

                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Core Topics & Mentoring Focus
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(mentor.topics)
                        ? mentor.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium border border-purple-100"
                            >
                              {t}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Availability: {mentor.availability}
                    </span>
                    <button
                      onClick={() => alert(`Session request sent to ${mentor.name}! You will receive a calendar invite once confirmed.`)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Book 1-on-1 Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Mentor Application Form */}
        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Apply to Become an EduGrowth Mentor</h2>
              <p className="text-xs text-slate-500 mt-1">
                Share your knowledge with passionate students, review capstone architectures, and shape the next generation of engineers.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs leading-relaxed">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyMentor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years of Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5+ Years"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={form.currentRole}
                    onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / Startup"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Distributed Systems, Go, System Design, Kubernetes"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mentoring Topics (comma-separated)</label>
                <input
                  type="text"
                  placeholder="System Design Mock, Portfolio Review, Career Transitions"
                  value={form.topics}
                  onChange={(e) => setForm({ ...form, topics: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={form.linkedIn}
                    onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Availability *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturdays 10 AM - 1 PM (2-3 hours)"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Mentoring *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Why do you want to mentor EduGrowth students?"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Mentor Application'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
