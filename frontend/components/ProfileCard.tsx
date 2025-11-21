import { StudentProfile } from '@/hooks/useStudentProfile';

interface ProfileCardProps {
  profile: StudentProfile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const imageSrc = profile?.avatar_url
    ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar_url}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-3xl">
          {imageSrc ? (
            <img src={imageSrc} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{profile?.avatar_emoji || '🙂'}</span>
          )}
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">
            {profile?.name || 'Student'}
          </p>
          <p className="text-sm text-slate-600">{profile?.school_name || 'School not set'}</p>
          <p className="text-sm text-slate-500">{profile?.class_name || 'Class not set'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
        <div>
          <p className="font-semibold text-slate-900">{profile?.survey?.study_hours ?? '—'} hrs</p>
          <p className="text-slate-500">Daily study goal</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">{profile?.survey?.screen_time ?? '—'} hrs</p>
          <p className="text-slate-500">Screen time</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">
            {profile?.survey?.wakeup_time || '—'}
          </p>
          <p className="text-slate-500">Wake up</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">
            {profile?.survey?.sleep_time || '—'}
          </p>
          <p className="text-slate-500">Sleep</p>
        </div>
      </div>
    </div>
  );
}

