"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface YarnDetail {
  id: string;
  description: string;
  ilkOlcum: string;
  sonOlcum: string;
  toplam: string;
}

export default function YeniNumunePage() {
  const today = format(new Date(), "dd.MM.yyyy");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  
  // Add state for sequential number
  const [sequentialNumber, setSequentialNumber] = useState<number>(1);
  
  const [formData, setFormData] = useState({
    firma: "CBN SOCKS",
    beden: "",
    tarih: today,
    saniye: "",
    artikel: "",
    model: "",
    // Add technical specs fields
    needleCount: "",
    diameter: "",
    cylinder: "",
    weltType: "",
    gauge: "",
    toeClosing: "",
    styleComposition: "",
    zeminIplikleri: [
      { id: '1-8', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-7', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-6', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-5', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-4', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: 'L-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: 'B.DİKİŞ', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
    ],
    desenIplikleri: [
      { id: '1-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '1-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '2-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '2-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '2-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '3-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '3-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '3-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '4-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '4-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '4-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '5-1', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '5-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
      { id: '5-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
    ],
    toplamAgirlik: "0",
    notlar: ""
  });

  // Generate formatted firm number on component mount
  useEffect(() => {
    // Format the number with leading zeros (e.g., 001, 012, 123)
    const formattedNumber = String(sequentialNumber).padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      firma: `CBN SOCKS #${formattedNumber}`
    }));
  }, [sequentialNumber]);

  // Pre-fill with data from the image
  useEffect(() => {
    // This simulates loading an existing sample where we might get the next number from the server
    // For demo purposes, we're using a hard-coded value
    setSequentialNumber(42); // This would come from an API in a real application
    
    setFormData(prev => ({
      ...prev,
      beden: "L56",
      saniye: "132",
      artikel: "81-03",
      model: "L56",
      zeminIplikleri: [
        { id: '1-8', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '228', sonOlcum: '140', toplam: '88' },
        { id: '1-7', description: '2tek KARDE M-58 PEMBE', ilkOlcum: '910', sonOlcum: '844', toplam: '66' },
        { id: '1-6', description: '2tek NYLON 9996 PEMBE', ilkOlcum: '928', sonOlcum: '926', toplam: '2' },
        { id: '1-5', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '1-4', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '1-3', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '274', sonOlcum: '256', toplam: '18' },
        { id: '1-2', description: '2tek KARDE M-245 SİYAH', ilkOlcum: '274', sonOlcum: '256', toplam: '18' },
        { id: '1-1', description: '20/20 Sc BEYAZ LİKRA', ilkOlcum: '1452', sonOlcum: '1414', toplam: '38' },
        { id: 'L-1', description: '140/140 BEYAZ LASTİK', ilkOlcum: '924', sonOlcum: '916', toplam: '8' },
        { id: 'B.DİKİŞ', description: '2tek NYLON SİYAH', ilkOlcum: '', sonOlcum: '', toplam: '' },
      ],
      desenIplikleri: [
        { id: '1-1', description: '2tek NYLON 9064 SİYAH (HUSSAN)', ilkOlcum: '716', sonOlcum: '702', toplam: '14' },
        { id: '1-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '1-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '2-1', description: '2tek NYLON 6010 YEŞİL (HUSSAN)', ilkOlcum: '710', sonOlcum: '702', toplam: '8' },
        { id: '2-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '2-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '3-1', description: '2tek NYLON 10171 BEYAZ (EUROTEX)', ilkOlcum: '1116', sonOlcum: '1112', toplam: '4' },
        { id: '3-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '3-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '4-1', description: '2tek NYLON 10108 EKRU (EUROTEX)', ilkOlcum: '738', sonOlcum: '730', toplam: '8' },
        { id: '4-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '4-3', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '5-1', description: '2tek NYLON 10011 KAHVE (EUROTEX)', ilkOlcum: '944', sonOlcum: '936', toplam: '8' },
        { id: '5-2', description: '', ilkOlcum: '', sonOlcum: '', toplam: '' },
        { id: '5-3', description: '2tek NYLON 10048 K.KAHVE (EUROTEX)', ilkOlcum: '1154', sonOlcum: '1150', toplam: '4' },
      ],
      toplamAgirlik: "254"
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleYarnDetailChange = (
    type: 'zemin' | 'desen',
    id: string, 
    field: keyof Omit<YarnDetail, 'id'>, 
    value: string
  ) => {
    setFormData(prev => {
      const arrayToUpdate = type === 'zemin' ? [...prev.zeminIplikleri] : [...prev.desenIplikleri];
      const index = arrayToUpdate.findIndex(item => item.id === id);
      
      if (index !== -1) {
        arrayToUpdate[index] = {
          ...arrayToUpdate[index],
          [field]: value
        };
        
        // Automatically calculate total if both measurements are provided
        if (field === 'ilkOlcum' || field === 'sonOlcum') {
          const ilkOlcum = field === 'ilkOlcum' ? parseInt(value) || 0 : parseInt(arrayToUpdate[index].ilkOlcum) || 0;
          const sonOlcum = field === 'sonOlcum' ? parseInt(value) || 0 : parseInt(arrayToUpdate[index].sonOlcum) || 0;
          
          if (ilkOlcum && sonOlcum) {
            const total = ilkOlcum - sonOlcum;
            arrayToUpdate[index].toplam = String(total > 0 ? total : 0);
          }
        }
      }
      
      // FIX: Calculate total weight using the same logic as calculateYarnTotals()
      const updatedZeminIplikleri = type === 'zemin' ? arrayToUpdate : prev.zeminIplikleri;
      const updatedDesenIplikleri = type === 'desen' ? arrayToUpdate : prev.desenIplikleri;
      
      let baseYarnTotal = 0;
      let patternYarnTotal = 0;
      
      updatedZeminIplikleri.forEach(item => {
        if (item.toplam && !isNaN(parseInt(item.toplam))) {
          baseYarnTotal += parseInt(item.toplam);
        }
      });
      
      updatedDesenIplikleri.forEach(item => {
        if (item.toplam && !isNaN(parseInt(item.toplam))) {
          patternYarnTotal += parseInt(item.toplam);
        }
      });
      
      const grandTotal = baseYarnTotal + patternYarnTotal;
      
      return {
        ...prev,
        [type === 'zemin' ? 'zeminIplikleri' : 'desenIplikleri']: arrayToUpdate,
        toplamAgirlik: String(grandTotal)
      };
    });
  };

  // Update calculateYarnTotals to be more strict about which values it includes
  const calculateYarnTotals = () => {
    let baseYarnTotal = 0;
    let patternYarnTotal = 0;
    
    formData.zeminIplikleri.forEach(item => {
      if (item.toplam && !isNaN(parseInt(item.toplam))) {
        baseYarnTotal += parseInt(item.toplam);
      }
    });
    
    formData.desenIplikleri.forEach(item => {
      if (item.toplam && !isNaN(parseInt(item.toplam))) {
        patternYarnTotal += parseInt(item.toplam);
      }
    });
    
    return {
      baseYarnTotal,
      patternYarnTotal,
      grandTotal: baseYarnTotal + patternYarnTotal
    };
  };

  // Step navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const steps = [
    { num: 1, name: "Basic Information", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { num: 2, name: "Yarn Details", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  ];

  // Render current step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderYarnDetails();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => {
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-4">CBN SOCKS</div>
            <div className="text-2xl font-bold">SAMPLE</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="firma" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              COMPANY
            </label>
            <div className="flex">
              <input
                type="text"
                id="firma"
                name="firma"
                value={formData.firma}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button 
                type="button"
                onClick={() => setSequentialNumber(prev => prev + 1)}
                className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                title="Generate new number"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="beden" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SIZE
            </label>
            <input
              type="text"
              id="beden"
              name="beden"
              value={formData.beden}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="tarih" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              DATE
            </label>
            <input
              type="text"
              id="tarih"
              name="tarih"
              value={formData.tarih}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="artikel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ARTICLE
            </label>
            <input
              type="text"
              id="artikel"
              name="artikel"
              value={formData.artikel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MODEL
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="saniye" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SECONDS
            </label>
            <input
              type="text"
              id="saniye"
              name="saniye"
              value={formData.saniye}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        {/* Technical Specifications Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label htmlFor="needleCount" className="block text-sm font-medium mb-1">Needle Count</label>
                <select
                  id="needleCount"
                  name="needleCount"
                  value={formData.needleCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Needle Count</option>
                  <option value="48">48</option>
                  <option value="52">52</option>
                  <option value="56">56</option>
                  <option value="60">60</option>
                  <option value="72">72</option>
                  <option value="84">84</option>
                  <option value="96">96</option>
                  <option value="108">108</option>
                  <option value="112">112</option>
                  <option value="120">120</option>
                  <option value="132">132</option>
                  <option value="144">144</option>
                  <option value="156">156</option>
                  <option value="168">168</option>
                  <option value="200">200</option>
                  <option value="220">220</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="diameter" className="block text-sm font-medium mb-1">Diameter</label>
                <select
                  id="diameter"
                  name="diameter"
                  value={formData.diameter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Diameter</option>
                  <option value='3 1/4"'>3 1/4"</option>
                  <option value='3.5"'>3.5"</option>
                  <option value='3 3/4"'>3 3/4"</option>
                  <option value='4"'>4"</option>
                  <option value='4.5"'>4.5"</option>
                  <option value='5"'>5"</option>
                  <option value='5.5"'>5.5"</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="cylinder" className="block text-sm font-medium mb-1">Cylinder (SC/DC)</label>
                <select
                  id="cylinder"
                  name="cylinder"
                  value={formData.cylinder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Cylinder Type</option>
                  <option value="Double cylinder">Double cylinder</option>
                  <option value="Single cylinder">Single cylinder</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label htmlFor="weltType" className="block text-sm font-medium mb-1">Welt Type</label>
                <select
                  id="weltType"
                  name="weltType"
                  value={formData.weltType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Welt Type</option>
                  <option value="plain">plain</option>
                  <option value="rib 1:1">rib 1:1</option>
                  <option value="rib 2:2">rib 2:2</option>
                  <option value="rib 3:1">rib 3:1</option>
                  <option value="rib 3:2">rib 3:2</option>
                  <option value="rib 5:1">rib 5:1</option>
                  <option value="lacoste">lacoste</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="gauge" className="block text-sm font-medium mb-1">Gauge</label>
                <select
                  id="gauge"
                  name="gauge"
                  value={formData.gauge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Gauge</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="14">14</option>
                  <option value="18">18</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="toeClosing" className="block text-sm font-medium mb-1">Toe Closing</label>
                <select
                  id="toeClosing"
                  name="toeClosing"
                  value={formData.toeClosing}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Toe Closing</option>
                  <option value="rosso">rosso</option>
                  <option value="hand linking">hand linking</option>
                  <option value="s by s">s by s</option>
                  <option value="comfort">comfort</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="mb-4">
              <label htmlFor="styleComposition" className="block text-sm font-medium mb-1">Style Composition Sales Main</label>
              <textarea
                id="styleComposition"
                name="styleComposition"
                rows={3}
                value={formData.styleComposition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="33% WOOL, 31% COTTON, 21% POLYAMIDE, 13% SILK, 2% ELASTANE"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="notlar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notlar"
            name="notlar"
            rows={3}
            value={formData.notlar}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add notes about the sample here..."
          ></textarea>
        </div>
      </div>
    );
  };

  // New combined render function for yarn details
  const renderYarnDetails = () => {
    return (
      <div>
        {/* Base Yarns Section */}
        <h2 className="text-lg font-medium mb-4 border-b pb-2">BASE YARNS</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  YARN DETAILS
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  FIRST MEASUREMENT
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  LAST MEASUREMENT
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {formData.zeminIplikleri.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleYarnDetailChange('zemin', item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.ilkOlcum}
                      onChange={(e) => handleYarnDetailChange('zemin', item.id, 'ilkOlcum', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.sonOlcum}
                      onChange={(e) => handleYarnDetailChange('zemin', item.id, 'sonOlcum', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.toplam}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pattern Yarns Section */}
        <h2 className="text-lg font-medium mb-4 border-b pb-2 mt-10">PATTERN YARNS</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  YARN DETAILS
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  FIRST MEASUREMENT
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  LAST MEASUREMENT
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {formData.desenIplikleri.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-medium">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleYarnDetailChange('desen', item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.ilkOlcum}
                      onChange={(e) => handleYarnDetailChange('desen', item.id, 'ilkOlcum', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.sonOlcum}
                      onChange={(e) => handleYarnDetailChange('desen', item.id, 'sonOlcum', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={item.toplam}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-600 dark:text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Total Weight Section with detailed breakdown */}
        <div className="mt-10 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-medium mb-4 border-b pb-2">WEIGHT SUMMARY</h2>
          
          {/* Base Yarn Details */}
          <div className="mb-4">
            <div className="text-md font-medium mb-2">BASE YARNS:</div>
            <div className="pl-4 space-y-1">
              {formData.zeminIplikleri.filter(item => parseInt(item.toplam) > 0).map(yarn => (
                <div key={`base-${yarn.id}`} className="flex justify-between text-sm">
                  <span className="truncate max-w-xs">{yarn.description || yarn.id}</span>
                  <span className="font-medium">{yarn.toplam} g</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600 font-medium">
                <span>Base Yarns Subtotal:</span>
                <span>{calculateYarnTotals().baseYarnTotal} g</span>
              </div>
            </div>
          </div>
          
          {/* Pattern Yarn Details */}
          <div className="mb-4">
            <div className="text-md font-medium mb-2">PATTERN YARNS:</div>
            <div className="pl-4 space-y-1">
              {formData.desenIplikleri.filter(item => parseInt(item.toplam) > 0).map(yarn => (
                <div key={`pattern-${yarn.id}`} className="flex justify-between text-sm">
                  <span className="truncate max-w-xs">{yarn.description || yarn.id}</span>
                  <span className="font-medium">{yarn.toplam} g</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600 font-medium">
                <span>Pattern Yarns Subtotal:</span>
                <span>{calculateYarnTotals().patternYarnTotal} g</span>
              </div>
            </div>
          </div>
          
          {/* Grand Total */}
          <div className="mt-4 pt-3 border-t-2 border-gray-300 dark:border-gray-500">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">TOTAL WEIGHT:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formData.toplamAgirlik} grams</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-1">
              Sum of all yarn weights ({calculateYarnTotals().baseYarnTotal} + {calculateYarnTotals().patternYarnTotal})
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Change the handleSubmit function to just handle the actual submission
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    // Here you would typically send the data to your API
    console.log("Form submitted:", formData);
    
    // Simulate API call with slight delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Redirect to list page after showing success message
      setTimeout(() => {
        router.push('/numuneler');
      }, 2000);
    }, 800);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Success modal overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all animate-success-modal">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300 animate-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Sample Successfully Saved!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Your sample has been created in the system.</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                You are being redirected to the sample list...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            {/* Add breadcrumb navigation similar to product identity page */}
            <div className="flex items-center gap-2 mb-2">
              <Link href="/numuneler" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Samples
              </Link>
              <span>/</span>
              <span>New Sample</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create New Sample</h1>
            <p className="text-gray-500 dark:text-gray-400">Step {currentStep} / {steps.length}</p>
          </div>
          <Link
            href="/numuneler"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to List
          </Link>
        </div>

        {/* Progress Steps - Use simplified step indicator like in product identity */}
        <div className="mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${currentStep >= step.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
                    ${index === 0 ? '' : 'ml-2'} 
                    cursor-pointer`}
                  onClick={() => step.num <= Math.max(currentStep, 2) && goToStep(step.num)}
                >
                  {currentStep > step.num ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 ${currentStep > step.num ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
            {steps.map(step => (
              <div key={step.num} className="w-20 text-center">
                {step.name}
              </div>
            ))}
          </div>
        </div>

        {/* Keep the existing content area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 transition-all">
          <div>
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>
            
            {/* Existing navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Step
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <Link
                  href="/numuneler"
                  className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center"
                  >
                    Next Step
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all flex items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Sample
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Click the "Save Sample" button after filling in all fields.</p>
          <p>If you need help, visit the <span className="text-blue-600 hover:underline cursor-pointer">help page</span>.</p>
        </div>
      </div>
    </div>
  );
}
