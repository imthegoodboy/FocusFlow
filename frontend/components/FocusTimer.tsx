'use client';

import { useEffect, useState } from 'react';
import { PlannedTask } from '@/hooks/useTodayTasks';

interface FocusTimerProps {
  activeTask: PlannedTask | null;
}

export default function FocusTimer({ activeTask }: FocusTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeTask || !activeTask.scheduled_end) {
      setSecondsLeft(0);
      return;
    }
    const endTime = activeTask.scheduled_end;
    const updateRemaining = () => {
      const end = new Date(endTime).getTime();
      setSecondsLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
    };
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeTask]);

  if (!activeTask) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 text-center text-slate-500">
        All quiet for now. Your next planned block will start automatically at its scheduled time.
      </div>
    );
  }

  const totalSeconds = (activeTask.duration || 0) * 60;
  const progress = totalSeconds ? Math.max(0, (secondsLeft / totalSeconds) * 100) : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const color =
    progress > 60 ? 'stroke-green-500' : progress > 30 ? 'stroke-amber-500' : 'stroke-rose-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="60" className="stroke-slate-200" strokeWidth="8" fill="transparent" />
          <circle
            cx="64"
            cy="64"
            r="60"
            className={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={((100 - progress) / 100) * 2 * Math.PI * 60}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-500">remaining</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Focus mode</p>
        <h3 className="text-xl font-semibold text-slate-900">{activeTask.name}</h3>
        <p className="text-slate-500">
          {activeTask.plan_reason || 'Timer kicks off automatically for every scheduled block.'}
        </p>
      </div>
    </div>
  );
}

