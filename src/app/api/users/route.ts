import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Define interface for user database row
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function GET() {
  try {
    const query = `SELECT id, name, email, role, active, last_login FROM users ORDER BY name`;
    const result = await queryDB(query, []);
    
    // Map column names to match the frontend expectations
    const users = result.rows.map((user: unknown) => {
      // Apply type assertion to the database row
      const typedUser = user as UserRow;
      return {
        id: typedUser.id,
        name: typedUser.name,
        email: typedUser.email,
        role: typedUser.role,
        active: typedUser.active,
        lastLogin: typedUser.last_login
      };
    });
    
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, active } = body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Name, email, password and role are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const checkQuery = `SELECT id FROM users WHERE email = $1`;
    const checkResult = await queryDB(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password_hash, role, active) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role, active
    `;
    
    const values = [name, email, hashedPassword, role, active || true];
    const result = await queryDB(insertQuery, values);
    
    // Return the created user (without password)
    return NextResponse.json(result.rows[0]);
    
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
