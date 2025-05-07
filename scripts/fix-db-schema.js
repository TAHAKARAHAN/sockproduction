/**
 * This script checks and fixes database schema issues
 * Run with: node scripts/fix-db-schema.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env if available
try {
  const dotenv = require('dotenv');
  dotenv.config();
} catch (e) {
  console.log('dotenv not available, using environment variables directly');
}

// Get connection string from environment variable
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sockproduction';

const pool = new Pool({
  connectionString,
});

async function main() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    try {
      console.log('Checking if productions table exists...');
      const tableCheck = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'productions'
      `);
      
      if (tableCheck.rowCount === 0) {
        console.log('Productions table does not exist. Creating it...');
        
        // Read the migration file
        const migrationPath = path.join(__dirname, '../db/migrations/create_productions_table.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute the migration
        await client.query(migrationSql);
        console.log('Productions table created successfully!');
      } else {
        console.log('Productions table already exists, checking for notlar column...');
        
        // Check if notlar column exists
        const columnCheck = await client.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'productions' AND column_name = 'notlar'
        `);
        
        if (columnCheck.rowCount === 0) {
          console.log('Adding notlar column to productions table...');
          await client.query(`ALTER TABLE productions ADD COLUMN notlar TEXT`);
          console.log('notlar column added successfully!');
        } else {
          console.log('notlar column already exists.');
        }
      }
      
      console.log('Database schema check completed successfully!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error running schema fix:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
