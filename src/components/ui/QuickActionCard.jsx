import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function QuickActionCard({
  title,
  description,
  to,
  icon: Icon,
  badge,
  iconBgColor = 'bg-slate-100 text-slate-800',
}) {
  return (
    <Link
      to={to}
      className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor} transition group-hover:scale-105 duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                {badge}
              </span>
            )}
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-900 transition">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-700 group-hover:text-slate-900">
        <span>Launch Feature</span>
      </div>
    </Link>
  );
}

