'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface RoutineLog {
  id: string;
  date: string;
  wakeup_time?: string;
  sleep_time?: string;
  study_hours: number;
  screen_time: number;
  exercise_duration: number;
  productivity_score?: number;
}

export default function RoutineSection() {
  const [todayLog, setTodayLog] = useState<RoutineLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    wakeup_time: '',
    sleep_time: '',
    study_hours: 0,
    screen_time: 0,
    exercise_duration: 0,
    productivity_score: 5,
    notes: '',
  });

  useEffect(() => {
    loadTodayLog();
  }, []);

  const loadTodayLog = async () => {
    try {
      const response = await api.get('/api/routine/today');
      if (response.data.id) {
        setTodayLog(response.data);
        setFormData({
          wakeup_time: response.data.wakeup_time || '',
          sleep_time: response.data.sleep_time || '',
          study_hours: response.data.study_hours || 0,
          screen_time: response.data.screen_time || 0,
          exercise_duration: response.data.exercise_duration || 0,
          productivity_score: response.data.productivity_score || 5,
          notes: response.data.notes || '',
        });
      }
    } catch (error) {
      // No log for today, that's okay
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        date: new Date().toISOString().split('T')[0],
        ...formData,
      };

      if (todayLog) {
        await api.put(`/api/routine/${todayLog.id}`, data);
        toast.success('Routine log updated!');
      } else {
        await api.post('/api/routine', data);
        toast.success('Routine log created!');
      }
      loadTodayLog();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save routine log');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Routine</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wakeup Time</label>
            <input
              type="time"
              value={formData.wakeup_time}
              onChange={(e) => setFormData({...formData, wakeup_time: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Time</label>
            <input
              type="time"
              value={formData.sleep_time}
              onChange={(e) => setFormData({...formData, sleep_time: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Study Hours</label>
          <input
            type="number"
            step="0.5"
            value={formData.study_hours}
            onChange={(e) => setFormData({...formData, study_hours: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Screen Time (hours)</label>
          <input
            type="number"
            step="0.5"
            value={formData.screen_time}
            onChange={(e) => setFormData({...formData, screen_time: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Duration (minutes)</label>
          <input
            type="number"
            value={formData.exercise_duration}
            onChange={(e) => setFormData({...formData, exercise_duration: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Productivity Score (0-10)
          </label>
          <input
            type="number"
            value={formData.productivity_score}
            onChange={(e) => setFormData({...formData, productivity_score: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          {todayLog ? 'Update Log' : 'Save Log'}
        </button>
      </form>
    </div>
  );
}

