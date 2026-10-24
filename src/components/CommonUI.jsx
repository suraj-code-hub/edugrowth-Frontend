import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : '';

  let bgClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['applied', 'pending', 'draft'].includes(normalized)) {
    bgClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['reviewing', 'in progress', 'hybrid'].includes(normalized)) {
    bgClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (['shortlisted', 'popular'].includes(normalized)) {
    bgClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (['interview'].includes(normalized)) {
    bgClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (['selected', 'completed', 'successful', 'approved', 'free'].includes(normalized)) {
    bgClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['rejected', 'failed', 'archived'].includes(normalized)) {
    bgClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['paid', 'job'].includes(normalized)) {
    bgClasses = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (['internship'].includes(normalized)) {
    bgClasses = 'bg-teal-50 text-teal-800 border-teal-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {status}
    </span>
  );
};

export const StatCard = ({ title, value, change, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">{change}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon }) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
