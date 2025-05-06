"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Production status types
type ProductionStatus = 
  | "Hammadde Girişi" 
  | "Numune Testi" 
  | "Üretim" 
  | "Burun Dikişi"
  | "Yıkama"
  | "Kurutma"
  | "Paketleme"
  | "Tamamlandı";

// Define interface for the product variant with miktar as string
interface ProductVariant {
  id: string;
  model: string;
  renk: string;
  beden: string;
  adet?: number;
  miktar: string; // Changed to string type for fixed selections
}

export interface ProductionFormData {
  id: string;
  siparisNo: string;
  urunAdi: string;
  musteri: string;
  miktar: number;
  baslangicTarihi: string;
  tahminiTamamlanma: string;
  durum: ProductionStatus;
  tamamlanma: number;
  variants: ProductVariant[]; // Array of variants
}

interface ProductionFormProps {
  onSubmit: (data: ProductionFormData) => void;
  isSubmitting: boolean;
}

export default function ProductionForm({ onSubmit, isSubmitting }: ProductionFormProps) {
  const [generatedSiparisNo, setGeneratedSiparisNo] = useState("");
  const [isOrderGenerated, setIsOrderGenerated] = useState(false);
  
  // Define text-only miktar options
  const miktarOptions = [
    "Bir Düzine",
    "İki Düzine", 
    "Üç Düzine", 
    "Dört Düzine",
    "Beş Düzine",
    "Altı Düzine", 
    "Sekiz Düzine",
    "On Düzine"
  ];

  // Create a mapping for converting text miktar to numeric values (for calculations if needed)
  const miktarValueMap: Record<string, number> = {
    "Bir Düzine": 12,
    "İki Düzine": 24,
    "Üç Düzine": 36,
    "Dört Düzine": 48,
    "Beş Düzine": 60,
    "Altı Düzine": 72,
    "Sekiz Düzine": 96,
    "On Düzine": 120
  };

  // Form state initialization with text miktar
  const [formData, setFormData] = useState<ProductionFormData>({
    id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    siparisNo: "", // Will be auto-generated
    urunAdi: "",
    musteri: "",
    miktar: 0,
    baslangicTarihi: formatDate(new Date()),
    tahminiTamamlanma: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    durum: "Hammadde Girişi",
    tamamlanma: 0,
    variants: [{ id: generateId(), model: "", renk: "", beden: "", adet: 0, miktar: "İki Düzine" }] // Default to "İki Düzine" (24)
  });

  // Auto-generate order number when component mounts
  useEffect(() => {
    generateSiparisNo();
  }, []);
  
  // Format date to YYYY-MM-DD
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  // Generate unique ID for variants
  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  // Generate Order Number (S + sequential number)
  function generateSiparisNo() {
    const timestamp = new Date().getTime().toString().slice(-5);
    const randomDigit = Math.floor(Math.random() * 10);
    const newOrderNo = `S${timestamp}${randomDigit}`;
    
    setGeneratedSiparisNo(newOrderNo);
    setFormData(prev => ({ ...prev, siparisNo: newOrderNo }));
    
    setIsOrderGenerated(true);
    setTimeout(() => {
      setIsOrderGenerated(false);
    }, 1500);
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "miktar" ? parseInt(value) || 0 : value
    }));
  };

  // Handle variant field changes - modified to handle miktar as string
  const handleVariantChange = (id: string, field: keyof ProductVariant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant => {
        if (variant.id === id) {
          if (field === 'adet') {
            return { ...variant, [field]: parseInt(value as string) || 0 };
          }
          // For all other fields including miktar (now a string)
          return { ...variant, [field]: value };
        }
        return variant;
      })
    }));
  };

  // Modified addVariantRow function
  const addVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: generateId(), model: "", renk: "", beden: "", adet: 0, miktar: "İki Düzine" }]
    }));
  };

  // Remove a variant row
  const removeVariantRow = (id: string) => {
    if (formData.variants.length <= 1) return; // Keep at least one row
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(variant => variant.id !== id)
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {/* Section 1: Basic Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Temel Bilgiler
          </h2>
          
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Otomatik Sipariş Numarası</h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    Aşağıdaki sipariş numarası otomatik olarak oluşturulmuştur. Gerekirse yenileyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="siparisNo" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Sipariş Numarası
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="siparisNo"
                  name="siparisNo"
                  value={formData.siparisNo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all ${
                    isOrderGenerated ? 'border-green-500 dark:border-green-600 ring-2 ring-green-300 dark:ring-green-800' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  readOnly
                />
                <button
                  type="button"
                  onClick={generateSiparisNo}
                  className={`px-4 py-2.5 rounded-r-lg text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isOrderGenerated ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isOrderGenerated ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Otomatik oluşturulan sipariş numarası. Yeni bir numara için butona tıklayın.
              </p>
            </div>

            <div>
              <label htmlFor="urunAdi" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Ürün Adı
              </label>
              <input
                type="text"
                id="urunAdi"
                name="urunAdi"
                value={formData.urunAdi}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Örn: L-Wool Socks with Silk"
                required
              />
            </div>

            <div>
              <label htmlFor="musteri" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Müşteri
              </label>
              <input
                type="text"
                id="musteri"
                name="musteri"
                value={formData.musteri}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Örn: ECC Legwear"
                required
              />
            </div>

            <div>
              <label htmlFor="baslangicTarihi" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Sipariş Tarihi
              </label>
              <input
                type="date"
                id="baslangicTarihi"
                name="baslangicTarihi"
                value={formData.baslangicTarihi}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="tahminiTamamlanma" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Termin Tarihi
              </label>
              <input
                type="date"
                id="tahminiTamamlanma"
                name="tahminiTamamlanma"
                value={formData.tahminiTamamlanma}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>
        </div>

        {/* Product Variants Table */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Ürün Detayları
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    No
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Model
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Renk
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Beden
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Adet
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Miktar
                  </th>
                  <th scope="col" className="relative px-4 py-3 w-10">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.variants.map((variant, index) => (
                  <tr key={variant.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={variant.model}
                        onChange={(e) => handleVariantChange(variant.id, 'model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={variant.renk}
                        onChange={(e) => handleVariantChange(variant.id, 'renk', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={variant.beden}
                        onChange={(e) => handleVariantChange(variant.id, 'beden', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={variant.adet || ''}
                        onChange={(e) => handleVariantChange(variant.id, 'adet', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        min="0"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={variant.miktar}
                        onChange={(e) => handleVariantChange(variant.id, 'miktar', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {miktarOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeVariantRow(variant.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={addVariantRow}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni Satır Ekle
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <Link 
              href="/uretim-takibi"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : "Üretim Kaydını Oluştur"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
