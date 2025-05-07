"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sample } from "@/lib/sample-db";

// Add some sample data as fallback in case the API fails
const demoSamples: Sample[] = [
  {
    id: 1,
    firma: "CBN ÇORAP",
    model: "L56",
    artikel: "81-03",
    beden: "L56",
    tarih: "23.05.2023",
    saniye: "132",
    durum: "Tamamlandı",
    zemin_iplikleri: [],
    desen_iplikleri: [],
    toplam_agirlik: "254"
  },
  {
    id: 2,
    firma: "CBN ÇORAP",
    model: "M47",
    artikel: "81-04",
    beden: "M",
    tarih: "24.05.2023",
    saniye: "128",
    durum: "İşlemde",
    zemin_iplikleri: [],
    desen_iplikleri: [],
    toplam_agirlik: "230"
  }
];

export default function NumunelerPage() {
  const [numuneler, setNumuneler] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFirma, setFilterFirma] = useState("");
  
  // Fetch samples from the API
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        console.log("Fetching samples from API...");
        
        const response = await fetch('/api/samples');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Received ${data.length} samples from API`);
        
        if (Array.isArray(data) && data.length > 0) {
          setNumuneler(data);
        } else {
          console.warn("API returned empty data, using demo samples");
          // Use demo data if API returns empty array
          setNumuneler(demoSamples);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching samples:", err);
        setError(err instanceof Error ? err.message : "Numuneler yüklenirken bir hata oluştu");
        
        // Fallback to demo data in case of error
        console.log("Using demo samples due to error");
        setNumuneler(demoSamples);
        
        setLoading(false);
      }
    };
    
    fetchSamples();
  }, []);

  // Filter samples based on search term and filter selections
  const filteredNumuneler = numuneler.filter(numune => {
    const matchesSearch = 
      searchTerm === "" ||
      numune.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      numune.artikel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      numune.beden.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFirma = filterFirma === "" || numune.firma === filterFirma;
    
    return matchesSearch && matchesFirma;
  });
  
  // Get unique firma values for the dropdown
  const uniqueFirmas = Array.from(new Set(numuneler.map(n => n.firma)));

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Numune Yönetimi</h1>
            <p className="text-gray-500 dark:text-gray-400">Tüm numune kayıtlarını görüntüleyin ve yönetin</p>
          </div>

          <Link 
            href="/numuneler/yeni" 
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Yeni Numune Oluştur
          </Link>
        </div>

        {/* Filters - removed Durum filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filtre ve Arama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Model, artikel veya beden ara..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="firma" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Firma</label>
              <select
                id="firma"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                value={filterFirma}
                onChange={(e) => setFilterFirma(e.target.value)}
              >
                <option value="">Tümü</option>
                {uniqueFirmas.map((firma) => (
                  <option key={firma} value={firma}>{firma}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table - removed Durum column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Numuneler yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-block rounded-full h-8 w-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300 text-xl flex items-center justify-center mb-4">!</div>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Demo veriler gösteriliyor</p>
              </div>
            ) : filteredNumuneler.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {numuneler.length === 0 ? "Henüz numune kaydı bulunmamaktadır." : "Arama kriterlerinize uygun numune bulunamadı."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Firma
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Model
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Artikel
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Beden
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNumuneler.map((numune) => (
                    <tr key={numune.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/numuneler/${numune.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                          #{numune.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{numune.firma}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">{numune.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{numune.artikel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{numune.beden}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{numune.tarih}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <Link 
                            href={`/numuneler/${numune.id}`} 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Görüntüle
                          </Link>
                          <Link 
                            href={`/numuneler/${numune.id}/duzenle`} 
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Düzenle
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
