import { Pool } from 'pg';
// Only import queryDB since we don't actually use dbPool directly in this file
import { queryDB } from './db';

// Sample interface matching database structure
export interface Sample {
  id: string;
  firma: string;
  model: string;
  artikel: string;
  beden: string;
  tarih: string;
  saniye: string;
  durum: string;
  zeminIplikleri: YarnDetail[];
  desenIplikleri: YarnDetail[];
  toplamAgirlik: string;
  created_at?: string;
  updated_at?: string;
}

export interface YarnDetail {
  id: string;
  description: string;
  ilkOlcum: string;
  sonOlcum: string;
  toplam: string;
}

// Get a single sample by ID
export async function getSampleById(id: string): Promise<Sample | undefined> {
  console.log(`[DB] Fetching sample with ID: ${id}`);
  const start = Date.now();
  
  try {
    const result = await queryDB(
      'SELECT * FROM samples WHERE id = $1',
      [id]
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] ${result.rows.length ? 'Found' : 'Did not find'} sample with ID: ${id} in ${duration}ms`);
    
    if (result.rows.length === 0) return undefined;
    
    // Fetch yarn details separately
    const yarnResult = await queryDB(
      'SELECT * FROM sample_yarns WHERE sample_id = $1',
      [id]
    );
    
    // Process sample data
    const sample = result.rows[0] as Sample;
    
    // Process yarn details
    if (yarnResult.rows.length > 0) {
      // Split yarns into base and pattern yarns
      sample.zeminIplikleri = yarnResult.rows
        .filter(yarn => yarn.type === 'zemin')
        .map(yarn => ({
          id: yarn.yarn_id,
          description: yarn.description,
          ilkOlcum: yarn.first_measurement,
          sonOlcum: yarn.last_measurement,
          toplam: yarn.total
        }));
        
      sample.desenIplikleri = yarnResult.rows
        .filter(yarn => yarn.type === 'desen')
        .map(yarn => ({
          id: yarn.yarn_id,
          description: yarn.description,
          ilkOlcum: yarn.first_measurement,
          sonOlcum: yarn.last_measurement,
          toplam: yarn.total
        }));
    } else {
      sample.zeminIplikleri = [];
      sample.desenIplikleri = [];
    }
    
    return sample;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve sample with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

// Get all samples
export async function getAllSamples(): Promise<Sample[]> {
  console.log(`[DB] Fetching all samples`);
  const start = Date.now();
  
  try {
    const result = await queryDB(
      'SELECT * FROM samples ORDER BY created_at DESC LIMIT 100',
      []
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] Retrieved ${result.rows.length} samples in ${duration}ms`);
    
    return result.rows as Sample[];
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve samples after ${duration}ms:`, error);
    throw error;
  }
}
