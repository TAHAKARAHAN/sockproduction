"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductionForm, { ProductionFormData } from "@/components/uretim-takibi/ProductionForm";

export default function UretimTakibiDuzenlePage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [production, setProduction] = useState<ProductionFormData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduction = async () => {
      setLoading(true);

      // In a real app, this would be an API call
      setTimeout(() => {
        const mockProduction: ProductionFormData = {
          styleNo: "77597",
          urunAdi: "L-Wool Socks with Silk",
          siparisId: "S235",
          musteri: "ECC Legwear",
          miktar: 1200,
          baslangicTarihi: "2023-04-10",
          tahminiTamamlanma: "2023-05-10",
          durum: "Yıkama",
          tamamlanma: 70,
          hammaddeDetay: {
            tarih: "2023-04-10",
            malzemeler: ["İplik A (250kg)", "İplik B (100kg)", "Yardımcı Malzeme X (50 adet)"],
            notlar: "Tüm hammaddeler zamanında teslim edildi ve kalite kontrolden geçti."
          },
          numuneTesti: {
            tarih: "2023-04-15",
            sonuc: "Başarılı",
            notlar: "Numune testleri başarıyla tamamlandı. Renk ve dayanıklılık testleri olumlu sonuçlandı."
          },
          uretimDetay: {
            baslangicTarihi: "2023-04-20",
            makinalar: ["Makine 01", "Makine 03", "Makine 05"],
            calismaSuresi: "120",
            notlar: "Üretim planlandığı gibi ilerliyor. Herhangi bir sorun yaşanmadı."
          },
          burunDikisi: {
            tarih: "2023-05-05",
            operator: "Zeynep Kaya",
            notlar: "Standart dikiş yöntemi kullanıldı. Tüm ürünler kalite kontrolden geçti."
          },
          yikama: {
            tarih: "2023-05-08",
            yikamaTuru: "Standart",
            sicaklik: "40",
            suresi: "45",
            notlar: "Yıkama işlemi devam ediyor. Tahmini tamamlanma süresi 2 gün."
          }
        };

        setProduction(mockProduction);
        setLoading(false);
      }, 800);
    };

    fetchProduction();
  }, [id]);

  const handleSubmit = (formData: ProductionFormData) => {
    setIsSubmitting(true);

    // In a real application, you would make an API call to update the data
    console.log("Updating production data:", formData);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/uretim-takibi/${id}`);
      }, 2000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Üretim bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Üretim bulunamadı</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Düzenlemek istediğiniz üretim kaydı bulunamadı veya silinmiş olabilir.</p>
          <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Üretim Takip Listesine Geri Dön
          </Link>
        </div>
      </div>
    );
  }

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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Üretim Kaydı Güncellendi!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Değişiklikleriniz başarıyla kaydedildi.</p>

              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Üretim detay sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Üretim Takibi
            </Link>
            <span>/</span>
            <Link href={`/uretim-takibi/${id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {id}
            </Link>
            <span>/</span>
            <span>Düzenle</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Üretim Kaydı Düzenle</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {production.urunAdi} ({production.styleNo}) - Üretim Takibi
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <ProductionForm 
            initialData={production}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Link 
            href={`/uretim-takibi/${id}`}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm"
          >
            Değişiklikleri iptal et ve detay sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
