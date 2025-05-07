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
        <DashboardCard 
          title="Ürün Kimliği" 
          description="Ürün kimlik bilgilerini görüntüleyin veya yeni ürün kimliği oluşturun." 
          icon="/product-icon.svg"
          href="/urun-kimligi"
          color="bg-blue-50 dark:bg-blue-950"
        />
        <DashboardCard 
          title="Numuneler" 
          description="Numune siparişlerini ve durumlarını takip edin." 
          icon="/sample-icon.svg"
          href="/numuneler"
          color="bg-green-50 dark:bg-green-950"
        />
        <DashboardCard 
          title="Siparişler" 
          description="Aktif siparişleri görüntüleyin ve yönetin." 
          icon="/order-icon.svg"
          href="/siparisler"
          color="bg-purple-50 dark:bg-purple-950"
        />
        <DashboardCard 
          title="Üretim Takibi" 
          description="Üretim süreçlerini ve durumlarını izleyin." 
          icon="/production-icon.svg"
          href="/uretim-takibi"
          color="bg-amber-50 dark:bg-amber-950"
        />
        <DashboardCard 
          title="Kullanıcı Yönetimi" 
          description="Kullanıcı hesaplarını ve yetkilerini yönetin." 
          icon="/user-icon.svg"
          href="/kullanicilar"
          color="bg-red-50 dark:bg-red-950"
        />
        <DashboardCard 
          title="Raporlar" 
          description="Üretim ve sipariş raporlarını görüntüleyin." 
          icon="/report-icon.svg"
          href="/raporlar"
          color="bg-cyan-50 dark:bg-cyan-950"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

function DashboardCard({ title, description, icon, href, color }: DashboardCardProps) {
  return (
    <Link href={href} className={`rounded-lg p-6 ${color} border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105`}>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          {/* Fallback to a colored div if icon is not available */}
          {icon ? (
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Image src={icon} width={24} height={24} alt={title} />
            </div>
          ) : (
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{title.charAt(0)}</span>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="mt-auto">
          <span className="inline-flex items-center text-sm font-medium">
            Görüntüle
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default HomePage;
