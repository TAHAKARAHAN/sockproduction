import React from "react";

interface TechnicalSpecsProps {
  formState: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const TechnicalSpecs = ({ formState, handleInputChange }: TechnicalSpecsProps) => {
  return (
    <div>
      {/* Changed grid from 3 columns to 2 columns for better layout after removing Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="needleCount" className="block text-sm font-medium mb-1">Needle Count</label>
            <select
              id="needleCount"
              name="needleCount"
              value={formState.needleCount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Needle Count</option>
              <option value="48">48</option>
              <option value="52">52</option>
              <option value="56">56</option>
              <option value="60">60</option>
              <option value="72">72</option>
              <option value="84">84</option>
              <option value="96">96</option>
              <option value="108">108</option>
              <option value="112">112</option>
              <option value="120">120</option>
              <option value="132">132</option>
              <option value="144">144</option>
              <option value="156">156</option>
              <option value="168">168</option>
              <option value="200">200</option>
              <option value="220">220</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="diameter" className="block text-sm font-medium mb-1">Diameter</label>
            <select
              id="diameter"
              name="diameter"
              value={formState.diameter}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Diameter</option>
              <option value='3 1/4"'>3 1/4"</option>
              <option value='3.5"'>3.5"</option>
              <option value='3 3/4"'>3 3/4"</option>
              <option value='4"'>4"</option>
              <option value='4.5"'>4.5"</option>
              <option value='5"'>5"</option>
              <option value='5.5"'>5.5"</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="cylinder" className="block text-sm font-medium mb-1">Cylinder (SC/DC)</label>
            <select
              id="cylinder"
              name="cylinder"
              value={formState.cylinder}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Cylinder Type</option>
              <option value="Double cylinder">Double cylinder</option>
              <option value="Single cylinder">Single cylinder</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="weltType" className="block text-sm font-medium mb-1">Welt Type</label>
            <select
              id="weltType"
              name="weltType"
              value={formState.weltType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Welt Type</option>
              <option value="plain">plain</option>
              <option value="rib 1:1">rib 1:1</option>
              <option value="rib 2:2">rib 2:2</option>
              <option value="rib 3:1">rib 3:1</option>
              <option value="rib 3:2">rib 3:2</option>
              <option value="rib 5:1">rib 5:1</option>
              <option value="lacoste">lacoste</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="gauge" className="block text-sm font-medium mb-1">Gauge</label>
            <select
              id="gauge"
              name="gauge"
              value={formState.gauge}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Gauge</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="14">14</option>
              <option value="18">18</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="toeClosing" className="block text-sm font-medium mb-1">Toe Closing</label>
            <select
              id="toeClosing"
              name="toeClosing"
              value={formState.toeClosing}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Toe Closing</option>
              <option value="rosso">rosso</option>
              <option value="hand linking">hand linking</option>
              <option value="s by s">s by s</option>
              <option value="comfort">comfort</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="mb-4">
          <label htmlFor="styleComposition" className="block text-sm font-medium mb-1">Style Composition Sales Main</label>
          <textarea
            id="styleComposition"
            name="styleComposition"
            rows={3}
            value={formState.styleComposition}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="33% WOOL, 31% COTTON, 21% POLYAMIDE, 13% SILK, 2% ELASTANE"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;
