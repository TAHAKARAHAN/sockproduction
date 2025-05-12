"use client";
import Navigation from "./Navigation";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Mobile menu button - improved positioning */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        type="button"
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile overlay to close sidebar when clicking outside - improved styling */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/25 dark:bg-black/40 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Navigation - improved mobile display */}
      <div className={`fixed z-50 h-full ${sidebarOpen ? 'block' : 'hidden'} md:block md:sticky md:top-0 md:z-30`}>
        <Navigation closeSidebar={closeSidebar} />
      </div>
      
      {/* Content area - improved padding and margin */}
      <div className="flex-1 w-full md:ml-64 p-4 sm:p-6 pt-16 md:pt-6 overflow-x-hidden">
        <main>{children}</main>
      </div>
    </div>
  );
}
