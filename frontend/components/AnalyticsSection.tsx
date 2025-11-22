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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
} from 'recharts';

export default function AnalyticsSection() {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [taskStats, setTaskStats] = useState<any>(null);
  const [focusHours, setFocusHours] = useState<any>(null);
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<any[]>([]);
  const [taskComparison, setTaskComparison] = useState<any>(null);
  const [productivityTrends, setProductivityTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [daily, weekly, tasks, focus, sleep, monthly, comparison, trends] = await Promise.all([
        api.get('/api/analytics/daily-productivity?days=7'),
        api.get('/api/analytics/weekly-productivity?weeks=4'),
        api.get('/api/analytics/task-statistics'),
        api.get('/api/analytics/focus-hours'),
        api.get('/api/analytics/sleep-performance'),
        api.get('/api/analytics/monthly-progress'),
        api.get('/api/analytics/task-comparison'),
        api.get('/api/analytics/productivity-trends'),
      ]);

      setDailyData(daily.data.data || []);
      setWeeklyData(weekly.data.data || []);
      setTaskStats(tasks.data);
      setFocusHours(focus.data);
      setSleepData(sleep.data.data || []);
      setMonthlyProgress(monthly.data.data || []);
      setTaskComparison(comparison.data || null);
      setProductivityTrends(trends.data?.data || []);
    } catch (error) {
      console.error('Failed to load analytics', error);
      // Set defaults to prevent crashes
      setTaskComparison(null);
      setProductivityTrends([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h2>
        <p className="text-primary-50">Track your productivity, focus hours, and performance insights</p>
      </div>

      {/* Task Statistics */}
      {taskStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-200 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-gray-600 mb-2">📋 Total Tasks</p>
            <p className="text-4xl font-black text-primary-600">{taskStats.total || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-gray-600 mb-2">✅ Completed</p>
            <p className="text-4xl font-black text-green-600">{taskStats.completed || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-yellow-200 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-gray-600 mb-2">⏳ Pending</p>
            <p className="text-4xl font-black text-yellow-600">{taskStats.pending || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-gray-600 mb-2">📈 Completion Rate</p>
            <p className="text-4xl font-black text-blue-600">
              {taskStats.completion_rate?.toFixed(1) || '0.0'}%
            </p>
          </div>
        </div>
      )}

      {/* Daily Productivity Chart */}
      {dailyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📅 Daily Productivity (Last 7 Days)</h3>
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
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📆 Weekly Productivity (Last 4 Weeks)</h3>
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
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">🎯 Focus Hours Analysis</h3>
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

      {/* Completed vs Pending */}
      {taskStats && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📊 Completed vs Pending Tasks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: taskStats.completed },
                  { name: 'Pending', value: taskStats.pending },
                  { name: 'Cancelled', value: taskStats.cancelled },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#f97316" />
                <Cell fill="#94a3b8" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sleep vs Performance */}
      {sleepData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">😴 Sleep vs Performance Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="sleep_hours" name="Sleep (hrs)" />
              <YAxis type="number" dataKey="performance_score" name="Performance" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={sleepData} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Progress */}
      {monthlyProgress.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📈 Monthly Progress (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyProgress}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="progress_score"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorProgress)"
                name="Productivity Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Task Comparison - This Week vs Last Week */}
      {taskComparison && taskComparison.this_week && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📊 Week Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-700 mb-2">This Week</p>
              <p className="text-3xl font-black text-blue-600">{taskComparison.this_week?.completed || 0}</p>
              <p className="text-xs text-blue-600 mt-1">tasks completed</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <p className="text-sm font-semibold text-purple-700 mb-2">Last Week</p>
              <p className="text-3xl font-black text-purple-600">{taskComparison.last_week?.completed || 0}</p>
              <p className="text-xs text-purple-600 mt-1">tasks completed</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Improvement</p>
                <p className={`text-2xl font-black ${taskComparison.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {taskComparison.improvement >= 0 ? '+' : ''}{taskComparison.improvement || 0}
                </p>
              </div>
              <span className="text-4xl">
                {taskComparison.improvement >= 0 ? '📈' : '📉'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Productivity Trends */}
      {productivityTrends.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">📉 Productivity Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productivity" stroke="#f97316" name="Productivity Score" strokeWidth={3} />
              <Line type="monotone" dataKey="study_hours" stroke="#3b82f6" name="Study Hours" strokeWidth={2} />
              <Line type="monotone" dataKey="tasks_completed" stroke="#22c55e" name="Tasks Completed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Improvement Progress Bars */}
      {taskStats && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary-100">
          <h3 className="text-xl font-bold mb-4 text-slate-900">🎯 Improvement Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-slate-700">Task Completion Rate</span>
                <span className="font-bold text-primary-600">{taskStats.completion_rate?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.completion_rate || 0}%` }}
                />
              </div>
            </div>
            {taskStats.by_priority && (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-red-700">High Priority</span>
                    <span className="text-sm font-bold text-red-600">{taskStats.by_priority.high || 0}</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((taskStats.by_priority.high || 0) / (taskStats.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-700">Medium Priority</span>
                    <span className="text-sm font-bold text-yellow-600">{taskStats.by_priority.medium || 0}</span>
                  </div>
                  <div className="w-full bg-yellow-100 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((taskStats.by_priority.medium || 0) / (taskStats.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">Low Priority</span>
                    <span className="text-sm font-bold text-blue-600">{taskStats.by_priority.low || 0}</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((taskStats.by_priority.low || 0) / (taskStats.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

