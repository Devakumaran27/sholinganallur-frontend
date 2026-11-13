import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  info: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
  teal: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/20',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20',
};

const DOT_COLORS = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  teal: 'bg-teal-500',
  purple: 'bg-purple-500',
  neutral: 'bg-slate-400',
};

export default function StatusBadge({
  children,
  variant = 'neutral',
  dot = true,
  className = '',
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.neutral;
  const dotClass = DOT_COLORS[variant] || DOT_COLORS.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {children}
    </span>
  );
}

