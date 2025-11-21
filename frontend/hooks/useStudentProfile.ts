import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  class_name: string;
  school_name: string;
  avatar_emoji?: string;
  avatar_url?: string;
  survey?: {
    wakeup_time?: string;
    sleep_time?: string;
    study_hours?: number;
    screen_time?: number;
    exercise_duration?: number;
    preferred_break_length?: number;
    class_schedule?: { day: string; start: string; end: string; subject: string }[];
  };
}

export const useStudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/student/profile');
      setProfile(res.data.profile);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
};

