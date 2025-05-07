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
  style_no: string; 
  urun_adi: string; 
  siparis_id: string; 
  musteri: string;
  miktar: number;
  baslangic_tarihi: string; 
  tahmini_tamamlanma: string; 
  durum: ProductionStatus;
  tamamlanma: number;
  notlar?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all productions with optional sorting and filtering
 */
export async function getAllProductions(options: { 
  sort?: string; 
  order?: 'asc' | 'desc'; 
  limit?: number;
  status?: string;
} = {}) {
  console.log('[DB] Fetching all productions');
  const start = Date.now();
  
  try {
    // Build query with conditional parameters
    let query = 'SELECT * FROM productions';
    const queryParams: any[] = [];
    
    // Add WHERE clause if status filter provided
    if (options.status) {
      query += ' WHERE durum = $1';
      queryParams.push(options.status);
    }
    
    // Add ORDER BY clause
    const sortField = options.sort || 'id';
    const sortOrder = options.order || 'desc';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    // Add LIMIT clause if provided
    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    
    console.log(`[DB] Executing query: ${query}`);
    const result = await queryDB(query, queryParams);
    console.log(`[DB] Executed query in ${Date.now() - start}ms: ${query}`);
    
    const duration = Date.now() - start;
    console.log(`[DB] Retrieved ${result.rows.length} productions in ${duration}ms`);
    
    if (result.rows.length > 0) {
      console.log('[DB] First row sample:', JSON.stringify(result.rows[0]));
    }
    
    return result.rows as Production[];
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve productions after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Get a single production by ID
 */
export async function getProductionById(id: string) {
  console.log(`[DB] Fetching production with ID: ${id}`);
  const start = Date.now();
  
  try {
    // Don't convert ID to number - keep as string to match database format
    console.log(`[DB] Executing query: SELECT * FROM productions WHERE id = '${id}'`);
    const result = await queryDB('SELECT * FROM productions WHERE id = $1', [id]);
    console.log(`[DB] Executed query in ${Date.now() - start}ms`);
    
    const duration = Date.now() - start;
    console.log(`[DB] ${result.rows.length ? 'Found' : 'Did not find'} production with ID: ${id} in ${duration}ms`);
    
    if (result.rows.length > 0) {
      console.log(`[DB] Found production:`, JSON.stringify(result.rows[0]));
    } else {
      console.log(`[DB] No production found with ID: ${id}`);
    }
    
    return result.rows[0] as Production | undefined;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Error fetching production with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Create a new production
 */
export async function createProduction(data: Omit<Production, 'id' | 'created_at' | 'updated_at'>) {
  console.log(`[DB] Creating new production for ${data.style_no} - ${data.urun_adi}`);
  const start = Date.now();
  
  try {
    // Generate a new ID with 'P' prefix and padded number
    const countResult = await queryDB('SELECT COUNT(*) FROM productions');
    const count = parseInt(countResult.rows[0].count) + 1;
    const newId = `P${count.toString().padStart(3, '0')}`; // P001, P002, etc.
    
    console.log(`[DB] Generated new ID: ${newId} for production`);
    
    const result = await queryDB(
      `INSERT INTO productions (
        id, style_no, urun_adi, siparis_id, musteri, miktar, 
        baslangic_tarihi, tahmini_tamamlanma, durum, tamamlanma, notlar
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        newId,
        data.style_no,
        data.urun_adi,
        data.siparis_id,
        data.musteri,
        data.miktar,
        data.baslangic_tarihi,
        data.tahmini_tamamlanma,
        data.durum,
        data.tamamlanma,
        data.notlar
      ]
    );
    
    const duration = Date.now() - start;
    console.log(`[DB] Created new production with ID: ${result.rows[0].id} in ${duration}ms`);
    
    return result.rows[0] as Production;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to create production after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Update an existing production
 */
export async function updateProduction(id: string, data: Partial<Omit<Production, 'id' | 'created_at' | 'updated_at'>>) {
  console.log(`[DB] Updating production with ID: ${id}`);
  const start = Date.now();
  
  try {
    const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
    if (fields.length === 0) {
      console.log(`[DB] No fields to update for production with ID: ${id}`);
      return null;
    }
    
    // Dynamically build the SET clause and parameter array
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => data[field as keyof typeof data]);
    
    const query = `UPDATE productions SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await queryDB(query, [id, ...values]);
    
    const duration = Date.now() - start;
    if (result.rowCount === 0) {
      console.log(`[DB] Production with ID: ${id} not found for update`);
      return null;
    }
    
    console.log(`[DB] Updated production with ID: ${id} in ${duration}ms, fields changed: ${fields.join(', ')}`);
    
    return result.rows[0] as Production;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to update production with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Delete a production
 */
export async function deleteProduction(id: string) {
  console.log(`[DB] Deleting production with ID: ${id}`);
  const start = Date.now();
  
  try {
    const result = await queryDB('DELETE FROM productions WHERE id = $1 RETURNING *', [id]);
    
    const duration = Date.now() - start;
    
    if (result.rowCount === 0) {
      console.log(`[DB] Production with ID: ${id} not found for deletion`);
      return undefined;
    }
    
    console.log(`[DB] Deleted production with ID: ${id} in ${duration}ms`);
    
    return result.rows[0] as Production;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to delete production with ID: ${id} after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Get production statistics
 */
export async function getProductionStats() {
  console.log('[DB] Fetching production statistics');
  const start = Date.now();
  
  try {
    const result = await queryDB(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE durum != 'Tamamlandı') as in_progress,
        COUNT(*) FILTER (WHERE durum = 'Tamamlandı') as completed,
        COUNT(*) FILTER (WHERE durum != 'Tamamlandı' AND tamamlanma < 50) as at_risk
      FROM productions
    `, []);
    
    const duration = Date.now() - start;
    console.log(`[DB] Retrieved production statistics in ${duration}ms`);
    
    return result.rows[0];
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve production statistics after ${duration}ms:`, error);
    throw error;
  }
}
