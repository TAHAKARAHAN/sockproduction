import React from "react";

// Define the BomItem interface
export interface BomItem {
  material: string;
  composition: string;
  desc: string;
  placement: string;
}

// Define the form state interface
export interface FormState {
  // Technical specs fields
  needleCount: string;
  diameter: string;
  cylinder: string;
  weltType: string;
  gauge: string;
  toeClosing: string;
  styleComposition: string;
  
  // BOM section
  bomItems: BomItem[];
  
  // Measurement values
  full_35_38: string;
  full_39_42: string;
  full_tolerance: string;
  fol_35_38: string;
  fol_39_42: string;
  fol_tolerance: string;
  rtw_35_38: string;
  rtw_39_42: string;
  rtw_tolerance: string;
  rth_35_38: string;
  rth_39_42: string;
  rth_tolerance: string;
  lsre_35_38: string;
  lsre_39_42: string;
  lsre_tolerance: string;
  lsle_35_38: string;
  lsle_39_42: string;
  lsle_tolerance: string;
  lsfo_35_38: string;
  lsfo_39_42: string;
  lsfo_tolerance: string;
  lsh_35_38: string;
  lsh_39_42: string;
  lsh_tolerance: string;
  gram: string;
  gram_tolerance: string;
  
  // Product images
  productImages: Array<{
    file: File;
    preview: string;
  }>;
}

// Props for TechnicalSpecs component
export interface TechnicalSpecsProps {
  formState: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Props for ProductSummary component
export interface ProductSummaryProps {
  formState: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Props for BomSection component
export interface BomSectionProps {
  formState: FormState;
  handleBomItemChange: (index: number, field: keyof BomItem, value: string) => void;
  addBomItem: () => void;
  removeBomItem: (index: number) => void;
}
