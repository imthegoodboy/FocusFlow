import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface PlannedTask {
  id: string;
  name: string;
  duration: number;
  priority: string;
  scheduled_start?: string;
  scheduled_end?: string;
  plan_reason?: string;
  status: string;
  sequence?: number;
}

export const useTodayTasks = () => {
  const [tasks, setTasks] = useState<PlannedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await api.get('/api/tasks', { params: { today: true } });
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to load today’s tasks.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60_000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks };
};

