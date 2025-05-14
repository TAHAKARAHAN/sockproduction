"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Interface for the form data structure
interface ProductIdentityFormData {
  uretici: string;
  mal_cinsi: string;
  style_no: string;
  adet: number;
  termin?: string;
  notlar?: string;
  burun?: string;
  iplik?: string;
  measurements?: string;
}

// BOM Item structure
interface BomItem {
  material: string;
  composition: string;
  desc: string;
  placement: string;
}

// Technical specifications structure
interface TechnicalSpecs {
  needleCount: string;
  diameter: string;
  cylinder: string;
  weltType: string;
  gauge: string;
  toeClosing: string;
}

export default function UrunKimligiDuzenlePage() {
  const params = useParams();
  // Get the id directly from params
  const id = params?.id as string;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ProductIdentityFormData>({
    uretici: "",
    mal_cinsi: "",
    style_no: "",
    adet: 0,
    termin: "",
    notlar: "",
    burun: "",
    iplik: "",
    measurements: ""
  });
  
  // Technical specs state
  const [techSpecs, setTechSpecs] = useState<TechnicalSpecs>({
    needleCount: "",
    diameter: "",
    cylinder: "",
    weltType: "",
    gauge: "",
    toeClosing: ""
  });
  
  // BOM items state
  const [bomItems, setBomItems] = useState<BomItem[]>([]);
  
  useEffect(() => {
    const fetchProductIdentity = async () => {
      try {
        setLoading(true);
        
        // Fetch product identity data from API
        const response = await fetch(`/api/product-identities/${id}`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched product identity:", data);
        
        // Set form data
        setFormData({
          uretici: data.uretici || "",
          mal_cinsi: data.mal_cinsi || "",
          style_no: data.style_no || "",
          adet: data.adet || 0,
          termin: data.termin || "",
          notlar: data.notlar || "",
          burun: data.burun || "",
          iplik: data.iplik || "",
          measurements: data.measurements || ""
        });
        
        // Parse technical specs from notes
        if (data.notlar) {
          parseTechnicalSpecs(data.notlar);
        }
        
        // Parse BOM items from iplik
        if (data.iplik) {
          parseBomItems(data.iplik);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product identity:", err);
        setError(err instanceof Error ? err.message : "Ürün kimliği yüklenirken bir hata oluştu");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductIdentity();
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

      setTechSpecs(specs);
    } catch (err) {
      console.error("Error parsing technical specs:", err);
    }
  };
  
  // Parse BOM items from iplik field
  const parseBomItems = (iplikStr: string) => {
    try {
      // Try to parse as JSON first (for newer format)
      try {
        const parsedItems = JSON.parse(iplikStr);
        if (Array.isArray(parsedItems)) {
          setBomItems(parsedItems);
          return;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Fall back to string parsing for older format
      }
      
      // Legacy format: Split by comma and parse each item
      const items = iplikStr.split(',').map(i => i.trim());
      const itemsArray: BomItem[] = [];
      
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "adet" ? parseInt(value) || 0 : value
    }));
  };
  
  // Handle technical specs changes
  const handleTechSpecChange = (field: keyof TechnicalSpecs, value: string) => {
    setTechSpecs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle BOM item changes
  const handleBomItemChange = (index: number, field: keyof BomItem, value: string) => {
    setBomItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  // Add new BOM item
  const addBomItem = () => {
    setBomItems(prev => [
      ...prev,
      {
        material: "material",
        composition: "",
        desc: "",
        placement: ""
      }
    ]);
  };
  
  // Remove BOM item
  const removeBomItem = (index: number) => {
    setBomItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Format notes with technical specs
  const formatNotesWithTechSpecs = () => {
    return `Technical Specs:
Needle Count: ${techSpecs.needleCount}
Diameter: ${techSpecs.diameter}
Cylinder: ${techSpecs.cylinder}
Welt Type: ${techSpecs.weltType}
Gauge: ${techSpecs.gauge}
Toe Closing: ${techSpecs.toeClosing}`;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format the data for submission - exclude measurements field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { measurements, ...formDataWithoutMeasurements } = formData;
      
      const updatedData = {
        ...formDataWithoutMeasurements,
        notlar: formatNotesWithTechSpecs(),
        iplik: JSON.stringify(bomItems)
      };
      
      // Send update request to API
      const response = await fetch(`/api/product-identities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Güncelleme sırasında bir hata oluştu");
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/urun-kimligi/${id}`);
      }, 2000);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating product identity:", err.message);
        setError(err.message);
      } else {
        console.error("Error updating product identity:", err);
        setError(String(err));
      }
      setIsSubmitting(false);
    }
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

  if (error && !formData.style_no) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Ürün kimliği bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
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
      {/* Success notification overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 transform animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Ürün Kimliği Güncellendi!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Değişiklikleriniz başarıyla kaydedildi.</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Ürün detay sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/urun-kimligi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Ürün Kimlikleri
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <Link href={`/urun-kimligi/${id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {id}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">Düzenle</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Ürün Kimliği Düzenle</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {formData.style_no && `Style No: ${formData.style_no}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Temel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="uretici" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Üretici
                  </label>
                  <input
                    type="text"
                    id="uretici"
                    name="uretici"
                    value={formData.uretici}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="mal_cinsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mal Cinsi
                  </label>
                  <input
                    type="text"
                    id="mal_cinsi"
                    name="mal_cinsi"
                    value={formData.mal_cinsi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="style_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Style No
                  </label>
                  <input
                    type="text"
                    id="style_no"
                    name="style_no"
                    value={formData.style_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="burun" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Burun
                  </label>
                  <input
                    type="text"
                    id="burun"
                    name="burun"
                    value={formData.burun}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="adet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adet
                  </label>
                  <input
                    type="number"
                    id="adet"
                    name="adet"
                    value={formData.adet}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="termin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Termin Tarihi
                  </label>
                  <input
                    type="date"
                    id="termin"
                    name="termin"
                    value={formData.termin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
            
            {/* Technical Specifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Teknik Özellikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="needleCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Needle Count
                  </label>
                  <input
                    type="text"
                    id="needleCount"
                    value={techSpecs.needleCount}
                    onChange={(e) => handleTechSpecChange('needleCount', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diameter
                  </label>
                  <input
                    type="text"
                    id="diameter"
                    value={techSpecs.diameter}
                    onChange={(e) => handleTechSpecChange('diameter', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="cylinder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cylinder
                  </label>
                  <input
                    type="text"
                    id="cylinder"
                    value={techSpecs.cylinder}
                    onChange={(e) => handleTechSpecChange('cylinder', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="weltType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Welt Type
                  </label>
                  <input
                    type="text"
                    id="weltType"
                    value={techSpecs.weltType}
                    onChange={(e) => handleTechSpecChange('weltType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="gauge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gauge
                  </label>
                  <input
                    type="text"
                    id="gauge"
                    value={techSpecs.gauge}
                    onChange={(e) => handleTechSpecChange('gauge', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="toeClosing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Toe Closing
                  </label>
                  <input
                    type="text"
                    id="toeClosing"
                    value={techSpecs.toeClosing}
                    onChange={(e) => handleTechSpecChange('toeClosing', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
            
            {/* Bill of Materials */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Bill of Materials (BOM)</h2>
              
              <div className="overflow-x-auto">
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
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bomItems.length > 0 ? (
                      bomItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={item.material}
                              onChange={(e) => handleBomItemChange(index, 'material', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              readOnly
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={item.composition}
                              onChange={(e) => handleBomItemChange(index, 'composition', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={item.desc}
                              onChange={(e) => handleBomItemChange(index, 'desc', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={item.placement}
                              onChange={(e) => handleBomItemChange(index, 'placement', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="">Select placement</option>
                              <option value="main yarn">main yarn</option>
                              <option value="design yarn">design yarn</option>
                              <option value="varisage">varisage</option>
                              <option value="reinforcement heel and toe">reinforcement heel and toe</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeBomItem(index)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          Henüz malzeme eklenmemiş
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addBomItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Malzeme Ekle
                </button>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <Link 
                href={`/urun-kimligi/${id}`}
                className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
