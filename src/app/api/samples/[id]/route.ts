import { NextRequest, NextResponse } from 'next/server';
import { getSampleById, updateSample, deleteSample } from '@/lib/sample-db';

// GET a specific sample
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(`[API] GET /api/samples/${id} - Fetching sample`);
  const startTime = Date.now();
  
  try {
    const sample = await getSampleById(id);
    
    if (!sample) {
      console.log(`[API] Sample with ID ${id} not found`);
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] Successfully returned sample with ID: ${id} in ${duration}ms`);
    
    return NextResponse.json(sample);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/samples/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch sample' },
      { status: 500 }
    );
  }
}

// PUT update a specific sample
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(`[API] PUT /api/samples/${id} - Updating sample`);
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    const updated = await updateSample(id, data);
    
    if (!updated) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] Successfully updated sample with ID: ${id} in ${duration}ms`);
    
    return NextResponse.json(updated);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] PUT /api/samples/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to update sample' },
      { status: 500 }
    );
  }
}

// DELETE a specific sample
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(`[API] DELETE /api/samples/${id} - Deleting sample`);
  const startTime = Date.now();
  
  try {
    const deleted = await deleteSample(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] Successfully deleted sample with ID: ${id} in ${duration}ms`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] DELETE /api/samples/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to delete sample' },
      { status: 500 }
    );
  }
}
