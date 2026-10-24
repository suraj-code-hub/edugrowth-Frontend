import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { enquiryService, INQUIRY_CATEGORIES } from '../../services/enquiryService';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const Contact = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('type') || searchParams.get('service') || 'General Inquiry';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: INQUIRY_CATEGORIES.includes(initialCategory) ? initialCategory : 'General Inquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.message) {
      setError('Please provide your full name, email, phone number, and inquiry message.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await enquiryService.submitEnquiry(form);
      setSuccess('Thank you! Your inquiry has been dispatched to the EduGrowth support & partnerships desk. Our team will contact you within 24 hours.');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        inquiryType: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Connect With Us</p>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Reach out for course enrollments, college placement drives, enterprise tech services, or general platform inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our support and admissions team is available Monday through Saturday from 9:00 AM to 7:00 PM IST.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">General Inquiries</span>
                    <a href="mailto:support@edugrowth.example.com" className="font-semibold hover:underline">
                      support@edugrowth.example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Admissions & Placements</span>
                    <p className="font-semibold">+91 (800) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Headquarters</span>
                    <p className="font-semibold text-slate-300">
                      Tech Park Tower B, Outer Ring Road, Bengaluru, Karnataka, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2">
              <p className="font-bold text-slate-200">Are you a recruiter or hiring manager?</p>
              <p className="text-slate-400 text-[11px]">
                Directly connect with our Placement Cell by selecting "Job or Career" or "Industry Collaboration" in the form.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Send an Inquiry</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your details below and our team will get back to you promptly.
              </p>
            </div>

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
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
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization or College</label>
                  <input
                    type="text"
                    placeholder="e.g. DTU / Tech Corp"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inquiry Type *</label>
                <select
                  value={form.inquiryType}
                  onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 font-medium"
                >
                  {INQUIRY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Message / Requirement *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your learning goals, institutional batch requirements, or project scope..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
