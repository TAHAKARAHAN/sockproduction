import { NextResponse } from 'next/server';
import { getAllProductions, createProduction } from '@/lib/production-db';
import { ensureProductionsTableHasNotlarColumn } from '@/lib/db';

// Ensure the table has the required column
let columnCheckPromise = ensureProductionsTableHasNotlarColumn();

/**
 * GET handler to fetch all productions with optional filters
 */
export async function GET(request: Request) {
  // Wait for column check to complete
  await columnCheckPromise;

  console.log('[API] GET /api/productions - Fetching productions');
  const startTime = Date.now();
  
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || undefined;
    const order = url.searchParams.get('order') as 'asc' | 'desc' | undefined;
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : undefined;
    const status = url.searchParams.get('status') || undefined;
    
    // Get productions with options
    const productions = await getAllProductions({
      sort,
      order,
      limit,
      status
    });
    
    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/productions - Successfully fetched ${productions.length} productions in ${duration}ms`);
    
    return NextResponse.json(productions);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/productions - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch productions' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new production
 */
export async function POST(request: Request) {
  const startTime = Date.now(); // Add this line to define startTime at beginning of function
  try {
    // Wait for column check to complete
    await columnCheckPromise;

    console.log('[API] POST /api/productions - Creating new production');
    
    const data = await request.json();
    
    // Log the data we received
    console.log('[API] POST /api/productions - Received data:', JSON.stringify(data));
    
    // Extract values using multiple possible field names (handle both camelCase and snake_case)
    const styleNo = data.styleNo || data.style_no || '';
    const urunAdi = data.urunAdi || data.urun_adi || '';
    const siparisId = data.siparisId || data.siparis_id || '';
    const musteri = data.musteri || '';
    const baslangicTarihi = data.baslangicTarihi || data.baslangic_tarihi || '';
    const tahminiTamamlanma = data.tahminiTamamlanma || data.tahmini_tamamlanma || '';
    
    // Debug the extracted values
    console.log('[API] Extracted values:', {
      styleNo, urunAdi, siparisId, musteri, baslangicTarihi, tahminiTamamlanma
    });
    
    // Validate required fields with more detailed logging
    if (!styleNo) console.log('[API] Missing required field: styleNo/style_no');
    if (!urunAdi) console.log('[API] Missing required field: urunAdi/urun_adi');
    if (!siparisId) console.log('[API] Missing required field: siparisId/siparis_id');
    if (!musteri) console.log('[API] Missing required field: musteri');
    if (!baslangicTarihi) console.log('[API] Missing required field: baslangicTarihi/baslangic_tarihi');
    if (!tahminiTamamlanma) console.log('[API] Missing required field: tahminiTamamlanma/tahmini_tamamlanma');
    
    // Only validate that we have values, not specific field names
    if (!styleNo || !urunAdi || !siparisId || !musteri || !baslangicTarihi || !tahminiTamamlanma) {
      console.log('[API] POST /api/productions - Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert the form data format to match our database schema
    const productionData = {
      style_no: styleNo,
      urun_adi: urunAdi,
      siparis_id: siparisId,
      musteri: musteri,
      miktar: Number(data.miktar || 0),
      baslangic_tarihi: baslangicTarihi,
      tahmini_tamamlanma: tahminiTamamlanma,
      durum: data.durum || 'Burun Dikişi',
      tamamlanma: Number(data.tamamlanma || 0),
      notlar: data.notlar || null
    };
    
    console.log('[API] POST /api/productions - Processed data:', JSON.stringify(productionData));
    
    // Create production
    const production = await createProduction(productionData);
    
    const duration = Date.now() - startTime;
    console.log(`[API] POST /api/productions - Successfully created production with ID: ${production.id} in ${duration}ms`);
    
    return NextResponse.json(production, { status: 201 });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] POST /api/productions - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to create production', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
