import { NextResponse } from 'next/server';
import { getProductionById, updateProduction, deleteProduction, getProductionsWithQRCode } from '@/lib/production-db';

/**
 * GET handler to fetch a single production by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: 'Production ID is required' },
      { status: 400 }
    );
  }

  console.log(`[API] GET /api/productions/${id} - Fetching production`);
  const startTime = Date.now();
  
  try {
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
  if (!id) {
    return NextResponse.json(
      { error: 'Production ID is required' },
      { status: 400 }
    );
  }

  console.log(`[API] PATCH /api/productions/${id} - Updating production`);
  const startTime = Date.now();
  
  try {
    const currentProduction = await getProductionById(id);
    if (!currentProduction) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    console.log(`[API] PATCH payload:`, updateData);
    
    const standardFields: Record<string, any> = {
      durum: updateData.durum,
      tamamlanma: updateData.tamamlanma
    };
    
    let notlarObject: any = {};
    try {
      if (currentProduction.notlar) {
        notlarObject = JSON.parse(currentProduction.notlar);
      }
    } catch (e) {
      console.warn(`[API] Failed to parse existing notlar as JSON, initializing as empty object`);
      notlarObject = {};
    }
    
    if (!notlarObject.scanHistory) {
      notlarObject.scanHistory = [];
    }
    
    if (updateData.scannedCode) {
      interface ScanEntry {
        timestamp: string;
        code: string;
        stage: string;
        operator: string;
        variant?: any;
      }
      
      const scanEntry: ScanEntry = {
        timestamp: new Date().toISOString(),
        code: updateData.scannedCode,
        stage: updateData.durum,
        operator: updateData.operatorId || 'unknown'
      };
      
      if (updateData.variant) {
        scanEntry.variant = updateData.variant;
      }
      
      notlarObject.scanHistory.push(scanEntry);
      
      if (notlarObject.scanHistory.length > 50) {
        notlarObject.scanHistory = notlarObject.scanHistory.slice(-50);
      }
    }
    
    if (updateData.assignQrCode && updateData.variant && updateData.scannedCode) {
      const qrCodeCheck = await getProductionsWithQRCode(updateData.scannedCode);
      const isCodeAssignedElsewhere = qrCodeCheck.some(p => {
        if (p.id.toString() === id) {
          try {
            const notes = JSON.parse(p.notlar || '{}');
            if (notes.qrCodes) {
              const variantKeys = Object.keys(notes.qrCodes);
              return variantKeys.some(vid => 
                vid !== updateData.variant.id && 
                notes.qrCodes[vid].qrCode === updateData.scannedCode
              );
            }
          } catch (e) {
            console.error('[API] Error parsing production notes for QR check:', e);
          }
          return false;
        }
        return true;
      });
      
      if (isCodeAssignedElsewhere) {
        return NextResponse.json(
          { error: 'Bu QR kod başka bir varyanta zaten atanmış! Benzersiz bir QR kodu kullanın.' },
          { status: 409 }
        );
      }
      
      if (!notlarObject.qrCodes) {
        notlarObject.qrCodes = {};
      }
      
      const variantId = updateData.variant.id;
      notlarObject.qrCodes[variantId] = {
        qrCode: updateData.scannedCode,
        quantity: updateData.quantity || 0,
        assignedAt: new Date().toISOString(),
        stage: updateData.durum
      };
      
      if (!notlarObject.variants) {
        notlarObject.variants = [];
      }
      
      const existingVariantIndex = notlarObject.variants.findIndex(
        (v: any) => v.id === updateData.variant.id
      );
      
      if (existingVariantIndex >= 0) {
        notlarObject.variants[existingVariantIndex] = {
          ...notlarObject.variants[existingVariantIndex],
          ...updateData.variant,
          adet: updateData.quantity || notlarObject.variants[existingVariantIndex].adet || 0
        };
      } else {
        notlarObject.variants.push({
          ...updateData.variant,
          adet: updateData.quantity || 0
        });
      }
    }
    
    standardFields.notlar = JSON.stringify(notlarObject);
    
    const updatedProduction = await updateProduction(id, standardFields);
    
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
      { error: 'Failed to update production', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a production
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: 'Production ID is required' },
      { status: 400 }
    );
  }

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
