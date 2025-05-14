import React from "react";
import StatusBadge from "./StatusBadge";

export type ProductionStatus = 
  | "Üretim"
  | "Burun Dikişi"
  | "Paketleme"
  | "Tamamlandı";

interface StatusTimelineProps {
  currentStatus: ProductionStatus;
  statusHistory: {
    status: ProductionStatus;
    date: string;
    notes?: string;
    user?: string;
  }[];
}

// Define the sequence of statuses for the timeline
const statusSequence: ProductionStatus[] = [
  "Üretim",
  "Burun Dikişi",
  "Paketleme",
  "Tamamlandı"
];

// Status icons for visual representation
const statusIcons: Record<ProductionStatus, string> = {
  "Üretim": "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  "Burun Dikişi": "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13",
  "Paketleme": "M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z",
  "Tamamlandı": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
};

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, statusHistory }) => {
  const currentStatusIndex = statusSequence.indexOf(currentStatus);

  return (
    <div className="py-6">
      <div className="relative">
        {/* The horizontal line and progress bar - Moved lower */}
        <div className="hidden sm:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
        
        {/* Progress bar for completed steps - Aligned with the line */}
        <div
          className="hidden sm:block absolute top-6 left-0 h-0.5 bg-blue-500 dark:bg-blue-600 z-0 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStatusIndex / (statusSequence.length - 1)) * 100}%`,
            maxWidth: "100%",
          }}
        ></div>

        {/* Timeline steps - Circle positioned at the line, text below */}
        <div className="relative z-10 flex justify-between">
          {statusSequence.map((status, index) => {
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const historyEntry = statusHistory.find(h => h.status === status);

            return (
              <div key={status} className="flex flex-col items-center">
                {/* Status circle - Positioned to align with the horizontal line */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800' : 
                      'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'}`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statusIcons[status]}></path>
                    </svg>
                  )}
                </div>
                
                {/* Status label - With increased margin from circle and clear separation */}
                <div className="mt-4 space-y-2 text-center"> 
                  <div 
                    className={`text-xs sm:text-sm font-semibold ${isCompleted ? 'text-green-600 dark:text-green-400' : 
                      isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                      'text-gray-600 dark:text-gray-300'}`}
                  >
                    {status}
                  </div>
                  
                  {/* Date if available */}
                  {historyEntry && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1"> 
                      {historyEntry.date}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Current status details */}
      {statusHistory.length > 0 && (
        <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-3">Durum Geçmişi</h3>
          <div className="space-y-4">
            {statusHistory.map((entry, index) => (
              <div 
                key={index} 
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      entry.status === currentStatus ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className="font-medium">{entry.status}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.notes}</p>
                )}
                {entry.user && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    İşlemi yapan: {entry.user}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;
