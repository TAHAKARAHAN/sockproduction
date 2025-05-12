"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const navItems = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ),
    bg: "bg-gray-100 dark:bg-gray-700",
    color: "text-gray-700 dark:text-gray-200"
  },
  {
    href: "/urun-kimligi",
    label: "Ürün Kimliği",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    bg: "bg-blue-100 dark:bg-blue-900",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    href: "/numuneler",
    label: "Numuneler",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    bg: "bg-purple-100 dark:bg-purple-900",
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    href: "/uretim-takibi",
    label: "Üretim Takibi",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    bg: "bg-green-100 dark:bg-green-900",
    color: "text-green-600 dark:text-green-400"
  },
  // {
  //   href: "/raporlar",
  //   label: "Raporlar",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  //     </svg>
  //   ),
  //   bg: "bg-yellow-100 dark:bg-yellow-900",
  //   color: "text-yellow-600 dark:text-yellow-400"
  // },
  {
    href: "/kullanicilar",
    label: "Kullanıcı Yönetimi",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    bg: "bg-indigo-100 dark:bg-indigo-900",
    color: "text-indigo-600 dark:text-indigo-400"
  }
];

interface NavigationProps {
  closeSidebar?: () => void;
}

export default function Navigation({ closeSidebar }: NavigationProps) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = Cookies.get("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    if (closeSidebar) closeSidebar();
    Cookies.remove("authToken", { path: '/' });
    Cookies.remove("userEmail", { path: '/' });
    window.location.href = "/login";
  };

  return (
    <div className="fixed h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Çorap Panel</h2>
        <nav className="flex flex-col gap-1 p-4 font-medium text-[15px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              onClick={() => closeSidebar && closeSidebar()}
            >
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${item.bg} ${item.color} group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userEmail ? userEmail.split("@")[0] : "Admin"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
