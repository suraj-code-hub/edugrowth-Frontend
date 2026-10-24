import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  School,
  BookOpen,
  Wrench,
  FileText,
  Github,
  Linkedin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
  X,
  Sparkles,
} from 'lucide-react';

export const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    alternatePhone: user?.alternatePhone || '',
    college: user?.college || '',
    education: user?.education || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '',
    about: user?.about || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    resumeFileName: user?.resumeFileName || '',
  });

  const [notification, setNotification] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      ...formData,
      skills: skillsArray,
    });

    setIsEditing(false);
    setNotification('Profile details updated successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      alternatePhone: user?.alternatePhone || '',
      college: user?.college || '',
      education: user?.education || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '',
      about: user?.about || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      resumeFileName: user?.resumeFileName || '',
    });
    setIsEditing(false);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingResume(true);
      setTimeout(() => {
        updateProfile({
          resumeFileName: file.name,
          resumeUpdatedDate: new Date().toISOString().split('T')[0],
        });
        setFormData((prev) => ({ ...prev, resumeFileName: file.name }));
        setUploadingResume(false);
        setNotification(`Resume "${file.name}" uploaded and attached to your student profile!`);
        setTimeout(() => setNotification(''), 4000);
      }, 700);
    }
  };

  const profilePct = user?.profileCompletion || 85;

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile & Credentials</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your skills, educational records, and resume updated for placement screening.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Completion Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">Profile Completion Benchmark</span>
          </div>
          <span className="font-extrabold text-indigo-600">{profilePct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${profilePct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Profiles with &gt;80% completeness and verified resumes get 3x higher placement shortlist rates.
        </p>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Personal & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alternate Phone</label>
              <input
                type="tel"
                disabled={!isEditing}
                placeholder="Optional backup contact"
                value={formData.alternatePhone}
                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Academic & Skills Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Academics, Skills & Biography
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Degree & Batch</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Technical Skills (comma-separated)</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">About Me / Career Objective</label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Portfolios & Resume Attachment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            External Portfolios & Resume
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <input
                type="url"
                disabled={!isEditing}
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-70 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Resume Upload UI */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">
                  {user?.resumeFileName || 'No resume uploaded yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {user?.resumeUpdatedDate ? `Last updated on ${user.resumeUpdatedDate}` : 'PDF format recommended (Max 5MB)'}
                </p>
              </div>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition shadow-xs shrink-0 text-center justify-center">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingResume ? 'Uploading...' : 'Upload New Resume'}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
