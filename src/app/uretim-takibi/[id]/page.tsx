"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Production, ProductionStatus, ProductionVariant } from "@/lib/production-db";

// Status color mapping for visual indication
const statusColors = {
  "Üretim": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "Burun Dikişi": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "Yıkama": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  "Kurutma": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  "Paketleme": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
};

export default function UretimDetayPage() {
  const { id } = useParams() as { id: string }; // Ensure id is a string
  const [production, setProduction] = useState<Production | null>(null);
  const [variants, setVariants] = useState<ProductionVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tamamlanma: 0,
    durum: "" as ProductionStatus | "", // Initialize with a valid type
  });

  // Handle changes in the update form
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: name === "tamamlanma" ? parseInt(value) : value
    }));
  };

  // Handle update submission
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductionStatus();
  };

  // Update production status
  const updateProductionStatus = async () => {
    try {
      const response = await fetch(`/api/productions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          durum: updateData.durum,
          tamamlanma: updateData.tamamlanma
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update production status');
      }

      // Update local state
      setProduction(prev => prev ? {
        ...prev,
        durum: updateData.durum as ProductionStatus,
        tamamlanma: updateData.tamamlanma
      } : null);
      
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Error updating production status:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`[UI] Fetching production with ID: ${id}`);
        const startTime = Date.now();

        const response = await fetch(`/api/productions/${id}`);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        const duration = Date.now() - startTime;
        console.log(`[UI] Production fetch completed in ${duration}ms`);

        setProduction(data);
        
        // Initialize update data with current values
        setUpdateData({
          tamamlanma: data.tamamlanma,
          durum: data.durum
        });
        
        // Parse notes to extract variants
        if (data?.notlar) {
          try {
            const parsedNotes = JSON.parse(data.notlar);
            
            // Extract variants
            if (parsedNotes.variants && Array.isArray(parsedNotes.variants)) {
              setVariants(parsedNotes.variants);
              console.log("Found variants in production:", parsedNotes.variants);
            } else if (parsedNotes.additionalDetails?.variants && Array.isArray(parsedNotes.additionalDetails.variants)) {
              // Try alternate location used in some production records
              setVariants(parsedNotes.additionalDetails.variants);
              console.log("Found variants in additionalDetails:", parsedNotes.additionalDetails.variants);
            } else {
              setVariants([]);
              console.log("No variants found in production notes");
            }
          } catch (e) {
            console.error("Failed to parse production notes JSON:", e);
            setVariants([]);
          }
        } else {
          setVariants([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching production:", err);
        setError(err instanceof Error ? err.message : "Üretim bilgisi yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);

  // Format date string
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('tr-TR');
    } catch {
      return dateString; // Return as-is if formatting fails
    }
  };

  const productionStages = [
    { key: "uretimBaslangic", label: "Üretim" },
    { key: "burunDikisi", label: "Burun Dikişi" },
    { key: "yikama", label: "Yıkama" },
    { key: "kurutma", label: "Kurutma" },
    { key: "paketleme", label: "Paketleme" },
    { key: "tamamlanma", label: "Tamamlandı" }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Üretim bilgisi yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-lg">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Bir hata oluştu</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
            >
              Yeniden Dene
            </button>
            <Link
              href="/uretim-takibi"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Üretim Listesine Dön
            </Link>
          </div>
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Üretim Takibi
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">{production.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {production.urun_adi}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Üretim ID: {production.id} | Sipariş No: {production.style_no} | Artikel No: {production.siparis_id}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link
                href={`/uretim-takibi/${id}/duzenle`}
                className="px-4 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Düzenle
              </Link>
              
              {!showUpdateModal && (
                <button 
                  onClick={() => setShowUpdateModal(true)}
                  className="px-4 py-2 flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
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
          <div className="lg:col-span-2 space-y-6">
            {showUpdateModal && (
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
                      onClick={() => setShowUpdateModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Üretim Genel Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Durum</h3>
                    <div className="mt-1 flex items-center">
                      <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColors[production.durum as ProductionStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {production.durum}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Miktar</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {production.miktar.toLocaleString()} adet
                    </p>
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

            {variants && variants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Üretim Süreci - Varyant Bazında</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-[600px] w-full text-xs divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Varyant
                        </th>
                        {productionStages.map((stage) => (
                          <th key={stage.key} scope="col" className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {stage.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {variants.map((variant, index) => {
                        const currentStageIndex = productionStages.findIndex(s => s.label === production.durum);
                        const variantQty = variant.adet || 0;
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {variant.renk || '-'} / {variant.beden || '-'}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                  {variantQty} adet
                                </div>
                              </div>
                            </td>
                            {productionStages.map((stage, stageIndex) => {
                              const isCompleted = stageIndex < currentStageIndex;
                              const isCurrent = stageIndex === currentStageIndex;
                              const isPending = stageIndex > currentStageIndex;
                              let completedQty = 0;
                              if (isCompleted) {
                                completedQty = variantQty;
                              } else if (isCurrent) {
                                completedQty = Math.floor(variantQty * (production.tamamlanma / 100));
                              }
                              const cellColorClass = 
                                isCompleted ? "bg-green-50 dark:bg-green-900/20" :
                                isCurrent ? "bg-blue-50 dark:bg-blue-900/20" :
                                "bg-gray-50 dark:bg-gray-700/20";
                              return (
                                <td key={stage.key} className={`px-2 py-2 text-center ${cellColorClass}`}>
                                  {isCompleted && (
                                    <div className="flex flex-col items-center">
                                      <svg className="h-4 w-4 text-green-500 dark:text-green-400 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-[10px] text-green-700 dark:text-green-300">{variantQty}/{variantQty}</span>
                                    </div>
                                  )}
                                  {isCurrent && (
                                    <div>
                                      <div className="flex flex-col items-center">
                                        <svg className="animate-pulse h-4 w-4 text-blue-500 dark:text-blue-400 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-[10px] text-blue-700 dark:text-blue-300">{completedQty}/{variantQty}</span>
                                      </div>
                                    </div>
                                  )}
                                  {isPending && (
                                    <div className="flex flex-col items-center">
                                      <svg className="h-3 w-3 text-gray-400 dark:text-gray-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400">0/{variantQty}</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="h-3 w-3 text-green-500 dark:text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tamamlandı</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 text-blue-500 dark:text-blue-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>İşlem devam ediyor</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Bekliyor</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
