import React from "react";        // add this import
import type { ProductSummaryProps } from "./types";  // adjust path as needed

export default function ProductSummary({ formState, handleInputChange }: ProductSummaryProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side - Measurements Table */}
      <div className="flex-1">
        <div className="overflow-x-auto bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">POM</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">MEASUREMENT</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">COMMENT</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">35-38</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">39-42</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Tol +/-</th>
              </tr>
            </thead>
            <tbody>
              {/* FULL */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">FULL</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">full length</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="full_35_38"
                    value={formState.full_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="full_39_42"
                    value={formState.full_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="full_tolerance"
                    value={formState.full_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* FOL */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">FOL</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">foot length</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="fol_35_38"
                    value={formState.fol_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="fol_39_42"
                    value={formState.fol_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="fol_tolerance"
                    value={formState.fol_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* RTW */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">RTW</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">ribtop width</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="rtw_35_38"
                    value={formState.rtw_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="rtw_39_42"
                    value={formState.rtw_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="rtw_tolerance"
                    value={formState.rtw_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* RTH */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">RTH</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">ribtop height</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="rth_35_38"
                    value={formState.rth_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="rth_39_42"
                    value={formState.rth_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="rth_tolerance"
                    value={formState.rth_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* LSRE */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">LSRE</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">lateral stretch: ribtop with elasthan</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsre_35_38"
                    value={formState.lsre_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="lsre_39_42"
                    value={formState.lsre_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsre_tolerance"
                    value={formState.lsre_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* LSLE */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">LSLE</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">lateral stretch: length</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsle_35_38"
                    value={formState.lsle_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="lsle_39_42"
                    value={formState.lsle_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsle_tolerance"
                    value={formState.lsle_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* LSFO */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">LSFO</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">lateral stretch: foot</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsfo_35_38"
                    value={formState.lsfo_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="lsfo_39_42"
                    value={formState.lsfo_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsfo_tolerance"
                    value={formState.lsfo_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* LSH */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">LSH</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">length stretch heel</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsh_35_38"
                    value={formState.lsh_35_38}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 font-bold">
                  <input
                    type="text"
                    name="lsh_39_42"
                    value={formState.lsh_39_42}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded-md text-right font-bold text-blue-700 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="lsh_tolerance"
                    value={formState.lsh_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>

              {/* GRAM */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-700">GRAM</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="text"
                    name="gram_tolerance"
                    value={formState.gram_tolerance}
                    onChange={handleInputChange}
                    className="w-16 px-2 py-1 border rounded-md text-right focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* ...existing right side content... */}
    </div>
  );
}
