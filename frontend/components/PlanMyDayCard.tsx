'use client';

import Link from 'next/link';

export default function PlanMyDayCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-4">
      <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Daily planner</p>
      <h2 className="text-3xl font-bold text-slate-900">Need help planning today?</h2>
      <p className="text-slate-600">
        Head to the dedicated planner to list your tasks. FocusFlow will arrange them around your routine, set
        start times, and push the plan back to this dashboard.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/plan"
          className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg"
        >
          Open planner
        </Link>
        <span className="text-sm text-slate-500">Enter up to six tasks—no priorities needed.</span>
      </div>
    </div>
  );
}

