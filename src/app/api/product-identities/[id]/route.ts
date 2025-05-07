import { NextResponse } from 'next/server';
import { getProductIdentityById, updateProductIdentity, deleteProductIdentity } from '@/lib/db';

// GET handler to fetch a specific product identity
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(`[API] GET /api/product-identities/${id} - Fetching product identity`);
  
  try {
    // Get data from database
    const product = await getProductIdentityById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] Successfully fetched product identity with ID: ${id}`);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error(`[API] Error fetching product identity:`, error);
    
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
  const { id } = params;
  console.log(`[API] PUT /api/product-identities/${id} - Updating product identity`);
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    console.log(`[API] PUT data preview: ${Object.keys(data).join(', ')}`);
    
    const updatedProduct = await updateProductIdentity(id, data);
    
    const duration = Date.now() - startTime;
    
    if (!updatedProduct) {
      console.log(`[API] PUT /api/product-identities/${id} - Product not found (${duration}ms)`);
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] PUT /api/product-identities/${id} - Successfully updated product in ${duration}ms`);
    return NextResponse.json(updatedProduct);
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
  const { id } = params;
  console.log(`[API] DELETE /api/product-identities/${id} - Deleting product identity`);
  const startTime = Date.now();
  
  try {
    const deletedProduct = await deleteProductIdentity(id);
    
    const duration = Date.now() - startTime;
    
    if (!deletedProduct) {
      console.log(`[API] DELETE /api/product-identities/${id} - Product not found (${duration}ms)`);
      return NextResponse.json(
        { error: 'Product identity not found' },
        { status: 404 }
      );
    }
    
    console.log(`[API] DELETE /api/product-identities/${id} - Successfully deleted product in ${duration}ms`);
    return NextResponse.json(deletedProduct);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] DELETE /api/product-identities/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to delete product identity' },
      { status: 500 }
    );
  }
}
