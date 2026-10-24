import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import { financeService } from '../../services/financeService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, EmptyState } from '../../components/CommonUI';
import {
  FileText,
  Search,
  Download,
  Lock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';

export const NotesResources = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [filter, setFilter] = useState({
    search: '',
    category: 'All',
    priceType: 'All',
  });
  const [toast, setToast] = useState('');

  const categories = ['All', 'Web Development', 'Software Engineering', 'Database & Backend', 'Algorithms'];

  useEffect(() => {
    loadNotes();
  }, [filter]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAllNotes(filter);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (note) => {
    // Record payment in financeService
    await financeService.recordTransaction({
      studentName: user?.fullName || 'Student User',
      studentEmail: user?.email || 'student@example.com',
      itemType: 'Resource Note',
      itemTitle: note.title,
      amount: note.price,
      status: 'Successful',
      paymentMethod: 'UPI Instant Gateway',
    });

    setPurchasedIds((prev) => [...prev, note.id]);
    setToast(`Unlocked "${note.title}". You can now download the complete handbook!`);
    setTimeout(() => setToast(''), 4000);
  };

  const handleDownload = (note) => {
    setToast(`Downloading verified copy of "${note.title}" (${note.pages} pages)...`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Study Materials</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Notes & Engineering Cheatsheets
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            Dense, high-yield technical notes, interview architecture summaries, and quick references curated by principal software engineers.
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between shadow-xs">
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search notes, algorithms, HLD..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filter.priceType}
              onChange={(e) => setFilter({ ...filter, priceType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            >
              <option value="All">All Pricing Types</option>
              <option value="Free">Free Resources Only</option>
              <option value="Paid">Premium Handbooks</option>
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-2">Loading notes library...</p>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No notes match your filters"
            description="Adjust your search query or reset filters to see all available study resources."
            actionText="Clear Filters"
            onAction={() => setFilter({ search: '', category: 'All', priceType: 'All' })}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {notes.map((note) => {
              const isUnlocked = !note.isPaid || purchasedIds.includes(note.id);
              return (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                          {note.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{note.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">By {note.author} • Updated {note.updatedDate}</p>
                      </div>
                      {note.isPaid ? (
                        <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg shrink-0">
                          ₹{note.price}
                        </span>
                      ) : (
                        <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                          Free PDF
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {note.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span>📄 {note.pages} Pages</span>
                      <span>Format: {note.format}</span>
                      <span>⬇ {note.downloadCount} downloads</span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 underline"
                    >
                      Preview Table of Contents
                    </button>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleDownload(note)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(note)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock for ₹{note.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Table of Contents Preview */}
        {selectedNote && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">{selectedNote.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Handbook Preview & Key Chapters:</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>1. Core Architectural Fundamentals & Invariants</span>
                    <span className="text-slate-400">pg. 1 - 18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Production Failure Cases & Mitigations</span>
                    <span className="text-slate-400">pg. 19 - 42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. High-Throughput Benchmarks & Code Snippets</span>
                    <span className="text-slate-400">pg. 43 - {selectedNote.pages}</span>
                  </div>
                </div>
                <p className="text-slate-500 italic">
                  Complete handbook contains high-resolution system design diagrams, copy-pasteable formulas, and cheat cards.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                {!selectedNote.isPaid || purchasedIds.includes(selectedNote.id) ? (
                  <button
                    onClick={() => {
                      handleDownload(selectedNote);
                      setSelectedNote(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                  >
                    Download PDF
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handlePurchase(selectedNote);
                      setSelectedNote(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Purchase for ₹{selectedNote.price}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
