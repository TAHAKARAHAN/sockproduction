import React, { useState } from 'react';

interface ProductIdentityFormProps {
  onSubmit: (data: unknown) => void;
  isSubmitting?: boolean;
}

export default function ProductIdentityForm({ onSubmit, isSubmitting = false }: ProductIdentityFormProps) {
  const [formData, setFormData] = useState({
    fixMaterial: '', // Changed from "type" to "fixMaterial"
    materialLocalNo: '',
    composition: '',
    desc: '',
    supplier: '',
    placement: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Yeni Ürün Kimliği Oluştur</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fixMaterial" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Style No
          </label>
          <input
            type="text"
            id="fixMaterial"
            name="fixMaterial"
            value={formData.fixMaterial}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        
        <div>
          <label htmlFor="materialLocalNo" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Sipariş No
          </label>
          <input
            type="text"
            id="materialLocalNo"
            name="materialLocalNo"
            value={formData.materialLocalNo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="composition" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Sipariş ID
          </label>
          <input
            type="text"
            id="composition"
            name="composition"
            value={formData.composition}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="desc" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Artikel No
          </label>
          <input
            type="text"
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Supplier
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="placement" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            PLACEMENT
          </label>
          <input
            type="text"
            id="placement"
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            DESCRIPTION
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="pt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kaydediliyor...
            </>
          ) : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
