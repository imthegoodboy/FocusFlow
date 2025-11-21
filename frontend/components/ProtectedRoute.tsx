'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import api from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export default function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      if (requireProfile) {
        try {
          const res = await api.get('/api/student/profile');
          if (!res.data.profile) {
            router.push('/onboarding');
            return;
          }
        } catch {
          router.push('/onboarding');
          return;
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, requireProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

