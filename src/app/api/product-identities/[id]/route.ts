import { NextRequest, NextResponse } from 'next/server';
import { queryDB, getProductIdentityById, updateProductIdentity, deleteProductIdentity } from '@/lib/db';

// GET handler to fetch a specific product identity by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Using params directly
  const { id } = params;
  console.log(`[API] GET /api/product-identities/${id} - Fetching product identity`);
  
  try {
    const productIdentity = await getProductIdentityById(id);
    
    if (!productIdentity) {
      console.log(`[API] GET /api/product-identities/${id} - Product identity not found`);
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] Successfully fetched product identity with ID: ${id}`);
    return NextResponse.json(productIdentity);
  } catch (error) {
    console.error(`[API] GET /api/product-identities/${id} - Failed:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product identity' },
      { status: 500 }
    );
  }
}

// PUT handler to update a product identity
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Using params directly
  const { id } = params;
  console.log(`[API] PUT /api/product-identities/${id} - Updating product identity`);
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    console.log(`[API] PUT data preview: ${Object.keys(data).join(', ')}`);
    
    // Remove measurements field which doesn't exist in the database
    const { measurements, ...updateData } = data;
    
    const updated = await updateProductIdentity(id, updateData);
    
    if (!updated) {
      console.log(`[API] PUT /api/product-identities/${id} - Product identity not found`);
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API] PUT /api/product-identities/${id} - Successfully updated product identity in ${duration}ms`);
    
    return NextResponse.json(updated);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] PUT /api/product-identities/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to update product identity' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a product identity
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Using params directly
  const { id } = params;
  console.log(`[API] DELETE /api/product-identities/${id} - Deleting product identity`);
  
  try {
    const deleted = await deleteProductIdentity(id);
    
    if (!deleted) {
      console.log(`[API] DELETE /api/product-identities/${id} - Product identity not found`);
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] DELETE /api/product-identities/${id} - Successfully deleted product identity`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] DELETE /api/product-identities/${id} - Failed:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product identity' },
      { status: 500 }
    );
  }
}
