import React from "react";
import { ProductionStatus } from "./StatusTimeline";

interface StatusBadgeProps {
  status: ProductionStatus;
  showDot?: boolean;
}

// Status color mapping for visual indication
const statusColors = {
  "Hammadde Girişi": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  "Numune Testi": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Üretim": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Burun Dikişi": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Yıkama": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Kurutma": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Paketleme": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const dotColors = {
  "Hammadde Girişi": "bg-gray-500 dark:bg-gray-400",
  "Numune Testi": "bg-blue-500 dark:bg-blue-400",
  "Üretim": "bg-amber-500 dark:bg-amber-400",
  "Burun Dikişi": "bg-orange-500 dark:bg-orange-400",
  "Yıkama": "bg-cyan-500 dark:bg-cyan-400",
  "Kurutma": "bg-indigo-500 dark:bg-indigo-400",
  "Paketleme": "bg-purple-500 dark:bg-purple-400",
  "Tamamlandı": "bg-green-500 dark:bg-green-400"
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true }) => {
  return (
    <span className={`px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
      {showDot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${dotColors[status]}`}></span>
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
