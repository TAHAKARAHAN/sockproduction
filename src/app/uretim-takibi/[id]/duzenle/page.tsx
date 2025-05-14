"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductionForm, { ProductionFormData } from '@/components/uretim-takibi/ProductionForm';

export default function DuzenleUretimTakibiPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productionData, setProductionData] = useState<Partial<ProductionFormData>>({});
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productIdentityId, setProductIdentityId] = useState<string | null>(null);

  // Fetch production data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch production record
        const response = await fetch(`/api/production/${id}`);
        if (!response.ok) {
          throw new Error('Üretim kaydı yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        setProductionData(data);
        
        // If this production record is linked to a product identity, fetch it
        if (data.productIdentityId) {
          setProductIdentityId(data.productIdentityId);
          const productResponse = await fetch(`/api/product-identities/${data.productIdentityId}`);
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            
            // Extract sizes from measurements
            let sizes: string[] = [];
            if (productData.measurements) {
              try {
                const measurementsData = JSON.parse(productData.measurements);
                if (measurementsData.sizes && Array.isArray(measurementsData.sizes)) {
                  sizes = measurementsData.sizes;
                }
              } catch (e) {
                console.error('Failed to parse measurements:', e);
              }
            }
            
            // If we couldn't find sizes, include both baby and adult default sizes
            if (sizes.length === 0) {
              sizes = [
                // Baby sizes
                '13-14', '15-16', '17-18', '19-22', '23-26', '27-30', '31-34',
                // Adult sizes
                '35-38', '39-42', '43-46'
              ];
            }
            
            // Check if product is marked as baby product type
            if (productData.productType === 'baby' || (productData.notlar && productData.notlar.includes('productType: baby'))) {
              // If no baby sizes are included, add default baby sizes
              if (!sizes.some(s => {
                const match = s.match(/^(\d+)-/);
                return match && parseInt(match[1]) < 35;
              })) {
                sizes = [
                  '13-14', '15-16', '17-18', '19-22', '23-26', '27-30', '31-34',
                  ...sizes
                ];
              }
            }
            
            setAvailableSizes(sizes);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Kayıt yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (data: ProductionFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Include the productIdentityId if we have one
      const dataWithProduct = productIdentityId 
        ? { ...data, productIdentityId } 
        : data;
      
      const response = await fetch(`/api/production/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithProduct),
      });

      if (!response.ok) {
        throw new Error('Üretim kaydı güncellenirken bir hata oluştu');
      }

      router.push('/uretim-takibi');
    } catch (err) {
      console.error('Error updating production record:', err);
      setError('Üretim kaydı güncellenirken bir hata oluştu');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Üretim kaydı yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/uretim-takibi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Üretim Takibi
              </Link>
              <span>/</span>
              <span>{id}</span>
              <span>/</span>
              <span>Düzenle</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Üretim Kaydını Düzenle</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
            <p className="text-sm text-green-600 dark:text-green-400">
              Bu ürün için uygun bedenler: {availableSizes.join(', ')}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ProductionForm
            initialData={productionData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            availableSizes={availableSizes}
          />
        </div>
      </div>
    </div>
  );
}
