"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function YeniKullaniciPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    active: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad alanı zorunludur";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı zorunludur";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Şifre alanı zorunludur";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = "Rol seçimi zorunludur";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          active: formData.active
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kullanıcı oluşturma başarısız oldu");
      }
      
      setShowSuccess(true);
      
      // Redirect after success message
      setTimeout(() => {
        router.push('/kullanicilar');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors(prev => ({
        ...prev,
        form: error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin."
      }));
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Success message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/20 dark:bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 transform animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Kullanıcı Başarıyla Oluşturuldu!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Yeni kullanıcı sisteme eklendi.</p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 w-64 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full animate-progress-bar"></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Kullanıcılar sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/kullanicilar" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Kullanıcılar
              </Link>
              <span>/</span>
              <span>Yeni Kullanıcı</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yeni Kullanıcı Ekle</h1>
            <p className="text-gray-500 dark:text-gray-400">Sisteme yeni bir kullanıcı hesabı ekleyin</p>
          </div>
          
          <Link 
            href="/kullanicilar" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Listeye Dön
            </div>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-500 text-red-700 dark:text-red-300">
                <p>{errors.form}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ad Soyad"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="ornek@mail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kullanıcı Rolü
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.role ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="Admin">Yönetici</option>
                  <option value="Operator">Operatör</option>
                  <option value="User">Kullanıcı</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                )}
              </div>
              
              <div className="flex items-center h-full pt-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Kullanıcı oluşturulduktan sonra, belirtilen e-posta ve şifre ile sisteme giriş yapabilecektir.
              </p>
              
              <div className="flex justify-end gap-3">
                <Link 
                  href="/kullanicilar"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                >
                  İptal
                </Link>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kullanıcı Oluştur'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
