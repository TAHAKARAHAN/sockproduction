import { NextResponse } from 'next/server';
import { getProductionStats } from '@/lib/production-db';

/**
 * GET handler to fetch production statistics
 */
export async function GET() {
  console.log('[API] GET /api/productions/stats - Fetching production statistics');
  const startTime = Date.now();
  
  try {
    const stats = await getProductionStats();
    
    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/productions/stats - Successfully fetched statistics in ${duration}ms`);
    
    return NextResponse.json(stats);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/productions/stats - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch production statistics' },
      { status: 500 }
    );
  }
}
