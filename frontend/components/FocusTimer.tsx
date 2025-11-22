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
  
  // Enhanced color coding: Green (>60%), Yellow (30-60%), Red (<30%)
  let color = 'stroke-green-500';
  let bgColor = 'bg-green-50';
  let textColor = 'text-green-700';
  if (progress <= 30) {
    color = 'stroke-red-500';
    bgColor = 'bg-red-50';
    textColor = 'text-red-700';
  } else if (progress <= 60) {
    color = 'stroke-yellow-500';
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-700';
  }

  return (
    <div className={`${bgColor} rounded-2xl border-2 ${color.replace('stroke-', 'border-')} shadow-xl p-8 flex flex-col md:flex-row items-center gap-8`}>
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="80" 
            cy="80" 
            r="72" 
            className="stroke-slate-200" 
            strokeWidth="10" 
            fill="transparent" 
          />
          <circle
            cx="80"
            cy="80"
            r="72"
            className={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 72}
            strokeDashoffset={((100 - progress) / 100) * 2 * Math.PI * 72}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${textColor}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className={`text-xs font-semibold ${textColor} opacity-80`}>remaining</span>
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600 font-bold mb-2">⏱️ Focus Timer</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{activeTask.name}</h3>
        <p className="text-slate-600">
          {activeTask.plan_reason || 'Stay focused! Timer automatically tracks your progress.'}
        </p>
        <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${textColor} ${bgColor}`}>
            {progress > 60 ? '🟢 On Track' : progress > 30 ? '🟡 Keep Going' : '🔴 Hurry Up!'}
          </span>
        </div>
      </div>
    </div>
  );
}

