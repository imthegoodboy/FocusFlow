'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import TasksSection from '@/components/TasksSection';
import RoutineSection from '@/components/RoutineSection';
import AnalyticsSection from '@/components/AnalyticsSection';
import NotificationsPanel from '@/components/NotificationsPanel';
import StreaksDisplay from '@/components/StreaksDisplay';
import AIRecommendations from '@/components/AIRecommendations';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'routine' | 'analytics'>('tasks');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Streaks and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StreaksDisplay />
          </div>
          <div>
            <NotificationsPanel />
          </div>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            {(['tasks', 'routine', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
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
      </div>
    </DashboardLayout>
  );
}

