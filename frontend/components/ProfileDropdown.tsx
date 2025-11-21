import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentProfile } from '@/hooks/useStudentProfile';

interface Props {
  profile: StudentProfile | null;
  avatarUrl?: string;
}

export default function ProfileDropdown({ profile }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const imageSrc = profile?.avatar_url
    ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar_url}`
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{profile?.avatar_emoji || '🙂'}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50">
          <div className="px-4 py-4 border-b border-slate-100">
            <p className="text-lg font-semibold text-slate-900">{profile?.name || 'Student'}</p>
            <p className="text-sm text-slate-600">{profile?.school_name}</p>
            <p className="text-sm text-slate-500">{profile?.class_name}</p>
          </div>
          <div className="px-4 py-3 space-y-2 text-sm text-slate-600">
            <p>Age: {profile?.age ?? '—'}</p>
            <p>Study hours: {profile?.survey?.study_hours ?? '—'} hrs/day</p>
            <p>Wake up: {profile?.survey?.wakeup_time ?? '—'}</p>
            <p>Sleep: {profile?.survey?.sleep_time ?? '—'}</p>
          </div>
          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/onboarding');
              }}
              className="w-full text-center text-primary-600 font-semibold hover:underline"
            >
              Edit profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

