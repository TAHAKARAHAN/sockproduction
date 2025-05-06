"use client";
import Navigation from "./Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Always show Navigation component */}
      <Navigation />
      
      {/* Content area, this will be updated while menu stays visible */}
      <div className="flex-1 ml-64"> {/* Width should match the sidebar width */}
        <main>{children}</main>
      </div>
    </div>
  );
}
