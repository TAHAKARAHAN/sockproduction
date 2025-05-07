"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Production, ProductionStatus } from "@/lib/production-db";

// Status color mapping for visual indication
const statusColors = {
  "Burun Dikişi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "Yıkama": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "Kurutma": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  "Paketleme": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
};

export default function UretimDetayPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details'|'variants'|'timeline'>('details');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    productionDetails: false,
    notes: false,
  });
  
  // For deletion dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Parse additional data
  const [variants, setVariants] = useState<any[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState<any>(null);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
        
        // Parse notes to extract variants and additional details
        if (data?.notlar) {
          try {
            const parsedNotes = JSON.parse(data.notlar);
            if (parsedNotes.variants) setVariants(parsedNotes.variants);
            if (parsedNotes.additionalDetails) setAdditionalDetails(parsedNotes.additionalDetails);
          } catch (e) {
            console.error("Failed to parse production notes JSON:", e);
          }
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      const response = await fetch(`/api/productions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete production');
      }
      
      router.push('/uretim-takibi');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete production");
      setIsDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Üretim bilgisi yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Not found state
  if (!production) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-lg">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Üretim kaydı bulunamadı</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Aradığınız üretim kaydı bulunamadı veya silinmiş olabilir.</p>
          <Link
            href="/uretim-takibi"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors inline-block"
          >
            Üretim Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  // Delete confirmation dialog
  const renderDeleteConfirmDialog = () => {
    if (!showDeleteConfirm) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Üretim kaydını sil</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            <span className="font-semibold text-red-600 dark:text-red-400">{production.style_no}</span> kodlu üretim kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
          
          {deleteError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              {deleteError}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isDeleting}
            >
              İptal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Siliniyor...
                </>
              ) : (
                <>Evet, Sil</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Format date from database format (YYYY-MM-DD) to display format (DD.MM.YYYY)
  const formatDate = (dateString: string): string => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}.${month}.${year}`;
    } catch (e) {
      return dateString; // Return as-is if formatting fails
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Delete confirmation dialog */}
      {renderDeleteConfirmDialog()}
      
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and title */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-2 text-gray-500 dark:text-gray-400">
            <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Üretim Takibi
            </Link>
            <span>/</span>
            <span className="text-gray-500 dark:text-gray-400">{production.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center flex-wrap gap-2">
                {production.style_no}
                <span className={`text-sm px-2.5 py-0.5 rounded-full ${statusColors[production.durum]} border`}>
                  {production.durum}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">{production.urun_adi}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/uretim-takibi/${id}/duzenle`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Düzenle
              </Link>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md shadow-sm transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Sil
              </button>
            </div>
          </div>
          
          <div className="mt-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'details' ? 
                  'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 
                  'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Üretim Bilgileri
              </button>
              <button
                onClick={() => setActiveTab('variants')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'variants' ? 
                  'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 
                  'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Varyantlar ({variants?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'timeline' ? 
                  'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 
                  'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Üretim Süreci
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-5">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <div 
                      className="flex items-center justify-between mb-4 cursor-pointer" 
                      onClick={() => toggleSection('basicInfo')}
                    >
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Temel Bilgiler
                      </h2>
                      <svg className={`w-5 h-5 transition-transform ${expandedSections.basicInfo ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {expandedSections.basicInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Style No</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{production.style_no}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ürün Adı</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{production.urun_adi}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sipariş ID</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{production.siparis_id}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Müşteri</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{production.musteri}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Miktar</div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{production.miktar}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Production Details */}
                  <div>
                    <div 
                      className="flex items-center justify-between mb-4 cursor-pointer" 
                      onClick={() => toggleSection('productionDetails')}
                    >
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Üretim Detayları
                      </h2>
                      <svg className={`w-5 h-5 transition-transform ${expandedSections.productionDetails ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {expandedSections.productionDetails && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Başlangıç Tarihi</div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{formatDate(production.baslangic_tarihi)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tahmini Tamamlanma</div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{formatDate(production.tahmini_tamamlanma)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Durum</div>
                            <div className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[production.durum]}`}>
                              {production.durum}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="font-medium text-gray-900 dark:text-gray-100">Tamamlanma</div>
                            <div className="text-gray-500 dark:text-gray-400">{production.tamamlanma}%</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${production.tamamlanma}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes Section */}
                  {production.notlar && (
                    <div>
                      <div 
                        className="flex items-center justify-between mb-4 cursor-pointer" 
                        onClick={() => toggleSection('notes')}
                      >
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          Notlar
                        </h2>
                        <svg className={`w-5 h-5 transition-transform ${expandedSections.notes ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {expandedSections.notes && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-gray-700 dark:text-gray-300 text-sm">
                          {/* If we can parse the JSON notlar, display nicely, otherwise just show raw */}
                          {typeof production.notlar === 'string' && (
                            <div className="whitespace-pre-wrap">{production.notlar}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'variants' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Ürün Varyantları
                  </h2>
                  
                  {variants && variants.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renk</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beden</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adet</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Miktar</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {variants.map((variant, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{variant.model}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{variant.renk}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{variant.beden}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{variant.adet}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{variant.miktar}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg font-medium">Varyant bilgisi bulunamadı</p>
                      <p className="mt-1">Bu ürün için herhangi bir varyant tanımlanmamış.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'timeline' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Üretim Süreci
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="relative flex">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${production.durum === "Burun Dikişi" || production.durum === "Yıkama" || production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                          {production.durum === "Burun Dikişi" || production.durum === "Yıkama" || production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">1</span>
                          )}
                        </div>
                        <div className={`h-16 w-1 ${production.durum === "Yıkama" || production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Burun Dikişi</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {additionalDetails?.burunDikisi ? additionalDetails.burunDikisi : "Ürünün burun dikişleri tamamlandı."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${production.durum === "Yıkama" || production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                          {production.durum === "Yıkama" || production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">2</span>
                          )}
                        </div>
                        <div className={`h-16 w-1 ${production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Yıkama</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {additionalDetails?.yikama ? additionalDetails.yikama : "Üretilen ürünler yıkama aşamasında."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                          {production.durum === "Kurutma" || production.durum === "Paketleme" || production.durum === "Tamamlandı" ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">3</span>
                          )}
                        </div>
                        <div className={`h-16 w-1 ${production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Kurutma</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Yıkanan ürünler kurutma aşamasında.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${production.durum === "Paketleme" || production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                          {production.durum === "Paketleme" || production.durum === "Tamamlandı" ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">4</span>
                          )}
                        </div>
                        <div className={`h-16 w-1 ${production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Paketleme</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kurutulan ürünler paketleme aşamasında.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${production.durum === "Tamamlandı" ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                          {production.durum === "Tamamlandı" ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white font-medium">5</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Tamamlandı</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {production.durum === "Tamamlandı" ? 
                            "Üretim tamamen tamamlanmıştır." : 
                            "Üretim henüz tamamlanmadı."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Created & Updated Info */}
        <div className="flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400 mt-6">
          <div>
            {production.created_at && (
              <span>
                Oluşturulma: {new Date(production.created_at).toLocaleDateString('tr-TR')}
              </span>
            )}
          </div>
          <div>
            {production.updated_at && production.updated_at !== production.created_at && (
              <span>
                Son Güncelleme: {new Date(production.updated_at).toLocaleDateString('tr-TR')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
