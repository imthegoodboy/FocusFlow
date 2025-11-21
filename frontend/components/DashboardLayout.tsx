'use client';

import { logout } from '@/lib/auth';
import { StudentProfile } from '@/hooks/useStudentProfile';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: StudentProfile | null;
}

export default function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/home" className="text-2xl font-bold text-primary-600">
              FocusFlow
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
              <Link href="/dashboard" className="hover:text-primary-600">
                Dashboard
              </Link>
              <Link href="/onboarding" className="hover:text-primary-600">
                Profile
              </Link>
              <Link href="/home#workflow" className="hover:text-primary-600">
                Workflow
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDropdown profile={profile} />
            <NotificationDropdown />
            <button
              onClick={logout}
              className="hidden md:inline-flex px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

