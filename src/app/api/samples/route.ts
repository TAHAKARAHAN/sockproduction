import { NextResponse } from 'next/server';
import { getAllSamples, getSampleById } from '@/lib/sample-db';

export async function GET(request: Request) {
  console.log('[API] GET /api/samples - Fetching samples');
  const startTime = Date.now();
  
  // Check if an ID is provided in the URL
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  try {
    if (id) {
      // Get a specific sample by ID
      const sample = await getSampleById(id);
      
      if (!sample) {
        return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
      }
      
      const duration = Date.now() - startTime;
      console.log(`[API] GET /api/samples - Successfully returned sample with ID: ${id} in ${duration}ms`);
      
      return NextResponse.json(sample);
    } else {
      // Get all samples
      const samples = await getAllSamples();
      
      const duration = Date.now() - startTime;
      console.log(`[API] GET /api/samples - Successfully returned ${samples.length} samples in ${duration}ms`);
      
      return NextResponse.json(samples);
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/samples - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch samples' },
      { status: 500 }
    );
  }
}
