import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { FileText, Upload, Download, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const ResumeManager = () => {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setErrorMsg('');
      try {
        const res = await profileService.uploadResume(user?.id, file);
        updateProfile({
          resumeFileName: res.fileName,
          resumeFilePath: res.filePath,
          resumeUpdatedDate: res.updatedDate,
        });
        setNotification(`Resume "${file.name}" uploaded successfully to Supabase Storage!`);
        setTimeout(() => setNotification(''), 4000);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to upload resume');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!user?.resumeFilePath && !user?.resumeFileName) return;
    setDownloading(true);
    try {
      const url = await profileService.getResumeDownloadUrl(user.resumeFilePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        setNotification('Simulated preview: Resume is active and attached to your profile.');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to download resume file.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resume & CV Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Attach your standard 1-page engineering resume for automated placement screening and mentor reviews.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Active Resume Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {user?.resumeFileName || 'No resume uploaded'}
              </h3>
              {user?.resumeFileName && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Active for Applications
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.resumeUpdatedDate ? `Uploaded on ${user.resumeUpdatedDate}` : 'Please upload your PDF resume'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.resumeFileName && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Loading...' : 'Download'}</span>
            </button>
          )}
          <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Replace Resume'}</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ATS Screening Readiness Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">ATS Verification Guidelines</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Single Column Standard Layout</span>
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Multi-column tables fail in automated applicant tracking systems. Use clean standard headers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Project URLs Verified</span>
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Every project mentioned includes a working GitHub repository link and a live preview URL.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Clear Education & Graduation Year</span>
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              State your exact college degree, branch, and expected year of graduation (e.g. 2026).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Action Verbs & Measured Results</span>
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Begin bullet points with verbs (Engineered, Architected, Automated) followed by concrete metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
