'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className={`text-center mb-16 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {/* Animated Cat Logo */}
          <div className="mb-8 animate-bounce-slow">
            <div className="relative inline-block">
              <div className="w-40 h-40 mx-auto bg-white rounded-full relative overflow-hidden shadow-2xl border-4 border-primary-300">
                {/* Cat Ears */}
                <div className="absolute -top-6 left-4 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[35px] border-b-primary-400"></div>
                <div className="absolute -top-6 right-4 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[35px] border-b-primary-400"></div>
                
                {/* Eyes */}
                <div className="absolute top-10 left-8 w-8 h-8 bg-primary-600 rounded-full animate-pulse">
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-10 right-8 w-8 h-8 bg-primary-600 rounded-full animate-pulse">
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
                
                {/* Nose */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full"></div>
                
                {/* Mouth */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-5 border-2 border-primary-500 border-t-0 rounded-b-full"></div>
                </div>

                {/* Whiskers */}
                <div className="absolute top-18 left-2 w-8 h-0.5 bg-primary-400"></div>
                <div className="absolute top-20 left-2 w-8 h-0.5 bg-primary-400"></div>
                <div className="absolute top-18 right-2 w-8 h-0.5 bg-primary-400"></div>
                <div className="absolute top-20 right-2 w-8 h-0.5 bg-primary-400"></div>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-primary-600 mb-6">
            Welcome to <span className="text-primary-400">FocusFlow</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4">
            Your AI-Powered Study Companion 🐱
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your productivity, track your routine, and achieve your academic goals with intelligent recommendations
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-opacity duration-1000 delay-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">Smart Task Management</h3>
            <p className="text-gray-600">
              Organize your tasks with AI-powered scheduling, priority sorting, and conflict detection
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">Routine Tracking</h3>
            <p className="text-gray-600">
              Log your daily activities and get insights into your productivity patterns
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-primary-600 mb-3">AI Recommendations</h3>
            <p className="text-gray-600">
              Get personalized suggestions for optimal study times and productivity tips
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`text-center transition-opacity duration-1000 delay-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {authenticated ? (
            <Link
              href="/dashboard"
              className="inline-block bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="inline-block bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-primary-500"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className={`mt-24 transition-opacity duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center text-primary-600 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and set up your profile' },
              { step: '2', title: 'Complete Survey', desc: 'Tell us about your routine and preferences' },
              { step: '3', title: 'Start Tracking', desc: 'Log your daily activities and tasks' },
              { step: '4', title: 'Get Insights', desc: 'Receive AI-powered recommendations' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-primary-600 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white text-center transition-opacity duration-1000 delay-900 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-100">Free to Use</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">AI</div>
              <div className="text-primary-100">Powered</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

