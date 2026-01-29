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

  const bgClass = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const panelBgClass = isDark ? 'bg-slate-700' : 'bg-gray-50';
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDark ? 'text-gray-200' : 'text-gray-700';
  const mutedTextClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const bodyTextClass = isDark ? 'text-gray-200' : 'text-gray-800';
  const borderClass = isDark ? 'border-slate-600' : 'border-gray-200';

  return (
    <div className={`fixed inset-0 ${bgClass} z-50 overflow-y-auto`}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-5xl ${cardBgClass} rounded-2xl shadow-2xl p-8 relative`}>
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-200 ${isDark ? 'hover:bg-slate-700' : ''}`}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">👁️</div>
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Radius and Diopter Conversion Calculator</h1>
              <p className={`text-sm ${mutedTextClass}`}>
                Convert corneal radius and diopters with a quick clinical reference.
              </p>
            </div>
          </div>

          <div className="leading-relaxed overflow-y-auto max-h-[85vh]">
          {/* Conversion Section */}
          <div className="mb-10">
            <h2 className={`text-xl font-bold ${textClass} mb-6`}>Convert Radius and Power</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Radius to Diopters */}
              <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Radius to Diopters</h3>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Radius (mm)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min={MIN_RADIUS}
                    max={MAX_RADIUS}
                    value={radiusInput} 
                    onChange={(e) => setRadiusInput(e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setRadiusInput(val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} 
                  />
                </div>

                <div className={`pt-4 border-t ${borderClass}`}>
                  <p className={`text-sm ${mutedTextClass} mb-1`}>Power</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {radiusResult === 'out-of-range' ? (
                      <span className="text-red-400 text-base">Out of range</span>
                    ) : radiusResult ? (
                      `${formatToTwoDecimals(radiusResult)} D`
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </div>

              {/* Diopters to Radius */}
              <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Diopters to Radius</h3>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Diopters (D)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min={MIN_DIOPTER}
                    max={MAX_DIOPTER}
                    value={diopterInput} 
                    onChange={(e) => setDiopterInput(e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setDiopterInput(val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} 
                  />
                </div>

                <div className={`pt-4 border-t ${borderClass}`}>
                  <p className={`text-sm ${mutedTextClass} mb-1`}>Radius</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {diopterResult === 'out-of-range' ? (
                      <span className="text-red-400 text-base">Out of range</span>
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
          <div className={`mb-10 ${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
            <h2 className={`text-xl font-bold ${textClass} mb-4`}>Understanding Corneal Curvature: Radius and Diopter Measurements</h2>
            
            <div className={`space-y-6 ${bodyTextClass}`}>
              <div>
                <h3 className={`font-semibold ${textClass} mb-2`}>Two Ways to Express the Same Curvature</h3>
                <p className="text-sm leading-relaxed">
                  Corneal curvature can be measured in two different units: radius of curvature (mm) and refractive power (diopters). Both describe the same physical surface but from different perspectives. The relationship between them is inversely proportional—a steeper cornea has a shorter radius and greater dioptric power, while a flatter cornea has a longer radius and lower dioptric power.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold ${textClass} mb-2`}>The Conversion Formula</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To convert between these measurements, optometrists and ophthalmologists use a standard formula based on the keratometric refractive index of 1.3375. This simplified index allows for practical clinical calculations:
                </p>
                <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} p-4 rounded border ${borderClass} font-mono text-sm mb-2`}>
                  <p className="mb-1"><strong>Power (D) = 337.5 ÷ radius (mm)</strong></p>
                  <p className={`${mutedTextClass}`}>For instance, a corneal radius of 7.80 mm converts to approximately 43.27 D of refractive power.</p>
                </div>
                <p className="text-sm leading-relaxed mb-2">To convert in the reverse direction:</p>
                <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} p-4 rounded border ${borderClass} font-mono text-sm`}>
                  <p><strong>Radius (mm) = 337.5 ÷ power (D)</strong></p>
                </div>
              </div>

              <div>
                <h3 className={`font-semibold ${textClass} mb-2`}>Why This Matters Clinically</h3>
                <p className="text-sm leading-relaxed">
                  Understanding this conversion is essential when interpreting measurements from different instruments. Keratometers typically report curvature in millimeters, corneal topographers may use diopters, and contact lens specifications often reference base curves in millimeters. Being able to convert between these units ensures accurate communication between devices, proper contact lens fitting, and consistent clinical decision-making.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
