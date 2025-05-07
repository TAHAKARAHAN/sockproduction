import { NextResponse } from 'next/server';
import { getProductionById, updateProduction, deleteProduction } from '@/lib/production-db';

/**
 * GET handler to fetch a single production by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[API] GET /api/productions/${id} - Fetching production`);
  const startTime = Date.now();
  
  try {
    // Don't attempt conversion of ID - accept it as is
    console.log(`[API] Fetching production with string ID: ${id}`);
    const production = await getProductionById(id);
    
    if (!production) {
      const duration = Date.now() - startTime;
      console.log(`[API] GET /api/productions/${id} - Production not found after ${duration}ms`);
      
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404 }
      );
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/productions/${id} - Successfully fetched production in ${duration}ms`);
    
    return NextResponse.json(production);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch production', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler to update a production
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[API] PATCH /api/productions/${id} - Updating production`);
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    const updatedProduction = await updateProduction(id, data);
    
    if (!updatedProduction) {
      const duration = Date.now() - startTime;
      console.log(`[API] PATCH /api/productions/${id} - Production not found after ${duration}ms`);
      
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404 }
      );
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] PATCH /api/productions/${id} - Successfully updated production in ${duration}ms`);
    
    return NextResponse.json(updatedProduction);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] PATCH /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to update production' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a production
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[API] DELETE /api/productions/${id} - Deleting production`);
  const startTime = Date.now();
  
  try {
    const deletedProduction = await deleteProduction(id);
    
    if (!deletedProduction) {
      const duration = Date.now() - startTime;
      console.log(`[API] DELETE /api/productions/${id} - Production not found after ${duration}ms`);
      
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404 }
      );
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] DELETE /api/productions/${id} - Successfully deleted production in ${duration}ms`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[API] DELETE /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to delete production' },
      { status: 500 }
    );
  }
}
