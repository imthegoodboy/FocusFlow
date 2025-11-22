'use client';

import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import { StudentProfile } from '@/hooks/useStudentProfile';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import dynamic from 'next/dynamic';

const SupportChat = dynamic(() => import('./SupportChat'), { ssr: false });

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: StudentProfile | null;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/plan', label: 'Plan Day', icon: '📅' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/onboarding', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/home" className="text-2xl font-bold text-primary-600">
              FocusFlow
            </Link>
            <nav className="hidden md:flex gap-4 text-sm font-semibold">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      active
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
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
      <SupportChat />
    </div>
  );
}

