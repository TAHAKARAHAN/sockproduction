interface QueryResult {
  rows: unknown[];
  rowCount: number;
}

interface DbPool {
  query(text: string, params: unknown[]): Promise<QueryResult>;
}

// Define a type for the Pool constructor
type PoolConstructor = new (config: unknown) => unknown;

// Only import Pool on the server side to prevent browser errors
let Pool: PoolConstructor | null = null;
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool: PgPool } = require('pg');
  Pool = PgPool;
}

// Flag for server-side operations
const isServer = typeof window === 'undefined';

// Single database connection pool for both reads and writes
let dbPool: DbPool | null = null;

if (isServer && Pool) {
  try {
    // Initialize the connection pool
    dbPool = new Pool({
      host: process.env.DB_HOST || 'sock-production-db-instance-1.cna0ueswg26s.us-east-1.rds.amazonaws.com',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'sockdbadmin',
      password: process.env.DB_PASSWORD || 'hAxZ[v|qe?!:Ibk_c2Y[LN1Uv_eO',
      database: process.env.DB_NAME || 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 5,
      statement_timeout: 10000
    }) as DbPool;
    
    console.log("[DB] Database connection pool initialized");
  } catch (err) {
    console.error("[DB] Failed to initialize database connection pool:", err);
  }
}

// Execute database query with retry logic
export async function queryDB(text: string, params: unknown[] = []) {
  if (!isServer) {
    throw new Error("[DB] Database operations can only be performed on the server side");
  }
  
  if (!dbPool) {
    throw new Error("[DB] Database connection pool not initialized");
  }
  
  const start = Date.now();
  try {
    console.log(`[DB] Executing query: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    const result = await dbPool!.query(text, params);
    const duration = Date.now() - start;
    console.log(`[DB] Executed query in ${duration}ms: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Query failed after ${duration}ms: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    console.error(`[DB] Error details:`, error);
    throw error;
  }
}

// Types for product identity
export interface ProductIdentity {
  id: number;
  uretici: string;
  mal_cinsi: string;
  style_no: string;
  adet: number;
  termin: string;
  created_at?: string;
  updated_at?: string;
  notlar?: string | null;
  iplik?: string | null;
  burun?: string | null;
}

// Function to get all product identities - optimized query
export async function getAllProductIdentities() {
  console.log('[DB] Fetching all product identities...');
  const start = Date.now();
  
  try {
    // Simplified query
    const query = 'SELECT * FROM product_identities ORDER BY id ASC LIMIT 100';
    const result = await queryDB(query, []);
    
    const duration = Date.now() - start;
    console.log(`[DB] Retrieved ${result.rows.length} product identities in ${duration}ms`);
    
    if (result.rows.length > 0) {
      console.log('[DB] First row sample:', JSON.stringify(result.rows[0]));
    }
    
    return result.rows as ProductIdentity[];
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[DB] Failed to retrieve product identities after ${duration}ms:`, error);
    throw error;
  }
}

// Function to get a single product identity by ID
export async function getProductIdentityById(id: string) {
  // Extra check to ensure this only runs on the server
  if (typeof window !== 'undefined') {
    throw new Error('[DB] Database operations can only be performed on the server side');
  }
  
  console.log(`[DB] Fetching product identity with ID: ${id}`);
  const start = Date.now();
  
  const result = await queryDB('SELECT * FROM product_identities WHERE id = $1', [id]);
  
  const duration = Date.now() - start;
  console.log(`[DB] ${result.rows.length ? 'Found' : 'Did not find'} product identity with ID: ${id} in ${duration}ms`);
  
  return result.rows[0] as ProductIdentity | undefined;
}

// Function to create a new product identity
export async function createProductIdentity(data: Omit<ProductIdentity, 'id' | 'created_at' | 'updated_at'>) {
  console.log(`[DB] Creating new product identity: ${data.style_no} - ${data.mal_cinsi}`);
  const { uretici, mal_cinsi, style_no, adet, termin, notlar, iplik, burun } = data;
  const start = Date.now();
  
  const result = await queryDB(
    'INSERT INTO product_identities (uretici, mal_cinsi, style_no, adet, termin, notlar, iplik, burun) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [uretici, mal_cinsi, style_no, adet, termin, notlar, iplik, burun]
  );
  
  const duration = Date.now() - start;
  console.log(`[DB] Created new product identity with ID: ${(result.rows[0] as ProductIdentity).id} in ${duration}ms`);
  
  return result.rows[0] as ProductIdentity;
}

// Function to update a product identity
export async function updateProductIdentity(id: string, data: Partial<Omit<ProductIdentity, 'id' | 'created_at' | 'updated_at'>>) {
  console.log(`[DB] Updating product identity with ID: ${id}`);
  const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
  const values = fields.map(field => data[field as keyof typeof data]);
  
  if (fields.length === 0) return null;
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  const query = `UPDATE product_identities SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
  
  const start = Date.now();
  const result = await queryDB(query, [id, ...values]);
  const duration = Date.now() - start;
  
  if (result.rowCount === 0) {
    console.log(`[DB] Product identity with ID: ${id} not found for update`);
    return null;
  }
  
  console.log(`[DB] Updated product identity with ID: ${id} in ${duration}ms, fields changed: ${fields.join(', ')}`);
  
  return result.rows[0] as ProductIdentity;
}

// Function to delete a product identity
export async function deleteProductIdentity(id: string) {
  console.log(`[DB] Deleting product identity with ID: ${id}`);
  const start = Date.now();
  
  const result = await queryDB('DELETE FROM product_identities WHERE id = $1 RETURNING *', [id]);
  
  const duration = Date.now() - start;
  
  if (result.rowCount === 0) {
    console.log(`[DB] Product identity with ID: ${id} not found for deletion`);
    return undefined;
  }
  
  console.log(`[DB] Deleted product identity with ID: ${id} in ${duration}ms`);
  
  return result.rows[0] as ProductIdentity | undefined;
}

/**
 * Check if the productions table has the notlar column and add it if missing
 */
export async function ensureProductionsTableHasNotlarColumn() {
  try {
    console.log('[DB] Checking if productions table has notlar column...');
    
    // Check if the column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'productions' AND column_name = 'notlar'
    `;
    const checkResult = await dbPool!.query(checkQuery, []); // Added empty params array
    
    if (checkResult.rowCount === 0) {
      console.log('[DB] notlar column not found, adding it now...');
      
      // Add the column if it doesn't exist
      const alterQuery = `ALTER TABLE productions ADD COLUMN notlar TEXT`;
      await dbPool!.query(alterQuery, []); // Added empty params array
      
      console.log('[DB] Successfully added notlar column to productions table');
      return true;
    } else {
      console.log('[DB] notlar column already exists in productions table');
      return false;
    }
  } catch (error) {
    console.error('[DB] Error ensuring productions table has notlar column:', error);
    throw error;
  }
}
