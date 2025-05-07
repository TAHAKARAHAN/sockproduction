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
            <p className="text-gray-500 dark:text-gray-400">Tüm ürün kimliklerini görüntüleyin ve yönetin</p>
          </div>

          <Link 
            href="/urun-kimligi/yeni" 
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Yeni Ürün Kimliği Oluştur
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filtre ve Arama</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ürün kimliği, üretici veya tür ara..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="uretici" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Üretici</label>
              <select
                id="uretici"
                value={ureticiFilter}
                onChange={(e) => setUreticiFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
              >
                <option value="">Tüm Üreticiler</option>
                {uniqueUreticiler.map((uretici) => (
                  <option key={uretici} value={uretici}>{uretici}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sıralama</label>
              <div className="flex space-x-2">
                <select
                  id="sort"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as keyof ProductIdentity)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                >
                  <option value="id">ID</option>
                  <option value="uretici">Üretici</option>
                  <option value="style_no">Style No</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  {sortDirection === 'asc' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Ürün kimlikleri yükleniyor...</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Bu işlem birkaç saniye sürebilir.</p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="inline-block bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4 text-red-700 dark:text-red-400">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2">Veritabanına bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Yeniden Dene
            </button>
          </div>
        ) : filteredAndSortedUrunKimlikleri.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="inline-block p-4 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Henüz hiç ürün kimliği bulunmuyor veya filtrelere uygun sonuç yok.</p>
            </div>
            <Link
              href="/urun-kimligi/yeni"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün Kimliği Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUrunKimlikleri.map((urun) => (
              <Link 
                key={urun.id}
                href={`/urun-kimligi/${urun.id}`} 
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {urun.uretici || "CBN Socks"}
                    </h3>
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                      #{urun.id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Style No</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{urun.style_no}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Burun</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{urun.burun || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {urun.created_at ? formatDate(urun.created_at) : "-"}
                    </div>
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Görüntüle
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && !error && filteredAndSortedUrunKimlikleri.length > 0 && (
          <div className="mt-8 flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{filteredAndSortedUrunKimlikleri.length}</span> sonuçtan <span className="font-medium">1</span> ile <span className="font-medium">{filteredAndSortedUrunKimlikleri.length}</span> arası gösteriliyor
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" disabled>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="px-4 py-2 border border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg">1</div>
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" disabled>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
