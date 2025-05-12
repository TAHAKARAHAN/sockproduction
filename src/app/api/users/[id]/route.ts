import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const query = `
      SELECT id, name, email, role, active, last_login, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await queryDB(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Map column names to match the frontend expectations
    const user = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      active: result.rows[0].active,
      lastLogin: result.rows[0].last_login,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
    
    return NextResponse.json(user);
    
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, email, password, role, active } = body;
    
    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const checkQuery = `SELECT id FROM users WHERE id = $1`;
    const checkResult = await queryDB(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already used by another user
    if (email) {
      const emailQuery = `SELECT id FROM users WHERE email = $1 AND id != $2`;
      const emailResult = await queryDB(emailQuery, [email, id]);
      
      if (emailResult.rows.length > 0) {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten kullanımda' },
          { status: 409 }
        );
      }
    }
    
    let query;
    let values;
    
    // If password is provided, update with password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET name = $1, email = $2, password_hash = $3, role = $4, active = $5, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $6
        RETURNING id, name, email, role, active, last_login
      `;
      values = [name, email, hashedPassword, role, active, id];
    } else {
      // Update without changing password
      query = `
        UPDATE users 
        SET name = $1, email = $2, role = $3, active = $4, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $5
        RETURNING id, name, email, role, active, last_login
      `;
      values = [name, email, role, active, id];
    }
    
    const result = await queryDB(query, values);
    
    // Return the updated user (without password)
    return NextResponse.json(result.rows[0]);
    
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const checkQuery = `SELECT id FROM users WHERE id = $1`;
    const checkResult = await queryDB(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    const query = `DELETE FROM users WHERE id = $1`;
    await queryDB(query, [id]);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
