'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
        {/* Lottie Animation */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64">
            <DotLottieReact
              src="https://lottie.host/3ba9d658-a564-4a9d-8da4-106d033c29fe/Mxlqn0yJCm.lottie"
              loop
              autoplay
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}

