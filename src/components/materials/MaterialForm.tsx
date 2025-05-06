import React, { useState } from 'react';

interface MaterialData {
  id?: string;
  fixMaterial: string; // Changed from "type" to "fixMaterial"
  materialLocalNo: string;
  composition: string;
  desc: string;
  supplier: string;
  placement: string;
  description: string;
}

interface MaterialFormProps {
  initialData?: MaterialData;
  onSubmit: (data: MaterialData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function MaterialForm({ 
  initialData = { 
    fixMaterial: '', 
    materialLocalNo: '', 
    composition: '', 
    desc: '', 
    supplier: '', 
    placement: '', 
    description: '' 
  },
  onSubmit,
  onCancel,
  isSubmitting = false 
}: MaterialFormProps) {
  
  const [formData, setFormData] = useState<MaterialData>(initialData);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Changed label from "TYPE" to "FIX MATERIAL" and input name from "type" to "fixMaterial" */}
          <label htmlFor="fixMaterial" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            FIX MATERIAL
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
            Material Local No.
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
            COMPOSITION
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
            DESCRIPTION
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
            SUPPLIER
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
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}