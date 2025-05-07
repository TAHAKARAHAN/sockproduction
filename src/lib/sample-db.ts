import { queryDB } from './db';

// Type definition for yarn details
export interface YarnDetail {
  id: string;
  description: string;
  ilkOlcum: string;
  sonOlcum: string;
  toplam: string;
}

// Type for database row structure
interface SampleRow {
  id: number;
  firma: string;
  model: string;
  artikel: string;
  beden: string;
  tarih: Date | string;
  saniye: string;
  durum: string;
  needle_count?: string;
  diameter?: string;
  cylinder?: string;
  welt_type?: string;
  gauge?: string;
  toe_closing?: string;
  notlar?: string;
  zemin_iplikleri: any;
  desen_iplikleri: any;
  toplam_agirlik: string;
  created_at?: string;
  updated_at?: string;
}

// Type definition for a sample
export interface Sample {
  id: number;
  firma: string;
  model: string;
  artikel: string;
  beden: string;
  tarih: string;
  saniye: string;
  durum: string;
  
  // Technical specs
  needle_count?: string;
  diameter?: string;
  cylinder?: string;
  welt_type?: string;
  gauge?: string;
  toe_closing?: string;
  
  notlar?: string;
  zemin_iplikleri: YarnDetail[];
  desen_iplikleri: YarnDetail[];
  toplam_agirlik: string;
  
  created_at?: string;
  updated_at?: string;
}

// Ensure this is a server-side function only
export async function getAllSamples(): Promise<Sample[]> {
  // Check if we're on the server
  if (typeof window !== 'undefined') {
    console.error("[DB] Database operations can only be performed on the server");
    return [];
  }
  
  console.log(`[DB] Fetching all samples`);
  const start = Date.now();
  
  try {
    const result = await queryDB(
      'SELECT * FROM numuneler ORDER BY created_at DESC'
    );
    
    // Parse JSON fields - fixed the TypeScript error by adding proper type
    const samples = result.rows.map((sample: SampleRow) => ({
      ...sample,
      zemin_iplikleri: sample.zemin_iplikleri || [],
      desen_iplikleri: sample.desen_iplikleri || [],
      // Convert date to formatted string (if needed)
      tarih: sample.tarih ? new Date(sample.tarih).toLocaleDateString('tr-TR') : '',
    }));
    
    const duration = Date.now() - start;
    console.log(`[DB] Fetched ${samples.length} samples in ${duration}ms`);
    
    // If no samples found, return fallback demo data
    if (samples.length === 0) {
      console.log('[DB] No samples found, check if database table is properly set up');
      return [
        {
          id: 1,
          firma: "CBN ÇORAP",
          model: "L56",
          artikel: "81-03",
          beden: "L56",
          tarih: "23.05.2023",
          saniye: "132",
          durum: "Tamamlandı",
          zemin_iplikleri: [],
          desen_iplikleri: [],
          toplam_agirlik: "254"
        }
      ];
    }
    
    return samples;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve samples after ${duration}ms:`, error);
    
    // Return empty array instead of throwing
    console.log('[DB] Returning empty array due to error');
    return [];
  }
}

// Get a single sample by ID
export async function getSampleById(id: string): Promise<Sample | undefined> {
  // Check if we're on the server
  if (typeof window !== 'undefined') {
    console.error("[DB] Database operations can only be performed on the server");
    return undefined;
  }
  
  console.log(`[DB] Fetching sample with ID: ${id}`);
  const start = Date.now();
  
  try {
    // Try to parse the ID as an integer, but fall back to string if needed
    let parsedId: number | string = parseInt(id, 10);
    
    // If parsing failed or resulted in NaN, use the original string
    if (isNaN(parsedId)) {
      parsedId = id;
      console.log(`[DB] ID is not numeric, using as string: ${id}`);
    } else {
      console.log(`[DB] Using numeric ID: ${parsedId}`);
    }
    
    // Try with both a parameterized query and direct value to debug
    console.log(`[DB] Executing query with ID type: ${typeof parsedId}`);
    
    const result = await queryDB(
      'SELECT * FROM numuneler WHERE id = $1',
      [parsedId]
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] ${result.rows.length ? 'Found' : 'Did not find'} sample with ID: ${id} in ${duration}ms`);
    
    // If no results, try using the ID as a string
    if (result.rows.length === 0 && typeof parsedId === 'number') {
      console.log(`[DB] Retrying with string ID: ${id}`);
      const stringResult = await queryDB(
        'SELECT * FROM numuneler WHERE id = $1',
        [id]
      );
      
      if (stringResult.rows.length > 0) {
        console.log(`[DB] Found sample using string ID`);
        const sample: Sample = {
          ...stringResult.rows[0],
          zemin_iplikleri: stringResult.rows[0].zemin_iplikleri || [],
          desen_iplikleri: stringResult.rows[0].desen_iplikleri || [],
          tarih: stringResult.rows[0].tarih ? new Date(stringResult.rows[0].tarih).toLocaleDateString('tr-TR') : '',
        };
        
        return sample;
      }
    }
    
    if (result.rows.length === 0) {
      // Log more details about the database
      try {
        const tableInfo = await queryDB('SELECT * FROM information_schema.tables WHERE table_name = $1', ['numuneler']);
        console.log(`[DB] Table info: ${JSON.stringify(tableInfo.rows)}`);
        
        if (tableInfo.rows.length > 0) {
          const sampleCount = await queryDB('SELECT COUNT(*) FROM numuneler');
          console.log(`[DB] Total samples in database: ${sampleCount.rows[0].count}`);
          
          if (parseInt(sampleCount.rows[0].count) > 0) {
            const firstSample = await queryDB('SELECT id FROM numuneler LIMIT 1');
            console.log(`[DB] First sample ID in database: ${JSON.stringify(firstSample.rows[0])}`);
          }
        }
      } catch (err) {
        console.error('[DB] Error checking database metadata:', err);
      }
      
      return undefined;
    }
    
    // Parse JSON fields and format date
    const sample: Sample = {
      ...result.rows[0],
      zemin_iplikleri: result.rows[0].zemin_iplikleri || [],
      desen_iplikleri: result.rows[0].desen_iplikleri || [],
      tarih: result.rows[0].tarih ? new Date(result.rows[0].tarih).toLocaleDateString('tr-TR') : '',
    };
    
    return sample;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve sample with ID: ${id} after ${duration}ms:`, error);
    
    // Return undefined instead of throwing for better error handling
    return undefined;
  }
}

// Create a new sample
export async function createSample(sampleData: Omit<Sample, 'id' | 'created_at' | 'updated_at'>): Promise<Sample> {
  console.log(`[DB] Creating new sample`);
  const start = Date.now();
  
  try {
    // Convert date string to proper format if needed
    const dateValue = sampleData.tarih ? new Date(sampleData.tarih) : new Date();
    
    const result = await queryDB(`
      INSERT INTO numuneler (
        firma, model, artikel, beden, tarih, saniye, durum,
        needle_count, diameter, cylinder, welt_type, gauge, toe_closing,
        notlar, zemin_iplikleri, desen_iplikleri, toplam_agirlik
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      sampleData.firma,
      sampleData.model,
      sampleData.artikel,
      sampleData.beden,
      dateValue,
      sampleData.saniye,
      sampleData.durum || 'İşlemde',
      sampleData.needle_count,
      sampleData.diameter,
      sampleData.cylinder,
      sampleData.welt_type,
      sampleData.gauge,
      sampleData.toe_closing,
      sampleData.notlar,
      JSON.stringify(sampleData.zemin_iplikleri),
      JSON.stringify(sampleData.desen_iplikleri),
      sampleData.toplam_agirlik
    ]);
    
    const duration = Date.now() - start;
    console.log(`[DB] Created new sample with ID: ${result.rows[0].id} in ${duration}ms`);
    
    // Parse JSON fields and format date
    const newSample = {
      ...result.rows[0],
      zemin_iplikleri: result.rows[0].zemin_iplikleri || [],
      desen_iplikleri: result.rows[0].desen_iplikleri || [],
      tarih: result.rows[0].tarih ? new Date(result.rows[0].tarih).toLocaleDateString('tr-TR') : '',
    };
    
    return newSample;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to create sample after ${duration}ms:`, error);
    throw error;
  }
}

// Update a sample
export async function updateSample(id: string, sampleData: Partial<Sample>): Promise<Sample | undefined> {
  console.log(`[DB] Updating sample with ID: ${id}`);
  const start = Date.now();
  
  try {
    // First check if the sample exists
    const existingResult = await queryDB('SELECT id FROM numuneler WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      console.log(`[DB] Sample with ID: ${id} not found for update`);
      return undefined;
    }
    
    // Prepare the update fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;
    
    // Helper function to add update fields
    const addUpdateField = (field: string, value: any) => {
      if (value !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(value);
        paramIndex++;
      }
    };
    
    // Add individual fields
    addUpdateField('firma', sampleData.firma);
    addUpdateField('model', sampleData.model);
    addUpdateField('artikel', sampleData.artikel);
    addUpdateField('beden', sampleData.beden);
    addUpdateField('saniye', sampleData.saniye);
    addUpdateField('durum', sampleData.durum);
    
    // Handle date conversion
    if (sampleData.tarih) {
      const dateValue = new Date(sampleData.tarih);
      addUpdateField('tarih', dateValue);
    }
    
    // Technical specs
    addUpdateField('needle_count', sampleData.needle_count);
    addUpdateField('diameter', sampleData.diameter);
    addUpdateField('cylinder', sampleData.cylinder);
    addUpdateField('welt_type', sampleData.welt_type);
    addUpdateField('gauge', sampleData.gauge);
    addUpdateField('toe_closing', sampleData.toe_closing);
    
    addUpdateField('notlar', sampleData.notlar);
    
    // Handle JSON fields
    if (sampleData.zemin_iplikleri) {
      addUpdateField('zemin_iplikleri', JSON.stringify(sampleData.zemin_iplikleri));
    }
    if (sampleData.desen_iplikleri) {
      addUpdateField('desen_iplikleri', JSON.stringify(sampleData.desen_iplikleri));
    }
    
    addUpdateField('toplam_agirlik', sampleData.toplam_agirlik);
    
    // If no fields to update, return the existing sample
    if (updateFields.length === 0) {
      return getSampleById(id);
    }
    
    // Perform the update
    const updateQuery = `
      UPDATE numuneler
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    // Add the ID as the last parameter
    updateValues.push(id);
    
    const result = await queryDB(updateQuery, updateValues);
    
    const duration = Date.now() - start;
    console.log(`[DB] Updated sample with ID: ${id} in ${duration}ms`);
    
    // Parse JSON fields and format date
    const updatedSample = {
      ...result.rows[0],
      zemin_iplikleri: result.rows[0].zemin_iplikleri || [],
      desen_iplikleri: result.rows[0].desen_iplikleri || [],
      tarih: result.rows[0].tarih ? new Date(result.rows[0].tarih).toLocaleDateString('tr-TR') : '',
    };
    
    return updatedSample;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to update sample with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

// Delete a sample
export async function deleteSample(id: string): Promise<boolean> {
  console.log(`[DB] Deleting sample with ID: ${id}`);
  const start = Date.now();
  
  try {
    const result = await queryDB('DELETE FROM numuneler WHERE id = $1 RETURNING id', [id]);
    
    const duration = Date.now() - start;
    const deleted = result.rows.length > 0;
    
    console.log(`[DB] ${deleted ? 'Successfully deleted' : 'Failed to delete'} sample with ID: ${id} in ${duration}ms`);
    
    return deleted;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to delete sample with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}
