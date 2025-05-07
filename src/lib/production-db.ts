import { Pool } from 'pg';
// Only import queryDB since we don't actually use dbPool directly in this file
import { queryDB } from './db';

// Production status types
export type ProductionStatus = 
  | "Burun Dikişi"
  | "Yıkama" 
  | "Kurutma" 
  | "Paketleme" 
  | "Tamamlandı";

// Production interface matching database structure
export interface Production {
  id: string;
  style_no: string; // Matches database field name
  urun_adi: string; // Matches database field name
  siparis_id: string; // Matches database field name
  musteri: string;
  miktar: number;
  baslangic_tarihi: string; // Matches database field name
  tahmini_tamamlanma: string; // Matches database field name
  durum: ProductionStatus;
  tamamlanma: number;
  notlar?: string;
  created_at?: string;
  updated_at?: string;
}

// Get a single production by ID
export async function getProductionById(id: string): Promise<Production | undefined> {
  console.log(`[DB] Fetching production with ID: ${id}`);
  const start = Date.now();
  
  try {
    const result = await queryDB(
      'SELECT * FROM production_tracking WHERE id = $1',
      [id]
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] ${result.rows.length ? 'Found' : 'Did not find'} production with ID: ${id} in ${duration}ms`);
    
    return result.rows[0] as Production | undefined;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve production with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

// Get all productions
export async function getAllProductions(): Promise<Production[]> {
  console.log(`[DB] Fetching all productions`);
  const start = Date.now();
  
  try {
    const result = await queryDB(
      'SELECT * FROM production_tracking ORDER BY created_at DESC LIMIT 100',
      []
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] Retrieved ${result.rows.length} productions in ${duration}ms`);
    
    return result.rows as Production[];
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve productions after ${duration}ms:`, error);
    throw error;
  }
}
