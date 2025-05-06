import React from "react";

interface ProductDetail {
  barkod: string;
  urunAdi: string;
  beden: string;
  renk: string;
  adet: string;
  miktar: string;
  fiyat: string;
  birim: string;
}

interface ProductDetailsSectionProps {
  productDetails: ProductDetail[];
  currentProduct: ProductDetail;
  showProductForm: boolean;
  editingProductIndex: number;
  handleProductChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addProductDetail: () => void;
  editProductDetail: (index: number) => void;
  removeProductDetail: (index: number) => void;
  setShowProductForm: (show: boolean) => void;
  setEditingProductIndex: (index: number) => void;
  setCurrentProduct: (product: ProductDetail) => void;
}

const ProductDetailsSection = ({
  productDetails,
  currentProduct,
  showProductForm,
  editingProductIndex,
  handleProductChange,
  addProductDetail,
  editProductDetail,
  removeProductDetail,
  setShowProductForm,
  setEditingProductIndex,
  setCurrentProduct
}: ProductDetailsSectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Ürün Detayları</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               No
             </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Barkod
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ürün Adı
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Beden
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Renk
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Adet
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Miktar
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fiyat
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Birim
              </th>
              <th scope="col" className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {productDetails.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Henüz ürün detayı eklenmemiş
                </td>
              </tr>
            ) : (
              productDetails.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.barkod}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.urunAdi}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.beden}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.renk}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.adet}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.miktar}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.fiyat}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.birim}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => editProductDetail(index)}
                      className="text-blue-600 hover:text-blue-900 mr-2 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProductDetail(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showProductForm ? (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="text-md font-medium mb-3">
            {editingProductIndex >= 0 ? 'Ürün Detayını Düzenle' : 'Yeni Ürün Detayı Ekle'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="barkod" className="block text-sm font-medium mb-1">Barkod</label>
              <input
                type="text"
                id="barkod"
                name="barkod"
                value={currentProduct.barkod}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="urunAdi" className="block text-sm font-medium mb-1">Ürün Adı</label>
              <input
                type="text"
                id="urunAdi"
                name="urunAdi"
                value={currentProduct.urunAdi}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label htmlFor="beden" className="block text-sm font-medium mb-1">Beden</label>
              <input
                type="text"
                id="beden"
                name="beden"
                value={currentProduct.beden}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="renk" className="block text-sm font-medium mb-1">Renk</label>
              <input
                type="text"
                id="renk"
                name="renk"
                value={currentProduct.renk}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="adet" className="block text-sm font-medium mb-1">Adet</label>
              <input
                type="number"
                id="adet"
                name="adet"
                value={currentProduct.adet}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="miktar" className="block text-sm font-medium mb-1">Miktar</label>
              <input
                type="text"
                id="miktar"
                name="miktar"
                value={currentProduct.miktar}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="fiyat" className="block text-sm font-medium mb-1">Fiyat</label>
              <input
                type="text"
                id="fiyat"
                name="fiyat"
                value={currentProduct.fiyat}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="birim" className="block text-sm font-medium mb-1">Birim</label>
              <select
                id="birim"
                name="birim"
                value={currentProduct.birim}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowProductForm(false);
                setEditingProductIndex(-1);
                setCurrentProduct({
                  barkod: "",
                  urunAdi: "",
                  beden: "",
                  renk: "",
                  adet: "",
                  miktar: "",
                  fiyat: "",
                  birim: "TL"
                });
              }}
              className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={addProductDetail}
              className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingProductIndex >= 0 ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </div>
      ) : (
        <button 
          type="button" 
          onClick={() => setShowProductForm(true)}
          className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün Detayı Ekle
        </button>
      )}
    </div>
  );
};

export default ProductDetailsSection;
