"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

function HomePage() {
  const [userName, setUserName] = useState("Admin");
  const router = useRouter();
  
  useEffect(() => {
    // Get username from cookie if available
    const userEmail = Cookies.get('userEmail');
    if (userEmail) {
      // Extract username from email (before @)
      const name = userEmail.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, []);

  return (
    <div className="p-8">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Çorap Denetim ve Üretim Paneli</h1>
          <p className="text-gray-500 mt-2">Hoş geldiniz, {userName}. Yapacağınız işlemi seçin.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ürün Kimliği Card */}
        <Link href="/urun-kimligi" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Ürün Kimliği</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Ürün kimlik bilgilerini görüntüleyin veya yeni ürün kimliği oluşturun.</p>
        </Link>

        {/* Numuneler Card */}
        <Link href="/numuneler" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Numuneler</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Numune siparişlerini ve durumlarını takip edin.</p>
        </Link>

        {/* Üretim Takibi Card */}
        <Link href="/uretim-takibi" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Üretim Takibi</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Üretim süreçlerini ve durumlarını izleyin.</p>
        </Link>

        {/* NEW: Operator Card */}
        <Link href="/operator" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Operatör Paneli</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">QR kod okutarak üretim aşamalarını güncelleyin.</p>
        </Link>

        {/* Kullanıcı Yönetimi Card */}
        <Link href="/kullanicilar" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Kullanıcı Yönetimi</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Kullanıcı hesaplarını ve yetkilerini yönetin.</p>
        </Link>

        {/* Raporlar Card */}
        {/* <Link href="/raporlar" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Raporlar</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Üretim ve sipariş raporlarını görüntüleyin.</p>
        </Link> */}
      </div>
    </div>
  );
}

export default HomePage;
