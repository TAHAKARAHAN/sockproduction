import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function UrunKimligiPage() {
  // Bu veriler normalde bir API'den gelecektir
  const urunKimlikleri = [
    {
      id: "301691",
      uretici: "MERTEKS TEKSTİL",
      malCinsi: "Wool Socks with Silk",
      styleNo: "77597",
      adet: 1200,
      termin: "10.10.2024"
    },
    {
      id: "301692",
      uretici: "ATLAS TEKSTİL",
      malCinsi: "Cotton Socks",
      styleNo: "77598",
      adet: 800,
      termin: "15.10.2024"
    },
    {
      id: "301693",
      uretici: "YILDIZ ÇORAP",
      malCinsi: "Sport Socks",
      styleNo: "77599",
      adet: 2000,
      termin: "20.10.2024"
    },
    {
      id: "301694",
      uretici: "MERTEKS TEKSTİL",
      malCinsi: "Bamboo Socks",
      styleNo: "77600",
      adet: 500,
      termin: "25.10.2024"
    },
  ];

  // Simple stats without status-related info
  const stats = {
    total: urunKimlikleri.length
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Ürün Kimliği Yönetimi</h1>
            <p className="text-gray-500 dark:text-gray-400">Tüm ürün kimliklerini görüntüleyin ve yönetin</p>
          </div>

          {/* Yeni Ürün Kimliği Oluştur Butonu */}
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

        {/* Single Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Ürün Kimliği</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtre ve Arama Bölümü */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filtre ve Arama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Arama</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Ürün kimliği, üretici veya tür ara..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
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
              >
                <option value="">Tümü</option>
                <option value="MERTEKS TEKSTİL">MERTEKS TEKSTİL</option>
                <option value="ATLAS TEKSTİL">ATLAS TEKSTİL</option>
                <option value="YILDIZ ÇORAP">YILDIZ ÇORAP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ürün Kimlikleri Tablosu */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ürün Kimlik No
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Üretici
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Malın Cinsi
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Style No
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Adet
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Termin
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {urunKimlikleri.map((urun) => (
                  <tr key={urun.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/urun-kimligi/${urun.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                        {urun.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <span className="font-bold text-gray-700 dark:text-gray-300">{urun.uretici.charAt(0)}</span>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{urun.uretici}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{urun.malCinsi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">{urun.styleNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{urun.adet}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{urun.termin}</td>
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
          </div>
          
          {/* Sayfalama - daha modern tasarım */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">4</span> sonuçtan <span className="font-medium">1</span> ile <span className="font-medium">4</span> arası gösteriliyor
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
          </div>
        </div>
      </div>
    </div>
  );
}
