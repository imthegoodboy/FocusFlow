'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import AnalyticsSection from '@/components/AnalyticsSection';
import { useStudentProfile } from '@/hooks/useStudentProfile';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}

function AnalyticsContent() {
  const { profile, loading } = useStudentProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout profile={profile}>
      <AnalyticsSection />
    </DashboardLayout>
  );
}

