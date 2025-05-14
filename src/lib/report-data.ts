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

// Register ChartJS components
if (typeof window !== 'undefined') {
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
}

// Define report types specific to sock manufacturing
export type ReportType = 
  | "Üretim" 
  | "Satış" 
  | "Stok" 
  | "Kalite" 
  | "Makine";

// Sample chart data for sock production metrics
export const monthlyProductionData = {
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
export const salesByTypeData = {
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
export const qualityMetricsData = {
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
export const machineEfficiencyData = {
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
export const initialReports = [
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
  // ... other reports
];

// Type color mapping for visual indication - updated for sock manufacturing
export const typeColors = {
  "Üretim": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Satış": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Stok": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Kalite": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Makine": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
};
