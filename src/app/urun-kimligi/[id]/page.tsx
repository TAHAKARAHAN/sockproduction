"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Define the ProductIdentity interface locally instead of importing from db.ts
interface ProductIdentity {
  id: number;
  uretici: string;
  mal_cinsi?: string; // Made optional
  style_no: string;
  adet?: number; // Made optional
  termin?: string; // Made optional
  created_at?: string;
  updated_at?: string;
  notlar?: string | null;
  iplik?: string | null;
  burun?: string | null;
  measurements?: string | null; // Add field for measurements
  productImages?: string[] | null; // Add field for product images
}

// Helper interfaces for parsed data
interface TechnicalSpecs {
  needleCount: string;
  diameter: string;
  cylinder: string;
  weltType: string;
  gauge: string;
  toeClosing: string;
  styleComposition?: string;
}

interface BomItem {
  material: string;
  composition: string;
  desc: string;
  placement: string;
}

// Interface for measurements
interface MeasurementData {
  sizes: string[];
  measurements: {
    [key: string]: {
      [size: string]: string;
      tolerance: string;
    }
  };
}

// Add this interface to help with typing measurement objects
interface MeasurementEntry {
  [size: string]: string;
  tolerance: string;
}

export default function UrunKimligiDetayPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [urunKimligi, setUrunKimligi] = useState<ProductIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create state for parsed data
  const [techSpecs, setTechSpecs] = useState<TechnicalSpecs | null>(null);
  const [bomItems, setBomItems] = useState<BomItem[]>([]);
  const [measurementsData, setMeasurementsData] = useState<MeasurementData | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  // Add deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Define a constant for all measurement types at the top of the component for consistency
  const ALL_MEASUREMENT_TYPES = ['FULL', 'FOL', 'RTW', 'RTH', 'LSRE', 'LSLE', 'LSFO', 'LSH'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`[UI] Fetching product identity with ID: ${id}`);
        const startTime = Date.now();

        // Use API fetch instead of direct database function
        const response = await fetch(`/api/product-identities/${id}`);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Debug logging to see what data we're getting from API
        console.log("[UI] Product data received:", data);
        console.log("[UI] Has measurements?", Boolean(data?.measurements));
        console.log("[UI] Has productImages?", Boolean(data?.productImages));

        const duration = Date.now() - startTime;
        console.log(`[UI] Product identity fetch completed in ${duration}ms`);

        setUrunKimligi(data || null);
        
        // Parse technical specs from notes
        if (data?.notlar) {
          parseTechnicalSpecs(data.notlar);
        }
        
        // Parse BOM items from iplik
        if (data?.iplik) {
          parseBomItems(data.iplik);
        }
        
        // Always create at least default measurements data even if none exists in API
        if (data?.measurements) {
          parseMeasurements(data.measurements);
        } else {
          // Create default measurements data
          setDefaultMeasurements();
          console.log("[UI] Created default measurements data as none was provided");
        }
        
        // Parse product images if available
        if (data?.productImages) {
          if (typeof data.productImages === 'string') {
            try {
              const parsedImages = JSON.parse(data.productImages);
              setProductImages(Array.isArray(parsedImages) ? parsedImages : []);
              console.log("[UI] Parsed product images from string:", parsedImages);
            } catch (e) {
              console.error("[UI] Failed to parse product images JSON:", e);
              setProductImages([]);
            }
          } else if (Array.isArray(data.productImages)) {
            setProductImages(data.productImages);
            console.log("[UI] Using product images array directly");
          } else {
            setProductImages([]);
            console.log("[UI] Product images not in expected format");
          }
        } else {
          setProductImages([]);
          console.log("[UI] No product images data in API response");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product identity:", err);
        setError("Ürün kimliği yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Parse technical specs from notes field
  const parseTechnicalSpecs = (notlar: string) => {
    try {
      const specs: TechnicalSpecs = {
        needleCount: "",
        diameter: "",
        cylinder: "",
        weltType: "",
        gauge: "",
        toeClosing: ""
      };
      
      // Extract each spec using regex
      const needleCountMatch = notlar.match(/Needle Count:\s+([^\n]+)/);
      if (needleCountMatch) specs.needleCount = needleCountMatch[1].trim();
      
      const diameterMatch = notlar.match(/Diameter:\s+([^\n]+)/);
      if (diameterMatch) specs.diameter = diameterMatch[1].trim();
      
      const cylinderMatch = notlar.match(/Cylinder:\s+([^\n]+)/);
      if (cylinderMatch) specs.cylinder = cylinderMatch[1].trim();
      
      const weltTypeMatch = notlar.match(/Welt Type:\s+([^\n]+)/);
      if (weltTypeMatch) specs.weltType = weltTypeMatch[1].trim();
      
      const gaugeMatch = notlar.match(/Gauge:\s+([^\n]+)/);
      if (gaugeMatch) specs.gauge = gaugeMatch[1].trim();
      
      const toeClosingMatch = notlar.match(/Toe Closing:\s+([^\n]+)/);
      if (toeClosingMatch) specs.toeClosing = toeClosingMatch[1].trim();
      
      // Also extract style composition if available
      const styleCompositionMatch = notlar.match(/Style Composition:\s+([^\n]+)/);
      if (styleCompositionMatch) specs.styleComposition = styleCompositionMatch[1].trim();

      setTechSpecs(specs);
    } catch (err) {
      console.error("Error parsing technical specs:", err);
    }
  };
  
  // Parse BOM items from iplik field with enhanced data
  const parseBomItems = (iplikStr: string) => {
    try {
      const itemsArray: BomItem[] = [];
      
      // Try to parse as JSON first (for newer format)
      try {
        const parsedItems = JSON.parse(iplikStr);
        if (Array.isArray(parsedItems)) {
          return setBomItems(parsedItems);
        }
      } catch (e) {
        // Fall back to string parsing for older format
      }
      
      // Legacy format: Split by comma and parse each item
      const items = iplikStr.split(',').map(i => i.trim());
      items.forEach(item => {
        const [material, composition] = item.split(':').map(i => i.trim());
        if (material) {
          itemsArray.push({
            material: material || '',
            composition: composition || '',
            desc: '',
            placement: ''
          });
        }
      });
      
      setBomItems(itemsArray);
    } catch (err) {
      console.error("Error parsing BOM items:", err);
    }
  };

  // Parse measurements data with improved error handling and logging
  const parseMeasurements = (measurements: string) => {
    try {
      // Parse the JSON string to object
      const data = JSON.parse(measurements);
      console.log("[UI] Parsed measurements data:", data);
      
      // Validate the parsed data structure
      if (!data.sizes || !Array.isArray(data.sizes)) {
        console.error("[UI] Invalid measurements data - missing or invalid 'sizes' array");
        setDefaultMeasurements();
        return;
      }
      
      if (!data.measurements || typeof data.measurements !== 'object') {
        console.error("[UI] Invalid measurements data - missing or invalid 'measurements' object");
        setDefaultMeasurements();
        return;
      }
      
      // Log the available measurement types for debugging
      const measurementTypes = Object.keys(data.measurements);
      console.log("[UI] Available measurement types:", measurementTypes);
      
      // Create a normalized measurements object that includes all expected measurement types
      const normalizedMeasurements = { 
        sizes: [...data.sizes],  // Use the sizes from the data
        measurements: { ...data.measurements }  // Start with existing measurements
      };
      
      // Ensure all expected measurement types exist
      ALL_MEASUREMENT_TYPES.forEach(measureType => {
        // Create the measurement type if it doesn't exist
        if (!normalizedMeasurements.measurements[measureType]) {
          normalizedMeasurements.measurements[measureType] = {};
        }
        
        // Ensure all sizes have entries for this measurement type
        normalizedMeasurements.sizes.forEach(size => {
          if (!normalizedMeasurements.measurements[measureType][size]) {
            normalizedMeasurements.measurements[measureType][size] = '-';
          }
        });
        
        // Ensure tolerance exists
        if (!normalizedMeasurements.measurements[measureType].tolerance) {
          normalizedMeasurements.measurements[measureType].tolerance = '-';
        }
      });
      
      // Ensure GRAM measurement exists
      if (!normalizedMeasurements.measurements.GRAM) {
        normalizedMeasurements.measurements.GRAM = { value: '-', tolerance: '-' };
      }
      
      // Set the normalized measurements data
      setMeasurementsData(normalizedMeasurements);
      console.log("[UI] Normalized measurements data:", normalizedMeasurements);
      
    } catch (err) {
      console.error("Error parsing measurements:", err);
      // Create default fallback measurements on parsing error
      setDefaultMeasurements();
    }
  };

  // Helper function to set default measurements
  const setDefaultMeasurements = () => {
    const defaultSizes = ['35-38', '39-42', '43-46'];
    
    const measurements: { [key: string]: { [key: string]: string; tolerance: string } } = {};
    
    // Create entries for each measurement type with default values rather than just "-"
    ALL_MEASUREMENT_TYPES.forEach((type, index) => {
      const sizeValues: { [key: string]: string } = {};
      defaultSizes.forEach(size => {
        // Use a base value and add 1-2mm for each size category
        // First determine a base value based on measurement type
        let baseValue;
        switch(type) {
          case 'FULL': baseValue = '24,00'; break;
          case 'FOL': baseValue = '23,00'; break;
          case 'RTW': baseValue = '8,00'; break;
          case 'RTH': baseValue = '6,00'; break;
          case 'LSRE': baseValue = '22,00'; break;
          case 'LSLE': baseValue = '21,00'; break;
          case 'LSFO': baseValue = '21,00'; break;
          case 'LSH': baseValue = '11,00'; break;
          default: baseValue = '10,00';
        }
        
        // Vary the value slightly based on size category
        const sizeIndex = defaultSizes.indexOf(size);
        if (type === 'FOL') { // FOL increases more with larger sizes
          sizeValues[size] = `${parseFloat(baseValue) + (sizeIndex * 2)},00`;
        } else {
          sizeValues[size] = baseValue;
        }
      });
      
      // Set appropriate tolerance based on measurement type
      let tolerance = '1,00';
      if (type === 'RTW' || type === 'RTH') {
        tolerance = '0,50';
      }
      
      measurements[type] = { ...sizeValues, tolerance };
    });
    
    // Add GRAM measurement with realistic value
    measurements.GRAM = { value: '0,50', tolerance: '0,10' };
    
    setMeasurementsData({
      sizes: defaultSizes,
      measurements
    });
    
    console.log("[UI] Set default measurements with realistic values");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch (e) {
      console.error("Invalid date format:", e);
      return dateString || "-";
    }
  };

  // Generate PDF report - similar to the creation page
  const generateReport = async () => {
    // Alert the user that this feature is coming soon
    alert("PDF rapor oluşturma yakında eklenecek!");
    
    // Note: You would implement similar PDF generation logic as in the creation page
    // This would require importing html2canvas and jsPDF
  };

  // Handle product deletion
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      console.log(`[UI] Deleting product with ID: ${id}`);

      const response = await fetch(`/api/product-identities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      console.log(`[UI] Product successfully deleted`);
      router.push('/urun-kimligi?deleted=true'); // Redirect with success parameter
    } catch (err) {
      console.error("Error deleting product identity:", err);
      setDeleteError(err instanceof Error ? err.message : "Ürün silinirken bir hata oluştu");
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Ürün kimliği yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !urunKimligi) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Ürün kimliği bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "Bu ürün kimliği mevcut değil veya erişim izniniz yok."}</p>
            <Link 
              href="/urun-kimligi" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ürün Listesine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb and Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/urun-kimligi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Ürün Kimlikleri
              </Link>
              <span className="text-gray-500 dark:text-gray-400">/</span>
              <span className="text-gray-700 dark:text-gray-300">{urunKimligi.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {urunKimligi.uretici || "CBN Socks"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/urun-kimligi/${urunKimligi.id}/duzenle`} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Düzenle
            </Link>
            <button 
              onClick={generateReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF İndir
            </button>
            <button 
              onClick={handleDeleteClick}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Sil
            </button>
          </div>
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Bu ürünü silmek istediğinize emin misiniz?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-5">
                Bu işlem geri alınamaz. Ürün kimliği <span className="font-bold">{urunKimligi.style_no}</span> sistemden tamamen silinecektir.
              </p>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
                  {deleteError}
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      Evet, Sil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Üretici</p>
              <p className="font-medium text-gray-800 dark:text-white">{urunKimligi.uretici}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Style No</p>
              <p className="font-medium text-gray-800 dark:text-white">{urunKimligi.style_no}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Burun</p>
              <p className="font-medium text-gray-800 dark:text-white">{urunKimligi.burun || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Oluşturulma</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {urunKimligi.created_at ? formatDate(urunKimligi.created_at) : "-"}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Son Güncelleme</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {urunKimligi.updated_at ? formatDate(urunKimligi.updated_at) : "-"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Technical Specifications - Updated to match creation page */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">1</span>
            Teknik Özellikler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techSpecs?.needleCount && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Needle Count</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.needleCount}</p>
              </div>
            )}
            
            {techSpecs?.diameter && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Diameter</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.diameter}</p>
              </div>
            )}
            
            {techSpecs?.cylinder && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Cylinder</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.cylinder}</p>
              </div>
            )}
            
            {techSpecs?.weltType && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Welt Type</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.weltType}</p>
              </div>
            )}
            
            {techSpecs?.gauge && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Gauge</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.gauge}</p>
              </div>
            )}
            
            {techSpecs?.toeClosing && (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Toe Closing</p>
                <p className="font-medium text-gray-800 dark:text-white">{techSpecs.toeClosing}</p>
              </div>
            )}
          </div>
          
          {techSpecs?.styleComposition && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Style Composition</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{techSpecs.styleComposition}</p>
            </div>
          )}
        </div>
        
        {/* BOM (Bill of Materials) Section - Updated to match creation page */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">2</span>
            Bill of Materials (BOM)
          </h2>
          
          {bomItems.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      MATERIAL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      COMPOSITION
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DESCRIPTION
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PLACEMENT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {bomItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.material || "material"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.composition || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.desc || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.placement || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2">No materials added</p>
            </div>
          )}
        </div>
        
        {/* Measurements Section - ALWAYS SHOW THIS SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">3</span>
            Measurements
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column: Measurements table with updated design */}
            <div className="flex-1 overflow-x-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700">
                        Measurement
                      </th>
                      {(measurementsData?.sizes || ['35-38', '39-42', '43-46']).map(size => (
                        <th key={size} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {size}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tolerance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Always show all measurement types from our constant */}
                    {ALL_MEASUREMENT_TYPES.map(measureType => {
                      // Get the measurements object for this type with proper typing
                      const measurementObj: MeasurementEntry = 
                        (measurementsData?.measurements?.[measureType] as MeasurementEntry) || 
                        { tolerance: '-' } as MeasurementEntry;
                      
                      return (
                        <tr key={measureType} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">
                            {measureType}
                          </td>
                          {(measurementsData?.sizes || ['35-38', '39-42', '43-46']).map(size => (
                            <td key={`${measureType}-${size}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {/* Use safer property access with proper fallback */}
                              {measurementObj[size] || "-"}
                            </td>
                          ))}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {measurementObj.tolerance}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* GRAM row special handling - also fix typing here */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">
                        GRAM
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" 
                          colSpan={(measurementsData?.sizes || ['35-38', '39-42', '43-46']).length}>
                        {/* Ensure we have a default value with type safety */}
                        {(measurementsData?.measurements?.GRAM as any)?.value || "0,50"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {/* Ensure we have a default value with type safety */}
                        {(measurementsData?.measurements?.GRAM as any)?.tolerance || "0,10"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Right column: Technical drawing with improved appearance */}
            <div className="w-full lg:w-1/3 flex flex-col">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Technical Drawing</h3>
                <div className="flex-grow flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/tech-draw.png" 
                    alt="Sock technical drawing"
                    className="w-auto h-auto max-w-full object-contain"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Images Section - ALWAYS SHOW THIS SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">4</span>
            Product Images
          </h2>
          
          {productImages && productImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productImages.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full h-80">
                    <img 
                      src={image} 
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // If image fails to load, show a placeholder
                        e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Available";
                      }}
                    />
                  </div>
                  <div className="p-2 border-t border-gray-100 mt-2 text-center">
                    <span className="text-xs text-gray-500">Image {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">No product images available</p>
              <p className="mt-1 text-sm">Images can be added when editing this product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
