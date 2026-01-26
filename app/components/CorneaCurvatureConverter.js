'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

export default function CorneaCurvatureConverter({ isDark = true, onClose }) {
  // Define limits
  const MIN_RADIUS = 4.00;
  const MAX_RADIUS = 12.00;
  const MIN_DIOPTER = 337.5 / MAX_RADIUS; // 28.125 D
  const MAX_DIOPTER = 337.5 / MIN_RADIUS; // 84.375 D

  // Radius to Diopters
  const [radiusInput, setRadiusInput] = useState(7.80);
  
  // Diopters to Radius
  const [diopterInput, setDiopterInput] = useState(43.27);

  const formatToTwoDecimals = (value) => Number(value).toFixed(2);

  const radiusToDiopters = (radius) => {
    const r = parseFloat(radius);
    if (!r || r <= 0) return null;
    if (r < MIN_RADIUS || r > MAX_RADIUS) return 'out-of-range';
    return 337.5 / r;
  };

  const dioptersToRadius = (diopters) => {
    const d = parseFloat(diopters);
    if (!d || d <= 0) return null;
    if (d < MIN_DIOPTER || d > MAX_DIOPTER) return 'out-of-range';
    return 337.5 / d;
  };

  const radiusResult = radiusToDiopters(radiusInput);
  const diopterResult = dioptersToRadius(diopterInput);

  const tableRows = useMemo(() => {
    const commonDs = [36,37,38,39,40,41,42,43,43.5,44,44.5,45,45.5,46,47,48,49,50,51,52,53];
    return commonDs.map(d => ({ D: d.toFixed(2), mm: (337.5 / d).toFixed(2) }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
          <h1 className="text-2xl font-bold text-slate-800">Radius and Diopter Conversion Calculator</h1>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-8 leading-relaxed text-gray-800 overflow-y-auto max-h-[85vh]">
          {/* Conversion Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Convert Radius and Power</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radius to Diopters */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Radius to Diopters</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Radius (mm)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min={MIN_RADIUS}
                    max={MAX_RADIUS}
                    value={Number(radiusInput).toFixed(2)} 
                    onChange={(e) => setRadiusInput(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Power</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {radiusResult === 'out-of-range' ? (
                      <span className="text-red-600 text-base">Out of range</span>
                    ) : radiusResult ? (
                      `${formatToTwoDecimals(radiusResult)} D`
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </div>

              {/* Diopters to Radius */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Diopters to Radius</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Diopters (D)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min={MIN_DIOPTER}
                    max={MAX_DIOPTER}
                    value={diopterInput} 
                    onChange={(e) => setDiopterInput(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Radius</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {diopterResult === 'out-of-range' ? (
                      <span className="text-red-600 text-base">Out of range</span>
                    ) : diopterResult ? (
                      `${formatToTwoDecimals(diopterResult)} mm`
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mb-10 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Radius and Diopter Conversion for Corneal Curvature</h2>
            
            <div className="space-y-6 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Why millimeters and diopters describe the same curvature</h3>
                <p className="text-sm leading-relaxed">
                  Corneal curvature is commonly expressed as a <strong>radius in millimeters</strong> or as an equivalent <strong>power in diopters</strong>. These are two ways to describe the same surface. The relationship is inverse: a shorter radius means a steeper cornea and a higher dioptric value. A longer radius means a flatter cornea and a lower dioptric value.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">The keratometric index and the 337.5 constant</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Most clinical keratometers use a standardized refractive index of <strong>1.3375</strong> (the keratometric index) to approximate corneal power from the anterior surface radius. With this convention, the conversion is:
                </p>
                <div className="bg-white p-4 rounded border border-blue-300 font-mono text-sm">
                  <p className="mb-1"><strong>D = 337.5 ÷ r</strong> (with r in millimeters)</p>
                  <p className="text-gray-600">Example: 7.50 mm corresponds to 45.00 D</p>
                </div>
                <p className="text-sm leading-relaxed mt-2">
                  Converting the other direction uses the rearranged form: <strong>r = 337.5 ÷ D</strong>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Clinical Applications</h3>
                <p className="text-sm leading-relaxed">
                  This matters when comparing keratometry readings, topography outputs, and contact lens base curves. One device may report a meridian as 45.00 D, while another reports the same curvature as 7.50 mm. Converting between units keeps interpretation consistent across instruments and ordering systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
