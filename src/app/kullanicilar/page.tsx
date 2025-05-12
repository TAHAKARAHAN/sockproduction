"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: string;
}

export default function KullanicilarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`Server yanıtı: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Kullanıcılar yüklenirken hata:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesQuery = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesQuery && matchesRole;
  });
  
  // Get unique roles for the filter dropdown
  const uniqueRoles = Array.from(new Set(users.map(user => user.role)));

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Kullanıcı Yönetimi</h1>
            <p className="text-gray-500 dark:text-gray-400">Kullanıcıları görüntüleyin, düzenleyin ve yönetin</p>
          </div>
          <Link
            href="/kullanicilar/yeni"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Kullanıcı Ekle
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ara</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="İsim veya email ile ara..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="role" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Rol</label>
              <select
                id="role"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tüm Roller</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Kullanıcı bilgileri yükleniyor...</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Bu işlem birkaç saniye sürebilir.</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-block bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4 text-red-700 dark:text-red-400">
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-2">Veritabanına bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Yeniden Dene
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Kullanıcı bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || roleFilter !== "all" ? "Filtreleri değiştirin veya temizleyin." : "Henüz kullanıcı eklenmemiş."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Son Giriş
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 
                           user.role === 'Operator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                           'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          user.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                       'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {user.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.lastLogin || 'Henüz giriş yapmadı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          <Link 
                            href={`/kullanicilar/${user.id}/duzenle`} 
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Düzenle
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center"
                            onClick={() => {
                              if (confirm(`${user.name} kullanıcısını silmek istediğinizden emin misiniz?`)) {
                                // Delete user API call would go here
                                alert('Bu fonksiyon şu anda demo modunda çalışmaktadır');
                              }
                            }}
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
