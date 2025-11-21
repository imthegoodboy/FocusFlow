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
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Cat */}
        <div className="mb-8 animate-bounce">
          <div className="relative">
            {/* Cat Face */}
            <div className="w-32 h-32 mx-auto bg-white rounded-full relative overflow-hidden shadow-2xl">
              {/* Cat Ears */}
              <div className="absolute -top-4 left-2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-primary-300"></div>
              <div className="absolute -top-4 right-2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-primary-300"></div>
              
              {/* Eyes */}
              <div className="absolute top-8 left-6 w-6 h-6 bg-primary-600 rounded-full animate-pulse">
                <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-8 right-6 w-6 h-6 bg-primary-600 rounded-full animate-pulse">
                <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Nose */}
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full"></div>
              
              {/* Mouth */}
              <div className="absolute top-18 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-4 border-2 border-primary-500 border-t-0 rounded-b-full"></div>
              </div>
            </div>
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

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
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

