"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MainLayout from './MainLayout';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token && pathname !== '/login') {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  // If we're on login page, don't apply main layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // For all other pages, keep the menu visible and wrap with MainLayout
  return <MainLayout>{children}</MainLayout>;
}
