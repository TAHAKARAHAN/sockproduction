import React from "react";
import { FormState } from "@/app/urun-kimligi/yeni/page";

interface CompanyInfoProps {
  formState: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const CompanyInfo = ({ formState, handleInputChange }: CompanyInfoProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 border-b pb-2">Firma Ürün Bilgileri</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="companyProductCategory" className="block text-sm font-medium mb-1">COMPANY PRODUCT CATEGORY</label>
            <input
              type="text"
              id="companyProductCategory"
              name="companyProductCategory"
              value={formState.companyProductCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="19"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="ecc" className="block text-sm font-medium mb-1">ECC</label>
            <input
              type="text"
              id="ecc"
              name="ecc"
              value={formState.ecc}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="03"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="season" className="block text-sm font-medium mb-1">SEASON</label>
            <input
              type="text"
              id="season"
              name="season"
              value={formState.season}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="FW 2025"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="eccErpNo" className="block text-sm font-medium mb-1">ECC ERP No</label>
            <input
              type="text"
              id="eccErpNo"
              name="eccErpNo"
              value={formState.eccErpNo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="301691"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="brandDivision" className="block text-sm font-medium mb-1">BRAND/DIVISION</label>
            <input
              type="text"
              id="brandDivision"
              name="brandDivision"
              value={formState.brandDivision}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="50 10 ECC Legwear"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="styleNumber" className="block text-sm font-medium mb-1">STYLE #</label>
            <input
              type="text"
              id="styleNumber"
              name="styleNumber"
              value={formState.styleNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="77597"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="genderSizeRange" className="block text-sm font-medium mb-1">GENDER SIZE RANGE</label>
            <input
              type="text"
              id="genderSizeRange"
              name="genderSizeRange"
              value={formState.genderSizeRange}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="500 02 Women"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="mainCategory" className="block text-sm font-medium mb-1">MAIN CATEGORY</label>
            <input
              type="text"
              id="mainCategory"
              name="mainCategory"
              value={formState.mainCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="10 Knit"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="basicSizeSpec" className="block text-sm font-medium mb-1">Basic Size Spec No.</label>
            <input
              type="text"
              id="basicSizeSpec"
              name="basicSizeSpec"
              value={formState.basicSizeSpec}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Socks"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="sizeRange" className="block text-sm font-medium mb-1">Size Range</label>
            <input
              type="text"
              id="sizeRange"
              name="sizeRange"
              value={formState.sizeRange}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="ECC Unisex size range 31-34"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="basicMeasTable" className="block text-sm font-medium mb-1">SELECT FINISHED BASIC MEAS. TABLE</label>
            <input
              type="text"
              id="basicMeasTable"
              name="basicMeasTable"
              value={formState.basicMeasTable}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="baseSize" className="block text-sm font-medium mb-1">Base Size</label>
            <input
              type="text"
              id="baseSize"
              name="baseSize"
              value={formState.baseSize}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
