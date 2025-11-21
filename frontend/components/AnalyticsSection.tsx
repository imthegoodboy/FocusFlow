'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsSection() {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [taskStats, setTaskStats] = useState<any>(null);
  const [focusHours, setFocusHours] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [daily, weekly, tasks, focus] = await Promise.all([
        api.get('/api/analytics/daily-productivity?days=7'),
        api.get('/api/analytics/weekly-productivity?weeks=4'),
        api.get('/api/analytics/task-statistics'),
        api.get('/api/analytics/focus-hours'),
      ]);

      setDailyData(daily.data.data || []);
      setWeeklyData(weekly.data.data || []);
      setTaskStats(tasks.data);
      setFocusHours(focus.data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>

      {/* Task Statistics */}
      {taskStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-primary-600">{taskStats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-primary-600">
              {taskStats.completion_rate?.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Daily Productivity Chart */}
      {dailyData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Daily Productivity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productivity_score" stroke="#f97316" name="Productivity" />
              <Line type="monotone" dataKey="study_hours" stroke="#3b82f6" name="Study Hours" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Productivity Chart */}
      {weeklyData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Weekly Productivity (Last 4 Weeks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week_start" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_productivity" fill="#f97316" name="Avg Productivity" />
              <Bar dataKey="avg_study_hours" fill="#3b82f6" name="Avg Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Focus Hours */}
      {focusHours && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Focus Hours Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">High Focus Hours</p>
              <div className="flex flex-wrap gap-2">
                {focusHours.high_focus_hours?.map((hour: number) => (
                  <span key={hour} className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Low Focus Hours</p>
              <div className="flex flex-wrap gap-2">
                {focusHours.low_focus_hours?.map((hour: number) => (
                  <span key={hour} className="px-3 py-1 bg-red-100 text-red-800 rounded">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

