import React from 'react';
import {
  MapPin,
  Route,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Compass,
  MessageSquare,
  Users,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import QuickActionCard from '../components/ui/QuickActionCard';
import StatusBadge from '../components/common/StatusBadge';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant="teal">Chennai Transit Intelligence</StatusBadge>
            <span className="text-xs text-slate-400 font-medium">
              OMR IT Corridor & Sholinganallur
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to RouteWise AI
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Your intelligent companion for smarter public transport journeys in Chennai.
            Access verified MTC timetables, plan multi-stop connections, and query transit knowledge using RAG-grounded AI.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Static GTFS Dataset Baseline</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>145 Grounded Vector Documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Statistics Grid */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Verified Dataset Metrics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified GTFS corpus metrics ingested and indexed for the Sholinganallur corridor.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400 self-start sm:self-auto">
            Not live vehicle telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Bus Stops"
            value="26"
            subtext="Corridor stops indexed"
            icon={MapPin}
            accentColor="teal"
            badgeText="GTFS Dataset"
          />
          <StatCard
            title="Active Routes"
            value="58"
            subtext="Direct & connecting lines"
            icon={Route}
            accentColor="navy"
            badgeText="MTC Network"
          />
          <StatCard
            title="Departures"
            value="18,439"
            subtext="Scheduled service runs"
            icon={Clock}
            accentColor="blue"
            badgeText="Daily Timetable"
          />
          <StatCard
            title="RAG Chunks"
            value="145"
            subtext="Embedded vector docs"
            icon={BookOpen}
            accentColor="purple"
            badgeText="Vector Knowledge"
          />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Find Bus Stops"
            description="Explore all 26 verified corridor stops, coordinates, and nearby service connections."
            to="/stops"
            icon={MapPin}
            iconBgColor="bg-teal-50 text-teal-700"
            badge="Explorer"
          />
          <QuickActionCard
            title="Plan a Journey"
            description="Find optimal route schedules between Sholinganallur, T. Nagar, Tambaram, and Broadway."
            to="/journey"
            icon={Route}
            iconBgColor="bg-blue-50 text-blue-700"
            badge="Timetable"
          />
          <QuickActionCard
            title="Ask RouteWise AI"
            description="Interact with the RAG-grounded transit assistant to answer complex route inquiries."
            to="/chat"
            icon={MessageSquare}
            iconBgColor="bg-indigo-50 text-indigo-700"
            badge="AI Chat"
          />
          <QuickActionCard
            title="Explore Crowd Advisor"
            description="View festival and peak crowd intelligence previews for Chennai corridors."
            to="/crowd-advisor"
            icon={Users}
            iconBgColor="bg-rose-50 text-rose-700"
            badge="Preview"
          />
        </div>
      </section>

      {/* Featured Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journey Planning Feature Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Deterministic GTFS Journey Planning
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              RouteWise AI uses clean, pre-processed GTFS scheduled timetables to calculate accurate connection windows, intermediate transfer hubs, and total travel durations across 58 active bus lines.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Covers Sholinganallur & OMR Hubs</span>
            <span className="font-semibold text-blue-700 flex items-center gap-1">
              Static Timetable <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* AI Assistant Intro Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Grounded AI Transit QA (RAG)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Powered by pgvector embeddings and structured corridor documents. The AI answers queries strictly based on verified MTC timetable chunks, eliminating hallucinations about nonexistent stops or timings.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Strict Grounding Pipeline</span>
            <span className="font-semibold text-purple-700 flex items-center gap-1">
              RAG Verified <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Static Timetable Notice */}
      <div className="rounded-2xl p-5 bg-amber-50/70 border border-amber-200/80 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-950">
            Static Timetable Information Notice
          </h4>
          <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
            All schedules, stop lists, and departures displayed in RouteWise AI are derived from the official MTC Chennai GTFS static dataset. This system does not track live bus locations via GPS or invent real-time arrival estimates.
          </p>
        </div>
      </div>
    </div>
  );
}
