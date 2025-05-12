import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { queryDB } from '@/lib/db';

// JWT için gizli anahtarınız
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key-should-be-in-env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-posta ve şifre zorunludur' }, 
        { status: 400 }
      );
    }

    // Veritabanından kullanıcıyı bul
    const query = `SELECT id, name, email, password_hash, role, active FROM users WHERE email = $1`;
    const result = await queryDB(query, [email]);
    
    // Kullanıcı bulunamadı
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' }, 
        { status: 401 }
      );
    }
    
    const user = result.rows[0];
    
    // Kullanıcı aktif değil
    if (!user.active) {
      return NextResponse.json(
        { message: 'Bu hesap devre dışı bırakılmış. Lütfen yöneticinize başvurun.' }, 
        { status: 403 }
      );
    }
    
    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' }, 
        { status: 401 }
      );
    }

    // Son giriş zamanını güncelle
    await queryDB(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    // JWT token oluştur
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Başarılı yanıt (şifre hariç kullanıcı bilgilerini döndür)
    return NextResponse.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
