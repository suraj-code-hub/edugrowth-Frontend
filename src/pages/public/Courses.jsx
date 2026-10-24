import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    level: 'All',
    priceType: 'All',
  });

  const categories = ['All', 'Web Development', 'Computer Science', 'Cloud Computing', 'UI/UX Design'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Beginner to Advanced'];
  const priceTypes = ['All', 'Free', 'Paid'];

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAllCourses(filters);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Learning Tracks</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Industry-Aligned Engineering Courses
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Master essential full-stack, systems, cloud, and design skills with hands-on lesson modules and verified capstones.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search courses, skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    Level: {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={filters.priceType}
                onChange={(e) => handleFilterChange('priceType', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
              >
                {priceTypes.map((p) => (
                  <option key={p} value={p}>
                    Pricing: {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-2">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses match your criteria"
            description="Try resetting your filters or searching with different keywords."
            actionText="Reset All Filters"
            onAction={() =>
              setFilters({
                search: '',
                category: 'All',
                level: 'All',
                priceType: 'All',
              })
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs hover:shadow-md transition"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status={course.level} />
                    {course.isPaid ? (
                      <span className="bg-slate-900/90 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        ₹{course.price}
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        Free Track
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {course.category}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {course.enrolledCount} learners
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Instructor</p>
                      <p className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
                        {course.instructor}
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                    >
                      View Syllabus & Enroll
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
