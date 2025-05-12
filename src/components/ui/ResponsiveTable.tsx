import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveTable - A wrapper component that makes tables responsive on small screens
 * 
 * Usage:
 * <ResponsiveTable>
 *   <table>...</table>
 * </ResponsiveTable>
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto -mx-4 sm:mx-0 ${className}`}>
      <div className="inline-block min-w-full align-middle p-4 sm:p-0">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveTable;
