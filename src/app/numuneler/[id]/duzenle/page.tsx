"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface YarnDetail {
  id: string;
  description: string;
  ilkOlcum: string;
  sonOlcum: string;
  toplam: string;
}

interface NumuneFormData {
  firma: string;
  beden: string;
  tarih: string;
  saniye: string;
  artikel: string;
  model: string;
  zeminIplikleri: YarnDetail[];
  desenIplikleri: YarnDetail[];
  toplamAgirlik: string;
}

// Update the Props type to use Promise
type Props = {
  params: Promise<{ id: string }>
}

export default function NumuneEditPage({ params }: Props) {
  const router = useRouter();
  const [numuneId, setNumuneId] = useState<string | null>(null);

  // Extract ID from promise-based params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setNumuneId(resolvedParams.id);
      } catch (error) {
        console.error("Failed to resolve params:", error);
      }
    };
    
    resolveParams();
  }, [params]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<NumuneFormData>({
    firma: "",
    beden: "",
    tarih: "",
    saniye: "",
    artikel: "",
    model: "",
    zeminIplikleri: [],
    desenIplikleri: [],
    toplamAgirlik: "0"
  });

  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    if (!numuneId) return;

    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo data
      setFormData({
        firma: "CBN ÇORAP",
        beden: "L56",
        tarih: "23.05.2023",
        saniye: "132",
        artikel: "81-03",
        model: "L56",
        zeminIplikleri: [
          { id: '1-8', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '228', sonOlcum: '140', toplam: '88' },
          { id: '1-7', description: '2tek KARDE M-58 PEMBE', ilkOlcum: '910', sonOlcum: '844', toplam: '66' },
          { id: '1-6', description: '2tek NYLON 9996 PEMBE', ilkOlcum: '928', sonOlcum: '926', toplam: '2' },
          { id: '1-3', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '274', sonOlcum: '256', toplam: '18' },
          { id: '1-1', description: '20/20 Sc BEYAZ LİKRA', ilkOlcum: '1452', sonOlcum: '1414', toplam: '38' },
          { id: 'L-1', description: '140/140 BEYAZ LASTİK', ilkOlcum: '924', sonOlcum: '916', toplam: '8' },
          { id: 'B.DİKİŞ', description: '2tek NYLON SİYAH', ilkOlcum: '664', sonOlcum: '654', toplam: '10' },
        ],
        desenIplikleri: [
          { id: '1-1', description: '2tek NYLON 9064 SİYAH (HUSSAN)', ilkOlcum: '716', sonOlcum: '702', toplam: '14' },
          { id: '2-1', description: '2tek NYLON 6010 YEŞİL (HUSSAN)', ilkOlcum: '710', sonOlcum: '702', toplam: '8' },
          { id: '3-1', description: '2tek NYLON 10171 BEYAZ (EUROTEX)', ilkOlcum: '1116', sonOlcum: '1112', toplam: '4' },
          { id: '4-1', description: '2tek NYLON 10108 EKRU (EUROTEX)', ilkOlcum: '738', sonOlcum: '730', toplam: '8' },
          { id: '5-1', description: '2tek NYLON 10011 KAHVE (EUROTEX)', ilkOlcum: '944', sonOlcum: '936', toplam: '8' },
          { id: '5-3', description: '2tek NYLON 10048 K.KAHVE (EUROTEX)', ilkOlcum: '1154', sonOlcum: '1150', toplam: '4' },
        ],
        toplamAgirlik: "254"
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, [numuneId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleYarnDetailChange = (
    type: 'zemin' | 'desen',
    id: string, 
    field: keyof Omit<YarnDetail, 'id'>, 
    value: string
  ) => {
    setFormData(prev => {
      const arrayToUpdate = type === 'zemin' ? [...prev.zeminIplikleri] : [...prev.desenIplikleri];
      const index = arrayToUpdate.findIndex(item => item.id === id);
      
      if (index !== -1) {
        arrayToUpdate[index] = {
          ...arrayToUpdate[index],
          [field]: value
        };
        
        // Automatically calculate total if both measurements are provided
        if (field === 'ilkOlcum' || field === 'sonOlcum') {
          const ilkOlcum = field === 'ilkOlcum' ? parseInt(value) || 0 : parseInt(arrayToUpdate[index].ilkOlcum) || 0;
          const sonOlcum = field === 'sonOlcum' ? parseInt(value) || 0 : parseInt(arrayToUpdate[index].sonOlcum) || 0;
          
          if (ilkOlcum && sonOlcum) {
            const total = ilkOlcum - sonOlcum;
            arrayToUpdate[index].toplam = String(total > 0 ? total : 0);
          }
        }
      }
      
      // Calculate total weight
      let totalWeight = 0;
      [...prev.zeminIplikleri, ...prev.desenIplikleri].forEach(item => {
        if (item.toplam) {
          totalWeight += parseInt(item.toplam) || 0;
        }
      });
      
      return {
        ...prev,
        [type === 'zemin' ? 'zeminIplikleri' : 'desenIplikleri']: arrayToUpdate,
        toplamAgirlik: String(totalWeight)
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would submit to an API here
    console.log("Form submitted:", formData);
    
    // Simulate API call with slight delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/numuneler/${numuneId}`);
      }, 2000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Success modal with completely transparent background */}
      {showSuccess && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md pointer-events-auto">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Değişiklikler Kaydedildi!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Numune başarıyla güncellendi.</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Numune detay sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/numuneler" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Numuneler
              </Link>
              <span>/</span>
              <Link href={`/numuneler/${numuneId}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                #{numuneId}
              </Link>
              <span>/</span>
              <span>Düzenle</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Numune Düzenle</h1>
            <p className="text-gray-500 dark:text-gray-400">Model: {formData.model} - Artikel: {formData.artikel}</p>
          </div>
          
          <Link 
            href={`/numuneler/${numuneId}`} 
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Görüntülemeye Dön
            </div>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold mr-4">CBN SOCKS</div>
                <div className="text-2xl font-bold">NUMUNE</div>
              </div>
              <div className="text-lg font-medium">
                #{numuneId}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="firma" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  FİRMA
                </label>
                <input
                  type="text"
                  id="firma"
                  name="firma"
                  value={formData.firma}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="beden" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  BEDEN
                </label>
                <input
                  type="text"
                  id="beden"
                  name="beden"
                  value={formData.beden}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="tarih" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  TARİH
                </label>
                <input
                  type="text"
                  id="tarih"
                  name="tarih"
                  value={formData.tarih}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="artikel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ARTIKEL
                </label>
                <input
                  type="text"
                  id="artikel"
                  name="artikel"
                  value={formData.artikel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  MODEL
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="saniye" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SANİYE
                </label>
                <input
                  type="text"
                  id="saniye"
                  name="saniye"
                  value={formData.saniye}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Zemin İplikleri Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 border-b pb-2">ZEMİN İPLİKLERİ</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İPLİK DETAYLARI
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      İLK ÖLÇÜM
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      SON ÖLÇÜM
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      TOPLAM
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.zeminIplikleri.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleYarnDetailChange('zemin', item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.ilkOlcum}
                          onChange={(e) => handleYarnDetailChange('zemin', item.id, 'ilkOlcum', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.sonOlcum}
                          onChange={(e) => handleYarnDetailChange('zemin', item.id, 'sonOlcum', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.toplam}
                          readOnly
                          className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desen İplikleri Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 border-b pb-2">DESEN İPLİKLERİ</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İPLİK DETAYLARI
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      İLK ÖLÇÜM
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      SON ÖLÇÜM
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                      TOPLAM
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.desenIplikleri.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleYarnDetailChange('desen', item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.ilkOlcum}
                          onChange={(e) => handleYarnDetailChange('desen', item.id, 'ilkOlcum', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.sonOlcum}
                          onChange={(e) => handleYarnDetailChange('desen', item.id, 'sonOlcum', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={item.toplam}
                          readOnly
                          className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Weight */}
          <div className="flex justify-end items-center mb-6">
            <div className="font-medium text-lg mr-4">TOPLAM =</div>
            <div className="w-32">
              <input
                type="text"
                value={formData.toplamAgirlik}
                readOnly
                className="w-full px-4 py-2 border rounded-md text-lg font-bold bg-gray-50 dark:bg-gray-700 dark:text-white text-center"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href={`/numuneler/${numuneId}`}
              className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
