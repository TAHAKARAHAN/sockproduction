"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductionById } from "@/lib/production-db";
import type { Production, ProductionStatus } from "@/lib/production-db";

// Status color mapping for visual indication
const statusColors = {
  "Burun Dikişi": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Yıkama": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Kurutma": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Paketleme": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

export default function UretimDetayPage() {
  const { id } = useParams();
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateData, setUpdateData] = useState({
    tamamlanma: 0,
    durum: "" as ProductionStatus
  });

  // Fetch production data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`[UI] Fetching production with ID: ${id}`);
        const startTime = Date.now();
        
        const data = await getProductionById(id as string);
        
        const duration = Date.now() - startTime;
        console.log(`[UI] Production fetch completed in ${duration}ms`);
        
        if (data) {
          setProduction(data);
          setUpdateData({
            tamamlanma: data.tamamlanma,
            durum: data.durum
          });
        } else {
          setError("Üretim kaydı bulunamadı.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching production:", err);
        setError("Üretim bilgisi yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch (e) {
      console.error("Invalid date format:", e);
      return dateString;
    }
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: name === "tamamlanma" ? parseInt(value) : value
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the production
    // For now, we just simulate the update locally
    setProduction(prev => prev ? {
      ...prev,
      durum: updateData.durum as ProductionStatus,
      tamamlanma: updateData.tamamlanma
    } : null);
    setUpdateMode(false);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !production) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Üretim kaydı bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "Bu üretim kaydı mevcut değil veya erişim izniniz yok."}</p>
            <Link 
              href="/uretim-takibi" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Üretim Listesine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main content with production data from database
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Üretim Takibi
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">{production.id}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {production.urun_adi}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Üretim ID: {production.id} | Style No: {production.style_no} | Sipariş ID: {production.siparis_id}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Link 
                href={`/uretim-takibi/${production.id}/duzenle`}
                className="px-4 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Düzenle
              </Link>
              {!updateMode && (
                <button 
                  onClick={() => setUpdateMode(true)}
                  className="px-4 py-2 flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Durumu Güncelle
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Update Form */}
            {updateMode && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Durum Güncelleme</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="durum" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Üretim Durumu
                      </label>
                      <select
                        id="durum"
                        name="durum"
                        value={updateData.durum}
                        onChange={handleUpdateChange}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="Burun Dikişi">Burun Dikişi</option>
                        <option value="Yıkama">Yıkama</option>
                        <option value="Kurutma">Kurutma</option>
                        <option value="Paketleme">Paketleme</option>
                        <option value="Tamamlandı">Tamamlandı</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tamamlanma" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tamamlanma Yüzdesi: {updateData.tamamlanma}%
                      </label>
                      <input
                        type="range"
                        id="tamamlanma"
                        name="tamamlanma"
                        value={updateData.tamamlanma}
                        onChange={handleUpdateChange}
                        min="0"
                        max="100"
                        step="5"
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setUpdateMode(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Production Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Üretim Genel Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Durum</h3>
                    <div className="mt-1 flex items-center">
                      <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full ${statusColors[production.durum]}`}>
                        {production.durum}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">İlerleme</h3>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${production.tamamlanma}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{production.tamamlanma}% tamamlandı</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Miktar</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.miktar.toLocaleString()} adet</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Müşteri</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.musteri}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarihler</h3>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Sipariş:</span> 
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{formatDate(production.baslangic_tarihi)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Termin:</span> 
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{formatDate(production.tahmini_tamamlanma)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notlar</h2>
              <p className="text-gray-700 dark:text-gray-300">{production.notlar || "Not bulunmamaktadır."}</p>
            </div>
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ürün Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Style No</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.style_no}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ürün</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.urun_adi}</p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hızlı İşlemler</h2>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Üretim Raporu İndir
                </button>
                
                <button className="w-full px-4 py-2.5 border border-transparent rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Kalite Kontrol Raporu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
