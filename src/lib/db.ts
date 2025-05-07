import { Pool, PoolClient } from 'pg';

// Ensure database operations only happen on the server side
const isServer = typeof window === 'undefined';

// Single database connection pool for both reads and writes
// Fix: Use 'typeof Pool.prototype' instead of 'Pool' for the type
// Export dbPool so it can be imported by other modules
export let dbPool: typeof Pool.prototype | null = null;

// Only initialize the pool on the server side
if (isServer) {
  dbPool = new Pool({
    host: 'sock-production-db-instance-1.cna0ueswg26s.us-east-1.rds.amazonaws.com', // Using only writer instance
    port: 5432,
    user: 'sockdbadmin',
    password: 'BEgZuL|~OUr2*waJ4MeNirO(~?12',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false // Use proper SSL configuration in production
    },
    connectionTimeoutMillis: 5000, // Shorter timeout for faster failure detection
    idleTimeoutMillis: 10000,
    max: 5, // Fewer connections to avoid overwhelming the database
    statement_timeout: 10000 // Shorter statement timeout
  });

  // Initialize connection with health check
  const initializePool = async () => {
    try {
      const isHealthy = await checkDBConnection();
      if (!isHealthy) {
        console.error('[DB] Database connection failed - operations will fail until connection is restored');
      } else {
        console.log('[DB] Database connected successfully');
      }
    } catch (error) {
      console.error('[DB] Pool initialization error:', error);
    }
  };

  // Call initialization but don't wait for it
  initializePool().catch(console.error);
}

// Function to check database connection health
async function checkDBConnection(): Promise<boolean> {
  if (!isServer || !dbPool) return false;

  try {
    console.log('[DB] Testing database connection...');
    const client = await dbPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[DB] Database connection test successful');
    return true;
  } catch (error) {
    console.error('[DB] Database connection test failed:', error);
    return false;
  }
}

// Function to log performance metrics
const logPerformance = (operation: string, text: string, duration: number, rows: number | null) => {
  // Handle null rowCount by defaulting to 0
  const rowCount = rows ?? 0;
  const formattedDuration = duration.toFixed(2);
  console.log(`[DB] ${operation} completed in ${formattedDuration}ms | Rows: ${rowCount} | Query: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
  
  if (duration > 1000) {
    console.warn(`[DB] Warning: Slow ${operation} detected (${formattedDuration}ms)`);
  }
};

// Simplified query function with retry logic
export async function queryDB(text: string, params: any[] = [], retryCount = 1) {
  if (!isServer || !dbPool) {
    throw new Error('[DB] Database operations can only be performed on the server side');
  }

  console.log(`[DB] Starting query: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
  
  let lastError: Error | null = null;
  let attempt = 0;
  
  while (attempt <= retryCount) {
    try {
      const start = Date.now();
      const client = await dbPool.connect();
      
      try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        
        // Log success after retries if applicable
        if (attempt > 0) {
          console.log(`[DB] Query successful after ${attempt} retries`);
        }
        
        logPerformance('Query', text, duration, res.rowCount);
        return res;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`[DB] Query error (attempt ${attempt + 1}/${retryCount + 1}):`, error);
      
      attempt++;
      
      if (attempt <= retryCount) {
        // Simple fixed delay for retry to avoid exponential backoff complexity
        const delay = 200;
        console.log(`[DB] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all attempts failed
  console.error('[DB] All query attempts failed');
  throw lastError;
}

// Use the same query function for mutations to simplify code
export const mutateDB = queryDB;

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
  console.log(`[DB] Created new product identity with ID: ${result.rows[0].id} in ${duration}ms`);
  
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
