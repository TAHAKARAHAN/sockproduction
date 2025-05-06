"use client";
import React, { useState } from "react";
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

// Define report types specific to sock manufacturing
type ReportType = 
  | "Üretim" 
  | "Satış" 
  | "Stok" 
  | "Kalite" 
  | "Makine";

// Sample chart data for sock production metrics
const monthlyProductionData = {
  labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
  datasets: [
    {
      label: 'Erkek Çorap',
      data: [12500, 13200, 14800, 13900, 15600, 16200],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
    {
      label: 'Kadın Çorap',
      data: [9800, 10500, 11200, 10800, 12100, 12700],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Çocuk Çorap',
      data: [6500, 7200, 7800, 7400, 8300, 8900],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
    }
  ]
};

// Sample chart data for sock sales by type
const salesByTypeData = {
  labels: ['Spor', 'Klasik', 'Patik', 'Desenli', 'Baskılı', 'Termal'],
  datasets: [
    {
      label: 'Satış Adedi (bin)',
      data: [45, 38, 27, 35, 22, 18],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

// Sample chart data for quality metrics
const qualityMetricsData = {
  labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs'],
  datasets: [
    {
      label: 'Hatalı Ürün Oranı (%)',
      data: [2.4, 2.1, 1.8, 1.5, 1.2],
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Kalite Skoru (100 üzerinden)',
      data: [87, 89, 91, 92, 94],
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.4,
      fill: false,
    },
  ],
};

// Sample chart data for machine efficiency
const machineEfficiencyData = {
  labels: ['Makine 1', 'Makine 2', 'Makine 3', 'Makine 4', 'Makine 5'],
  datasets: [
    {
      label: 'Verimlilik (%)',
      data: [85, 92, 78, 88, 90],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

// Sample data for sock manufacturing reports
const initialReports = [
  {
    id: "R001",
    title: "Aylık Çorap Üretim Özeti",
    type: "Üretim" as ReportType,
    createdDate: "01.05.2023",
    period: "Mayıs 2023",
    createdBy: "Üretim Müdürü",
    downloadCount: 24,
    lastAccess: "28.05.2023"
  },
  {
    id: "R002",
    title: "Çeyrek Bayii Satış Raporu",
    type: "Satış" as ReportType,
    createdDate: "15.04.2023",
    period: "Q1 2023",
    createdBy: "Satış Departmanı",
    downloadCount: 18,
    lastAccess: "10.05.2023"
  },
  {
    id: "R003",
    title: "İplik ve Aksesuar Stok Durumu",
    type: "Stok" as ReportType,
    createdDate: "20.05.2023",
    period: "Mayıs 2023",
    createdBy: "Depo Yönetimi",
    downloadCount: 12,
    lastAccess: "22.05.2023"
  },
  {
    id: "R004",
    title: "Çorap Maliyet Analizi",
    type: "Üretim" as ReportType,
    createdDate: "05.05.2023",
    period: "Q2 2023",
    createdBy: "Finans Departmanı",
    downloadCount: 9,
    lastAccess: "15.05.2023"
  },
  {
    id: "R005",
    title: "Çorap Makinesi Performans Raporu",
    type: "Makine" as ReportType,
    createdDate: "10.05.2023",
    period: "Nisan 2023",
    createdBy: "Teknik Departman",
    downloadCount: 16,
    lastAccess: "25.05.2023"
  },
  {
    id: "R006",
    title: "Çorap Modeli Satış Trend Analizi",
    type: "Satış" as ReportType,
    createdDate: "01.01.2023",
    period: "2022",
    createdBy: "Pazarlama",
    downloadCount: 32,
    lastAccess: "15.05.2023"
  },
  {
    id: "R007",
    title: "Çorap Kalite Kontrol Raporu",
    type: "Kalite" as ReportType,
    createdDate: "12.05.2023",
    period: "Mayıs 2023",
    createdBy: "Kalite Kontrol",
    downloadCount: 21,
    lastAccess: "20.05.2023"
  },
  {
    id: "R008",
    title: "Sezonluk Çorap Koleksiyon Performansı",
    type: "Satış" as ReportType,
    createdDate: "01.04.2023",
    period: "Bahar 2023",
    createdBy: "Ürün Yönetimi",
    downloadCount: 27,
    lastAccess: "18.05.2023"
  }
];

// Type color mapping for visual indication - updated for sock manufacturing
const typeColors = {
  "Üretim": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Satış": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Stok": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Kalite": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Makine": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
};

// Export these for reuse in report detail page
export { 
  monthlyProductionData, 
  salesByTypeData, 
  qualityMetricsData, 
  machineEfficiencyData,
  initialReports,
  typeColors 
};

export default function RaporlarPage() {
  const [reports, setReports] = useState(initialReports);
  const [filterType, setFilterType] = useState<ReportType | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === "" || report.type === filterType;
    const matchesSearch = searchTerm === "" || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  // Calculate stats for dashboard - updated for sock manufacturing
  const stats = {
    total: reports.length,
    production: reports.filter(r => r.type === "Üretim").length,
    sales: reports.filter(r => r.type === "Satış").length,
    quality: reports.filter(r => r.type === "Kalite").length,
    downloaded: reports.reduce((sum, report) => sum + report.downloadCount, 0)
  };

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Render chart dashboard based on report types
  const renderChartDashboard = () => {
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Production Chart */}
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
          
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Çorap Tipi Bazında Satışlar</h3>
            <div className="h-80">
              <Pie 
                data={salesByTypeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                      }
                    },
                    title: {
                      display: true,
                      text: 'Çorap Tipi Bazında Satış Dağılımı',
                      color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Quality Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Kalite Metrikleri</h3>
            <div className="h-80">
              <Line 
                data={qualityMetricsData} 
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
                      text: 'Aylık Kalite Metrikleri',
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
          
          {/* Machine Efficiency */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Makine Verimliliği</h3>
            <div className="h-80">
              <Doughnut 
                data={machineEfficiencyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                      }
                    },
                    title: {
                      display: true,
                      text: 'Çorap Makinesi Verimliliği',
                      color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Rapor Listesi</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rapor Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.slice(0, 5).map(report => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {report.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[report.type]}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/raporlar/${report.id}`} 
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <Link
              href="#"
              onClick={() => setViewMode('table')}
              className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Tüm raporları görüntüle →
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Çorap Raporları</h1>
            <p className="text-gray-500 dark:text-gray-400">Çorap üretimi ve satışına dair tüm raporları görüntüleyin ve yönetin</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } rounded-l-lg transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'chart'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } rounded-r-lg transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </button>
            </div>
            
            <Link 
              href="/raporlar/yeni" 
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Yeni Rapor Oluştur
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Rapor</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Üretim Raporları</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.production}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Kalite Raporları</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.quality}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-500 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Satış Raporları</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.sales}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'chart' ? (
          renderChartDashboard()
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Filtre ve Arama</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Arama</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Çorap raporu adı, dönem veya departman ara..."
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
                  <label htmlFor="reportType" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Rapor Tipi</label>
                  <select
                    id="reportType"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as ReportType | "")}
                  >
                    <option value="">Tüm Tipler</option>
                    <option value="Üretim">Üretim</option>
                    <option value="Satış">Satış</option>
                    <option value="Stok">Stok</option>
                    <option value="Kalite">Kalite</option>
                    <option value="Makine">Makine</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sıralama</label>
                  <select
                    id="sortBy"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setSortDirection("desc");
                    }}
                  >
                    <option value="createdDate">Oluşturma Tarihi</option>
                    <option value="title">Rapor Adı</option>
                    <option value="downloadCount">İndirme Sayısı</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center">
                          <span>Çorap Raporu</span>
                          {sortBy === "title" && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tip
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dönem
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("createdDate")}
                      >
                        <div className="flex items-center">
                          <span>Oluşturma Tarihi</span>
                          {sortBy === "createdDate" && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Oluşturan
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("downloadCount")}
                      >
                        <div className="flex items-center">
                          <span>İndirme</span>
                          {sortBy === "downloadCount" && (
                            <svg className={`w-4 h-4 ml-1 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <p className="text-lg font-medium mb-1">Çorap raporu bulunamadı</p>
                          <p>Filtreleri temizlemeyi veya yeni bir çorap raporu oluşturmayı deneyin</p>
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/raporlar/${report.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                              {report.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${typeColors[report.type]}`}>
                              {report.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{report.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{report.createdDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{report.createdBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>{report.downloadCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-3">
                              <Link 
                                href={`/raporlar/${report.id}`} 
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Görüntüle
                              </Link>
                              <button 
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors flex items-center"
                                onClick={() => {
                                  // In a real app, this would trigger download functionality
                                  alert(`${report.title} indiriliyor...`);
                                }}
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                İndir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{filteredReports.length}</span> sonuçtan <span className="font-medium">1</span> ile <span className="font-medium">{filteredReports.length}</span> arası gösteriliyor
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" disabled>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="px-4 py-2 border border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg">1</div>
                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" disabled>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
