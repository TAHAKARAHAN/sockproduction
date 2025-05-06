"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import PrintButton from "@/components/PrintButton";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Import chart data from the main page (consider moving to a shared utils file in a real app)
import { 
  monthlyProductionData, 
  salesByTypeData, 
  qualityMetricsData, 
  machineEfficiencyData,
  initialReports,
  typeColors 
} from "../page";

// Define the Report type to match your data structure
interface Report {
  id: string;
  title: string;
  type: keyof typeof typeColors; // This ensures type is one of the valid keys in typeColors
  period: string;
  createdBy: string;
  createdDate: string;
  lastAccess: string;
  // Add other properties as needed
}

export default function ReportDetail({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch the report from an API
    // For this demo, we'll use the sample data
    const foundReport = initialReports.find(r => r.id === params.id);
    setReport(foundReport as Report || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Rapor yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Rapor bulunamadı</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">İstediğiniz rapor mevcut değil veya silinmiş olabilir.</p>
          <Link href="/raporlar" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Rapor Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  // Determine which charts to show based on report type
  const renderReportCharts = () => {
    switch(report.type) {
      case 'Üretim':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Aylık Üretim Miktarları</h3>
              <div className="h-80">
                <Bar 
                  data={monthlyProductionData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                        }
                      },
                      title: {
                        display: true,
                        text: 'Çorap Tipi Bazında Üretim (Adet)',
                        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                        },
                        grid: {
                          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                        }
                      },
                      x: {
                        ticks: {
                          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                        },
                        grid: {
                          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Üretim Hataları Oranı</h3>
              <div className="h-80">
                <Line 
                  data={qualityMetricsData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );
      
      case 'Satış':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Çorap Tipi Bazında Satışlar</h3>
              <div className="h-80">
                <Pie 
                  data={salesByTypeData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Aylık Satış Trendi</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                    datasets: [
                      {
                        label: 'Satış Adedi (bin)',
                        data: [58, 62, 70, 65, 75, 82],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        );
      
      case 'Stok':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">İplik Stok Durumu</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: ['Pamuk', 'Merino', 'Polyester', 'Yün', 'Likra', 'Bambu'],
                    datasets: [
                      {
                        label: 'Miktar (kg)',
                        data: [850, 620, 1200, 480, 320, 150],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y'
                  }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Stok Kullanım Oranı</h3>
              <div className="h-80">
                <Doughnut
                  data={{
                    labels: ['Kullanılan', 'Kalan'],
                    datasets: [
                      {
                        data: [68, 32],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                        ],
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        );
      
      case 'Kalite':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Kalite Metrikleri</h3>
              <div className="h-80">
                <Line 
                  data={qualityMetricsData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Hata Kategorileri</h3>
              <div className="h-80">
                <Pie
                  data={{
                    labels: ['Dikiş', 'Boyama', 'Malzeme', 'Ölçü', 'Baskı', 'Diğer'],
                    datasets: [
                      {
                        data: [35, 25, 15, 12, 8, 5],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)',
                        ],
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        );
      
      case 'Makine':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Makine Verimliliği</h3>
              <div className="h-80">
                <Doughnut
                  data={machineEfficiencyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Çalışma/Durma Oranları</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: ['Makine 1', 'Makine 2', 'Makine 3', 'Makine 4', 'Makine 5'],
                    datasets: [
                      {
                        label: 'Çalışma (saat)',
                        data: [195, 210, 185, 202, 205],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                      },
                      {
                        label: 'Durma (saat)',
                        data: [25, 10, 35, 18, 15],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { stacked: true },
                      y: { stacked: true }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-500 dark:text-gray-400">Bu rapor tipi için görselleştirme mevcut değil.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/raporlar" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Raporlar
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-300">{report.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">{report.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${typeColors[report.type]}`}>
                  {report.type}
                </span>
                <span>Dönem: <span className="font-medium">{report.period}</span></span>
                <span>Oluşturan: <span className="font-medium">{report.createdBy}</span></span>
                <span>Oluşturma: <span className="font-medium">{report.createdDate}</span></span>
              </div>
            </div>
            <div className="flex gap-3 print:hidden">
              <PrintButton />
              <button 
                className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => alert(`${report.title} indiriliyor...`)}
              >
                <svg className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                İndir
              </button>
            </div>
          </div>
        </div>

        {/* Report Charts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Rapor Görselleri</h2>
          {renderReportCharts()}
        </div>

        {/* Report Details/Tables */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Rapor Detayları</h2>
          
          <div className="prose max-w-none dark:prose-invert">
            <p>Bu rapor, {report.period} dönemi için {report.type.toLowerCase()} verilerini içermektedir. {report.createdBy} tarafından {report.createdDate} tarihinde oluşturulmuştur.</p>
            
            <h3>Özet Bulgular</h3>
            <p>Aşağıdaki tablolar ve grafikler, dönem içindeki önemli metrikleri ve trendleri göstermektedir.</p>
            
            {report.type === "Üretim" && (
              <>
                <h4>Üretim Özeti</h4>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ürün</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Planlanan</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Gerçekleşen</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Erkek Çorap</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">15,000</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">16,200</td>
                      <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">+1,200</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Kadın Çorap</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">12,000</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">12,700</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">+700</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Çocuk Çorap</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">8,500</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">8,900</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">+400</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            
            {report.type === "Satış" && (
              <>
                <h4>Satış Özeti</h4>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Kanal</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ciro (TL)</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Adet</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Yüzde</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Perakende</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">842,500</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">62,400</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">48%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Online</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">525,300</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">47,800</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">35%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">Toptan</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">315,200</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">75,600</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">17%</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            
            {(report.type !== "Üretim" && report.type !== "Satış") && (
              <p className="italic text-gray-500 dark:text-gray-400">
                Bu rapor türü için detaylı tablo verileri görüntüleniyor...
              </p>
            )}
            
            <h3>Sonuç ve Öneriler</h3>
            <p>
              {report.type === "Üretim" && "Üretim hedeflerinin üzerinde bir performans sergilenmiştir. Özellikle erkek çorap üretimindeki artış dikkat çekmektedir. Kapasite kullanımı ve verimlilik artışının sürdürülebilir olması için personel eğitimlerinin devam etmesi önerilmektedir."}
              {report.type === "Satış" && "Satış hedeflerine ulaşılmış olup, online satış kanalında bir önceki döneme göre %15 artış sağlanmıştır. Toptan satışlarda ise rekabetin artması sebebiyle hafif bir düşüş gözlemlenmiştir. Toptan satış kanalında yeni müşteri kazanımına yönelik stratejiler geliştirilmesi önerilmektedir."}
              {report.type === "Stok" && "Stok seviyelerinin optimum düzeyde tutulması için eldeki verilere göre sipariş miktarları ve zamanlamaları yeniden düzenlenmelidir. Özellikle mevsimsel değişimlere göre stok stratejisinin güncellenmesi önerilmektedir."}
              {report.type === "Kalite" && "Kalite kontrollerinin sıklaştırılması ve özellikle dikiş hatalarına yönelik önlemlerin alınması gerekmektedir. Üretim hattında yapılacak bazı iyileştirmeler ile hata oranının %1'in altına düşürülmesi hedeflenmelidir."}
              {report.type === "Makine" && "Makine verimliliğinin artırılması için düzenli bakım ve yedek parça tedariki konularına önem verilmelidir. Özellikle Makine 3'ün durma sürelerinin azaltılması için acil önlem alınması önerilmektedir."}
            </p>
          </div>
        </div>
        
        {/* Activity Stream */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Rapor Aktivitesi</h2>
          
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{report.createdBy}</span> oluşturdu
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {report.createdDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-100">Son görüntülenme</span>
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {report.lastAccess}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
