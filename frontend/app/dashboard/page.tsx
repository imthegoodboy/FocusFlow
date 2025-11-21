'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StreaksDisplay from '@/components/StreaksDisplay';
import PlanMyDayCard from '@/components/PlanMyDayCard';
import TodayTasksList from '@/components/TodayTasksList';
import FocusTimer from '@/components/FocusTimer';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useTodayTasks } from '@/hooks/useTodayTasks';
import { PlannedTask } from '@/hooks/useTodayTasks';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { profile, loading } = useStudentProfile();
  const { tasks, loading: tasksLoading, refresh } = useTodayTasks();
  const [activeTask, setActiveTask] = useState<PlannedTask | null>(null);

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
        <div className="space-y-6">
          <PlanMyDayCard />
          <TodayTasksList
            tasks={tasks}
            loading={tasksLoading}
            onRefresh={refresh}
            onStartTimer={(task) => setActiveTask(task)}
          />
          <FocusTimer activeTask={activeTask} />
        </div>
        <aside className="space-y-6">
          <StreaksDisplay />
        </aside>
      </div>
    </DashboardLayout>
  );
}

