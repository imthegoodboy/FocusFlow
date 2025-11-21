'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Show splash screen, then redirect to home
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}

