"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Production, ProductionStatus } from "@/lib/production-db";

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
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For deletion dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // For status update form
  const [updateMode, setUpdateMode] = useState(false);
  const [updateData, setUpdateData] = useState({
    tamamlanma: 0,
    durum: "" as ProductionStatus
  });

  // Parse additional data
  const [variants, setVariants] = useState<any[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState<any>(null);

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
    // In a real application, this would be an API call to update the production
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
      
      setUpdateMode(false);
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
        
        // Parse notes to extract variants and additional details
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
            
            // Extract QR codes
            let qrCodesData = null;
            if (parsedNotes.qrCodes) {
              qrCodesData = parsedNotes.qrCodes;
              console.log("Found QR codes directly in notes:", parsedNotes.qrCodes);
            } else if (parsedNotes.additionalDetails?.qrCodes) {
              qrCodesData = parsedNotes.additionalDetails.qrCodes;
              console.log("Found QR codes in additionalDetails:", parsedNotes.additionalDetails.qrCodes);
            }
            
            // Create a combined object with variant data and QR info
            const notlarObject = {
              ...parsedNotes,
              qrCodes: qrCodesData
            };
            
            setAdditionalDetails(notlarObject);
          } catch (e) {
            console.error("Failed to parse production notes JSON:", e);
            setVariants([]);
            setAdditionalDetails({});
          }
        } else {
          setVariants([]);
          setAdditionalDetails({});
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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

  // Calculate production stages and their status
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
      {/* Delete confirmation dialog */}
      {renderDeleteConfirmDialog()}
      
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Page Header */}
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
                Üretim ID: {production.id} | Style No: {production.style_no} | Sipariş ID: {production.siparis_id}
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
              
              {!updateMode && (
                <button 
                  onClick={() => setUpdateMode(true)}
                  className="px-4 py-2 flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Durumu Güncelle
                </button>
              )}
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <svg className="h-5 w-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Sil
              </button>
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

            {/* Production Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Üretim Süreci</h2>
              
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="space-y-8">
                  {productionStages.map((stage, index) => {
                    // Determine if this stage is completed or current based on the production status
                    const stageIndex = productionStages.findIndex(s => s.label === production.durum);
                    const stagePosition = productionStages.findIndex(s => s.label === stage.label);
                    
                    const isCompleted = stagePosition < stageIndex;
                    const isCurrent = stage.label === production.durum;
                    
                    // Get any additional details for this stage
                    const stageDetail = additionalDetails?.[stage.key];
                    
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
                          </div>
                          
                          <div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {isCompleted ? `Tamamlandı` : 
                              isCurrent ? "Devam ediyor" : 
                              "Bekliyor"}
                            </p>
                            
                            {/* Show stage details if available */}
                            {(isCompleted || isCurrent) && stageDetail && (
                              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">
                                <p className="text-gray-600 dark:text-gray-300">{stageDetail}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Connect the stages with lines */}
                  {productionStages.map((stage, index) => {
                    if (index < productionStages.length - 1) {
                      const stageIndex = productionStages.findIndex(s => s.label === production.durum);
                      const isCompleted = index < stageIndex;
                      
                      return (
                        <div 
                          key={`line-${index}`} 
                          className={`absolute left-5 -translate-x-1/2 w-0.5 top-[${index * 8 + 3}rem] h-8 ${
                            isCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        ></div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            
            {/* Product Variants Table - Enhanced with better QR code detection */}
            {variants && variants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ürün Varyantları</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Model
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Renk
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Beden
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Adet
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tamamlanan
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          QR Kodu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {variants.map((variant, index) => {
                        // Calculate completion based on production status
                        const variantQty = variant.adet || 0;
                        const completedAmount = Math.floor(variantQty * (production.tamamlanma / 100));
                        
                        // Get QR code from different possible locations
                        let variantQrCode = '-';
                        const variantId = variant.id;
                        
                        // Check for QR code in different possible locations
                        if (additionalDetails?.qrCodes && additionalDetails.qrCodes[variantId]?.qrCode) {
                          variantQrCode = additionalDetails.qrCodes[variantId].qrCode;
                        } else if (variant.assignedQrCode) {
                          variantQrCode = variant.assignedQrCode;
                        } else if (additionalDetails?.scanHistory && additionalDetails.scanHistory.length > 0) {
                          // Try to find QR code in scan history that matches this variant
                          interface ScanHistoryItem {
                            variant?: {
                              id: string;
                              [key: string]: any;
                            };
                            code: string;
                            timestamp: string;
                            stage: string;
                            [key: string]: any;
                          }
                          
                          const relevantScan = additionalDetails.scanHistory.find(
                            (scan: ScanHistoryItem) => scan.variant && scan.variant.id === variantId
                          );
                          
                          if (relevantScan) {
                            variantQrCode = relevantScan.code;
                          }
                        }
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {variant.model || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {variant.renk && (
                                  <div className="h-5 w-5 rounded-full mr-2" style={{
                                    backgroundColor: variant.renk.toLowerCase(),
                                    border: '1px solid rgba(156, 163, 175, 0.3)'
                                  }}></div>
                                )}
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {variant.renk || '-'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {variant.beden || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {variantQty} adet
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                  <div 
                                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${production.tamamlanma}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {completedAmount}/{variantQty}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {variantQrCode !== '-' ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md text-xs">
                                  {variantQrCode.substring(0, 10)}...
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-md text-xs">
                                  Tanımlanmadı
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="row" colSpan={3} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Toplam
                        </th>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {variants.reduce((sum, variant) => sum + (variant.adet || 0), 0)} adet
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {Math.floor(variants.reduce((sum, variant) => sum + (variant.adet || 0), 0) * (production.tamamlanma / 100))} adet
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
            
            {/* Display a message when no variants exist */}
            {(!variants || variants.length === 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Varyant Bilgisi Bulunamadı</h3>
                <p className="text-gray-500 dark:text-gray-400">Bu üretim kaydı için tanımlanmış varyant bilgisi bulunmuyor.</p>
              </div>
            )}
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quality Control - We'll simulate this with available data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Kalite Kontrol</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    production.tamamlanma > 50 ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"
                  }`}>
                    {production.tamamlanma > 50 ? (
                      <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {production.tamamlanma > 50 ? "Kalite Kontrolden Geçti" : "Kalite Kontrol Bekliyor"}
                    </h3>
                    {production.tamamlanma > 50 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tarih: {formatDate(new Date().toISOString().slice(0, 10))}</p>
                    )}
                  </div>
                </div>
                
                {production.tamamlanma > 50 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kontrol Notları:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Standartlara uygun üretim devam ediyor.</p>
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
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.style_no}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ürün</h3>
                  <p className="mt-1 text-base text-gray-900 dark:text-gray-100">{production.urun_adi}</p>
                </div>
                
                {variants && variants.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Varyantlar</h3>
                    <div className="mt-2 space-y-2">
                      {variants.map((variant, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{variant.renk} / {variant.beden}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Çift</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                <span className="text-blue-600 dark:text-blue-400">
                                  {Math.floor(variant.adet * (production.tamamlanma / 100))}
                                </span> / {variant.adet} adet
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions
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
            </div> */}
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
