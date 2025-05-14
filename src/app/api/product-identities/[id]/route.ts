import { NextRequest, NextResponse } from 'next/server';
import {
  getProductIdentityById,
  updateProductIdentity,
  deleteProductIdentity,
} from '@/lib/db';

// Use Promise-based params as in your example
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, props: Props) {
  const params = await props.params;
  const { id } = params;
  const productIdentity = await getProductIdentityById(id);
  if (!productIdentity) {
    return NextResponse.json({ error: 'Product identity not found' }, { status: 404 });
  }
  return NextResponse.json(productIdentity);
}

export async function PUT(request: NextRequest, props: Props) {
  const params = await props.params;
  const { id } = params;
  const data = await request.json();
  const { measurements, ...updateData } = data;
  const updated = await updateProductIdentity(id, updateData);
  if (!updated) {
    return NextResponse.json({ error: 'Product identity not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, props: Props) {
  const params = await props.params;
  const { id } = params;
  const deleted = await deleteProductIdentity(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Product identity not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
