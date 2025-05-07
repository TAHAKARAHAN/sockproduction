"use client";

import React from "react";
import Link from "next/link";
import { Sample } from "@/lib/sample-db";

interface SampleDetailProps {
  sample: Sample;
}

const SampleDetail: React.FC<SampleDetailProps> = ({ sample }) => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs and Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/numuneler" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Numuneler
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-700 dark:text-gray-300">#{sample.id}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {sample.model} <span className="text-gray-500 dark:text-gray-400">|</span> {sample.artikel}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {sample.firma} · {sample.beden} · {sample.tarih}
              </p>
            </div>
            
            <Link
              href={`/numuneler/${sample.id}/duzenle`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Düzenle
            </Link>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Tech Specs */}
          <div className="lg:col-span-1">
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
                Temel Bilgiler
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Firma</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.firma}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Artikel</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.artikel}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Beden</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.beden}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tarih</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.tarih}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Saniye</p>
                    <p className="font-medium text-gray-900 dark:text-white">{sample.saniye}</p>
                  </div>
                </div>
                
                {/* Weight Card - Moved to top for importance */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Ağırlık</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sample.toplam_agirlik} gr</p>
                </div>
              </div>
            </div>
            
            {/* Tech Specs Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
                Teknik Özellikler
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Needle Count</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.needle_count || "-"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Diameter</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.diameter || "-"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cylinder</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.cylinder || "-"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Welt Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.welt_type || "-"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gauge</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.gauge || "-"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toe Closing</p>
                  <p className="font-medium text-gray-900 dark:text-white">{sample.toe_closing || "-"}</p>
                </div>
              </div>
              
              {sample.notlar && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Notlar</h3>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 p-3 rounded">
                    {sample.notlar}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Yarn Details */}
          <div className="lg:col-span-2">
            {/* Yarn Details with tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="px-6 py-3 text-lg font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-500">
                  İplik Detayları
                </div>
              </div>
              
              {/* Zemin İplikleri */}
              <div className="p-6 pt-4">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                  Zemin İplikleri
                </h3>
                
                <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          No
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          İlk Ölçüm
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Son Ölçüm
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Toplam
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sample.zemin_iplikleri
                        .filter(iplik => iplik.description)
                        .map((iplik) => (
                          <tr key={iplik.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{iplik.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{iplik.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{iplik.ilkOlcum || "-"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{iplik.sonOlcum || "-"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                              {iplik.toplam}
                            </td>
                          </tr>
                        ))
                      }
                      {sample.zemin_iplikleri.filter(iplik => iplik.description).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Zemin iplik verisi bulunmamaktadır.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Desen İplikleri */}
              <div className="p-6 pt-0">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                  Desen İplikleri
                </h3>
                
                <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          No
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          İlk Ölçüm
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Son Ölçüm
                        </th>
                        <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Toplam
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sample.desen_iplikleri
                        .filter(iplik => iplik.description)
                        .map((iplik) => (
                          <tr key={iplik.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{iplik.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{iplik.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{iplik.ilkOlcum || "-"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{iplik.sonOlcum || "-"}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                              {iplik.toplam}
                            </td>
                          </tr>
                        ))
                      }
                      {sample.desen_iplikleri.filter(iplik => iplik.description).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Desen iplik verisi bulunmamaktadır.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <Link
                href={`/numuneler/${sample.id}/duzenle`}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Düzenle
              </Link>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Yazdır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetail;
