'use client';

import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/home" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition">
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
          <div className="flex items-center gap-2 md:gap-4">
            <ProfileDropdown profile={profile} />
            <NotificationDropdown />
            <button
              onClick={logout}
              className="hidden md:inline-flex px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      active
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-semibold mt-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <SupportChat />
    </div>
  );
}

