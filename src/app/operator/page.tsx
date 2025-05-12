"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

// Production status types
type ProductionStatus = 
  | "Üretim" 
  | "Burun Dikişi" 
  | "Yıkama" 
  | "Kurutma" 
  | "Paketleme" 
  | "Tamamlandı";

// Production and Variant types
interface Production {
  id: string;
  urun_adi: string;
  style_no: string;
  durum: ProductionStatus;
  tamamlanma: number;
  miktar: number;
  notlar?: string;
}

interface Variant {
  id: string;
  model: string;
  renk: string;
  beden: string;
  adet: number;
  assignedQrCode?: string; // Store the assigned QR code
}

export default function OperatorPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannerDivId] = useState("qr-scanner");
  const [scannerRef, setScannerRef] = useState<Html5Qrcode | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{text: string, type: "success" | "error" | "info"} | null>(null);
  const [currentStage, setCurrentStage] = useState<ProductionStatus>("Üretim");
  
  // New state variables for production and variant selection
  const [isLoadingProductions, setIsLoadingProductions] = useState(false);
  const [productions, setProductions] = useState<Production[]>([]);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productionQuantity, setProductionQuantity] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [qrCodeMismatch, setQrCodeMismatch] = useState<boolean>(false);
  const [qrAssignmentMode, setQrAssignmentMode] = useState<boolean>(false);
  const [assignedQrCodes, setAssignedQrCodes] = useState<{[key: string]: { qrCode: string; quantity: number; }}>({});

  // Initialize the scanner when the component mounts
  useEffect(() => {
    const scanner = new Html5Qrcode(scannerDivId);
    setScannerRef(scanner);

    // Fetch available productions when component mounts
    fetchProductions();

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(err => console.error("QR tarayıcı durdurulurken hata oluştu:", err));
      }
      scanner.clear();
    };
  }, [scannerDivId]);

  // Fetch productions from API
  const fetchProductions = async () => {
    try {
      setIsLoadingProductions(true);
      const response = await fetch('/api/productions');
      
      if (!response.ok) {
        throw new Error('Üretimler yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      setProductions(data);
    } catch (error) {
      console.error("Error fetching productions:", error);
      setError("Üretimler yüklenirken bir hata oluştu");
    } finally {
      setIsLoadingProductions(false);
    }
  };

  // Handle production selection and extract variants
  const handleProductionSelect = (production: Production) => {
    setSelectedProduction(production);
    setSelectedVariant(null);
    setProductionQuantity(0);
    setQrCodeMismatch(false);
    setQuantityError(null);
    
    try {
      // Parse variants from production notes
      if (production.notlar) {
        const parsedNotes = JSON.parse(production.notlar);
        if (parsedNotes.variants && Array.isArray(parsedNotes.variants)) {
          // Check if any variants have assigned QR codes
          const variantsWithQrCodes = parsedNotes.variants.map((variant: any) => {
            if (parsedNotes.qrCodes && parsedNotes.qrCodes[variant.id]) {
              variant.assignedQrCode = parsedNotes.qrCodes[variant.id].qrCode;
            }
            return variant;
          });
          setVariants(variantsWithQrCodes);
          
          // Store QR code assignments if available
          if (parsedNotes.qrCodes) {
            setAssignedQrCodes(parsedNotes.qrCodes);
          } else {
            setAssignedQrCodes({});
          }
        } else {
          setVariants([]);
          setAssignedQrCodes({});
        }
      } else {
        setVariants([]);
        setAssignedQrCodes({});
      }
    } catch (error) {
      console.error("Error parsing variants:", error);
      setVariants([]);
      setAssignedQrCodes({});
    }
  };

  // Update for handling variant selection to also reset quantity
  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    // Reset quantity to 1 or max quantity of the variant (whichever is smaller)
    const maxQuantity = variant.adet || 0;
    setProductionQuantity(maxQuantity > 0 ? 1 : 0);
    setQuantityError(null);
  };

  // Add validation for quantity changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxQuantity = selectedVariant?.adet || 0;
    
    if (value > maxQuantity) {
      setQuantityError(`Üretim adedi, varyant adedini (${maxQuantity}) aşamaz`);
      setProductionQuantity(value);
    } else if (value <= 0) {
      setQuantityError("Üretim adedi 0'dan büyük olmalıdır");
      setProductionQuantity(value);
    } else {
      setQuantityError(null);
      setProductionQuantity(value);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedProduction(null);
    setSelectedVariant(null);
    setVariants([]);
    setProductionQuantity(0);
    setQrCodeMismatch(false);
    setAssignedQrCodes({});
    setQuantityError(null);
  };

  const startScanning = () => {
    if (!scannerRef) return;
    if (!selectedProduction) {
      setMessage({text: "Lütfen önce bir üretim seçin", type: "error"});
      return;
    }
    
    // Validate quantity input
    const maxQuantity = selectedVariant?.adet || 0;
    
    // If production stage is selected and quantity is not set or invalid
    if (currentStage === "Üretim") {
      if (productionQuantity <= 0) {
        setMessage({text: "Lütfen üretim adedi girin", type: "error"});
        return;
      }
      
      if (productionQuantity > maxQuantity) {
        setMessage({text: `Üretim adedi, varyant adedini (${maxQuantity}) aşamaz`, type: "error"});
        return;
      }
    }
    
    // Check if this is an initial scan for a variant that needs QR assignment
    const needsQrAssignment = 
      currentStage === "Üretim" && 
      selectedVariant && 
      (!assignedQrCodes[selectedVariant.id] || !assignedQrCodes[selectedVariant.id].qrCode);
    
    if (needsQrAssignment) {
      setQrAssignmentMode(true);
      setMessage({text: "Bu varyant için ilk QR kodu okutuyorsunuz. Bu kod bu varyanta atanacak.", type: "info"});
    } else {
      setQrAssignmentMode(false);
    }

    const qrCodeSuccessCallback = (decodedText: string) => {
      setIsScanning(false);
      setScanResult(decodedText);
      handleScanSuccess(decodedText);
      stopScanning();
    };

    // Modified error callback that filters out common scanning messages
    const qrCodeErrorCallback = (errorMessage: string) => {
      // Ignore common scanning messages that aren't actual errors
      if (
        errorMessage.includes("No barcode or QR code detected") || 
        errorMessage.includes("No MultiFormat Readers were able to detect the code") ||
        errorMessage.includes("NotFoundException")
      ) {
        // These are normal during scanning, don't treat as errors
        return;
      }
      
      // Only log real errors
      console.error("QR Scanning Error:", errorMessage);
    };

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [
        0, // QR_CODE
        3, // EAN_13
        4, // EAN_8
        5, // UPC_A
        6, // UPC_E
        7, // UPC_EAN_EXTENSION
        8, // CODE_39
        9, // CODE_93
        10, // CODE_128
        11, // CODABAR
        12, // ITF
      ]
    };
    
    scannerRef
      .start(
        { facingMode: "environment" }, 
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      )
      .then(() => {
        setIsScanning(true);
        setError(null);
        setQrCodeMismatch(false);
      })
      .catch((err) => {
        setError(`Tarayıcı başlatılırken hata: ${err}`);
      });
  };

  const stopScanning = () => {
    if (scannerRef && scannerRef.isScanning) {
      scannerRef
        .stop()
        .then(() => {
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("QR tarayıcı durdurulurken hata:", err);
        });
    }
  };

  const handleScanSuccess = async (result: string) => {
    if (!selectedProduction) {
      setMessage({text: "Lütfen bir üretim seçin", type: "error"});
      return;
    }

    try {
      setIsUpdating(true);
      const scannedQrCode = result.trim();
      
      // If we have a selected variant, check if it has an assigned QR code
      // and if it matches the scanned code (except in QR assignment mode)
      if (selectedVariant && !qrAssignmentMode) {
        const variantId = selectedVariant.id;
        const assignedQrData = assignedQrCodes[variantId];
        
        // If this variant has an assigned QR code that doesn't match what was scanned
        if (assignedQrData && assignedQrData.qrCode && assignedQrData.qrCode !== scannedQrCode) {
          setQrCodeMismatch(true);
          setIsUpdating(false);
          setMessage({
            text: `QR kod eşleşmedi! Bu varyant için farklı bir QR kod atanmış. Doğru etiketi tarayın.`, 
            type: "error"
          });
          return;
        }
      }
      
      // For initial QR code assignment, check if the code is already assigned elsewhere
      if (qrAssignmentMode) {
        // First check locally if this QR code is assigned to any other variant we know about
        let isDuplicateLocal = false;
        
        Object.entries(assignedQrCodes).forEach(([variantId, qrData]) => {
          if (variantId !== selectedVariant?.id && qrData.qrCode === scannedQrCode) {
            isDuplicateLocal = true;
          }
        });
        
        if (isDuplicateLocal) {
          setIsUpdating(false);
          setMessage({
            text: `Bu QR kod başka bir varyanta zaten atanmış! Lütfen benzersiz bir QR kodu kullanın.`,
            type: "error"
          });
          return;
        }
        
        // Then check with the server if this code exists in the database
        const checkResponse = await fetch(`/api/qr-code/check?code=${encodeURIComponent(scannedQrCode)}`);
        
        if (!checkResponse.ok) {
          const errorData = await checkResponse.json();
          throw new Error(errorData.message || "QR kod kontrol edilirken bir hata oluştu");
        }
        
        const checkResult = await checkResponse.json();
        
        if (checkResult.exists) {
          setIsUpdating(false);
          setMessage({
            text: `Bu QR kod sistemde başka bir ürüne zaten atanmış! Lütfen benzersiz bir QR kodu kullanın.`,
            type: "error"
          });
          return;
        }
      }
      
      setMessage({text: "Üretim durumu güncelleniyor...", type: "info"});
      
      // Use selected production ID
      const productionId = selectedProduction.id;
      
      console.log(`Updating production: ${productionId}, Stage: ${currentStage}`);
      
      // Create update payload with only fields that exist in the database schema
      // Other fields will be handled by the API and stored in the notlar JSON
      const updatePayload: any = {
        durum: currentStage,
        tamamlanma: getCompletionPercentage(currentStage),
        scannedCode: scannedQrCode,
        operatorId: "operator-panel" // Identify source of the update
      };
      
      // Add variant information if relevant
      if (selectedVariant) {
        updatePayload.variant = {
          id: selectedVariant.id,
          model: selectedVariant.model,
          renk: selectedVariant.renk,
          beden: selectedVariant.beden
        };
        
        // For initial production stage, assign the QR code and quantity
        if (currentStage === "Üretim") {
          updatePayload.assignQrCode = true;
          updatePayload.quantity = productionQuantity;
        }
      }
      
      console.log("Update payload:", JSON.stringify(updatePayload));
      
      // Update the production status
      const updateResponse = await fetch(`/api/productions/${productionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      
      if (!updateResponse.ok) {
        // Try to get detailed error message from response
        let errorDetail = '';
        try {
          const errorData = await updateResponse.json();
          errorDetail = errorData.message || errorData.error || errorData.details || '';
        } catch (e) {
          // If can't parse JSON, use status text
          errorDetail = updateResponse.statusText;
        }
        
        throw new Error(`Güncellenirken hata: ${updateResponse.status} ${errorDetail}`);
      }
      
      // Try to get the updated data
      const updatedData = await updateResponse.json().catch(() => null);
      console.log("Update successful:", updatedData);
      
      // If this was a QR assignment operation, update our local state
      if (selectedVariant && currentStage === "Üretim") {
        const newAssignedQrCodes = {...assignedQrCodes};
        newAssignedQrCodes[selectedVariant.id] = {
          qrCode: scannedQrCode,
          quantity: productionQuantity
        };
        setAssignedQrCodes(newAssignedQrCodes);
        
        // Update the variant in our local state
        const updatedVariants = variants.map(v => {
          if (v.id === selectedVariant.id) {
            return {...v, assignedQrCode: scannedQrCode};
          }
          return v;
        });
        setVariants(updatedVariants);
      }
      
      // Build success message
      let successMessage = `${selectedProduction.urun_adi} için '${currentStage}' aşaması kaydedildi!`;
      if (selectedVariant) {
        successMessage += ` (${selectedVariant.renk} / ${selectedVariant.beden})`;
      }
      if (currentStage === "Üretim" && productionQuantity > 0) {
        successMessage += ` - ${productionQuantity} adet`;
      }
      
      setMessage({
        text: successMessage,
        type: "success"
      });
      
      // Reset quantity after successful update
      if (currentStage === "Üretim") {
        setProductionQuantity(0);
      }
      
      // Reset QR assignment mode
      setQrAssignmentMode(false);
      
      // Automatically clear success message after 5 seconds
      setTimeout(() => {
        if (message?.type === "success") {
          setMessage(null);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Error updating production status:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Bilinmeyen bir hata oluştu";
        
      setMessage({
        text: `Üretim güncelleme hatası: ${errorMessage}`, 
        type: "error"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter productions based on search term
  const filteredProductions = productions.filter(production => 
    production.urun_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.style_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to determine completion percentage based on stage
  const getCompletionPercentage = (stage: ProductionStatus): number => {
    switch (stage) {
      case "Üretim": return 20;
      case "Burun Dikişi": return 40;
      case "Yıkama": return 60;
      case "Kurutma": return 80;
      case "Paketleme": return 90;
      case "Tamamlandı": return 100;
      default: return 0;
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Operatör Paneli</h1>
            <p className="text-gray-500 dark:text-gray-400">Üretim aşamalarını güncelleyin</p>
          </div>
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Menüye Dön
            </div>
          </Link>
        </div>
        
        {/* Production Selection Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
            Üretim Seçin
          </h2>
          
          {selectedProduction ? (
            <div className="mb-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{selectedProduction.urun_adi}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Style No: {selectedProduction.style_no}</p>
                </div>
                <button 
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Variant Selection */}
              {variants.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Varyant Seçin
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantSelect(variant)}
                        className={`p-3 rounded-lg border ${
                          selectedVariant === variant
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center">
                          {variant.renk && (
                            <div 
                              className="h-4 w-4 rounded-full mr-2" 
                              style={{
                                backgroundColor: variant.renk.toLowerCase(),
                                border: '1px solid rgba(156, 163, 175, 0.3)'
                              }}
                            ></div>
                          )}
                          <span className="font-medium">{variant.renk || '-'} / {variant.beden || '-'}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {variant.adet} adet
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Search box */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Üretim adı veya style no ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-3" 
                    onClick={() => setSearchTerm('')}
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Productions list */}
              <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                {isLoadingProductions ? (
                  <div className="flex justify-center items-center p-4">
                    <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2">Yükleniyor...</span>
                  </div>
                ) : filteredProductions.length > 0 ? (
                  filteredProductions.map(production => (
                    <button
                      key={production.id}
                      onClick={() => handleProductionSelect(production)}
                      className="block w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{production.urun_adi}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Style No: {production.style_no}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          production.durum === "Tamamlandı" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {production.durum}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? "Arama sonucu bulunamadı" : "Üretim kaydı bulunamadı"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Stage selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
            Üretim Aşaması Seçin
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StageButton 
              stage="Üretim" 
              isActive={currentStage === "Üretim"} 
              onClick={() => setCurrentStage("Üretim")} 
            />
            <StageButton 
              stage="Burun Dikişi" 
              isActive={currentStage === "Burun Dikişi"} 
              onClick={() => setCurrentStage("Burun Dikişi")} 
            />
            <StageButton 
              stage="Yıkama" 
              isActive={currentStage === "Yıkama"} 
              onClick={() => setCurrentStage("Yıkama")} 
            />
            <StageButton 
              stage="Kurutma" 
              isActive={currentStage === "Kurutma"} 
              onClick={() => setCurrentStage("Kurutma")} 
            />
            <StageButton 
              stage="Paketleme" 
              isActive={currentStage === "Paketleme"} 
              onClick={() => setCurrentStage("Paketleme")} 
            />
            <StageButton 
              stage="Tamamlandı" 
              isActive={currentStage === "Tamamlandı"} 
              onClick={() => setCurrentStage("Tamamlandı")} 
              color="green"
            />
          </div>
          
          {/* Quantity input for Production stage */}
          {currentStage === "Üretim" && (
            <div className="mt-5 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-md font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                Üretim Adedi
              </h3>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max={selectedVariant?.adet || 0}
                  value={productionQuantity || ''}
                  onChange={handleQuantityChange}
                  placeholder="Üretilecek adet sayısını girin"
                  className={`w-full px-4 py-2.5 border ${
                    quantityError 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
              </div>
              {quantityError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{quantityError}</p>
              )}
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
                * Seçilen varyant için maksimum üretim adedi: <strong>{selectedVariant?.adet || 0}</strong>
              </p>
            </div>
          )}
        </div>
      
        {/* QR Scanner Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center">
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              {currentStage}
            </span>
            QR Kod Tarayıcı
            {selectedProduction && (
              <span className="ml-2 text-sm font-normal">
                ({selectedProduction.urun_adi}
                {selectedVariant && ` - ${selectedVariant.renk}/${selectedVariant.beden}`})
              </span>
            )}
          </h2>
          
          {/* Display assigned QR code if available */}
          {selectedVariant && assignedQrCodes[selectedVariant.id] && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Atanan QR Kod:</strong> {assignedQrCodes[selectedVariant.id].qrCode?.substring(0, 8)}...
                  {assignedQrCodes[selectedVariant.id].quantity && ` (${assignedQrCodes[selectedVariant.id].quantity} adet)`}
                </span>
              </p>
            </div>
          )}
          
          {/* QR mismatch warning */}
          {qrCodeMismatch && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                  QR Kod Eşleşmedi!
                </h3>
              </div>
              <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                Bu üretim ve varyant için farklı bir QR kod tanımlanmış. Lütfen doğru QR kodu okutun.
              </p>
            </div>
          )}
          
          {message && (
            <div className={`p-4 mb-4 rounded-lg ${
              message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
              message.type === "error" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            }`}>
              <p>{message.text}</p>
              {message.type === "error" && (
                <div className="mt-2 flex gap-2">
                  <button 
                    onClick={() => {
                      setMessage(null);
                      setQrCodeMismatch(false);
                    }} 
                    className="text-sm underline focus:outline-none"
                  >
                    Kapat
                  </button>
                  {scanResult && !qrCodeMismatch && (
                    <button 
                      onClick={() => handleScanSuccess(scanResult)}
                      className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}
          
          <div className="flex flex-col items-center">
            <div 
              id={scannerDivId} 
              style={{ width: '100%', maxWidth: '400px', height: '300px', position: 'relative' }}
              className="mx-auto border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-4"
            >
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-black/5 dark:bg-black/30 pointer-events-none">
                  <div className="w-48 h-48 border-2 border-blue-500 rounded-lg"></div>
                  <p className="mt-3 text-sm text-white px-2 py-1 bg-black/50 rounded">QR kodu bu çerçeveye hizalayın</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  className={`px-6 py-3 rounded-lg transition-all flex items-center ${
                    !selectedProduction || 
                    (currentStage === "Üretim" && (productionQuantity <= 0 || !!quantityError))
                      ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={
                    isUpdating || 
                    !selectedProduction || 
                    (currentStage === "Üretim" && (productionQuantity <= 0 || !!quantityError))
                  }
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  QR Kod Taramaya Başla
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Taramayı Durdur
                </button>
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {!selectedProduction 
                ? "Lütfen önce bir üretim seçin" 
                : currentStage === "Üretim" && productionQuantity <= 0
                ? "Lütfen üretim adedi girin ve QR kod okutun"
                : currentStage === "Üretim" && !!quantityError
                ? quantityError
                : qrAssignmentMode
                ? "Bu varyant için ilk QR kodu okutun. Bu kod varyanta atanacak."
                : "Üretim etiketindeki QR kodu kamera ile okutarak üretim durumunu güncelleyin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for stage buttons
function StageButton({ 
  stage, 
  isActive, 
  onClick,
  color = "blue" 
}: { 
  stage: ProductionStatus, 
  isActive: boolean, 
  onClick: () => void,
  color?: "blue" | "green" 
}) {
  const baseClasses = "px-4 py-3 rounded-lg text-center transition-all";
  const activeClasses = color === "green" 
    ? "bg-green-600 text-white shadow-md"
    : "bg-blue-600 text-white shadow-md";
  const inactiveClasses = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
  
  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {stage}
    </button>
  );
}
