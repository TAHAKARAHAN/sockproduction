"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Kimlik doğrulama isteğini API'ye gönder
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Giriş yapılırken bir hata oluştu');
      }
      
      // Cookie'yi ayarla
      const expires = rememberMe ? 7 : undefined;
      Cookies.set('authToken', data.token, { expires, sameSite: 'strict', secure: true });
      Cookies.set('userEmail', email, { expires, sameSite: 'strict', secure: true });

      setIsLoading(false);
      router.push('/');
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error instanceof Error ? error.message : "Oturum açma sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top fabric pattern (optional) */}
      <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/20 dark:to-purple-900/20"></div>
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Çorap Üretim
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Yönetim Sistemi
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mt-8">
            <h2 className="text-center text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Hesabınıza Giriş Yapın
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200 rounded-md text-sm">
                <p>{error}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                           dark:bg-gray-700 dark:text-white"
                  placeholder="eposta@ornek.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                           dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Beni Hatırla
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Şifrenizi mi unuttunuz?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium 
                           text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
                           ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş Yapılıyor...
                    </span>
                  ) : (
                    "Giriş Yap"
                  )}
                </button>
              </div>
            </form>
            
            {/* Demo credentials notice */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <b>Demo Bilgileri:</b> E-posta: admin@example.com / Şifre: password
              </p>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2023 Çorap Üretim Yönetim Sistemi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
