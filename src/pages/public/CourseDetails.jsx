import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/CommonUI';
import {
  Clock,
  Users,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileCheck,
  Award,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enrollInCourse } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({ 0: true });
  const [enrolling, setEnrolling] = useState(false);
  const [notification, setNotification] = useState('');

  const isEnrolled = user?.enrolledCourseIds?.includes(id) || user?.enrolledCourseIds?.includes(course?.id);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (index) => {
    setOpenModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    setTimeout(() => {
      enrollInCourse(course.id);
      setEnrolling(false);
      setNotification('Successfully enrolled in this course! It is now in your Student Dashboard.');
      setTimeout(() => setNotification(''), 4000);
    }, 600);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 mt-2">Loading course syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The course you are looking for does not exist or has been moved.</p>
        <Link to="/courses" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        {/* Notification Alert */}
        {notification && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
            <span>{notification}</span>
            <Link to="/student/courses" className="font-bold underline text-emerald-900">
              Go to My Courses →
            </Link>
          </div>
        )}

        {/* Hero Course Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={course.category} />
              <StatusBadge status={course.level} />
              {course.isPaid ? (
                <span className="bg-slate-900 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Paid Certification (₹{course.price})
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  100% Free Track
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Instructor</span>
                <span className="font-bold text-slate-800">{course.instructor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <span className="font-bold text-slate-800">{course.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Enrolled</span>
                <span className="font-bold text-slate-800">{course.enrolledCount} Students</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Rating</span>
                <span className="font-bold text-amber-600">★ {course.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Enrollment Card Sidebar */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-200">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">
                  {course.isPaid ? `₹${course.price}` : 'Free'}
                </span>
                {course.isPaid && (
                  <span className="text-xs text-slate-400 line-through">₹4,999</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Full lifetime access & verified digital certificate</p>
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are enrolled in this track!</span>
                </div>
                <Link
                  to="/student/courses"
                  className="w-full block text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-xs transition"
                >
                  Continue Learning →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm shadow-xs transition"
              >
                {enrolling ? 'Enrolling...' : course.isPaid ? 'Enroll Now (₹' + course.price + ')' : 'Enroll for Free'}
              </button>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Self-paced with weekly office hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-world capstone code review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct internship eligibility</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content & Curriculum Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Curriculum & Lesson Modules</span>
              </h2>

              <div className="space-y-3">
                {course.curriculum?.map((module, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleModule(idx)}
                      className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition"
                    >
                      <div>
                        <p className="text-xs font-semibold text-indigo-600">Module {idx + 1} ({module.duration})</p>
                        <h4 className="text-sm font-bold text-slate-800 mt-0.5">{module.title}</h4>
                      </div>
                      {openModules[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {openModules[idx] && (
                      <div className="p-4 bg-white divide-y divide-slate-100">
                        {module.lessons?.map((lesson, lIdx) => (
                          <div key={lIdx} className="py-2.5 flex items-center justify-between text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4 text-indigo-500" />
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-slate-400">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prerequisites and Outcomes */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>What You Will Achieve</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {course.outcomes?.map((out, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-600" />
                <span>Prerequisites</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {course.prerequisites?.map((pre, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
