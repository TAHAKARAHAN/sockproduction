import React from "react";
import Link from "next/link";
import PrintButton from "../../../components/PrintButton";

interface Props {
  params: {
    id: string;
  };
}

// Making this an async function to follow Next.js server component patterns
export default async function UrunKimligiDetayPage({ params }: Props) {
  // Get the id directly from params without additional await
  // Since it's a direct object property access
  const { id } = params;
  
  // In a real app, you would fetch data here
  // const urunKimligi = await fetchUrunKimligi(id);
  
  // For now, we use static data
  const urunKimligi = {
    id: id,
    uretici: "MERTEKS TEKSTİL",
    adet: 1200,
    burun: "BOYA/YIKAMA",
    malCinsi: "L-Wool Socks with Silk - pique Styl FW 2025",
    iplik: "",
    notlar: "",
    termin: "10.10.2024",
    imalatNum: "",
    yuklemeNum: "",
    // Added technical specs
    teknikOzellikler: {
      toeClosing: "Rosso",
      graduation: "yes",
      sellingUnit: "Pair",
      bundleAmount: "1",
      pdCoordinator: "John Doe",
      needleCount: "84",
      diameterCylinder: "3.5",
      weltType: "double cylinder rib 2:2",
      knittingType: "Flat Knit",
      gauge: "400N",
      eccFinishing: "Standard",
      styleComposition: "Premium"
    },
    // Added company info
    firmaUrunBilgileri: {
      companyProductCategory: "19",
      ecc: "03",
      season: "FW 2025",
      eccErpNo: "301691",
      brandDivision: "50 10 ECC Legwear",
      styleNumber: "77597",
      genderSizeRange: "500 02 Women",
      mainCategory: "10 Knit",
      basicSizeSpec: "Socks",
      sizeRange: "ECC Unisex size range 31-34",
      basicMeasTable: "Standard",
      baseSize: "Medium"
    },
    // Added BOM info
    bomItems: [
      {
        type: "Fabric",
        erpNo: "ERP001",
        materialLocalNo: "ML001",
        composition: "Cotton 100%",
        description: "Main fabric",
        qtyWeight: "150",
        quantity: "1",
        supplier: "TextileCorp",
        placement: "All",
        itemDescription: "Premium cotton fabric"
      },
      {
        type: "Thread",
        erpNo: "ERP002",
        materialLocalNo: "ML002",
        composition: "Polyester 100%",
        description: "Sewing thread",
        qtyWeight: "10",
        quantity: "2",
        supplier: "ThreadsInc",
        placement: "Seams",
        itemDescription: "High-strength thread"
      }
    ],
    urunDetaylari: [
      {
        barkod: "8683052208987",
        urunAdi: "MERCURY-B",
        beden: "M",
        renk: "Black(Siyah)",
        adet: 300,
        miktar: "Pair",
        fiyat: "2,2000",
        birim: "EURO"
      },
      {
        barkod: "8683052208994",
        urunAdi: "MERCURY-B",
        beden: "L",
        renk: "Black(Siyah)",
        adet: 300,
        miktar: "Pair",
        fiyat: "2,2000",
        birim: "EURO"
      },
      {
        barkod: "8683052208963",
        urunAdi: "MERCURY-G",
        beden: "M",
        renk: "Grey(Gri)",
        adet: 300,
        miktar: "Pair",
        fiyat: "2,2000",
        birim: "EURO"
      },
      {
        barkod: "8683052208970",
        urunAdi: "MERCURY-G",
        beden: "L",
        renk: "Grey(Gri)",
        adet: 300,
        miktar: "Pair",
        fiyat: "2,2000",
        birim: "EURO"
      }
    ],
    teknikBilgiler: {
      styleNo: "77597",
      styleDescription: "L-Wool Socks with Silk - pique Styl FW 2025",
      sellingUnit: "Pair",
      needleCount: "84",
      weltType: "double cylinder rib 2:2",
      composition: "33% WOOL, 31% COTTON, 21% POLYAMIDE, 13% SILK, 2% ELASTANE",
      olcuBilgileri: [
        {
          olcu: "Full length",
          beden1: "24,00",
          beden2: "24,00"
        },
        {
          olcu: "Foot length",
          beden1: "23,00",
          beden2: "25,00"
        },
        {
          olcu: "Ribtop width",
          beden1: "8,00",
          beden2: "8,00"
        },
        {
          olcu: "Ribtop height",
          beden1: "6,00",
          beden2: "6,00"
        }
      ]
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/urun-kimligi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Ürün Kimlikleri
            </Link>
            <span>/</span>
            <span>{urunKimligi.id}</span>
          </div>
          <h1 className="text-2xl font-bold">Ürün Kimliği #{urunKimligi.id}</h1>
        </div>
        
        <div className="flex gap-3">
          <PrintButton />
          <Link 
            href={`/urun-kimligi/${id}/duzenle`} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Düzenle
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4">Ürün Bilgileri</h2>
              <div className="overflow-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BİLGİ</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEĞER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">ÜRETİCİ</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.uretici}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">ADET</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.adet}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">BURUN</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.burun}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">MALIN CİNSİ</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.malCinsi}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">İPLİK</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.iplik || "-"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">NOTLAR</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.notlar || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4">Üretim Bilgileri</h2>
              <div className="overflow-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BİLGİ</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEĞER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">TERMİN</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.termin}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">İMALAT NUM.</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.imalatNum || "-"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">YÜKLEME NUM.</td>
                      <td className="py-2 px-3 text-sm">{urunKimligi.yuklemeNum || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Ürün Detayları</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BARKOD</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ÜRÜN ADI</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BEDEN</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RENK</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ADET</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">MİKTAR</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">FİYAT</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BİRİM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {urunKimligi.urunDetaylari.map((detay, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3 text-sm">{detay.barkod}</td>
                    <td className="py-2 px-3 text-sm">{detay.urunAdi}</td>
                    <td className="py-2 px-3 text-sm">{detay.beden}</td>
                    <td className="py-2 px-3 text-sm">{detay.renk}</td>
                    <td className="py-2 px-3 text-sm">{detay.adet}</td>
                    <td className="py-2 px-3 text-sm">{detay.miktar}</td>
                    <td className="py-2 px-3 text-sm">{detay.fiyat}</td>
                    <td className="py-2 px-3 text-sm">{detay.birim}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
                  <td className="py-2 px-3 text-sm" colSpan={4}>TOPLAM</td>
                  <td className="py-2 px-3 text-sm">
                    {urunKimligi.urunDetaylari.reduce((total, detay) => total + detay.adet, 0)}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {urunKimligi.urunDetaylari.length > 0 ? urunKimligi.urunDetaylari[0].miktar : ''}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {urunKimligi.urunDetaylari.reduce((total, detay) => {
                      // Convert price string (like "2,2000") to number
                      const price = parseFloat(detay.fiyat.replace(',', '.'));
                      return total + (price * detay.adet);
                    }, 0).toFixed(4).replace('.', ',')}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {urunKimligi.urunDetaylari.length > 0 ? urunKimligi.urunDetaylari[0].birim : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Added Technical Specifications Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Teknik Özellikler</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ÖZELLİK</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEĞER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">TOE CLOSING</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.toeClosing}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">GRADUATION</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.graduation}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">SELLING UNIT</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.sellingUnit}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">BUNDLE AMOUNT</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.bundleAmount}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">PD COORDINATOR</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.pdCoordinator}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">NEEDLE COUNT</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.needleCount}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">DIAMETER CYLINDER</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.diameterCylinder}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">WELT TYPE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.weltType}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">KNITTING TYPE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.knittingType}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">GAUGE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.gauge}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">ECC FINISHING</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.eccFinishing}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">STYLE COMPOSITION</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.teknikOzellikler.styleComposition}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Added Company Product Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Firma Ürün Bilgileri</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BİLGİ</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEĞER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">COMPANY PRODUCT CATEGORY</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.companyProductCategory}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">ECC</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.ecc}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">SEASON</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.season}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">ECC ERP NO</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.eccErpNo}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">BRAND/DIVISION</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.brandDivision}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">STYLE #</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.styleNumber}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">GENDER SIZE RANGE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.genderSizeRange}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">MAIN CATEGORY</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.mainCategory}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">BASIC SIZE SPEC</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.basicSizeSpec}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">SIZE RANGE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.sizeRange}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">BASIC MEAS TABLE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.basicMeasTable}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm font-medium">BASE SIZE</td>
                  <td className="py-2 px-3 text-sm">{urunKimligi.firmaUrunBilgileri.baseSize}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Added Bill of Materials (BOM) Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">BOM - Malzeme Listesi</h2>
          <div className="overflow-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TYPE</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ERP NO.</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">MATERIAL LOCAL NO.</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">COMPOSITION</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DESC</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">QTY/WEIGHT (g)</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">QUANTITY</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SUPPLIER</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PLACEMENT</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {urunKimligi.bomItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3 text-sm">{item.type}</td>
                    <td className="py-2 px-3 text-sm">{item.erpNo}</td>
                    <td className="py-2 px-3 text-sm">{item.materialLocalNo}</td>
                    <td className="py-2 px-3 text-sm">{item.composition}</td>
                    <td className="py-2 px-3 text-sm">{item.description}</td>
                    <td className="py-2 px-3 text-sm">{item.qtyWeight}</td>
                    <td className="py-2 px-3 text-sm">{item.quantity}</td>
                    <td className="py-2 px-3 text-sm">{item.supplier}</td>
                    <td className="py-2 px-3 text-sm">{item.placement}</td>
                    <td className="py-2 px-3 text-sm">{item.itemDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Teknik Detaylar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Ürün Özellikleri</h3>
                <div className="overflow-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ÖZELLİK</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEĞER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium">STYLE #</td>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.styleNo}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium">STYLE DESCRIPTION</td>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.styleDescription}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium">SELLING UNIT</td>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.sellingUnit}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium">NEEDLE COUNT</td>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.needleCount}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm font-medium">WELT TYPE</td>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.weltType}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Kompozisyon</h3>
                <div className="overflow-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KOMPOZİSYON</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 text-sm">{urunKimligi.teknikBilgiler.composition}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Ölçü Bilgileri</h3>
                <div className="overflow-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">MEASUREMENT</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">35-38</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">39-42</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {urunKimligi.teknikBilgiler.olcuBilgileri.map((olcu, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3 text-sm font-medium">{olcu.olcu}</td>
                          <td className="py-2 px-3 text-sm">{olcu.beden1}</td>
                          <td className="py-2 px-3 text-sm">{olcu.beden2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
