import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';

// Define an interface for the database row
interface ProductionRow {
  id: string;
  style_no: string;
  [key: string]: unknown; // For any additional fields that might be returned
}

/**
 * GET handler to check if a QR code is already assigned to any production
 */
export async function GET(request: Request) {
  try {
    // Get the QR code from the URL parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'QR code parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if this QR code is assigned to any production
    const query = `
      SELECT id, style_no 
      FROM productions 
      WHERE notlar IS NOT NULL 
      AND notlar LIKE $1
    `;
    
    const result = await queryDB(query, [`%${code}%`]);
    const productions = result.rows as ProductionRow[]; // Assert type here
    
    // Return whether the QR code exists and where it's used
    return NextResponse.json({
      exists: productions.length > 0,
      count: productions.length,
      // Add proper type annotation for parameter p
      usedIn: productions.length > 0 ? productions.map((p: ProductionRow) => ({
        productionId: p.id,
        styleNo: p.style_no
      })) : []
    });
    
  } catch (error: unknown) {
    console.error(`[API] Error checking QR code:`, error);
    
    return NextResponse.json(
      { error: 'Failed to check QR code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
