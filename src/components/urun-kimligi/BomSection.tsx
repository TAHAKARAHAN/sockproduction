import React from "react";

interface BomItem {
  material: string;  // Changed from "type"
  composition: string;
  desc: string;
  placement: string;
  // Removed unused properties: materialLocalNo, supplier, description
}

interface BomSectionProps {
  formState: {
    bomItems: BomItem[];
  };
  handleBomItemChange: (index: number, field: keyof BomItem, value: string) => void;
  addBomItem: () => void;
  removeBomItem: (index: number) => void;
}

export default function BomSection({ formState, handleBomItemChange, addBomItem, removeBomItem }: BomSectionProps) {
  const { bomItems } = formState;

  return (
    <div>
      <button onClick={addBomItem} className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Add Item</button>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th>MATERIAL</th>
              <th>COMPOSITION</th>
              <th>DESC</th>
              <th>PLACEMENT</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {bomItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No BOM items added yet. Click "Add Item" to begin.
                </td>
              </tr>
            ) : (
              bomItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">
                    <select
                      value={item.material}
                      onChange={e => handleBomItemChange(idx, "material", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="material">Material</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full"
                      value={item.composition}
                      onChange={e => handleBomItemChange(idx, "composition", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full"
                      value={item.desc}
                      onChange={e => handleBomItemChange(idx, "desc", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full"
                      value={item.placement}
                      onChange={e => handleBomItemChange(idx, "placement", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => removeBomItem(idx)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
