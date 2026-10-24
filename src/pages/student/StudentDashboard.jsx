import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { StatCard, StatusBadge } from '../../components/CommonUI';
import {
  BookOpen,
  Briefcase,
  Bookmark,
  FileCheck2,
  ArrowRight,
  PlayCircle,
  Clock,
  Sparkles,
  User,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentDashboard();
  }, [user]);

  const loadStudentDashboard = async () => {
    setLoading(true);
    try {
      const allCourses = await courseService.getAllCourses();
      const allOpps = await jobService.getAllOpportunities();

      const userCourseIds = user?.enrolledCourseIds || ['c-1', 'c-2'];
      const enrolled = allCourses.filter((c) => userCourseIds.includes(c.id));
      setEnrolledCourses(enrolled);

      const userSavedIds = user?.savedOpportunityIds || ['opp-1'];
      const saved = allOpps.filter((o) => userSavedIds.includes(o.id));
      setSavedOpportunities(saved);

      if (user?.email) {
        const apps = await applicationService.getApplications({ applicantEmail: user.email });
        setApplications(apps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profilePct = user?.profileCompletion || 75;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Student Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            You're currently enrolled in <strong className="text-white">{enrolledCourses.length} active learning tracks</strong> and have <strong className="text-white">{applications.length} active placement applications</strong>.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Link
              to="/courses"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Browse Courses
            </Link>
            <Link
              to="/jobs"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition"
            >
              Find Jobs
            </Link>
            <Link
              to="/internships"
              className="px-3.5 py-2 bg-teal-600/80 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold transition"
            >
              Find Internships
            </Link>
            <Link
              to="/student/profile"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion Widget inside Banner */}
        <div className="mt-6 pt-6 border-t border-indigo-800/80 max-w-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-indigo-200">Profile Readiness</span>
            <span className="font-bold text-white">{profilePct}% Completed</span>
          </div>
          <div className="w-full h-2 bg-indigo-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
              style={{ width: `${profilePct}%` }}
            />
          </div>
          {profilePct < 100 && (
            <p className="text-[11px] text-indigo-300 mt-1.5 flex items-center justify-between">
              <span>Complete your portfolio links and resume for priority placement reviews.</span>
              <Link to="/student/profile" className="underline font-bold text-white shrink-0 ml-2">
                Fix now →
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          change="+1 this month"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Active Applications"
          value={applications.length}
          change="Realtime status tracked"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Saved Opportunities"
          value={savedOpportunities.length}
          change="Ready to apply"
          icon={Bookmark}
          color="teal"
        />
        <StatCard
          title="Resume Status"
          value={user?.resumeFileName ? 'Uploaded' : 'Pending'}
          change={user?.resumeFileName ? 'ATS Verified' : 'Action needed'}
          icon={FileCheck2}
          color="purple"
        />
      </div>

      {/* Continue Learning Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Continue Learning</h2>
          </div>
          <Link to="/student/courses" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All My Courses ({enrolledCourses.length}) →
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
            >
              Explore Free & Paid Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.slice(0, 2).map((course, idx) => (
              <div
                key={course.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/80 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600">{course.category}</span>
                    <span className="text-xs font-semibold text-slate-500">{course.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Progress: {idx === 0 ? '65%' : '30%'}</span>
                    <span>{idx === 0 ? '12/18 Lessons' : '5/15 Lessons'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: idx === 0 ? '65%' : '30%' }}
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">By {course.instructor}</span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
                    >
                      Resume Lesson →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: My Applications & Saved Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Placement Applications</h2>
            <Link to="/student/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
              View History ({applications.length}) →
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No applications submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{app.opportunityTitle}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{app.organization} • Applied {app.appliedDate}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Opportunities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Saved Opportunities</h2>
            <Link to="/student/saved" className="text-xs font-semibold text-indigo-600 hover:underline">
              View Saved ({savedOpportunities.length}) →
            </Link>
          </div>

          {savedOpportunities.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No opportunities bookmarked yet.</p>
          ) : (
            <div className="space-y-3">
              {savedOpportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{opp.title}</span>
                      <StatusBadge status={opp.type} />
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{opp.organization} • {opp.salary}</p>
                  </div>
                  <Link
                    to={opp.type === 'JOB' ? `/jobs/${opp.id}` : `/internships/${opp.id}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
                  >
                    Apply Now →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
