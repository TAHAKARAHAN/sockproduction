import React from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

type Props = {
  params: { id: string }
}

export default function NumuneDetailPage({ params }: Props) {
  const id = params.id;
  
  // This data would typically come from an API fetch
  const numuneData = {
    id,
    firma: "CBN ÇORAP",
    beden: "L56",
    tarih: "23.05.2023",
    saniye: "132",
    artikel: "81-03",
    model: "L56",
    zeminIplikleri: [
      { id: '1-8', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '228', sonOlcum: '140', toplam: '88' },
      { id: '1-7', description: '2tek KARDE M-58 PEMBE', ilkOlcum: '910', sonOlcum: '844', toplam: '66' },
      { id: '1-6', description: '2tek NYLON 9996 PEMBE', ilkOlcum: '928', sonOlcum: '926', toplam: '2' },
      { id: '1-3', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '274', sonOlcum: '256', toplam: '18' },
      { id: '1-1', description: '20/20 Sc BEYAZ LİKRA', ilkOlcum: '1452', sonOlcum: '1414', toplam: '38' },
      { id: 'L-1', description: '140/140 BEYAZ LASTİK', ilkOlcum: '924', sonOlcum: '916', toplam: '8' },
      { id: 'B.DİKİŞ', description: '2tek NYLON SİYAH', ilkOlcum: '664', sonOlcum: '654', toplam: '10' },
    ],
    desenIplikleri: [
      { id: '1-1', description: '2tek NYLON 9064 SİYAH (HUSSAN)', ilkOlcum: '716', sonOlcum: '702', toplam: '14' },
      { id: '2-1', description: '2tek NYLON 6010 YEŞİL (HUSSAN)', ilkOlcum: '710', sonOlcum: '702', toplam: '8' },
      { id: '3-1', description: '2tek NYLON 10171 BEYAZ (EUROTEX)', ilkOlcum: '1116', sonOlcum: '1112', toplam: '4' },
      { id: '4-1', description: '2tek NYLON 10108 EKRU (EUROTEX)', ilkOlcum: '738', sonOlcum: '730', toplam: '8' },
      { id: '5-1', description: '2tek NYLON 10011 KAHVE (EUROTEX)', ilkOlcum: '944', sonOlcum: '936', toplam: '8' },
      { id: '5-3', description: '2tek NYLON 10048 K.KAHVE (EUROTEX)', ilkOlcum: '1154', sonOlcum: '1150', toplam: '4' },
    ],
    toplamAgirlik: "254"
  };

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
                  {numuneData.zeminIplikleri.map((item, index) => (
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
                  {numuneData.desenIplikleri.map((item, index) => (
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
          
          {/* Creation Info */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
            <div>
              <span>Oluşturan: Admin</span>
            </div>
            <div>
              <span>Oluşturma Tarihi: {numuneData.tarih}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
