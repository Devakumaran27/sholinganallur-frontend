import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  accentColor = 'navy', // 'navy', 'teal', 'blue', 'purple'
  badgeText = 'Dataset Verified',
}) {
  const colorStyles = {
    navy: {
      bg: 'bg-slate-900',
      iconBg: 'bg-slate-100 text-slate-800',
      border: 'border-slate-200/80',
    },
    teal: {
      bg: 'bg-teal-700',
      iconBg: 'bg-teal-50 text-teal-700',
      border: 'border-teal-100',
    },
    blue: {
      bg: 'bg-blue-600',
      iconBg: 'bg-blue-50 text-blue-700',
      border: 'border-blue-100',
    },
    purple: {
      bg: 'bg-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-700',
      border: 'border-indigo-100',
    },
  };

  const style = colorStyles[accentColor] || colorStyles.navy;

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 border ${style.border} shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {value}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>{subtext}</span>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

