"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Navigation() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userEmail');
    window.location.href = '/login';
  };

  return (
    <div className="fixed h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Çorap Panel</h2>
        
        {/* Navigation Links */}
        <nav className="space-y-1">
          <NavLink href="/" label="Ana Sayfa" active={pathname === '/'} icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          <NavLink href="/urun-kimligi" label="Ürün Kimliği" active={pathname.startsWith('/urun-kimligi')} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <NavLink href="/numuneler" label="Numuneler" active={pathname.startsWith('/numuneler')} icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          <NavLink href="/uretim-takibi" label="Üretim Takibi" active={pathname.startsWith('/uretim-takibi')} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          <NavLink href="/raporlar" label="Raporlar" active={pathname.startsWith('/raporlar')} icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </nav>
      </div>
      
      {/* User Profile & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userEmail ? userEmail.split('@')[0] : 'Admin'}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for navigation links
function NavLink({ href, label, active, icon }: { href: string; label: string; active: boolean; icon: string }) {
  return (
    <Link href={href}>
      <div className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
        </svg>
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  );
}
