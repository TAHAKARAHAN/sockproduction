"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductionForm, { ProductionFormData } from "@/components/uretim-takibi/ProductionForm";

export default function YeniUretimTakibiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create a mapping for converting text miktar to numeric values
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

  const handleSubmit = async (formData: ProductionFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    // Log form submission data
    console.log("Submitting production data:", formData);
    
    try {
      // Log detailed information about variants
      formData.variants.forEach((variant, index) => {
        console.log(`Variant ${index + 1}:`, {
          no: index + 1,
          model: variant.model,
          renk: variant.renk,
          beden: variant.beden,
          adet: variant.adet,
          miktar: variant.miktar
        });
      });
      
      // Calculate total adet from all variants
      const totalAdet = formData.variants.reduce((sum, variant) => sum + (variant.adet || 0), 0);
      
      // Prepare data for API - using the exact field names expected by the API
      const apiData = {
        style_no: formData.styleNo,
        urun_adi: formData.urunAdi,
        siparis_id: formData.siparisId,
        musteri: formData.musteri,
        miktar: formData.miktar || totalAdet,
        baslangic_tarihi: formData.baslangicTarihi,
        tahmini_tamamlanma: formData.tahminiTamamlanma,
        durum: formData.durum,
        tamamlanma: formData.tamamlanma,
        notlar: JSON.stringify({
          variants: formData.variants,
          additionalDetails: {
            hammaddeDetay: formData.hammaddeDetay,
            numuneTesti: formData.numuneTesti,
            uretimDetay: formData.uretimDetay,
            burunDikisi: formData.burunDikisi,
            yikama: formData.yikama
          }
        })
      };
      
      console.log("API data prepared:", apiData);
      
      // Make the API call to save the production
      const response = await fetch('/api/productions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }
      
      const savedProduction = await response.json();
      console.log("Production saved successfully:", savedProduction);
      
      setShowSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/uretim-takibi/${savedProduction.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error saving production:", err);
      setError(err instanceof Error ? err.message : 'Failed to save production');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Success overlay message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/20 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 transform animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Üretim Kaydı Oluşturuldu!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Üretim kaydınız başarıyla oluşturuldu.</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Üretim takibi sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Üretim Takibi
              </Link>
              <span>/</span>
              <span>Yeni Kayıt</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yeni Üretim Kaydı Oluştur</h1>
            <p className="text-gray-500 dark:text-gray-400">Üretim sürecini takip etmek için yeni bir kayıt oluşturun.</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <ProductionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
