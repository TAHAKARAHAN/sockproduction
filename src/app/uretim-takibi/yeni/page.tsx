"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Fix: Use useRouter from next/navigation
import ProductionForm, { ProductionFormData } from '@/components/uretim-takibi/ProductionForm';

interface ProductIdentity {
  id: string;
  name: string;
  styleNo: string;
  style_no: string; // Added for API response
  uretici: string; // Added for API response
  measurements?: string; 
  // Add other expected fields from product identity if necessary
}

export default function YeniUretimTakibiPage() {
  const [, setProductIdentities] = useState<ProductIdentity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId] = useState<string>('');
  const [availableSizes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Fix: Initialize router using useRouter hook

  // Fetch all product identities for selection
  useEffect(() => {
    const fetchProductIdentities = async () => {
      try {
        const response = await fetch('/api/product-identities');
        if (!response.ok) {
          throw new Error('Ürün kimlikleri yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setProductIdentities(data);
      } catch (err) {
        console.error('Error fetching product identities:', err);
        setError('Ürün kimlikleri yüklenirken bir hata oluştu');
      }
    };

    fetchProductIdentities();
  }, []);

  // Fetch specific product identity data when one is selected

  const handleSubmit = async (data: ProductionFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // If we have a selected product, associate it with this production record
      const dataWithProduct = selectedProductId 
        ? { ...data, productIdentityId: selectedProductId }
        : data;
        
      const response = await fetch('/api/productions', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithProduct),
      });

      if (!response.ok) {
        let errorDetails = `API Error: ${response.status} ${response.statusText}`;
        try {
          // Try to parse the error response body as JSON
          const errorData = await response.json();
          errorDetails += ` - ${errorData.message || JSON.stringify(errorData)}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // If response is not JSON, try to read it as text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorDetails += ` - ${errorText}`;
            }
          } catch (e2) {
            // Fallback if reading as text also fails
            console.warn('Could not parse error response body', e2);
          }
        }
        console.error('Error creating production record:', errorDetails);
        throw new Error(`Üretim kaydı oluşturulurken bir hata oluştu. ${errorDetails}`);
      }

      router.push('/uretim-takibi'); // Fix: Use the router instance to navigate
    } catch (err: unknown) { // Catch any type for err
      console.error('Error creating production record:', err);
      // Use err.message if available, otherwise fallback to a generic message
      setError(err instanceof Error ? err.message : 'Üretim kaydı oluşturulurken bir hata oluştu. Daha fazla bilgi için konsolu kontrol edin.');
      setIsSubmitting(false);
    }
  };

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
              <span>Yeni Üretim</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yeni Üretim Kaydı Oluştur</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}

    

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ProductionForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            availableSizes={availableSizes}
          />
        </div>
      </div>
    </div>
  );
}
