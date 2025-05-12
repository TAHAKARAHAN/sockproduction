"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductionForm, { ProductionFormData } from "@/components/uretim-takibi/ProductionForm";

export default function YeniUretimTakibiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
    
    try {
      // Format variants for the notlar field
      const notesData = {
        variants: formData.variants || [],
        additionalDetails: {
          hammaddeDetay: formData.hammaddeDetay,
          numuneTesti: formData.numuneTesti,
          uretimDetay: formData.uretimDetay,
          burunDikisi: formData.burunDikisi,
          yikama: formData.yikama
        }
      };
      
      // Calculate total adet from all variants
      const totalAdet = formData.variants.reduce((sum, variant) => sum + (variant.adet || 0), 0);
      
      // Prepare data for API
      const productionData = {
        style_no: formData.styleNo,
        urun_adi: formData.urunAdi,
        siparis_id: formData.siparisId,
        musteri: formData.musteri,
        miktar: totalAdet || formData.adet || 0,
        baslangic_tarihi: formData.baslangicTarihi,
        tahmini_tamamlanma: formData.tahminiTamamlanma,
        durum: formData.durum || "Üretim",
        tamamlanma: 0,
        notlar: JSON.stringify(notesData)
      };
      
      // Make the actual API call to save the data
      const response = await fetch('/api/productions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create production record');
      }
      
      // On success
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/uretim-takibi");
      }, 2000);
      
    } catch (error) {
      console.error("Error creating production:", error);
      setIsSubmitting(false);
      alert(`Üretim kaydı oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
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
      
      <div className="max-w-7xl mx-auto">
        {/* Add an info alert about the variants in basic info */}
        <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 dark:bg-blue-900/30 dark:border-blue-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Varyantlar artık temel bilgiler bölümünde görüntüleniyor. Varyant bilgilerini burada ekleyebilir ve düzenleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
        
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
          <ProductionForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            showVariantsInBasicInfo={true} // Show variants in the basic info section
          />
        </div>
      </div>
    </div>
  );
}
