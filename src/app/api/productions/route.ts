import { NextResponse } from 'next/server';
import { getAllProductions, getProductionById } from '@/lib/production-db';

export async function GET(request: Request) {
  console.log('[API] GET /api/productions - Fetching productions');
  const startTime = Date.now();
  
  // Check if an ID is provided in the URL
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  try {
    if (id) {
      // Get a specific production by ID
      const production = await getProductionById(id);
      
      if (!production) {
        return NextResponse.json({ error: 'Production not found' }, { status: 404 });
      }
      
      const duration = Date.now() - startTime;
      console.log(`[API] GET /api/productions - Successfully returned production with ID: ${id} in ${duration}ms`);
      
      return NextResponse.json(production);
    } else {
      // Get all productions
      const productions = await getAllProductions();
      
      const duration = Date.now() - startTime;
      console.log(`[API] GET /api/productions - Successfully returned ${productions.length} productions in ${duration}ms`);
      
      return NextResponse.json(productions);
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/productions - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch productions' },
      { status: 500 }
    );
  }
}
