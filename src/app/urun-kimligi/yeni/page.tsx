"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import TechnicalSpecs from "@/components/urun-kimligi/TechnicalSpecs";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

// Define the interfaces for our form state types
interface BomItem {
  material: string;
  composition: string;
  desc: string;
  placement: string;
}

// Change the FormState interface to be exported:
export interface FormState {
  companyProductCategory: string | number | readonly string[] | undefined;
  ecc: string | number | readonly string[] | undefined;
  season: string | number | readonly string[] | undefined;
  eccErpNo: string | number | readonly string[] | undefined;
  brandDivision: string | number | readonly string[] | undefined;
  styleNumber: string | number | readonly string[] | undefined;
  genderSizeRange: string | number | readonly string[] | undefined;
  mainCategory: string | number | readonly string[] | undefined;
  basicSizeSpec: string | number | readonly string[] | undefined;
  sizeRange: string | number | readonly string[] | undefined;
  basicMeasTable: string | number | readonly string[] | undefined;
  baseSize: string | number | readonly string[] | undefined;
  // Technical specs fields
  needleCount: string;
  diameter: string;
  cylinder: string;
  weltType: string;
  gauge: string;
  toeClosing: string;
  uretici: string; // Manufacturer field
  
  // Basic info fields
  style_no: string;
  
  // BOM section
  bomItems: BomItem[];
  
  // New fields for dynamic sizes
  productType: 'baby' | 'normal';
  activeSizes: string[];
  
  // Measurement values will now be stored dynamically
  measurements: {
    [key: string]: {
      [size: string]: string;
      tolerance: string;
    }
  };
  
  // Multiple image storage
  productImages: Array<{
    file: File;
    preview: string;
  }>;

  // Legacy measurement properties for backward compatibility
  full_35_38?: string;
  full_39_42?: string;
  full_43_46?: string;
  full_tolerance?: string;
  
  fol_35_38?: string;
  fol_39_42?: string;
  fol_43_46?: string;
  fol_tolerance?: string;
  
  rtw_35_38?: string;
  rtw_39_42?: string;
  rtw_43_46?: string;
  rtw_tolerance?: string;
  
  rth_35_38?: string;
  rth_39_42?: string;
  rth_43_46?: string;
  rth_tolerance?: string;
  
  lsre_35_38?: string;
  lsre_39_42?: string;
  lsre_43_46?: string;
  lsre_tolerance?: string;
  
  lsle_35_38?: string;
  lsle_39_42?: string;
  lsle_43_46?: string;
  lsle_tolerance?: string;
  
  lsfo_35_38?: string;
  lsfo_39_42?: string;
  lsfo_43_46?: string;
  lsfo_tolerance?: string;
  
  lsh_35_38?: string;
  lsh_39_42?: string;
  lsh_43_46?: string;
  lsh_tolerance?: string;
  
  gram?: string;
  gram_tolerance?: string;
}

export default function CreateProductIdentityPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Generate random style number in format ST-XXXXXX
  const generateStyleNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
    return `ST-${randomNum}`;
  };

  // Initialize form state with a generated style number
  const [formState, setFormState] = useState<FormState>({
    // Required properties from FormState interface that were missing
    companyProductCategory: "",
    ecc: "",
    season: "",
    eccErpNo: "",
    brandDivision: "",
    styleNumber: "",
    genderSizeRange: "",
    mainCategory: "",
    basicSizeSpec: "",
    sizeRange: "",
    basicMeasTable: "",
    baseSize: "",
    
    // Technical specs
    needleCount: "",
    diameter: "",
    cylinder: "",
    weltType: "",
    gauge: "",
    toeClosing: "",
    uretici: "", 
    
    // Auto-generate style_no initially
    style_no: generateStyleNumber(),
    
    // BOM items
    bomItems: [],
    
    // Initialize with product type and active sizes
    productType: 'normal',
    activeSizes: ['35-38', '39-42', '43-46'],
    
    // Initialize measurements with existing structure but as a dynamic object
    measurements: {
      FULL: {
        '35-38': '24,00',
        '39-42': '24,00',
        '43-46': '24,00',
        tolerance: '1,00'
      },
      FOL: {
        '35-38': '23,00',
        '39-42': '25,00',
        '43-46': '27,00',
        tolerance: '1,00'
      },
      RTW: {
        '35-38': '8,00',
        '39-42': '8,00',
        '43-46': '8,00',
        tolerance: '0,50'
      },
      RTH: {
        '35-38': '6,00',
        '39-42': '6,00',
        '43-46': '6,00',
        tolerance: '0,50'
      },
      LSRE: {
        '35-38': '22,00',
        '39-42': '22,00',
        '43-46': '22,00',
        tolerance: '1,00'
      },
      LSLE: {
        '35-38': '21,00',
        '39-42': '21,00',
        '43-46': '21,00',
        tolerance: '1,00'
      },
      LSFO: {
        '35-38': '21,00',
        '39-42': '21,00',
        '43-46': '21,00',
        tolerance: '1,00'
      },
      LSH: {
        '35-38': '11,00',
        '39-42': '11,00',
        '43-46': '11,00',
        tolerance: '1,00'
      },
      GRAM: {
        tolerance: '0,10',
        value: 'g'
      }
    },
    
    // Keep the old structure for compatibility until fully migrated
    full_35_38: "24,00",
    full_39_42: "24,00",
    full_43_46: "24,00",
    full_tolerance: "1,00",
    
    fol_35_38: "23,00",
    fol_39_42: "25,00",
    fol_43_46: "27,00",
    fol_tolerance: "1,00",
    
    rtw_35_38: "8,00",
    rtw_39_42: "8,00",
    rtw_43_46: "8,00",
    rtw_tolerance: "0,50",
    
    rth_35_38: "6,00",
    rth_39_42: "6,00",
    rth_43_46: "6,00",
    rth_tolerance: "0,50",
    
    lsre_35_38: "22,00",
    lsre_39_42: "22,00",
    lsre_43_46: "22,00",
    lsre_tolerance: "1,00",
    
    lsle_35_38: "21,00",
    lsle_39_42: "21,00",
    lsle_43_46: "21,00",
    lsle_tolerance: "1,00",
    
    lsfo_35_38: "21,00",
    lsfo_39_42: "21,00",
    lsfo_43_46: "21,00",
    lsfo_tolerance: "1,00",
    
    lsh_35_38: "11,00",
    lsh_39_42: "11,00",
    lsh_43_46: "11,00",
    lsh_tolerance: "1,00",
    gram: "g",
    gram_tolerance: "0,10",
    
    // Initialize empty images array
    productImages: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false); // Add success modal state
  const router = useRouter();

  // Define available sizes
  const babySizes = ['13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-22', '23-26', '27-30', '31-34'];
  const normalSizes = ['35-38', '39-42', '43-46', '47-50'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const addBomItem = () => {
    setFormState(prev => ({
      ...prev,
      bomItems: [
        ...prev.bomItems,
        {
          material: "",
          composition: "",
          desc: "",
          placement: ""
        }
      ]
    }));
  };
  
  const removeBomItem = (index: number) => {
    setFormState(prev => ({
      ...prev,
      bomItems: prev.bomItems.filter((_, i) => i !== index)
    }));
  };
  
  const nextStep = () => {
    setCurrentStep(current => current + 1);
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 1));
  };

  const handleBomItemChange = (index: number, field: keyof BomItem, value: string) => {
    const updatedBomItems = [...formState.bomItems];
    updatedBomItems[index] = { ...updatedBomItems[index], [field]: value };
    setFormState(prev => ({ ...prev, bomItems: updatedBomItems }));
  };

  // Handle multiple image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Create new image objects for each file
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormState(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...newImages]
    }));
  };

  // Delete a specific image by index
  const handleDeleteImage = (index: number) => {
    setFormState(prev => {
      // Release the URL object to avoid memory leaks
      if (prev.productImages[index]?.preview) {
        URL.revokeObjectURL(prev.productImages[index].preview);
      }
      
      // Filter out the image at the specified index
      return {
        ...prev,
        productImages: prev.productImages.filter((_, i) => i !== index)
      };
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Handle product type change
  const handleProductTypeChange = (type: 'baby' | 'normal') => {
    let defaultSizes: string[];
    
    if (type === 'baby') {
      defaultSizes = ['19-22', '23-26', '27-30']; // Default baby sizes
    } else {
      defaultSizes = ['35-38', '39-42', '43-46']; // Default normal sizes
    }
    
    // Initialize measurements for the new sizes
    const updatedMeasurements = { ...formState.measurements };
    
    // For each measurement type, add the new sizes with default values
    Object.keys(updatedMeasurements).forEach(measureType => {
      if (measureType !== 'GRAM') {
        // Add explicit type annotation to tell TypeScript this object can have dynamic keys
        const measurement: { [key: string]: string; tolerance: string } = { 
          ...updatedMeasurements[measureType], 
          tolerance: updatedMeasurements[measureType].tolerance 
        };
        
        defaultSizes.forEach(size => {
          measurement[size] = '0,00';
        });
        updatedMeasurements[measureType] = measurement;
      }
    });
    
    setFormState(prev => ({
      ...prev,
      productType: type,
      activeSizes: defaultSizes,
      measurements: updatedMeasurements
    }));
  };
  
  // Add a new size column
  const addSizeColumn = (size: string) => {
    if (formState.activeSizes.includes(size)) return;
    
    const updatedActiveSizes = [...formState.activeSizes, size];
    
    // Add the new size to all measurements
    const updatedMeasurements = { ...formState.measurements };
    Object.keys(updatedMeasurements).forEach(measureType => {
      if (measureType !== 'GRAM') {
        updatedMeasurements[measureType] = {
          ...updatedMeasurements[measureType],
          [size]: '0,00'
        };
      }
    });
    
    setFormState(prev => ({
      ...prev,
      activeSizes: updatedActiveSizes,
      measurements: updatedMeasurements
    }));
  };
  
  // Remove a size column
  const removeSizeColumn = (size: string) => {
    if (formState.activeSizes.length <= 1) return; // Prevent removing the last column
    
    const updatedActiveSizes = formState.activeSizes.filter(s => s !== size);
    
    // Remove the size from all measurements
    const updatedMeasurements = { ...formState.measurements };
    Object.keys(updatedMeasurements).forEach(measureType => {
      if (measureType !== 'GRAM' && updatedMeasurements[measureType][size]) {
        const measurement = { ...updatedMeasurements[measureType] };
        delete measurement[size];
        updatedMeasurements[measureType] = measurement;
      }
    });
    
    setFormState(prev => ({
      ...prev,
      activeSizes: updatedActiveSizes,
      measurements: updatedMeasurements
    }));
  };
  
  // Handle measurement value changes
  const handleMeasurementChange = (measureType: string, size: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [measureType]: {
          ...prev.measurements[measureType],
          [size]: value
        }
      }
    }));
  };

  // Add a state for custom size input
  const [customSize, setCustomSize] = useState('');

  // Enhance addCustomSize to handle single numbers
  const addCustomSize = () => {
    let sizeToAdd = customSize.trim();
    
    // Check if input is just a number
    const numberPattern = /^\d{1,2}$/;
    if (numberPattern.test(sizeToAdd)) {
      // Convert the string to a number
      const sizeNumber = parseInt(sizeToAdd, 10);
      
      // Determine the lower bound based on common sock size groupings
      let lowerBound;
      
      // Find the right range: make it a 3-4 size range where the number is the upper bound
      if (sizeNumber <= 14) lowerBound = Math.max(13, sizeNumber - 1);
      else if (sizeNumber <= 19) lowerBound = Math.max(18, sizeNumber - 1);
      else if (sizeNumber <= 22) lowerBound = 19;
      else if (sizeNumber <= 26) lowerBound = 23;
      else if (sizeNumber <= 30) lowerBound = 27;
      else if (sizeNumber <= 34) lowerBound = 31;
      else if (sizeNumber <= 38) lowerBound = 35;
      else if (sizeNumber <= 42) lowerBound = 39;
      else if (sizeNumber <= 46) lowerBound = 43;
      else lowerBound = 47;
      
      // Format as XX-YY
      sizeToAdd = `${lowerBound}-${sizeNumber}`;
    }
    
    // Basic validation for format XX-YY
    const sizePattern = /^\d{1,2}-\d{1,2}$/;
    
    if (!sizeToAdd || !sizePattern.test(sizeToAdd)) {
      alert("Please enter a valid size format (e.g., 35-38) or just a number like 38");
      return;
    }
    
    if (formState.activeSizes.includes(sizeToAdd)) {
      alert("This size is already added");
      return;
    }
    
    addSizeColumn(sizeToAdd);
    setCustomSize(''); // Clear the input after adding
  };

  // Add a helper function to handle input changes for the custom size
  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSize(e.target.value);
  };

  // Updated function to ensure technical drawing and measurements table are side by side with same height
  const generateReport = async () => {
    if (!reportRef.current) return;
    
    try {
      // Show loading indicator
      alert("Generating report. Please wait...");
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add report title
      pdf.setFontSize(24);
      pdf.setTextColor(33, 37, 41); // text-gray-800
      pdf.text("Product Report", 105, 20, { align: 'center' });
      
      // Add report content using a simpler approach than html2canvas
      // Technical Specs
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235); // bg-blue-600
      pdf.text("1. Technical Specifications", 20, 40);
      
      // Create two-column layout for technical specs
      pdf.setFontSize(11);
      pdf.setTextColor(55, 65, 81); // text-gray-700
      
      // Column 1
      let y = 50;
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // text-gray-500
      pdf.text("Needle Count", 20, y);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55); // text-gray-800
      pdf.text(formState.needleCount || "-", 20, y + 5);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Diameter", 20, y + 15);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formState.diameter || "-", 20, y + 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Cylinder", 20, y + 30);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formState.cylinder || "-", 20, y + 35);
      
      // Column 2
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Welt Type", 105, y);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formState.weltType || "-", 105, y + 5);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Gauge", 105, y + 15);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formState.gauge || "-", 105, y + 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Toe Closing", 105, y + 30);
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formState.toeClosing || "-", 105, y + 35);
      
      // Bill of Materials section
      y = 115; // Adjust y position based on content above
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235); // bg-blue-600
      pdf.text("2. Bill of Materials", 20, y);
      
      if (formState.bomItems.length > 0) {
        // Add table header
        y += 10;
        pdf.setFillColor(249, 250, 251); // bg-gray-50
        pdf.rect(20, y, 170, 8, 'F');
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        pdf.text("MATERIAL", 22, y + 5);
        pdf.text("COMPOSITION", 62, y + 5);
        pdf.text("DESCRIPTION", 102, y + 5);
        pdf.text("PLACEMENT", 142, y + 5);
        
        // Add table rows
        y += 8;
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        
        formState.bomItems.forEach((item) => {
          pdf.text("material", 22, y + 5);
          pdf.text(item.composition || "-", 62, y + 5);
          pdf.text(item.desc || "-", 102, y + 5);
          pdf.text(item.placement || "-", 142, y + 5);
          
          y += 10;
          // Draw row separator
          pdf.setDrawColor(229, 231, 235); // border-gray-200
          pdf.line(20, y, 190, y);
        });
      } else {
        y += 10;
        pdf.setFontSize(11);
        pdf.setTextColor(107, 114, 128);
        pdf.text("No materials added", 105, y + 5, { align: 'center' });
      }
      
      // Measurements section
      y += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235); // bg-blue-600
      pdf.text("3. Measurements", 20, y);
      
      // Loading technical drawing
      let techDrawingLoaded = false;
      const techDrawImg = new Image();
      techDrawImg.crossOrigin = "Anonymous";
      
      // Use full URL path to ensure the image loads correctly
      const baseUrl = window.location.origin;
      techDrawImg.src = `${baseUrl}/images/tech-draw.png`;
      
      // Wait for image to load with timeout
      try {
        await new Promise((resolve, reject) => {
          techDrawImg.onload = () => {
            techDrawingLoaded = true;
            resolve(true);
          };
          techDrawImg.onerror = reject;
          // Set a timeout of 3 seconds in case of hanging
          setTimeout(resolve, 3000);
        });
      } catch (error) {
        console.error("Error loading technical drawing:", error);
      }
      
      // Start measurements content 12mm below the heading
      y += 12;
      
      // Determine layout based on number of sizes
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const sizeCount = formState.activeSizes.length;
      
      // Dynamically determine layout based on number of sizes
      let tableWidth: number, drawingWidth: number, drawingX: number;
      let layoutType: 'side-by-side' | 'stacked';
      
      // Calculate optimal table and drawing widths for better side-by-side alignment
      if (sizeCount <= 3) {
        // Side-by-side layout for 3 or fewer sizes
        tableWidth = 105; // Reduced from 115 to allow more space for drawing
        drawingWidth = 75; // Increased from 70 for better visibility
        drawingX = 20 + tableWidth + 5;
        layoutType = 'side-by-side';
      } else if (sizeCount <= 5) {
        // Side-by-side with narrower drawing
        tableWidth = 130; // Reduced from 140 
        drawingWidth = 60; // Increased from 50
        drawingX = 20 + tableWidth + 5;
        layoutType = 'side-by-side';
      } else {
        // Drawing below table for many sizes
        tableWidth = pageWidth - 40; // Full width minus margins
        drawingWidth = 100; // Larger drawing when positioned below
        drawingX = (pageWidth - drawingWidth) / 2; // Center horizontally
        layoutType = 'stacked';
      }
      
      // Calculate column widths based on table width and number of columns
      const labelWidth = 25; // Width for measurement type column
      const tolWidth = 15; // Width for tolerance column
      const availableWidth = tableWidth - labelWidth - tolWidth;
      
      // Calculate width per size column, minimum 15mm
      const sizeColWidth = Math.max(15, availableWidth / sizeCount);
      
      // If columns would be too narrow, use landscape orientation for table
      if (sizeColWidth < 15 && layoutType === 'side-by-side') {
        // Switch to drawing below table layout for better readability
        tableWidth = pageWidth - 40;
        drawingWidth = 100;
        drawingX = (pageWidth - drawingWidth) / 2;
        layoutType = 'stacked';
      }
      
      // First calculate measurements table height to match with drawing
      const measureTypes = Object.keys(formState.measurements).filter(m => m !== 'GRAM');
      const rowHeight = 7;
      const tableBodyHeight = rowHeight * (measureTypes.length + 1); // +1 for GRAM row
      const tableHeaderHeight = 8; // Header row height
      const tableHeight = tableHeaderHeight + tableBodyHeight;
      
      // Calculate drawing height to match table height when side-by-side
      let drawingHeight = 0; // Initialize with a default value
      if (techDrawingLoaded && layoutType === 'side-by-side') {
        const imgRatio = techDrawImg.width / techDrawImg.height;
        
        // Calculate drawing height based on width while maintaining aspect ratio
        drawingHeight = drawingWidth / imgRatio;
        
        // Ensure drawing height matches table height exactly
        if (Math.abs(drawingHeight - tableHeight) > 5) {
          // If too different, recalculate width based on table height
          drawingHeight = tableHeight;
          drawingWidth = drawingHeight * imgRatio;
          
          // If drawing would be too wide, recalculate based on max width
          if (drawingWidth > 80) {
            drawingWidth = 80;
            drawingHeight = drawingWidth / imgRatio;
          }
        }
      } else if (techDrawingLoaded) {
        // For stacked layout, maintain aspect ratio with fixed width
        const imgRatio = techDrawImg.width / techDrawImg.height;
        drawingHeight = drawingWidth / imgRatio;
      }
      
      // Draw measurements table
      // Table header
      pdf.setFillColor(249, 250, 251); // bg-gray-50
      pdf.rect(20, y, tableWidth, tableHeaderHeight, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      
      // Header cells
      pdf.text("MEASUREMENT", 22, y + 5);
      
      let xPos = 20 + labelWidth;
      formState.activeSizes.forEach(size => {
        // Shorten size text if needed to fit in column
        let displaySize = size;
        if (size.length > 6 && sizeColWidth < 18) {
          displaySize = size.substring(0, 6) + '..';
        }
        
        pdf.text(displaySize, xPos + (sizeColWidth / 2), y + 5, { align: 'center' });
        xPos += sizeColWidth;
      });
      
      pdf.text("TOL", tableWidth + 20 - tolWidth/2, y + 5, { align: 'center' });
      
      // If side-by-side layout, add the drawing title next to the table
      if (layoutType === 'side-by-side' && techDrawingLoaded) {
        // Draw heading for technical drawing - align with table header
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Technical Drawing", drawingX + drawingWidth/2, y + 4, { align: 'center' });
      }
      
      // Table data
      y += tableHeaderHeight;
      pdf.setFontSize(7);
      pdf.setTextColor(31, 41, 55);
      
      // Draw outer border for table
      pdf.setDrawColor(229, 231, 235);
      
      // Add table data
      let tableCurrentY = y; // Track current Y position in the table
      
      measureTypes.forEach((measureType) => {
        // Check if we need a new page
        if (tableCurrentY + rowHeight > pageHeight - 20) {
          pdf.addPage();
          tableCurrentY = 20;
          // If we change page, drawing position needs to be recalculated
          layoutType = 'stacked';
        }
        
        pdf.text(measureType, 22, tableCurrentY + 5);
        xPos = 20 + labelWidth;
        
        formState.activeSizes.forEach(size => {
          const value = formState.measurements[measureType][size] || "-";
          pdf.text(value, xPos + (sizeColWidth / 2), tableCurrentY + 5, { align: 'center' });
          xPos += sizeColWidth;
        });
        
        // Add tolerance with abbreviation to save space
        pdf.text(formState.measurements[measureType].tolerance || "-", 
                tableWidth + 20 - tolWidth/2, tableCurrentY + 5, { align: 'center' });
        
        tableCurrentY += rowHeight;
        
        // Draw row separator
        pdf.line(20, tableCurrentY, 20 + tableWidth, tableCurrentY);
      });
      
      // Add GRAM row
      pdf.text("GRAM", 22, tableCurrentY + 5);
      // Handle GRAM special layout - centered across size columns
      pdf.text(formState.measurements.GRAM.value || "-", 
              20 + labelWidth + (sizeColWidth * formState.activeSizes.length / 2), 
              tableCurrentY + 5, { align: 'center' });
      // Tolerance
      pdf.text(formState.measurements.GRAM.tolerance || "-", 
              tableWidth + 20 - tolWidth/2, tableCurrentY + 5, { align: 'center' });
      
      tableCurrentY += rowHeight;
      
      // Draw table borders
      pdf.rect(20, y, tableWidth, tableBodyHeight);
      
      // Add vertical lines between columns
      xPos = 20 + labelWidth;
      for (let i = 0; i <= formState.activeSizes.length; i++) {
        pdf.line(xPos, y, xPos, tableCurrentY);
        xPos += sizeColWidth;
      }
      
      // Add drawing according to layout type
      if (techDrawingLoaded) {
        if (layoutType === 'side-by-side') {
          // Position drawing higher than the measurement table
          const drawingY = y - 8; // Position drawing higher than table data start
          
          // Add the drawing next to the table (ensure all parameters are defined numbers)
          if (drawingWidth > 0 && drawingHeight > 0) {
            pdf.addImage(techDrawImg, 'PNG', drawingX, drawingY, drawingWidth, drawingHeight);
            
            // Add border around drawing
            pdf.rect(drawingX, drawingY, drawingWidth, drawingHeight);

            // If drawing is shorter than table, add a note at the bottom
            if (drawingHeight < tableBodyHeight) {
              const noteY = drawingY + drawingHeight + 5;
              pdf.setFontSize(7);
              pdf.setTextColor(107, 114, 128);
              pdf.text("Drawing shown to scale", drawingX + drawingWidth/2, noteY, { align: 'center' });
            }
          }
        } else {
          // For stacked layout, add drawing below the table
          // Check if we need a new page
          if (tableCurrentY + drawingHeight + 20 > pageHeight) {
            pdf.addPage();
            tableCurrentY = 20;
          } else {
            tableCurrentY += 15; // Add some space after the table
          }
          
          // Add the drawing centered below the table (ensure all parameters are defined numbers)
          if (drawingWidth > 0 && drawingHeight > 0) {
            pdf.addImage(techDrawImg, 'PNG', drawingX, tableCurrentY + 10, drawingWidth, drawingHeight);
            
            // Add border around drawing
            pdf.rect(drawingX, tableCurrentY + 10, drawingWidth, drawingHeight);
          }
          
          // Move down past the drawing
          tableCurrentY += drawingHeight + 20;
        }
      } else {
        // If drawing failed to load, add a placeholder message
        pdf.setFontSize(10);
        pdf.setTextColor(220, 38, 38); // text-red-600
        
        if (layoutType === 'side-by-side') {
          pdf.text("Technical drawing could not be loaded", 
                  drawingX + drawingWidth/2, y + 30, { align: 'center' });
        } else {
          tableCurrentY += 15;
          pdf.text("Technical drawing could not be loaded", 
                  pageWidth/2, tableCurrentY, { align: 'center' });
          tableCurrentY += 15;
        }
      }
      
      // Update y to continue after both table and drawing
      if (layoutType === 'side-by-side') {
        y = Math.max(tableCurrentY, y + tableHeight);
      } else {
        y = tableCurrentY;
      }
      
      // Product Images section
      // Check if we need to add a new page for images
      if (y > 230) {
        pdf.addPage();
        y = 20;
      } else {
        y += 20;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235); // bg-blue-600
      pdf.text("4. Product Images", 20, y);
      
      // Add image count
      y += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(`Total Images: ${formState.productImages.length}`, 20, y);
      
      // Add product images on new pages
      if (formState.productImages.length > 0) {
        for (let i = 0; i < formState.productImages.length; i++) {
          // Add a new page for each image
          pdf.addPage();
          
          try {
            // Create new image element to avoid html2canvas issues
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = formState.productImages[i].preview;
            
            // Wait for image to load
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            
            // Calculate dimensions to fit image within page
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;
            
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            // Prevent division by zero
            const ratio = imgHeight > 0 ? imgWidth / imgHeight : 1;
            
            let pdfImgWidth = pageWidth - 40; // 20mm margins on each side
            let pdfImgHeight = pdfImgWidth / ratio;
            
            // Ensure image fits on the page height-wise
            if (pdfImgHeight > pageHeight - 60) {
              pdfImgHeight = pageHeight - 60;
              pdfImgWidth = pdfImgHeight * ratio;
            }
            
            // Add image page title
            pdf.setFontSize(16);
            pdf.setTextColor(31, 41, 55);
            pdf.text(`Product Image ${i+1}`, 105, 20, { align: 'center' });
            
            // Create canvas for the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL('image/jpeg');
              
              // Add image to PDF with calculated dimensions - ensure all numbers are defined
              if (pdfImgWidth > 0 && pdfImgHeight > 0) {
                const xPos = (pageWidth - pdfImgWidth) / 2;
                pdf.addImage(imgData, 'JPEG', xPos, 30, pdfImgWidth, pdfImgHeight);
              }
            }
          } catch (err) {
            console.error("Error adding product image to PDF:", err);
            pdf.setFontSize(12);
            pdf.setTextColor(220, 38, 38); // text-red-600
            pdf.text(`Error adding image ${i+1}`, 105, 100, { align: 'center' });
          }
        }
      }
      
      // Download the PDF
      pdf.save(`product_report_${Date.now()}.pdf`);
      
      // Show success notification
      setTimeout(() => {
        alert("Report generated successfully!");
      }, 500);
      
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Error generating report. Please try again: " + (err as Error).message);
    }
  };

  // Add a function to regenerate style number on demand
  const regenerateStyleNumber = () => {
    setFormState(prev => ({
      ...prev,
      style_no: generateStyleNumber()
    }));
  };

  // Add validation function to check required fields
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Check required fields
    if (!formState.uretici.trim()) {
      errors.push("Üretici alanı zorunludur");
    }
    
    // No need to check style_no as it's auto-generated
    // But ensure it exists just in case
    if (!formState.style_no.trim()) {
      // If somehow it's empty, regenerate it
      const newStyleNo = generateStyleNumber();
      setFormState(prev => ({ ...prev, style_no: newStyleNo }));
    }
    
    if (!formState.needleCount.trim()) {
      errors.push("Needle Count alanı zorunludur");
    }
    
    if (!formState.gauge.trim()) {
      errors.push("Gauge alanı zorunludur");
    }
    
    setValidationErrors(errors);
    
    // Add console log to debug validation state
    if (errors.length > 0) {
      console.log("Form validation failed. Errors:", errors);
    }
    
    return errors.length === 0;
  };

  const handleFinalSubmit = async () => {
    try {
      // Run validation before submission
      if (!validateForm()) {
        // Show validation error notification with more details
        console.error("Validation failed. Errors:", validationErrors);
        
        if (validationErrors.length > 0) {
          alert(`Lütfen form hatalarını düzeltin:\n${validationErrors.join('\n')}`);
        } else {
          alert("Form doğrulama hatası oluştu, lütfen tüm gerekli alanları doldurun.");
        }
        return;
      }

      setIsSubmitting(true);
      setErrorMessage("");
      
      // Format the data according to the ProductIdentity interface
      // Ensure all required database fields are included with proper formatting
      const productData = {
        uretici: formState.uretici || "CBN Socks",
        mal_cinsi: "Standard sock", // Default value instead of styleComposition
        style_no: formState.style_no,
        // Convert adet to number and ensure it's not 0 or undefined
        adet: 1, 
        // Format termin as YYYY-MM-DD for database compatibility
        termin: new Date().toISOString().split('T')[0],
        notlar: `Technical Specs:
Needle Count: ${formState.needleCount}
Diameter: ${formState.diameter}
Cylinder: ${formState.cylinder}
Welt Type: ${formState.weltType}
Gauge: ${formState.gauge}
Toe Closing: ${formState.toeClosing}`,
        iplik: JSON.stringify(formState.bomItems || []), 
        burun: formState.toeClosing || "standard",
        // Store measurements as a separate field - won't cause database issues
        measurements: JSON.stringify({
          sizes: formState.activeSizes,
          measurements: formState.measurements
        })
      };
      
      console.log("Submitting product data:", productData);
      
      // Send data to API
      const response = await fetch('/api/product-identities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        let errorMessage = 'Error saving product';
        try {
          const errorData = await response.json();
          console.error("API Error Response:", errorData);
          errorMessage = errorData.error || errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parseError) {
          // If response isn't valid JSON, try to get text
          const errorText = await response.text();
          console.error("API Error Response (text):", errorText || "Empty response");
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Product saved successfully:", result);
      
      // Show success modal instead of alert/PDF
      setShowSuccess(true);
      setIsSubmitting(false);

      // Redirect to the product list after a short delay
      setTimeout(() => {
        router.push('/urun-kimligi');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      setErrorMessage(error instanceof Error ? error.message : "Unable to save product identity");
      
      // Show more detailed error message
      alert(`Kayıt hatası: ${error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"}\n\nLütfen tüm alanları doğru doldurduğunuzdan emin olun.`);
    }
  };

  useEffect(() => {
    if (validationErrors.length > 0) {
      console.log("Displaying validation errors:", validationErrors);
    }
  }, [validationErrors]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Success modal overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 transform animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Ürün Kimliği Kaydedildi!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Yeni ürün başarıyla kaydedildi.</p>
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Ürün kimliği listesine yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
              Lütfen aşağıdaki hataları düzeltin:
            </h3>
            <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/urun-kimligi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Ürün Kimliği
              </Link>
              <span>/</span>
              <span>Yeni Ürün Kimliği</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yeni Ürün Kimliği Oluştur</h1>
            <p className="text-gray-500 dark:text-gray-400">Step {currentStep} of 5</p>
          </div>
        </div>

        {/* Step indicator - Updated for 5 steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } mr-2`}>
              1
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } mx-2`}>
              2
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } mx-2`}>
              3
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } mx-2`}>
              4
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } ml-2`}>
              5
            </div>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-sm">Technical Specs</span>
            <span className="text-sm">Bill of Materials</span>
            <span className="text-sm">Measurements</span>
            <span className="text-sm">Product Image</span>
            <span className="text-sm">Final</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Display validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 dark:bg-red-900/30 dark:text-red-300">
              <h3 className="text-sm font-medium mb-2">Lütfen aşağıdaki hataları düzeltin:</h3>
              <ul className="list-disc pl-5 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: Technical Specs */}
          {currentStep === 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Technical Specifications</h2>
              <TechnicalSpecs 
                formState={formState} 
                handleInputChange={handleInputChange}
              />
              {/* Style No input with regenerate button */}
              <div className="mb-4">
                <label htmlFor="style_no" className="block text-sm font-medium mb-1">Style No</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="style_no"
                    name="style_no"
                    value={formState.style_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button 
                    type="button"
                    onClick={regenerateStyleNumber}
                    className="sm:ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    title="Generate new style number"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Bill of Materials */}
          {currentStep === 2 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Bill of Materials</h2>
              
              {/* Custom BOM implementation - replace the Placement input with dropdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Header - no change needed */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-4 gap-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Material</div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Composition</div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Placement</div>
                </div>
                
                {/* Items */}
                {formState.bomItems.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formState.bomItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <div>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-600 text-gray-500 dark:text-gray-300">
                            material
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={item.composition}
                            onChange={(e) => handleBomItemChange(index, 'composition', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Composition"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => handleBomItemChange(index, 'desc', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Description"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Replace text input with dropdown */}
                          <select
                            value={item.placement}
                            onChange={(e) => handleBomItemChange(index, 'placement', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="">Select placement</option>
                            <option value="main yarn">main yarn</option>
                            <option value="design yarn">design yarn</option>
                            <option value="varisage">varisage</option>
                            <option value="reinforcement heel and toe">reinforcement heel and toe</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeBomItem(index)}
                            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No materials added yet. Click the button below to add materials.
                  </div>
                )}
                
                {/* Add button */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={addBomItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Material
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Product Measurements with Technical Drawing and dynamic size selection */}
          {currentStep === 3 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Product Measurements</h2>
              
              <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                    <div className="mt-1 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => handleProductTypeChange('normal')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          formState.productType === 'normal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Normal Sizes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProductTypeChange('baby')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          formState.productType === 'baby'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Baby Sizes
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add Size Column</label>
                    
                    {formState.productType === 'baby' ? (
                      <div className="mt-1 flex">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) => addSizeColumn(e.target.value)}
                          value=""
                        >
                          <option value="" disabled>Select size to add</option>
                          {babySizes.map(size => (
                            !formState.activeSizes.includes(size) && (
                              <option key={size} value={size}>{size}</option>
                            )
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const nextSize = babySizes.find(size => !formState.activeSizes.includes(size));
                            if (nextSize) addSizeColumn(nextSize);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex flex-col sm:flex-row gap-4">
                        {/* Dropdown for predefined normal sizes */}
                        <div className="flex flex-1">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            onChange={(e) => addSizeColumn(e.target.value)}
                            value=""
                          >
                            <option value="" disabled>Select predefined size</option>
                            {normalSizes.map(size => (
                              !formState.activeSizes.includes(size) && (
                                <option key={size} value={size}>{size}</option>
                              )
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const nextSize = normalSizes.find(size => !formState.activeSizes.includes(size));
                              if (nextSize) addSizeColumn(nextSize);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Custom size input for normal sizes */}
                        <div className="flex flex-1">
                          <input
                            type="text"
                            value={customSize}
                            onChange={handleCustomSizeChange}
                            placeholder="Size (e.g., 38 or 35-38)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={addCustomSize}
                            className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition"
                          >
                            Add Custom
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Sizes</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formState.activeSizes.map(size => (
                      <div 
                        key={size} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center text-sm"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSizeColumn(size)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          disabled={formState.activeSizes.length <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column: Measurements table - Dynamic size columns */}
                <div className="flex-1 overflow-x-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs md:text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase sticky left-0 bg-gray-50 dark:bg-gray-700">Measurement</th>
                          {formState.activeSizes.map(size => (
                            <th key={size} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{size}</th>
                          ))}
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tolerance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.keys(formState.measurements).map((measureType) => 
                          measureType !== 'GRAM' && (
                            <tr key={measureType} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">{measureType}</td>
                              {formState.activeSizes.map(size => (
                                <td key={`${measureType}-${size}`} className="px-4 py-3">
                                  <input
                                    type="text"
                                    value={formState.measurements[measureType][size] || ''}
                                    onChange={(e) => handleMeasurementChange(measureType, size, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={formState.measurements[measureType].tolerance || ''}
                                  onChange={(e) => handleMeasurementChange(measureType, 'tolerance', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                              </td>
                            </tr>
                          )
                        )}
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">GRAM</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" colSpan={formState.activeSizes.length}>
                            <input
                              type="text"
                              name="gram"
                              value={formState.measurements.GRAM.value || ''}
                              onChange={(e) => handleMeasurementChange('GRAM', 'value', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formState.measurements.GRAM.tolerance || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Right column: Technical drawing */}
                <div className="w-full lg:w-1/3 flex flex-col mt-8 lg:mt-0">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Technical Drawing</h3>
                    <div className="flex-grow flex items-center justify-center overflow-hidden">
                      <img 
                        src="/images/tech-draw.png" 
                        alt="Sock technical drawing"
                        className="w-auto h-auto max-w-full object-contain"
                        style={{ maxHeight: 'calc(100vh - 300px)', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Product Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Product Images</h2>
              {/* dropzone */}
              <div className="flex items-center justify-center w-full">
                <label 
                  className="flex flex-col w-32 h-16 border-2 border-dashed border-green-500 dark:border-green-400 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                      Click to upload
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
                <button
                  type="button"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Çoklu Resim Ekle
                </button>
              </div>

              {formState.productImages.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Product Images ({formState.productImages.length})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {formState.productImages.map((image, index) => (
                      <div key={index} className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <img 
                          src={image.preview} 
                          alt={`Product Preview ${index + 1}`}
                          className="w-full h-48 sm:h-64 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display product images in a grid layout within Step 4 */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">4</span>
                  Product Images {formState.productImages.length > 0 && `(${formState.productImages.length})`}
                </h3>
                
                {formState.productImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formState.productImages.map((image, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-full h-48 sm:h-80">
                          <img 
                            src={image.preview} 
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="p-2 border-t border-gray-100 mt-2 text-center">
                          <span className="text-xs text-gray-500">Image {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center text-gray-500 dark:text-gray-400">
                    No product images added
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 5: Final Report */}
          {currentStep === 5 && (
            <div className="space-y-6" ref={reportRef}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Product Report</h2>
              
              {/* Technical Specs Summary */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">1</span>
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Needle Count</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.needleCount || "-"}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Diameter</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.diameter || "-"}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cylinder</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.cylinder || "-"}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welt Type</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.weltType || "-"}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gauge</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.gauge || "-"}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toe Closing</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formState.toeClosing || "-"}</p>
                  </div>
                </div>
              </div>
              
              {/* Bill of Materials */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">2</span>
                  Bill of Materials
                </h3>
                
                {formState.bomItems.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composition</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {formState.bomItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">material</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.composition || "-"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.desc || "-"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.placement || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2">No materials added</p>
                  </div>
                )}
              </div>
              
              {/* Measurements section in Final Report */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">3</span>
                  Measurements
                </h3>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left column: Measurements table */}
                  <div className="flex-1 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs md:text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700">Measurement</th>
                          {formState.activeSizes.map(size => (
                            <th key={size} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{size}</th>
                          ))}
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tolerance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.keys(formState.measurements).map((measureType) => 
                          measureType !== 'GRAM' && (
                            <tr key={measureType} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">{measureType}</td>
                              {formState.activeSizes.map(size => (
                                <td key={`${measureType}-${size}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                  {formState.measurements[measureType][size] || "-"}
                                </td>
                              ))}
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {formState.measurements[measureType].tolerance || "-"}
                              </td>
                            </tr>
                          )
                        )}
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white sticky left-0 bg-white dark:bg-gray-800">GRAM</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" colSpan={formState.activeSizes.length}>
                            {formState.measurements.GRAM.value || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {formState.measurements.GRAM.tolerance || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Right column: Technical drawing - Properly positioned alongside measurements */}
                  <div className="w-full lg:w-1/3 flex flex-col mt-8 lg:mt-0">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col">
                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Technical Drawing</h3>
                      <div className="flex-grow flex items-center justify-center overflow-hidden">
                        <img 
                          src="/images/tech-draw.png" 
                          alt="Sock technical drawing"
                          className="w-auto h-auto max-w-full object-contain"
                          style={{ maxHeight: '300px', width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images Summary */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white mr-2 text-xs">4</span>
                  Product Images Summary
                </h3>
                
                {formState.productImages.length > 0 ? (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {formState.productImages.length} product images added
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No product images added
                  </div>
                )}
              </div>
              
              {/* Show error message if there's any */}
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Navigation Buttons - Always visible with conditional buttons for Step 5 */}
          <div className="flex flex-wrap justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
            {/* Previous button - always shown if not on first step */}
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
            
            <div className="ml-auto flex flex-wrap gap-4">
              {/* Download Report button - only shown on final step */}
              {currentStep === 5 && (
                <button
                  type="button"
                  onClick={generateReport}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              )}
              
              {/* Next/Save Product button - changes based on current step */}
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      Save Product
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
