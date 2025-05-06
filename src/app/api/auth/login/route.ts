import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// Gerçek uygulamada bu değerler güvenli bir veritabanından veya ortam değişkenlerinden gelmelidir
const DEMO_USER = {
  email: 'admin@example.com',
  password: 'password', // Gerçek ortamda bu karmalanmış (hashed) olmalıdır
  name: 'Admin'
};

// JWT için gizli anahtarınız
// UYARI: Bu bir örnektir, gerçek ortamda JWT_SECRET ortam değişkeni olarak saklanmalıdır
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key-should-be-in-env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Kullanıcı kimlik doğrulaması
    // Gerçek uygulamada bu bir veritabanı sorgusu olacaktır
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' }, 
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = sign(
      { 
        email: DEMO_USER.email,
        name: DEMO_USER.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token'ın geçerlilik süresi
    );

    // Başarılı yanıt
    return NextResponse.json({ token, user: { email: DEMO_USER.email, name: DEMO_USER.name } });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
