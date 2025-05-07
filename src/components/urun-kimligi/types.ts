import React from "react";

// Define the BomItem interface
export interface BomItem {
  material: string;
  composition: string;
  desc: string;
  placement: string;
}

// Define FormState interface that matches what's used in the components
export interface FormState {
  needleCount: string;
  diameter: string;
  cylinder: string;
  weltType: string;
  gauge: string;
  toeClosing: string;
  styleComposition?: string;
  uretici: string; // Added this field for manufacturer
  bomItems?: BomItem[];
  productType?: 'baby' | 'normal';
  activeSizes?: string[];
  measurements?: {
    [key: string]: {
      [size: string]: string;
      tolerance: string;
    }
  };
  productImages?: Array<{
    file: File;
    preview: string;
  }>;
  [key: string]: any; // Allow for dynamic properties
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
