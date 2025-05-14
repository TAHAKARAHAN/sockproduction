import { NextRequest, NextResponse } from 'next/server';
import { getProductionById, updateProduction, deleteProduction, getProductionsWithQRCode } from '@/lib/production-db';

// Define an interface for the variant data stored in 'notlar' and expected in 'updateData'
interface ApiVariant {
  id: string;
  model?: string;
  renk?: string;
  beden?: string;
  adet?: number;
  // Allow other properties as they might exist in notlar
  [key: string]: unknown; 
}

interface UpdateData {
  durum: string; // Should ideally be ProductionStatus type if shared
  tamamlanma: number;
  scannedCode?: string;
  operatorId?: string;
  assignQrCode?: boolean;
  quantity?: number;
  variant?: ApiVariant; // Use ApiVariant here
}

/**
 * GET handler to fetch a single production by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch production', details: (error as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler to update a production
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const updateData = await request.json() as UpdateData;
    console.log(`[API] PATCH payload:`, updateData);
    
    const standardFields: Record<string, unknown> = {
      durum: updateData.durum,
      tamamlanma: updateData.tamamlanma
    };
    
    let notlarObject: {
      scanHistory?: unknown[];
      qrCodes?: Record<string, unknown>;
      variants?: ApiVariant[]; // Ensure variants is typed
      [key: string]: unknown; // Allow other dynamic properties
    } = {};

    try {
      if (currentProduction.notlar) {
        notlarObject = JSON.parse(currentProduction.notlar);
      }
    } catch {
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
        variant?: ApiVariant; // Use ApiVariant
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
      const isCodeAssignedElsewhere = qrCodeCheck.some((p: { id: string; notlar?: string | null }) => {
        if (p.id.toString() === id) {
          try {
            const notes = JSON.parse(p.notlar || '{}') as { qrCodes?: Record<string, { qrCode: string }> };
            if (notes.qrCodes && updateData.variant) {
              const variantKeys = Object.keys(notes.qrCodes);
              return variantKeys.some(vid => 
                vid !== updateData.variant!.id && 
                notes.qrCodes![vid].qrCode === updateData.scannedCode
              );
            }
          } catch (error) {
            console.error('[API] Error parsing production notes for QR check:', error);
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
      
      const variantsArr = notlarObject.variants; // Now typed as ApiVariant[]
      const existingVariantIndex = variantsArr.findIndex(
        (v: ApiVariant) => v.id === updateData.variant!.id // v is ApiVariant
      );
      
      if (existingVariantIndex >= 0) {
        variantsArr[existingVariantIndex] = {
          ...variantsArr[existingVariantIndex], // This is ApiVariant
          ...updateData.variant, // This is ApiVariant (or part of it)
          adet: updateData.quantity !== undefined ? updateData.quantity : variantsArr[existingVariantIndex].adet || 0
        };
      } else {
        variantsArr.push({
          ...updateData.variant,
          adet: updateData.quantity !== undefined ? updateData.quantity : 0
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
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[API] PATCH /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to update production', details: (error as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a production
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[API] DELETE /api/productions/${id} - Failed after ${duration}ms:`, error);
    
    return NextResponse.json(
      { error: 'Failed to delete production' },
      { status: 500 }
    );
  }
}
