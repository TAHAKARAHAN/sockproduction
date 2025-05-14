/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getAllSamples, createSample } from '@/lib/sample-db';

export async function GET(_request: Request) {
  console.log('[API] GET /api/samples - Fetching samples');
  const startTime = Date.now();
  
  try {
    // Get all samples from database
    const samples = await getAllSamples();
    
    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/samples - Successfully returned ${samples.length} samples in ${duration}ms`);
    
    // Debug log to see what's being returned
    console.log(`[API] Sample data preview: ${samples.length} items, first item ID: ${samples.length > 0 ? samples[0].id : 'none'}`);
    
    return NextResponse.json(samples);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/samples - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch samples' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('[API] POST /api/samples - Creating new sample');
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.firma || !data.model || !data.artikel || !data.beden) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Log the incoming date format for debugging
    console.log(`[API] Sample creation - received date: "${data.tarih}"`);
    
    // Set defaults for missing fields
    const sampleData = {
      ...data,
      durum: data.durum || 'İşlemde',
      zemin_iplikleri: data.zemin_iplikleri?.filter((item: unknown) => (item as { description?: unknown })?.description) || [],
      desen_iplikleri: data.desen_iplikleri?.filter((item: unknown) => (item as { description?: unknown })?.description) || [],
      toplam_agirlik: data.toplam_agirlik || "0",
      additional_field: data.additional_field || 'default_value'
    };
    
    // Create sample
    const sample = await createSample(sampleData);
    
    const duration = Date.now() - startTime;
    console.log(`[API] POST /api/samples - Successfully created sample with ID: ${sample.id} in ${duration}ms`);
    
    return NextResponse.json(sample, { status: 201 });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[API] POST /api/samples - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to create sample' },
      { status: 500 }
    );
  }
}
