import React, { useState } from "react";

// Variant interface for production form
export interface ProductionVariant {
  no?: number;
  model: string;
  renk: string;
  beden: string;
  adet: number;
  miktar: string;
}

// Define the production form data interface with all required properties
export interface ProductionFormData {
  // Basic production info
  styleNo: string;
  siparisNo?: string;
  urunAdi: string;
  siparisId: string;
  musteri: string;
  miktar: number;
  baslangicTarihi: string;
  tahminiTamamlanma: string;
  durum: string;
  tamamlanma: number;
  
  // Production stage details
  hammaddeDetay?: {
    tarih: string;
    malzemeler: string[];
    notlar: string;
  };
  numuneTesti?: {
    tarih: string;
    sonuc: string;
    notlar: string;
  };
  uretimDetay?: {
    baslangicTarihi: string;
    makinalar: string[];
    calismaSuresi: string;
    notlar: string;
  };
  burunDikisi?: {
    tarih: string;
    operator: string;
    notlar: string;
  };
  yikama?: {
    tarih: string;
    yikamaTuru: string;
    sicaklik: string;
    suresi: string;
    notlar: string;
  };
  
  // Variants - different versions of the same product
  variants: ProductionVariant[];
}

interface ProductionFormProps {
  initialData?: Partial<ProductionFormData>;
  onSubmit: (data: ProductionFormData) => void;
  isSubmitting?: boolean;
}

// Default form data to use when no initialData is provided
const defaultFormData: ProductionFormData = {
  styleNo: "",
  urunAdi: "",
  siparisId: "",
  musteri: "",
  miktar: 0,
  baslangicTarihi: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  tahminiTamamlanma: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
  durum: "Burun Dikişi",
  tamamlanma: 0,
  variants: [{ model: "", renk: "", beden: "", adet: 0, miktar: "" }]
};

const ProductionForm: React.FC<ProductionFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false 
}) => {
  // Merge initialData with defaultFormData
  const [formData, setFormData] = useState<ProductionFormData>({
    ...defaultFormData,
    ...initialData,
    variants: initialData.variants?.length 
      ? initialData.variants 
      : defaultFormData.variants
  });

  const [activeTab, setActiveTab] = useState<string>("basicInfo");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductionVariant, value: string | number) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { model: "", renk: "", beden: "", adet: 0, miktar: "" }
      ]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;

    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validations - more detailed to help identify issues
    if (!formData.styleNo.trim()) newErrors.styleNo = "Style No gerekli";
    if (!formData.urunAdi.trim()) newErrors.urunAdi = "Ürün adı gerekli";
    if (!formData.siparisId.trim()) newErrors.siparisId = "Sipariş ID gerekli";
    if (!formData.musteri.trim()) newErrors.musteri = "Müşteri gerekli";
    if (!formData.baslangicTarihi.trim()) newErrors.baslangicTarihi = "Başlangıç tarihi gerekli";
    if (!formData.tahminiTamamlanma.trim()) newErrors.tahminiTamamlanma = "Tahmini tamamlanma tarihi gerekli";

    // Print the validation results to help with debugging
    console.log("Form validation errors:", newErrors);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          type="button"
          className={`px-4 py-3 ${activeTab === "basicInfo" ? "text-blue-600 border-b-2 border-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("basicInfo")}
        >
          Temel Bilgiler
        </button>
        <button
          type="button"
          className={`px-4 py-3 ${activeTab === "productionDetails" ? "text-blue-600 border-b-2 border-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("productionDetails")}
        >
          Üretim Detayları
        </button>
        <button
          type="button"
          className={`px-4 py-3 ${activeTab === "variants" ? "text-blue-600 border-b-2 border-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("variants")}
        >
          Varyantlar
        </button>
      </div>

      {/* Basic Information Tab */}
      {activeTab === "basicInfo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="styleNo" className="block text-sm font-medium mb-1">Style No</label>
            <input
              type="text"
              id="styleNo"
              name="styleNo"
              value={formData.styleNo}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.styleNo ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.styleNo && <p className="mt-1 text-xs text-red-500">{errors.styleNo}</p>}
          </div>

          <div>
            <label htmlFor="urunAdi" className="block text-sm font-medium mb-1">Ürün Adı</label>
            <input
              type="text"
              id="urunAdi"
              name="urunAdi"
              value={formData.urunAdi}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.urunAdi ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
              required
            />
            {errors.urunAdi && <p className="mt-1 text-xs text-red-500">{errors.urunAdi}</p>}
          </div>

          <div>
            <label htmlFor="siparisId" className="block text-sm font-medium mb-1">Sipariş ID</label>
            <input
              type="text"
              id="siparisId"
              name="siparisId"
              value={formData.siparisId}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.siparisId ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
              required
            />
            {errors.siparisId && <p className="mt-1 text-xs text-red-500">{errors.siparisId}</p>}
          </div>

          <div>
            <label htmlFor="musteri" className="block text-sm font-medium mb-1">Müşteri</label>
            <input
              type="text"
              id="musteri"
              name="musteri"
              value={formData.musteri}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.musteri ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
              required
            />
            {errors.musteri && <p className="mt-1 text-xs text-red-500">{errors.musteri}</p>}
          </div>

          <div>
            <label htmlFor="miktar" className="block text-sm font-medium mb-1">Miktar</label>
            <input
              type="number"
              id="miktar"
              name="miktar"
              value={formData.miktar}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="baslangicTarihi" className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              id="baslangicTarihi"
              name="baslangicTarihi"
              value={formData.baslangicTarihi}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.baslangicTarihi ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
              required
            />
            {errors.baslangicTarihi && <p className="mt-1 text-xs text-red-500">{errors.baslangicTarihi}</p>}
          </div>

          <div>
            <label htmlFor="tahminiTamamlanma" className="block text-sm font-medium mb-1">Tahmini Tamamlanma</label>
            <input
              type="date"
              id="tahminiTamamlanma"
              name="tahminiTamamlanma"
              value={formData.tahminiTamamlanma}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.tahminiTamamlanma ? "border-red-500" : "border-gray-300"} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600`}
              required
            />
            {errors.tahminiTamamlanma && <p className="mt-1 text-xs text-red-500">{errors.tahminiTamamlanma}</p>}
          </div>

          <div>
            <label htmlFor="durum" className="block text-sm font-medium mb-1">Durum</label>
            <select
              id="durum"
              name="durum"
              value={formData.durum}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="Burun Dikişi">Burun Dikişi</option>
              <option value="Yıkama">Yıkama</option>
              <option value="Kurutma">Kurutma</option>
              <option value="Paketleme">Paketleme</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
          </div>

          <div>
            <label htmlFor="tamamlanma" className="block text-sm font-medium mb-1">Tamamlanma (%)</label>
            <input
              type="number"
              id="tamamlanma"
              name="tamamlanma"
              value={formData.tamamlanma}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${formData.tamamlanma}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Production Details Tab - Just a simplified version for illustration */}
      {activeTab === "productionDetails" && (
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Bu sekme üretim sürecinin detaylı bilgilerini içerir. Hammadde, numune testleri ve üretim aşamaları
            burada takip edilir.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-2">Üretim süreç takibi</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Burada üretim sürecinin daha detaylı bilgileri bulunacak.
            </p>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === "variants" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ürün Varyantları</h3>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Varyant Ekle
            </button>
          </div>

          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Varyant #{index + 1}</h4>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={variant.model}
                    onChange={(e) => handleVariantChange(index, "model", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Renk</label>
                  <input
                    type="text"
                    value={variant.renk}
                    onChange={(e) => handleVariantChange(index, "renk", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Beden</label>
                  <input
                    type="text"
                    value={variant.beden}
                    onChange={(e) => handleVariantChange(index, "beden", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Adet</label>
                  <input
                    type="number"
                    value={variant.adet}
                    onChange={(e) => handleVariantChange(index, "adet", parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Miktar (Düzine)</label>
                  <select
                    value={variant.miktar}
                    onChange={(e) => handleVariantChange(index, "miktar", e.target.value)}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Bir Düzine">Bir Düzine (12)</option>
                    <option value="İki Düzine">İki Düzine (24)</option>
                    <option value="Üç Düzine">Üç Düzine (36)</option>
                    <option value="Dört Düzine">Dört Düzine (48)</option>
                    <option value="Beş Düzine">Beş Düzine (60)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductionForm;
