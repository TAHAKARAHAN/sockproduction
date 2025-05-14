import React from "react";
import Image from "next/image";

interface FinalSummaryProps {
  formState: unknown;
}

const FinalSummary = ({ }: FinalSummaryProps) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <table className="w-full border-collapse table-auto">
        <tbody>
          {/* Header Row */}
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3 font-bold bg-blue-50">
              <div className="text-blue-800 text-lg">
                Fashion L_urban_October<br />
                <span className="text-sm font-semibold text-blue-700">- WOOL SOCKS WITH SILK<br />
                - WOOL/SOCKEN MIT SEIDE</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Countries</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">ANAS</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div>
                <span className="font-bold text-gray-700 block mb-1">ACG CG</span>
                <span className="text-gray-600 text-sm">Ladies_Textiles</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div>
                <span className="font-bold text-gray-700 block mb-1">ACG SCG</span>
                <span className="text-gray-600 text-sm">16-7 Socks & Hosiery</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div className="flex flex-col">
                <span className="font-bold text-gray-700 mb-1">Month</span>
                <span className="bg-blue-50 px-2 py-1 rounded text-blue-800 text-center font-medium">Oct</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div className="flex flex-col">
                <span className="font-bold text-gray-700 mb-1">Year</span>
                <span className="bg-blue-50 px-2 py-1 rounded text-blue-800 text-center font-medium">2025</span>
              </div>
            </td>
          </tr>
          
          {/* Quality / Material Row */}
          <tr className="bg-gray-100">
            <td className="border border-gray-300 p-3">
              <div className="font-bold text-gray-800 flex items-center">
                <span className="w-2 h-full bg-blue-500 mr-2"></span>
                <span>QUALITY / MATERIAL</span>
              </div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-3">
              <div className="font-bold">FEATURES / SPECIFICATION</div>
            </td>
            <td className="border border-gray-300 p-3">
              <div className="flex flex-col">
                <span className="font-bold">FIT / Gender</span>
                <span>Ladies</span>
              </div>
            </td>
            <td className="border border-gray-300 p-3">
              <div className="flex flex-col">
                <span className="font-bold">SIZE</span>
                <span className="font-semibold">ALBA SOUTH</span>
                <span>35/38 - 39/42</span>
                <span className="font-semibold mt-2">ALBA NORTH</span>
                <span>35/38 - 39/42</span>
              </div>
            </td>
          </tr>
          
          {/* Style 1 Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">STYLE</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="font-bold">Weight</div>
                    <div>45</div>
                  </div>
                  <div>
                    <div className="font-bold">Structure</div>
                    <div>Plain</div>
                  </div>
                </div>
              </div>
            </td>
            <td colSpan={2} rowSpan={3} className="border border-gray-300 p-2 align-top">
              <div>
                <div className="font-bold mb-2">ADDITIONAL INFORMATION</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>- Responsible Wool Standard (RWS)</li>
                  <li>- BCI (AS only)</li>
                  <li>- double transfer</li>
                  <li>- manufacturing: 84 needles</li>
                  <li>- ribbed</li>
                  <li>- linking of the area: flat toe seam</li>
                </ul>
                <div className="mt-4 font-bold">Crew length</div>
              </div>
            </td>
          </tr>
          
          {/* Style 2 Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">STYLE</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="font-bold">Composition</div>
                    <div>-</div>
                  </div>
                  <div>
                    <div className="font-bold">Weight</div>
                    <div>-</div>
                  </div>
                  <div>
                    <div className="font-bold">Structure</div>
                    <div>-</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          
          {/* Style 3 Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">STYLE</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="font-bold">Composition</div>
                    <div>-</div>
                  </div>
                  <div>
                    <div className="font-bold">Weight</div>
                    <div>-</div>
                  </div>
                  <div>
                    <div className="font-bold">Structure</div>
                    <div>-</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          
          {/* Claim Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">Claim</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              <div>Lycra</div>
            </td>
            <td colSpan={2} className="border border-gray-300 p-2">
              <div className="font-bold">BRAND</div>
              <div>HOFASHION WOMEN</div>
            </td>
          </tr>
          
          {/* Treatment Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">Treatment / Finishing</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">-</td>
            <td colSpan={2} className="border border-gray-300 p-2">
              <div className="font-bold">PACKAGING</div>
              <div>Header Card</div>
            </td>
          </tr>
          
          {/* Trim Details Row */}
          <tr>
            <td className="border border-gray-300 p-2">
              <div className="font-bold">Trim details</div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              Please see Key features and Technical Sketch pages for details
            </td>
            <td colSpan={2} className="border border-gray-300 p-2">
              <div className="font-bold">ONLY</div>
              <div>YOUNG FASHION</div>
            </td>
          </tr>
          
          {/* Material Codes Row */}
          <tr>
            <td colSpan={6} className="border border-gray-300 p-2 text-xs">
              MATERIAL CODES AND DETAILED DESCRIPTION. AVAILABILITY TO BE CONSIDERED IN FUTURE PLM IMPLEMENTATION
            </td>
          </tr>
          
          {/* Style Images Row */}
          <tr className="flex flex-col sm:table-row">
            <td colSpan={2} className="border border-gray-300 p-2 sm:w-1/2">
              <div className="flex justify-center">
                <div className="w-32 h-40 bg-gray-100 flex items-center justify-center relative">
                  <div className="w-28 h-38">
                    <Image 
                      src="/images/sock-style2.png" 
                      alt="Style 2 sock" 
                      width={112} 
                      height={152} 
                      layout="responsive"
                      objectFit="contain" 
                    />
                  </div>
                </div>
              </div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2 sm:w-1/2">
              <div className="flex justify-center">
                <div className="w-32 h-40 bg-blue-100 flex items-center justify-center relative">
                  <div className="w-28 h-38">
                    <Image 
                      src="/images/sock-style3.png" 
                      alt="Style 3 sock" 
                      width={112} 
                      height={152} 
                      layout="responsive"
                      objectFit="contain" 
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          
          {/* Color Swatches Row */}
          <tr className="flex flex-wrap sm:table-row">
            <td className="border border-gray-300 p-2 w-full sm:w-auto">
              <div>
                <div className="text-xs font-bold">Main Color</div>
                <div className="w-12 h-8 bg-pink-400 my-1"></div>
                <div className="text-xs">TH-BLSTCK</div>
                <div className="text-xs">Nostalgic Rose</div>
              </div>
            </td>
            <td colSpan={2} className="border border-gray-300 p-2">
              <div>
                <div className="text-xs font-bold">Main Color</div>
                <div className="w-12 h-8 bg-gray-200 my-1"></div>
                <div className="text-xs">HJ-04STCK</div>
                <div className="text-xs">Sand Off</div>
              </div>
            </td>
            <td colSpan={3} className="border border-gray-300 p-2">
              <div>
                <div className="text-xs font-bold">Main Color</div>
                <div className="w-12 h-8 bg-blue-700 my-1"></div>
                <div className="text-xs">TH-02STCK</div>
                <div className="text-xs">Stormy Blue</div>
              </div>
            </td>
          </tr>
          
          {/* Footer Row */}
          <tr>
            <td colSpan={6} className="border border-gray-300 p-2 text-center text-xs">
              PLEASE NOTE THAT ABOVE SHOWN IMAGES/SKETCHES ARE FOR INSPIRATIONAL PURPOSE ONLY. SUPPLIERS WILL BE HELD ACCOUNTABLE FOR ALL LEGAL CHECK.
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="text-xs p-2">
        18.11.2024
      </div>
    </div>
  );
};

export default FinalSummary;
