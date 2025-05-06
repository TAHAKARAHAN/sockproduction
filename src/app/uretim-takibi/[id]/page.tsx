"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Production status types - removed Hammadde Girişi and Numune Testi
type ProductionStatus = 
  | "Üretim" 
  | "Burun Dikişi"
  | "Yıkama"
  | "Kurutma"
  | "Paketleme"
  | "Tamamlandı";

// Status color mapping - removed Hammadde Girişi and Numune Testi
const statusColors = {
  "Üretim": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Burun Dikişi": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Yıkama": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Kurutma": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Paketleme": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

// Sample data for production batches
const initialProductions = [
  {
    id: "P001",
    styleNo: "77597",
    urunAdi: "L-Wool Socks with Silk",
    siparisId: "S235",
    musteri: "ECC Legwear",
    miktar: 1200,
    baslangicTarihi: "10.04.2023",
    tahminiTamamlanma: "10.05.2023",
    durum: "Yıkama" as ProductionStatus,
    tamamlanma: 70,
    // Additional details for the detail page
    notlar: "Müşteri numuneden memnun kaldı. Üretim planlandığı gibi devam ediyor.",
    uretimTarihleri: {
      uretimBaslangic: "15.04.2023",
      burunDikisi: "20.04.2023",
      yikama: "25.04.2023",
      kurutma: null,
      paketleme: null,
      tamamlanma: null
    },
    // Add quantities per stage
    asamaMiktarlari: {
      uretimBaslangic: 1200, // Started with 1200 units
      burunDikisi: 1180,     // 1180 units completed this stage
      yikama: 1150,          // 1150 units completed this stage
      kurutma: 0,            // Not started yet
      paketleme: 0,          // Not started yet
      tamamlanma: 0          // Not completed yet
    },
    kaliteKontrol: {
      yapildi: true,
      tarih: "22.04.2023",
      gectiMi: true,
      notlar: "Standartlara uygun üretim devam ediyor."
    },
    siparisBilgileri: {
      teslimatTarihi: "15.05.2023",
      adres: "İstanbul, Türkiye"
    }
  },
  {
    id: "P002",
    styleNo: "77598",
    urunAdi: "Cashmere Sweater",
    siparisId: "S236",
    musteri: "Luxury Knitwear",
    miktar: 800,
    baslangicTarihi: "15.04.2023",
    tahminiTamamlanma: "15.05.2023",
    durum: "Üretim" as ProductionStatus,
    tamamlanma: 40,
    notlar: "Üretim süreci başladı.",
    uretimTarihleri: {
      hammaddeGirisi: "15.04.2023",
      numuneTesti: "17.04.2023",
      uretimBaslangic: "20.04.2023",
      burunDikisi: null,
      yikama: null,
      kurutma: null,
      paketleme: null,
      tamamlanma: null
    },
    kaliteKontrol: {
      yapildi: false,
      tarih: null,
      gectiMi: null,
      notlar: null
    },
    siparisBilgileri: {
      teslimatTarihi: "20.05.2023",
      adres: "İstanbul, Türkiye"
    }
  }
];

export default function UretimDetayPage() {
  const { id } = useParams();
  const [production, setProduction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateData, setUpdateData] = useState({
    tamamlanma: 0,
    durum: "" as ProductionStatus
  });

  useEffect(() => {
    // In a real application, this would be an API call to fetch the production by ID
    const foundProduction = initialProductions.find(p => p.id === id);
    
    // Simulate API delay
    setTimeout(() => {
      setProduction(foundProduction || null);
      if (foundProduction) {
        setUpdateData({
          tamamlanma: foundProduction.tamamlanma,
          durum: foundProduction.durum
        });
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: name === "tamamlanma" ? parseInt(value) : value
    }));
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would be an API call to update the production
    setProduction(prev => ({
      ...prev,
      durum: updateData.durum,
      tamamlanma: updateData.tamamlanma
    }));
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

  if (!production) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Üretim kaydı bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Bu üretim kaydı mevcut değil veya erişim izniniz yok.</p>
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

  // Calculate the production timeline status - removed Hammadde Girişi and Numune Testi
  const productionStages = [
    { key: "uretimBaslangic", label: "Üretim" },
    { key: "burunDikisi", label: "Burun Dikişi" },
    { key: "yikama", label: "Yıkama" },
    { key: "kurutma", label: "Kurutma" },
    { key: "paketleme", label: "Paketleme" },
    { key: "tamamlanma", label: "Tamamlandı" }
  ];

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
                {production.urunAdi}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Üretim ID: {production.id} | Style No: {production.styleNo} | Sipariş ID: {production.siparisId}
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
                        <option value="Üretim">Üretim</option>
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
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.miktar} adet</p>
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
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{production.baslangicTarihi}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Termin:</span> 
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{production.tahminiTamamlanma}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teslimat</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.siparisBilgileri.teslimatTarihi} - {production.siparisBilgileri.adres}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Üretim Süreci</h2>
              
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="space-y-8">
                  {productionStages.map((stage, index) => {
                    const isCompleted = production.uretimTarihleri[stage.key] !== null;
                    const isCurrent = production.durum === stage.label;
                    const stageNote = production.asamaNotlari && production.asamaNotlari[stage.key];
                    const hasNotes = stageNote && stageNote.notlar && stageNote.notlar.trim() !== '';
                    const stageMiktar = production.asamaMiktarlari ? production.asamaMiktarlari[stage.key] : 0;
                    
                    return (
                      <div key={stage.key} className="relative flex items-start">
                        <div className={`absolute left-4 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                          isCompleted ? 'bg-green-500 dark:bg-green-600' : 
                          isCurrent ? 'bg-blue-500 dark:bg-blue-600 animate-pulse' : 
                          'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isCurrent ? (
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          ) : null}
                        </div>
                        <div className="ml-10">
                          <div className="flex items-center">
                            <h3 className={`text-base font-medium ${
                              isCompleted ? 'text-green-600 dark:text-green-400' : 
                              isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                              'text-gray-700 dark:text-gray-300'
                            }`}>
                              {stage.label}
                            </h3>
                            
                            {/* Display quantity */}
                            {(isCompleted || isCurrent) && stageMiktar > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {stageMiktar} adet
                              </span>
                            )}
                          </div>
                          
                          <div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {isCompleted ? `Tamamlandı: ${production.uretimTarihleri[stage.key]}` : 
                              isCurrent ? "Devam ediyor" : 
                              "Bekliyor"}
                            </p>
                            
                            {/* Show notes if available */}
                            {(isCompleted || isCurrent) && hasNotes && (
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Notlar:</p>
                                <p className="text-gray-600 dark:text-gray-300">{stageNote.notlar}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notlar</h2>
              <p className="text-gray-700 dark:text-gray-300">{production.notlar}</p>
            </div>
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quality Control */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Kalite Kontrol</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    production.kaliteKontrol.yapildi ? 
                      (production.kaliteKontrol.gectiMi ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900") : 
                      "bg-gray-100 dark:bg-gray-700"
                  }`}>
                    {production.kaliteKontrol.yapildi ? (
                      production.kaliteKontrol.gectiMi ? (
                        <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )
                    ) : (
                      <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {production.kaliteKontrol.yapildi ? (
                        production.kaliteKontrol.gectiMi ? "Kalite Kontrolden Geçti" : "Kalite Kontrolden Kaldı"
                      ) : "Kalite Kontrol Bekliyor"}
                    </h3>
                    {production.kaliteKontrol.yapildi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tarih: {production.kaliteKontrol.tarih}</p>
                    )}
                  </div>
                </div>
                
                {production.kaliteKontrol.yapildi && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kontrol Notları:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{production.kaliteKontrol.notlar}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Production Variants */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ürün Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Style No</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.styleNo}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ürün</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.urunAdi}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Varyantlar</h3>
                  <div className="mt-2 space-y-2">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Siyah / L</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Çift</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-blue-600 dark:text-blue-400">290</span> / 400 adet
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Siyah / M</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Çift</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-blue-600 dark:text-blue-400">310</span> / 400 adet
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mavi / L</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Çift</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-blue-600 dark:text-blue-400">140</span> / 200 adet
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mavi / M</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Çift</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-blue-600 dark:text-blue-400">130</span> / 200 adet
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                
                <button className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Teslimat Planı
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
