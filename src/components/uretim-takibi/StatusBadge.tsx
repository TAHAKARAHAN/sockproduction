import React from "react";
import { ProductionStatus } from "./StatusTimeline";

interface StatusBadgeProps {
  status: ProductionStatus;
  showDot?: boolean;
}

// Status color mapping for visual indication
const statusColors = {
  "Üretim": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Burun Dikişi": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Paketleme": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Tamamlandı": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const dotColors = {
  "Üretim": "bg-amber-500 dark:bg-amber-400",
  "Burun Dikişi": "bg-orange-500 dark:bg-orange-400",
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
