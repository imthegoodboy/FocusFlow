'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

const benefitCards = [
  {
    title: "Real-time Task Planning",
    copy:
      "FocusFlow enforces non-overlapping schedules, auto-prioritises urgent work and nudges you when a study block opens up. Every task requires a deadline, so nothing slips.",
    icon: "🧠",
  },
  {
    title: "Routine Intelligence",
    copy:
      "Wake-sleep tracking, class hours, screen time and exercise logs combine into a single productivity journal. Missing entries are flagged so your data stays reliable.",
    icon: "📈",
  },
  {
    title: "Guided Coaching",
    copy:
      "Insights highlight when you learn fastest, when to pause, and how sleep impacts exam performance. Recommendations adapt to your habits—not the other way round.",
    icon: "✨",
  },
];

const workflow = [
  {
    title: "Profile & Targets",
    desc: "Describe exams, goals and semester plans so FocusFlow knows what success looks like for you.",
  },
  {
    title: "Daily Routine Log",
    desc: "Capture wake time, study blocks, classes, breaks and workouts in less than a minute per day.",
  },
  {
    title: "Smart Scheduling",
    desc: "Create todos with duration + deadline and let the scheduler prevent clashes while respecting rest windows.",
  },
  {
    title: "Insights & Nudges",
    desc: "Dashboards highlight streaks, low-focus periods and sleep vs. performance trends. Notifications prompt timely action.",
  },
];

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setTimeout(() => setShowContent(true), 150);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-primary-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div
            className="text-2xl font-bold text-primary-600 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            FocusFlow
          </div>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <a href="#impact" className="hover:text-primary-600">
              Impact
            </a>
            <a href="#workflow" className="hover:text-primary-600">
              Workflow
            </a>
            <a href="#students" className="hover:text-primary-600">
              For Students
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border border-primary-300 text-primary-600 hover:bg-primary-50 transition"
            >
              Login
            </Link>
            <Link
              href={authenticated ? "/dashboard" : "/register"}
              className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-200/60"
            >
              {authenticated ? "Dashboard" : "Sign Up"}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <p className="uppercase tracking-[0.3em] text-xs text-primary-500 font-semibold">
            Balanced learning for ambitious students
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Build an exam-ready routine that respects focus, rest and real life.
          </h1>
          <p className="text-lg text-slate-700">
            FocusFlow pairs intelligent scheduling with habit tracking so you know exactly when to study,
            when to pause, and how lifestyle decisions influence marks. One place for tasks, routines,
            analytics and AI coaching.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={authenticated ? "/dashboard" : "/register"}
              className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-200/70"
            >
              {authenticated ? "Open Dashboard" : "Start Free Plan"}
            </Link>
            <Link
              href="#impact"
              className="px-6 py-3 rounded-xl border border-primary-200 text-primary-600 font-semibold hover:bg-primary-50 transition"
            >
              Explore what students see →
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white shadow-2xl shadow-primary-100 p-4">
          <iframe
            src="https://lottie.host/embed/8cac7497-ce76-4918-a630-781a22af2b52/kFkloEu6JT.lottie"
            title="Hero animation"
            className="w-full h-[360px] border-0 rounded-2xl"
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section id="impact" className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {benefitCards.map((card) => (
          <article
            key={card.title}
            className="bg-white rounded-2xl border border-primary-100 p-8 shadow-md hover:-translate-y-1 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-2xl font-semibold text-primary-700 mb-3">{card.title}</h3>
            <p className="text-slate-600 leading-relaxed">{card.copy}</p>
          </article>
        ))}
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="bg-white border-y border-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="uppercase text-primary-500 font-semibold text-sm tracking-widest mb-2">
            Workflow designed for busy semesters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
            Four simple layers keep you organised and motivated.
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-primary-100 p-6 bg-gradient-to-br from-white via-white to-primary-50"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white font-semibold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT FOCUSED */}
      <section
        id="students"
        className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <p className="uppercase text-primary-500 font-semibold text-xs tracking-[0.4em]">
            For motivated learners
          </p>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">
            Why students stay with FocusFlow after exams finish:
          </h2>
          <ul className="space-y-4 text-slate-700">
            <li>• Daily streaks for study, tasks and logging keep you accountable without anxiety.</li>
            <li>
              • Alerts summarize urgent deadlines, low sleep warnings and unused focus windows in plain
              language.
            </li>
            <li>
              • Dashboards correlate sleep, study hours and grades to surface non-obvious improvements.
            </li>
            <li>• Everything is synced to MongoDB so data is durable and ready for future ML upgrades.</li>
          </ul>
          <div className="flex gap-3">
            <Link
              href={authenticated ? "/dashboard" : "/register"}
              className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-200/70"
            >
              {authenticated ? "Resume planning" : "Create your plan"}
            </Link>
            {!authenticated && (
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl border border-primary-300 text-primary-600 font-semibold hover:bg-primary-50 transition"
              >
                Already have an account?
              </Link>
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 text-white p-10 space-y-6 shadow-2xl">
          <h3 className="text-2xl font-semibold">“My day finally makes sense.”</h3>
          <p className="text-lg opacity-90">
            “FocusFlow stopped me from double-booking study blocks with classes and flagged when my sleep
            tanked my math score. The AI suggestions are simple, actionable and eerily accurate.”
          </p>
          <div>
            <p className="font-semibold text-white">Aayushi Sharma</p>
            <p className="text-sm opacity-80">Computer Science Undergraduate</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-primary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between text-sm text-slate-600">
          <p>© {new Date().getFullYear()} FocusFlow. Helping students plan smarter days.</p>
          <div className="flex gap-4">
            <a href="#impact" className="hover:text-primary-600">
              Features
            </a>
            <a href="#workflow" className="hover:text-primary-600">
              Workflow
            </a>
            <a href="/login" className="hover:text-primary-600">
              Sign in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

