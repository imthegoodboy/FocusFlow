'use client';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function AchievementBadge({ title, description, icon, unlocked }: AchievementBadgeProps) {
  return (
    <div className={`p-4 rounded-xl border-2 transition ${
      unlocked 
        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>
          {icon}
        </div>
        <div>
          <p className={`font-bold ${unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className={`text-sm ${unlocked ? 'text-yellow-700' : 'text-gray-400'}`}>
            {description}
          </p>
        </div>
        {unlocked && (
          <div className="ml-auto">
            <span className="text-2xl">✨</span>
          </div>
        )}
      </div>
    </div>
  );
}

