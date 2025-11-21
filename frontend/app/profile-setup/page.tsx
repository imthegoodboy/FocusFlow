import { redirect } from 'next/navigation';

export default function LegacyProfileSetupPage() {
  redirect('/onboarding');
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';
export default function ProfileSetupPage() {
  return (
    <ProtectedRoute>
      <ProfileSetupContent />
    </ProtectedRoute>
  );
}
function ProfileSetupContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile data
  const [goals, setGoals] = useState<string[]>(['']);
  const [examDates, setExamDates] = useState<Array<{date: string, subject: string}>>([{date: '', subject: ''}]);
  const [semesterPlan, setSemesterPlan] = useState('');
  const [studyTargets, setStudyTargets] = useState({ daily_hours: 6, weekly_goals: [''] });

  // Survey data
  const [wakeupTime, setWakeupTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [studyHours, setStudyHours] = useState(6);
  const [screenTime, setScreenTime] = useState(4);
  const [exerciseHours, setExerciseHours] = useState(3.5);
  const [breakDuration, setBreakDuration] = useState(15);
  const [classTimings, setClassTimings] = useState<Array<{day: string, start: string, end: string}>>([]);
  const [preferredStudyTimes, setPreferredStudyTimes] = useState<string[]>([]);

  const addGoal = () => setGoals([...goals, '']);
  const removeGoal = (index: number) => setGoals(goals.filter((_, i) => i !== index));
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const addExamDate = () => setExamDates([...examDates, {date: '', subject: ''}]);
  const removeExamDate = (index: number) => setExamDates(examDates.filter((_, i) => i !== index));
  const updateExamDate = (index: number, field: string, value: string) => {
    const newDates = [...examDates];
    newDates[index] = { ...newDates[index], [field]: value };
    setExamDates(newDates);
  };

  const handleProfileSubmit = async () => {
    setLoading(true);
    try {
      await api.put('/api/user/profile', {
        goals: goals.filter(g => g.trim() !== ''),
        exam_dates: examDates.filter(e => e.date && e.subject),
        semester_plan: semesterPlan,
        study_targets: studyTargets
      });
      toast.success('Profile saved!');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySubmit = async () => {
    setLoading(true);
    try {
      await api.put('/api/user/survey', {
        wakeup_time: wakeupTime,
        sleep_time: sleepTime,
        study_hours: studyHours,
        screen_time: screenTime,
        exercise_hours: exerciseHours,
        break_duration: breakDuration,
        class_timings: classTimings,
        preferred_study_times: preferredStudyTimes,
        energy_levels: {
          morning: 8,
          afternoon: 6,
          evening: 7
        }
      });
      toast.success('Survey completed!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">Setup Your Profile</h1>
            <div className="flex items-center mt-4">
              <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-2 rounded mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Step {step} of 2</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Student Profile</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                {goals.map((goal, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter a goal"
                    />
                    {goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGoal}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Add Goal
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Dates</label>
                {examDates.map((exam, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="date"
                      value={exam.date}
                      onChange={(e) => updateExamDate(index, 'date', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      value={exam.subject}
                      onChange={(e) => updateExamDate(index, 'subject', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Subject"
                    />
                    {examDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExamDate(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExamDate}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Add Exam Date
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester Plan</label>
                <textarea
                  value={semesterPlan}
                  onChange={(e) => setSemesterPlan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Describe your semester plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Hours Target</label>
                <input
                  type="number"
                  value={studyTargets.daily_hours}
                  onChange={(e) => setStudyTargets({...studyTargets, daily_hours: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="12"
                />
              </div>

              <button
                onClick={handleProfileSubmit}
                disabled={loading}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue to Survey'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Routine Survey</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wakeup Time</label>
                  <input
                    type="time"
                    value={wakeupTime}
                    onChange={(e) => setWakeupTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Time</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Study Hours per Day</label>
                <input
                  type="number"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  max="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Screen Time (hours/day)</label>
                <input
                  type="number"
                  value={screenTime}
                  onChange={(e) => setScreenTime(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  max="24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise (hours/week)</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseHours}
                  onChange={(e) => setExerciseHours(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="5"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Study Times</label>
                <div className="flex flex-wrap gap-2">
                  {['morning', 'afternoon', 'evening'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        if (preferredStudyTimes.includes(time)) {
                          setPreferredStudyTimes(preferredStudyTimes.filter(t => t !== time));
                        } else {
                          setPreferredStudyTimes([...preferredStudyTimes, time]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        preferredStudyTimes.includes(time)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSurveySubmit}
                  disabled={loading}
                  className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
