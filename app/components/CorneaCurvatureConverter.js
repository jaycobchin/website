'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

export default function CorneaCurvatureConverter({ isDark = true, onClose }) {
  const [kInput, setKInput] = useState(7.80);
  const [kType, setKType] = useState('mm');

  const formatToTwoDecimals = (value) => Number(value).toFixed(2);

  const convertKValue = () => {
    const constant = 337.5;
    const input = parseFloat(kInput);
    if (!input || input <= 0) return null;
    if (kType === 'mm') {
      return { value: constant / input, unit: 'D' };
    } else {
      return { value: constant / input, unit: 'mm' };
    }
  };

  const tableRows = useMemo(() => {
    const commonDs = [36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
    return commonDs.map(d => ({ D: d.toFixed(2), mm: (337.5 / d).toFixed(2) }));
  }, []);

  const kResult = convertKValue();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">Cornea Curvature Conversion</h1>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-8 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          {/* Conversion Calculator */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Converter</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-4 p-5 bg-gray-50 rounded-lg">
              <div className="md:col-span-1">
                <label className="block font-bold mb-2 text-slate-700">Input Value:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={kInput} 
                  onChange={(e) => setKInput(parseFloat(e.target.value))} 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="md:col-span-1">
                <label className="block font-bold mb-2 text-slate-700">Convert From:</label>
                <select 
                  value={kType} 
                  onChange={(e) => setKType(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mm">mm to Diopters</option>
                  <option value="d">Diopters to mm</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <div className="w-full p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Result</h3>
                  {kResult ? (
                    <p className="text-lg font-bold text-blue-600">{formatToTwoDecimals(kResult.value)} {kResult.unit}</p>
                  ) : (
                    <p className="text-gray-500">Enter a valid value.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Common K Values Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Common K Values Reference Table</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold text-slate-800">Diopters (D)</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold text-slate-800">Radius (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 p-3 text-slate-700">{row.D}</td>
                      <td className="border border-gray-300 p-3 text-slate-700">{row.mm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> This converter uses the standard keratometry constant of 337.5 for converting between corneal radius (mm) and corneal power (D).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
