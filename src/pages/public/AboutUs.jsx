import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Target, HeartHandshake, Award, Users, BookOpen, Sparkles } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Building Real Engineering Careers Through Real Engineering.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            EduGrowth was founded with a singular conviction: tech education should be accountable, project-centric, and directly tied to industry outcomes.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Outcome-Driven Curriculum</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We eliminate filler content. Every lesson, module, and assignment teaches real production skills needed by high-growth startups and tech enterprises today.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Authenticity & Zero Slop</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No fabricated placement figures, fake partnerships, or superficial certificates. Our candidates stand out because their GitHub repos and projects demonstrate authentic competency.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Empowering Non-Metro Talent</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Democratizing access to high-caliber mentorship, system design training, and internship opportunities for students across all colleges and backgrounds.
            </p>
          </div>
        </div>

        {/* Platform Milestones */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white mt-16 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">EduGrowth Impact</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Measured through actual student milestones and engineering projects delivered.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-slate-800 last:border-none">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">12,500+</p>
              <p className="text-xs text-slate-400 mt-1">Students Enrolled</p>
            </div>
            <div className="p-4 border-r border-slate-800 last:border-none">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">450+</p>
              <p className="text-xs text-slate-400 mt-1">Production Capstones</p>
            </div>
            <div className="p-4 border-r border-slate-800 last:border-none">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">85+</p>
              <p className="text-xs text-slate-400 mt-1">Hiring Partners</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">150+</p>
              <p className="text-xs text-slate-400 mt-1">Active Industry Mentors</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-slate-900">Want to join or partner with us?</h2>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Get in Touch
            </Link>
            <Link
              to="/mentorship"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
