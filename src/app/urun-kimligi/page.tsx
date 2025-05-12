"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Updated to match your exact database schema with optional fields
interface ProductIdentity {
  id: number;
  uretici: string;
  mal_cinsi?: string; // Made optional
  style_no: string;
  adet?: number; // Already optional
  termin?: string; // Made optional
  created_at?: string;
  updated_at?: string;
  notlar?: string | null;
  iplik?: string | null;
  burun?: string | null;
}

export default function UrunKimligiPage() {
  const [urunKimlikleri, setUrunKimlikleri] = useState<ProductIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ureticiFilter, setUreticiFilter] = useState("");
  const [sortField, setSortField] = useState<keyof ProductIdentity>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Enhanced fetch with refresh capability
  useEffect(() => {
    let isMounted = true;
    const fetchData = async (retries = 2) => {
      if (!isMounted) return;
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        console.log(`[UI] Attempting to fetch product identities from API (attempt ${3 - retries})`);
        
        const response = await fetch('/api/product-identities', {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: { revalidate: 0 }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[UI] Successfully fetched data:', data.length, 'items');
        
        if (data.length > 0) {
          console.log('[UI] First item sample:', JSON.stringify(data[0] || {}));
        }
        
        if (isMounted) {
          setUrunKimlikleri(data);
          setLoading(false);
          setError(null);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("[UI] Error fetching product identities:", err);

        if (retries > 0 && err.name !== 'AbortError') {
          console.log(`[UI] Retrying... ${retries} attempts left`);
          const delay = Math.pow(2, 3 - retries - 1) * 500;
          setTimeout(() => fetchData(retries - 1), delay);
          return;
        }

        if (isMounted) {
          if (err.name === 'AbortError') {
            console.log('[UI] Request timed out');
            setError("Veri yükleme zaman aşımına uğradı. Lütfen tekrar deneyin.");
          } else {
            setError(`Bağlantı hatası: ${err.message}. Lütfen tekrar deneyin.`);
          }
          
          setUrunKimlikleri([]);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetch('/api/product-identities', { 
      cache: 'no-store',
      headers: { 
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(data => {
        setUrunKimlikleri(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error refreshing data:", err);
        setLoading(false);
      });
  };

  const uniqueUreticiler = [...new Set(urunKimlikleri.map(item => item.uretici))];

  const handleSort = (field: keyof ProductIdentity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUrunKimlikleri = urunKimlikleri
    .filter(urun => {
      const matchesSearch = searchTerm === "" || 
        urun.style_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        urun.uretici.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (urun.burun || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUretici = ureticiFilter === "" || urun.uretici === ureticiFilter;

      return matchesSearch && matchesUretici;
    })
    .sort((a, b) => {
      if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
        return sortDirection === 'asc' 
          ? (a[sortField] as number) - (b[sortField] as number)
          : (b[sortField] as number) - (a[sortField] as number);
      }
      
      const aValue = String(a[sortField] || '').toLowerCase();
      const bValue = String(b[sortField] || '').toLowerCase();
      
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch (e) {
      return dateString || "-";
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Ürün Kimliği Yönetimi</h1>
            <p className="text-gray-500 dark:text-gray-400">Tüm ürün kimliği kayıtlarını görüntüleyin ve yönetin</p>
          </div>
          <Link 
            href="/urun-kimligi/yeni" 
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Yeni Ürün Kimliği Oluştur
          </Link>
        </div>

        {/* Filtreler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filtre ve Arama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Style No, üretici veya burun ara..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="uretici" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Üretici</label>
              <select
                id="uretici"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                value={ureticiFilter}
                onChange={e => setUreticiFilter(e.target.value)}
              >
                <option value="">Tümü</option>
                {uniqueUreticiler.map(uretici => (
                  <option key={uretici} value={uretici}>{uretici}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tablo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Ürün kimlikleri yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-block rounded-full h-8 w-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300 text-xl flex items-center justify-center mb-4">!</div>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Demo veriler gösteriliyor</p>
              </div>
            ) : filteredAndSortedUrunKimlikleri.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {urunKimlikleri.length === 0 ? "Henüz ürün kimliği kaydı bulunmamaktadır." : "Arama kriterlerinize uygun ürün kimliği bulunamadı."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Style No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Üretici
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Burun
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedUrunKimlikleri.map((urun) => (
                    <tr key={urun.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/urun-kimligi/${urun.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                          #{urun.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">{urun.style_no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{urun.uretici}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{urun.burun}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <Link 
                            href={`/urun-kimligi/${urun.id}`} 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Görüntüle
                          </Link>
                          <Link 
                            href={`/urun-kimligi/${urun.id}/duzenle`} 
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
