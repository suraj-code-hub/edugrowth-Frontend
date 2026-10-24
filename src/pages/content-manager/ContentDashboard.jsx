import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { resourceService } from '../../services/resourceService';
import { StatCard, StatusBadge } from '../../components/CommonUI';
import {
  BookOpen,
  FileText,
  FolderGit2,
  Plus,
  Layers,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

export const ContentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // courses, notes, projects
  const [loading, setLoading] = useState(true);

  // Modal for new content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    isPaid: false,
    duration: '8 Weeks',
    instructor: 'Lead Instructor',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [c, n, p] = await Promise.all([
        courseService.getAllCourses(),
        resourceService.getAllNotes(),
        resourceService.getAllProjects(),
      ]);
      setCourses(c);
      setNotes(n);
      setProjects(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) return;

    try {
      const created = await courseService.createCourse({
        ...newCourse,
        price: Number(newCourse.price),
        isPaid: Number(newCourse.price) > 0,
      });

      setCourses((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNotification(`Course "${created.title}" successfully published to the platform!`);
      setTimeout(() => setNotification(''), 4000);
      setNewCourse({
        title: '',
        category: 'Web Development',
        level: 'Beginner',
        price: 0,
        isPaid: false,
        duration: '8 Weeks',
        instructor: 'Lead Instructor',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Curriculum & Learning Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Content Manager Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit, and organize lessons, study notes, cheat sheets, and student project portfolios.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Course</span>
        </button>
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

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Courses"
          value={courses.length}
          change="All Published"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Notes & Resources"
          value={notes.length}
          change="PDF Handbooks"
          icon={FileText}
          color="teal"
        />
        <StatCard
          title="Project Showcase"
          value={projects.length}
          change="Verified Capstones"
          icon={FolderGit2}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Courses & Lessons ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'notes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Study Notes & Handbooks ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'projects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Capstone Portfolios ({projects.length})
        </button>
      </div>

      {/* Courses Tab Content */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Course Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Enrolled Learners</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      {c.title}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{c.category}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={c.level} />
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {c.isPaid ? `₹${c.price}` : 'Free'}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{c.enrolledCount} learners</td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Handbook Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pages & Format</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Total Downloads</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{n.title}</td>
                    <td className="py-4 px-4 text-slate-600">{n.category}</td>
                    <td className="py-4 px-4 text-slate-500">{n.pages} Pages ({n.format})</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{n.isPaid ? `₹${n.price}` : 'Free'}</td>
                    <td className="py-4 px-4 text-slate-600">{n.downloadCount}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Live
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Tab Content */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{p.category}</span>
              <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1 pt-2">
                {p.techStack?.map((t) => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Publish New Course */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Publish New Course</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Next.js & GraphQL"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner to Advanced">Beginner to Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price in ₹ (0 for Free)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive syllabus overview and competencies covered..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
