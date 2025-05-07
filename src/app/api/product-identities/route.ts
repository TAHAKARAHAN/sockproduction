import { NextResponse } from 'next/server';
import { queryDB, ProductIdentity } from '@/lib/db';

// GET handler to fetch all product identities
export async function GET() {
  try {
    const result = await queryDB(`
      SELECT * FROM product_identities 
      ORDER BY id DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching product identities:', error);
    return NextResponse.json(
      { error: 'Error fetching product identities' },
      { status: 500 }
    );
  }
}

// POST handler to create a new product identity
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.uretici || !data.mal_cinsi || !data.style_no || !data.adet || !data.termin) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new product identity using the queryDB function
    const result = await queryDB(`
      INSERT INTO product_identities (uretici, mal_cinsi, style_no, adet, termin, notlar, iplik, burun)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data.uretici,
      data.mal_cinsi,
      data.style_no,
      Number(data.adet),
      new Date(data.termin),
      data.notlar || null,
      data.iplik || null,
      data.burun || null
    ]);
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product identity:', error);
    return NextResponse.json(
      { error: 'Error creating product identity' },
      { status: 500 }
    );
  }
}
