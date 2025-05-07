import React, { useState, useEffect } from "react";

interface BasicInfoProps {
  formState: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfo = ({ formState, handleInputChange }: BasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="mb-4">
          <label htmlFor="uretici" className="block text-sm font-medium mb-1">Üretici</label>
          <select
            id="uretici"
            name="uretici"
            value={formState.uretici}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="">Seçiniz</option>
            {formState.uretici === "Manuel Giriş" && (
              <option value="Manuel Giriş">Manuel Giriş</option>
            )}
          </select>
          {formState.uretici === "Manuel Giriş" && (
            <input
              type="text"
              name="ureticiManuel"
              placeholder="Üretici adını giriniz"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              value={formState.ureticiManuel || ""}
              onChange={handleInputChange}
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="style_no" className="block text-sm font-medium mb-1">Style No</label>
          <input
            type="text"
            id="style_no"
            name="style_no"
            value={formState.style_no}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="burun" className="block text-sm font-medium mb-1">Burun</label>
          <input
            type="text"
            id="burun"
            name="burun"
            value={formState.burun}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="not" className="block text-sm font-medium mb-1">Notlar</label>
          <textarea
            id="not"
            name="not"
            rows={3}
            value={formState.not}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
