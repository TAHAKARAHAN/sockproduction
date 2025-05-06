"use client";

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";

type FormDataType = {
  type: "summary" | "detailed";
  period: string;
  startDate: string;
  endDate: string;
  includeCharts: boolean;
  includeTables: boolean;
  chartTypes: string[];
  tableTypes: string[];
  schedule: "once" | "daily" | "weekly" | "monthly";
  showDailyDetails: boolean;
  processTypes: string[];
};

type StepType = {
  num: number;
  name: string;
  icon: string;
};

export default function Page() {
  // Step 1: Report Type and Period
  // Step 2: Report Content
  // Step 3: Distribution and Scheduling

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    type: "summary",
    period: "",
    startDate: "",
    endDate: "",
    includeCharts: false,
    includeTables: false,
    chartTypes: [],
    tableTypes: [],
    schedule: "once",
    showDailyDetails: false,
    processTypes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showExample, setShowExample] = useState(false); // Add state for showing example
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const steps: StepType[] = [
    { num: 1, name: "Rapor Tipi", icon: "M5 13l4 4L19 7" },
    { num: 2, name: "İçerik Seçimi", icon: "M5 13l4 4L19 7" },
    { num: 3, name: "Paylaşım ve Zamanlama", icon: "M5 13l4 4L19 7" },
  ];

  // Handle Input Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle MultiSelect Change
  const handleMultiSelectChange = (field: keyof FormDataType, value: string) => {
    setFormData((prevData) => {
      const currentValues = prevData[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prevData, [field]: newValues };
    });
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  // Go to Step
  const goToStep = (stepNum: number) => {
    setCurrentStep(stepNum);
  };

  // Next Step
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // Previous Step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.period.trim()) {
      errors.push("Lütfen bir dönem belirtin");
    }

    if (!formData.startDate || !formData.endDate) {
      errors.push("Lütfen tarih aralığı belirtin");
    }

    if (formData.includeCharts && formData.chartTypes.length === 0) {
      errors.push("Lütfen en az bir grafik türü seçin");
    }

    if (formData.includeTables && formData.tableTypes.length === 0) {
      errors.push("Lütfen en az bir tablo türü seçin");
    }

    if (formData.type === "detailed" && formData.processTypes.length === 0) {
      errors.push("Lütfen en az bir üretim süreci seçin");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show example instead of confirmation
    setShowExample(true);
  };

  // Handle Confirm Report Creation
  const handleConfirmCreate = () => {
    setShowConfirmation(false);
    setShowExample(false); // Hide example panel
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect to reports page after 3 seconds
      setTimeout(() => {
        window.location.href = "/raporlar";
      }, 3000);
    }, 2000);
  };

  // Handle Cancel Confirmation
  const handleCancelConfirm = () => {
    setShowConfirmation(false);
    setShowExample(false); // Hide example panel
  };

  // Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderReportTypeAndPeriod();
      case 2:
        return renderReportContent();
      case 3:
        return renderDistributionScheduling();
      default:
        return null;
    }
  };

  // Render Step 1: Report Type and Period
  const renderReportTypeAndPeriod = () => (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rapor Tipi
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="summary">Özet Rapor</option>
          <option value="detailed">Detaylı Rapor</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dönem
        </label>
        <input
          type="text"
          name="period"
          value={formData.period}
          onChange={handleInputChange}
          placeholder="Örn: 2023 Q1"
          className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tarih Aralığı
        </label>
        <div className="flex space-x-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  // Render Step 2 content
  const renderReportContent = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="includeCharts"
            name="includeCharts"
            checked={formData.includeCharts}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="includeCharts" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Grafik ve Görseller İçer
          </label>
        </div>

        {formData.includeCharts && (
          <div className="ml-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Görselleştirilecek Grafik Türleri:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["bar", "line", "pie", "area", "radar"].map((chartType) => (
                <div key={chartType} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`chart-${chartType}`}
                    checked={formData.chartTypes.includes(chartType)}
                    onChange={() => handleMultiSelectChange("chartTypes", chartType)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor={`chart-${chartType}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Grafik
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Not: Seçilen veri türüne ve miktarına göre bazı grafik türleri otomatik olarak oluşturulacaktır.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="includeTables"
            name="includeTables"
            checked={formData.includeTables}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="includeTables" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tablolar ve Detaylı Veriler İçer
          </label>
        </div>

        {formData.includeTables && (
          <div className="ml-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Eklenecek Tablo Türleri:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "summary", label: "Özet Veriler" },
                { id: "detailed", label: "Detaylı Veriler" },
                { id: "comparison", label: "Karşılaştırma Tabloları" },
                { id: "trends", label: "Trend Analizleri" },
              ].map((tableType) => (
                <div key={tableType.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`table-${tableType.id}`}
                    checked={formData.tableTypes.includes(tableType.id)}
                    onChange={() => handleMultiSelectChange("tableTypes", tableType.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor={`table-${tableType.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {tableType.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Production Process Types */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Üretim Süreçleri
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Rapora hangi üretim süreçleri dahil edilsin?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "burunDikme", label: "Burun Dikme" },
              { id: "yikama", label: "Yıkama" },
              { id: "kurutma", label: "Kurutma" },
              { id: "paketleme", label: "Paketleme" },
            ].map((processType) => (
              <div key={processType.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`process-${processType.id}`}
                  checked={formData.processTypes.includes(processType.id)}
                  onChange={() => handleMultiSelectChange("processTypes", processType.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`process-${processType.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {processType.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Details Option */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showDailyDetails"
            name="showDailyDetails"
            checked={formData.showDailyDetails}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="showDailyDetails" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Günlük Detayları Göster
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
          Seçilen tarih aralığındaki her gün için ayrı üretim verileri gösterilir.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rapor Özeti
        </h3>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Rapor Tipi:</span> {formData.type === "summary" ? "Özet Rapor" : "Detaylı Rapor"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Dönem:</span> {formData.period || "Belirtilmedi"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Tarih Aralığı:</span> {formData.startDate ? `${formData.startDate} - ${formData.endDate}` : "Belirtilmedi"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">İçerik:</span>{" "}
            {[
              formData.includeCharts ? "Grafikler" : null,
              formData.includeTables ? "Tablolar" : null,
            ]
              .filter(Boolean)
              .join(", ") || "Belirtilmedi"}
          </p>
          {formData.processTypes.length > 0 && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">Üretim Süreçleri:</span>{" "}
              {formData.processTypes
                .map((process) => {
                  switch (process) {
                    case "burunDikme":
                      return "Burun Dikme";
                    case "yikama":
                      return "Yıkama";
                    case "kurutma":
                      return "Kurutma";
                    case "paketleme":
                      return "Paketleme";
                    default:
                      return process;
                  }
                })
                .join(", ")}
            </p>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Detay Seviyesi:</span>{" "}
            {formData.showDailyDetails ? "Günlük detaylar" : "Özet görünüm"}
          </p>
        </div>
      </div>
    </div>
  );

  // Render step 3 content
  const renderDistributionScheduling = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Rapor Zamanlama
        </h3>
        <div>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="schedule-once"
                name="schedule"
                value="once"
                checked={formData.schedule === "once"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="schedule-once"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Tek Seferlik Oluştur
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="schedule-daily"
                name="schedule"
                value="daily"
                checked={formData.schedule === "daily"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="schedule-daily"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Günlük
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="schedule-weekly"
                name="schedule"
                value="weekly"
                checked={formData.schedule === "weekly"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="schedule-weekly"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Haftalık
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="schedule-monthly"
                name="schedule"
                value="monthly"
                checked={formData.schedule === "monthly"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="schedule-monthly"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Aylık
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Rapor Özeti
        </h3>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Rapor Tipi:</span> {formData.type === "summary" ? "Özet Rapor" : "Detaylı Rapor"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Dönem:</span> {formData.period || "Belirtilmedi"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Tarih Aralığı:</span> {formData.startDate ? `${formData.startDate} - ${formData.endDate}` : "Belirtilmedi"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Zamanlama:</span> {
              formData.schedule === "once" ? "Tek Seferlik" :
              formData.schedule === "daily" ? "Günlük" :
              formData.schedule === "weekly" ? "Haftalık" : "Aylık"
            }
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yeni Rapor Oluştur</h1>
          <p className="text-gray-500 dark:text-gray-400">Rapor bilgilerini adım adım girin</p>
        </div>
        <Link
          href="/raporlar"
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Listeye Dön
        </Link>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step) => (
            <div 
              key={step.num} 
              className={`flex flex-col items-center cursor-pointer ${currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'}`}
              onClick={() => step.num <= Math.max(currentStep, 2) && goToStep(step.num)}
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ease-in-out
                  ${currentStep === step.num 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900' 
                    : currentStep > step.num 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
              >
                {currentStep > step.num ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <span>{step.num}</span>
                )}
              </div>
              <span className="text-sm font-medium">{step.name}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Adım {step.num}/{steps.length}
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Steps */}
        <div className="block md:hidden mb-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-blue-600">Adım {currentStep}/{steps.length}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{steps[currentStep-1].name}</span>
          </div>
        </div>
        
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="absolute bg-blue-600 h-full transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
        {showExample ? (
          <div className="animate-fade-in">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Oluşturulacak Rapor Örneği</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={handleConfirmCreate}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  Raporu Oluştur
                </button>
              </div>
            </div>
            
            {/* Example Report Preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {formData.period} {formData.type === "summary" ? "Özet Raporu" : "Detaylı Raporu"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tarih Aralığı: {formData.startDate} - {formData.endDate}
                </p>
              </div>
              
              <div className="p-6">
                {/* Sample Charts */}
                {formData.includeCharts && (
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Grafikler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                        <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bar Grafik</div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 h-40 rounded flex items-center justify-center">
                          <svg className="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 13v-1m4 1v-3m4 3V8M12 21l9-9-9-9-9 9 9 9z" />
                          </svg>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                        <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pasta Grafik</div>
                        <div className="bg-green-50 dark:bg-green-900/20 h-40 rounded flex items-center justify-center">
                          <svg className="w-32 h-32 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="1" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2a10 10 0 0110 10M12 2v10l-6.364 6.364" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Sample Tables */}
                {formData.includeTables && (
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Tablolar</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ürün</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Miktar</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Erkek Çorap</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">16,200</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                ✓ Tamamlandı
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Kadın Çorap</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">12,700</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                ✓ Tamamlandı
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Çocuk Çorap</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">8,900</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                ⧖ Devam Ediyor
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Production Processes */}
                {formData.processTypes.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Üretim Süreçleri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.processTypes.map(process => (
                        <div key={process} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {process === "burunDikme" ? "Burun Dikme" : 
                               process === "yikama" ? "Yıkama" :
                               process === "kurutma" ? "Kurutma" : "Paketleme"}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              % {Math.floor(Math.random() * 30) + 70} Tamamlandı
                            </span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Schedule Information */}
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Rapor Zamanlama</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.schedule === "once" ? "Bu rapor tek seferlik oluşturulacak." :
                     formData.schedule === "daily" ? "Bu rapor günlük olarak otomatik oluşturulacak." :
                     formData.schedule === "weekly" ? "Bu rapor haftalık olarak otomatik oluşturulacak." :
                     "Bu rapor aylık olarak otomatik oluşturulacak."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>
            
            {/* Show validation errors if any */}
            {validationErrors.length > 0 && currentStep === 3 && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                  Lütfen aşağıdaki hataları düzeltin:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
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
                    Önceki Adım
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <Link
                  href="/raporlar"
                  className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  İptal
                </Link>
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center"
                  >
                    Sonraki Adım
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all flex items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Rapor Oluştur
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Tüm alanları doldurduktan sonra "Rapor Oluştur" düğmesine tıklayın.</p>
        <p>Yardıma ihtiyacınız olursa, <span className="text-blue-600 hover:underline cursor-pointer">yardım sayfasını</span> ziyaret edin.</p>
      </div>
    </div>
  );
}