import React from "react";

interface BasicInfoProps {
  formState: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfo = ({ formState, handleInputChange }: BasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Temel Bilgiler</h2>
        
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
            <option value="MERTEKS TEKSTİL">MERTEKS TEKSTİL</option>
            <option value="ATLAS TEKSTİL">ATLAS TEKSTİL</option>
            <option value="YILDIZ ÇORAP">YILDIZ ÇORAP</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="malCinsi" className="block text-sm font-medium mb-1">Malın Cinsi</label>
          <input
            type="text"
            id="malCinsi"
            name="malCinsi"
            value={formState.malCinsi}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="styleNo" className="block text-sm font-medium mb-1">Style No</label>
          <input
            type="text"
            id="styleNo"
            name="styleNo"
            value={formState.styleNo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="adet" className="block text-sm font-medium mb-1">Adet</label>
          <input
            type="number"
            id="adet"
            name="adet"
            value={formState.adet}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Teknik Bilgiler</h2>
        
        <div className="mb-4">
          <label htmlFor="iplik" className="block text-sm font-medium mb-1">İplik</label>
          <input
            type="text"
            id="iplik"
            name="iplik"
            value={formState.iplik}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
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
          <label htmlFor="termin" className="block text-sm font-medium mb-1">Termin Tarihi</label>
          <input
            type="date"
            id="termin"
            name="termin"
            value={formState.termin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
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
