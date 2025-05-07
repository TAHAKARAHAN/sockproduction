"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSampleById } from "@/lib/sample-db";
import type { Sample } from "@/lib/sample-db";
import PrintButton from "@/components/PrintButton";

export default function NumuneDetailPage() {
  const { id } = useParams();
  const [numuneData, setNumuneData] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`[UI] Fetching sample with ID: ${id}`);
        const startTime = Date.now();
        
        const data = await getSampleById(id as string);
        
        const duration = Date.now() - startTime;
        console.log(`[UI] Sample fetch completed in ${duration}ms`);
        
        if (data) {
          setNumuneData(data);
        } else {
          setError("Numune bulunamadı.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sample:", err);
        setError("Numune yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Numune yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !numuneData) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Numune bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "Bu numune mevcut değil veya erişim izniniz yok."}</p>
            <Link 
              href="/numuneler" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Numune Listesine Dön
            </Link>
          </div>
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
              <Link href="/numuneler" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Numuneler
              </Link>
              <span>/</span>
              <span>#{numuneData.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Numune Detayları</h1>
            <p className="text-gray-500 dark:text-gray-400">Model: {numuneData.model} - Artikel: {numuneData.artikel}</p>
          </div>

          <div className="flex space-x-4">
            <PrintButton />
            <Link 
              href={`/numuneler/${numuneData.id}/duzenle`} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Düzenle
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold mr-4">CBN SOCKS</h2>
              <h2 className="text-2xl font-bold">NUMUNE</h2>
            </div>
            <div className="text-lg font-medium">
              #{numuneData.id}
            </div>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">FİRMA</span>
              <span className="mt-1 text-lg font-medium">{numuneData.firma}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">BEDEN</span>
              <span className="mt-1 text-lg font-medium">{numuneData.beden}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">TARİH</span>
              <span className="mt-1 text-lg font-medium">{numuneData.tarih}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ARTIKEL</span>
              <span className="mt-1 text-lg font-medium">{numuneData.artikel}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">MODEL</span>
              <span className="mt-1 text-lg font-medium">{numuneData.model}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">SANİYE</span>
              <span className="mt-1 text-lg font-medium">{numuneData.saniye}</span>
            </div>
          </div>
          
          {/* Zemin İplikleri */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">ZEMİN İPLİKLERİ</h3>
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
                  {numuneData.zeminIplikleri && numuneData.zeminIplikleri.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.ilkOlcum || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.sonOlcum || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {item.toplam || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desen İplikleri */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">DESEN İPLİKLERİ</h3>
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
                  {numuneData.desenIplikleri && numuneData.desenIplikleri.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.ilkOlcum || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                        {item.sonOlcum || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {item.toplam || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Weight */}
          <div className="flex justify-end items-center mb-2">
            <div className="font-medium text-lg mr-4">TOPLAM AĞIRLIK:</div>
            <div className="w-32 text-center px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-lg font-bold">
              {numuneData.toplamAgirlik} gr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
