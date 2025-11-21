'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import TasksSection from '@/components/TasksSection';
import RoutineSection from '@/components/RoutineSection';
import AnalyticsSection from '@/components/AnalyticsSection';
import StreaksDisplay from '@/components/StreaksDisplay';
import ProfileCard from '@/components/ProfileCard';
import { useStudentProfile } from '@/hooks/useStudentProfile';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'routine' | 'analytics'>('tasks');
  const { profile, loading } = useStudentProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout profile={profile}>
      <div className="grid xl:grid-cols-[2fr,1fr] gap-6">
        <section className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
              {(['tasks', 'routine', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'tasks' && <TasksSection />}
            {activeTab === 'routine' && <RoutineSection />}
            {activeTab === 'analytics' && <AnalyticsSection />}
          </div>
        </section>

        <aside className="space-y-6">
          <ProfileCard profile={profile} />
          <StreaksDisplay variant="vertical" />
        </aside>
      </div>
    </DashboardLayout>
  );
}

