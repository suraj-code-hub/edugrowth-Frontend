import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { jobService } from '../../services/jobService';
import { resourceService } from '../../services/resourceService';
import { INITIAL_SERVICES } from '../../data/initialData';
import { StatusBadge } from '../../components/CommonUI';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Users2,
  CheckCircle2,
  Sparkles,
  Laptop,
  Code2,
  Rocket,
  ShieldCheck,
  Search,
  ExternalLink,
  Github,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';

export const Home = () => {
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, p, o] = await Promise.all([
          courseService.getAllCourses(),
          resourceService.getAllProjects(),
          jobService.getAllOpportunities()
        ]);
        setCourses(c.slice(0, 3));
        setProjects(p.slice(0, 3));
        setOpportunities(o.slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white pt-16 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Full-Spectrum Education & Placement Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Learn. Build. <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Share. Grow.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              An all-in-one ecosystem for aspiring software engineers: master industry-grade curriculums, engineer real-world capstone projects, gain 1-on-1 mentorship, and unlock verified jobs and internships.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold border border-slate-300 hover:bg-slate-50 transition"
              >
                <span>View Jobs & Internships</span>
                <Briefcase className="w-4 h-4 text-slate-500" />
              </Link>
              <Link
                to="/mentorship"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
              >
                <span>Find a Mentor</span>
                <Users2 className="w-4 h-4" />
              </Link>
            </div>

            {/* Platform Trust Highlights */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Fake Placements</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Capstones</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Active 1-on-1 Mentors</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free & Paid Tracks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: Learn -> Build -> Work -> Grow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Proven Philosophy</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How EduGrowth Works</h2>
          <p className="text-sm text-slate-500 mt-2">
            A linear, high-accountability blueprint to transform from curious student into capable industry engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative shadow-xs hover:border-indigo-300 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Learn</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engage with modular curriculums covering React, Node.js, Cloud Architectures, and Algorithmic problem solving without fluff.
            </p>
            <div className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              Curated Courses & Notes →
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative shadow-xs hover:border-indigo-300 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Build</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Don’t just watch tutorials. Build full-stack capstone projects with real databases, authentication, responsive design, and tests.
            </p>
            <div className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1">
              Portfolio Projects Showcase →
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative shadow-xs hover:border-indigo-300 transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Work</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apply directly to vetted tech internships and entry-level software positions with your verified portfolio and resume.
            </p>
            <div className="mt-4 text-xs font-semibold text-teal-600 flex items-center gap-1">
              Live Jobs & Internships →
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 relative shadow-xs hover:border-indigo-300 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Grow</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect with experienced tech leads, sharpen interview skills, and accelerate career trajectories through structured mentorship.
            </p>
            <div className="mt-4 text-xs font-semibold text-purple-600 flex items-center gap-1">
              Personalized Mentorship →
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Curriculum</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Courses</h2>
              <p className="text-sm text-slate-500 mt-1">
                Practical, hands-on courses taught by seasoned engineers and tech leads.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>View all courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">{course.instructor}</p>
                      <p>{course.duration} • {course.enrolledCount} enrolled</p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Real Engineering</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Verified Project Showcase</h2>
            <p className="text-sm text-slate-500 mt-1">
              Production architectures engineered by students with real databases, auth & clean code.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Explore all projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col"
            >
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{proj.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.techStack?.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between text-xs">
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Live Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs & Internships */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Placements & Hiring</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Jobs & Internships</h2>
              <p className="text-sm text-slate-500 mt-1">
                Direct openings with transparent salary/stipend, eligibility, and direct application tracking.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                All Jobs →
              </Link>
              <Link
                to="/internships"
                className="text-sm font-semibold text-teal-600 hover:underline"
              >
                All Internships →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={opp.type} />
                        <span className="text-xs text-slate-400">• {opp.workMode}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{opp.title}</h3>
                      <p className="text-sm font-medium text-slate-700">{opp.organization}</p>
                    </div>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md shrink-0">
                      {opp.salary}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opp.skills?.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs text-slate-500">
                  <span>Location: {opp.location}</span>
                  <Link
                    to={opp.type === 'JOB' ? `/jobs/${opp.id}` : `/internships/${opp.id}`}
                    className="font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View & Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Business Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Enterprise & Academic Solutions</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Technology & Business Services</h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineering services, campus bootcamps, digital growth consulting, and industry collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_SERVICES.map((serv) => (
            <div
              key={serv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-sm hover:border-indigo-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{serv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{serv.shortDesc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/services"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry & Contact CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Tech Journey?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of active students and collaborate with industry engineers. Have an institutional or enterprise request? Talk to our team today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-bold hover:bg-slate-100 transition shadow-md"
            >
              Register as Student
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-indigo-800/80 text-white font-semibold border border-indigo-700 hover:bg-indigo-700 transition"
            >
              Submit an Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
