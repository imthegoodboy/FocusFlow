'use client';

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const emojiOptions = ['📚', '🧠', '🚀', '🎯', '💡', '📝', '🎓', '📖'];

interface SurveyForm {
  wakeup_time: string;
  sleep_time: string;
  study_hours: string;
  screen_time: string;
  exercise_duration: string;
  preferred_break_length: string;
  class_schedule: { day: string; start: string; end: string; subject: string }[];
}

const defaultSurvey: SurveyForm = {
  wakeup_time: '',
  sleep_time: '',
  study_hours: '',
  screen_time: '',
  exercise_duration: '',
  preferred_break_length: '',
  class_schedule: [],
};

function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState<string | null>(emojiOptions[0]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    class_name: '',
    school_name: '',
  });
  const [survey, setSurvey] = useState<SurveyForm>(defaultSurvey);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/student/profile');
      const data = res.data.profile;
      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age?.toString() || '',
          class_name: data.class_name || '',
          school_name: data.school_name || '',
        });
        if (data.avatar_emoji) setAvatarEmoji(data.avatar_emoji);
        if (data.survey) {
          setSurvey({
            wakeup_time: data.survey.wakeup_time || '',
            sleep_time: data.survey.sleep_time || '',
            study_hours: data.survey.study_hours?.toString() || '',
            screen_time: data.survey.screen_time?.toString() || '',
            exercise_duration: data.survey.exercise_duration?.toString() || '',
            preferred_break_length: data.survey.preferred_break_length?.toString() || '',
            class_schedule: data.survey.class_schedule || [],
          });
        }
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const updated = [...survey.class_schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSurvey({ ...survey, class_schedule: updated });
  };

  const addScheduleRow = () => {
    setSurvey({
      ...survey,
      class_schedule: [...survey.class_schedule, { day: '', start: '', end: '', subject: '' }],
    });
  };

  const removeScheduleRow = (index: number) => {
    const updated = survey.class_schedule.filter((_, idx) => idx !== index);
    setSurvey({ ...survey, class_schedule: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/student/profile', {
        name: profile.name,
        age: Number(profile.age),
        class_name: profile.class_name,
        school_name: profile.school_name,
        avatar_emoji: avatarEmoji,
        survey: {
          ...survey,
          study_hours: survey.study_hours ? Number(survey.study_hours) : null,
          screen_time: survey.screen_time ? Number(survey.screen_time) : null,
          exercise_duration: survey.exercise_duration ? Number(survey.exercise_duration) : null,
          preferred_break_length: survey.preferred_break_length ? Number(survey.preferred_break_length) : null,
        },
      });

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        await api.post('/api/student/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Profile saved');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-primary-100 p-8 md:p-12">
        <div className="mb-10">
          <p className="uppercase text-sm tracking-[0.4em] text-primary-500 font-semibold">
            Welcome, let&apos;s personalise FocusFlow
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Tell us about you and your routine
          </h1>
          <p className="text-slate-600 mt-2">
            These details power your dashboard, streaks and notifications. You can update everything later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Student profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Full name', name: 'name', type: 'text' },
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Class / Year', name: 'class_name', type: 'text' },
                { label: 'School / College', name: 'school_name', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(profile as any)[field.name]}
                    onChange={(e) => setProfile({ ...profile, [field.name]: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Pick an avatar</h2>
            <p className="text-slate-600">Choose an emoji or upload a photo—whichever represents you best.</p>
            <div className="flex flex-wrap gap-3">
              {emojiOptions.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-14 h-14 rounded-2xl border text-2xl flex items-center justify-center ${
                    avatarEmoji === emoji ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Or upload image</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-600
                  hover:file:bg-primary-100"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Daily routine survey</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Wake up time', name: 'wakeup_time', type: 'time' },
                { label: 'Sleep time', name: 'sleep_time', type: 'time' },
                { label: 'Study hours per day', name: 'study_hours', type: 'number' },
                { label: 'Screen time (hrs/day)', name: 'screen_time', type: 'number' },
                { label: 'Exercise (hrs/week)', name: 'exercise_duration', type: 'number' },
                { label: 'Preferred break (mins)', name: 'preferred_break_length', type: 'number' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(survey as any)[field.name]}
                    onChange={(e) => setSurvey({ ...survey, [field.name]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Weekly class schedule</p>
                <button
                  type="button"
                  onClick={addScheduleRow}
                  className="text-primary-600 text-sm font-semibold hover:underline"
                >
                  + Add entry
                </button>
              </div>
              {survey.class_schedule.length === 0 && (
                <p className="text-sm text-slate-500">No classes added yet.</p>
              )}
              {survey.class_schedule.map((row, idx) => (
                <div key={idx} className="grid md:grid-cols-4 gap-3 items-end border border-slate-100 p-3 rounded-2xl">
                  {['day', 'start', 'end', 'subject'].map((field) => (
                    <div key={field}>
                      <label className="text-xs uppercase tracking-wide text-slate-500 block mb-1">
                        {field}
                      </label>
                      <input
                        type={field === 'subject' ? 'text' : field === 'day' ? 'text' : 'time'}
                        value={(row as any)[field] || ''}
                        onChange={(e) => handleScheduleChange(idx, field, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(idx)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save and continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireProfile={false}>
      <OnboardingForm />
    </ProtectedRoute>
  );
}

