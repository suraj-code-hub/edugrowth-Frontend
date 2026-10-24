import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import { BookOpen, PlayCircle, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrolled();
  }, [user]);

  const loadEnrolled = async () => {
    setLoading(true);
    try {
      const all = await courseService.getAllCourses();
      const userIds = user?.enrolledCourseIds || ['c-1', 'c-2'];
      const enrolled = all.filter((c) => userIds.includes(c.id));
      setCourses(enrolled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Enrolled Courses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your syllabus progress, watch lesson videos, and complete capstones.</p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <span>Explore More Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses enrolled yet"
          description="Browse our catalogue of free and paid curriculums in full-stack, cloud devops, and algorithms."
          actionText="Browse Courses"
          onAction={() => window.location.assign('/courses')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => {
            const progressPct = idx === 0 ? 65 : 30;
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <StatusBadge status={course.level} />
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span className="font-semibold">Course Progress</span>
                        <span className="font-bold text-indigo-600">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Instructor: {course.instructor}</span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Resume Lesson</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
