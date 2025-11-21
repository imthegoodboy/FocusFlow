'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        router.push('/home');
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Lottie Animation via iframe */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64">
            <iframe
              src="https://lottie.host/embed/3ba9d658-a564-4a9d-8da4-106d033c29fe/Mxlqn0yJCm.lottie"
              className="w-full h-full border-0"
              title="Loading animation"
            />
          </div>
        </div>

        {/* Logo Text */}
        <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
          Focus<span className="text-primary-100">Flow</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-primary-100 mb-8 animate-slide-up">
          Your AI-Powered Study Companion 🐱
        </p>
      </div>
    </div>
  );
}

