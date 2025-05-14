// If this file already contains type definitions but lacks exports,
// add the 'export' keyword before each type declaration:

export interface ProductionFormData {
  styleNo: string;
  urunAdi: string;
  siparisNo: string;
  artikelNo?: string;
  musteri: string;
  adet: number;
  baslangicTarihi: string;
  tahminiTamamlanma: string;
  durum: string;
  tamamlanma?: number;
  notlar?: string;
  variants: ProductionVariant[];
}

export interface ProductionVariant {
  model: string;
  renk: string;
  beden: string;
  adet: number;
}

export interface ProductIdentity {
  id: string;
  name?: string;
  style_no: string;
  uretici: string;
  measurements?: string;
  productType?: 'baby' | 'normal';
  productIdentityId?: string;
}

// Add any additional types that might be defined in this file
// Each should have the 'export' keyword
