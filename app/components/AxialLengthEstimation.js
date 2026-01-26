'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

export default function AxialLengthEstimation({ isDark = true, onClose }) {
  const [rightEye, setRightEye] = useState({
    flatK: 8.00,
    steepK: 8.00,
    sphere: 0.00,
    cyl: 0.00
  });

  const [leftEye, setLeftEye] = useState({
    flatK: 8.00,
    steepK: 8.00,
    sphere: 0.00,
    cyl: 0.00
  });

  const [rightResult, setRightResult] = useState('24.62');
  const [leftResult, setLeftResult] = useState('24.62');
  const [rightError, setRightError] = useState(null);
  const [leftError, setLeftError] = useState(null);
  const [showReferences, setShowReferences] = useState(false);

  // Generate sphere options from +20.00 to -20.00 in 0.25 steps (positive first)
  const sphereOptions = useMemo(() => {
    const options = [];
    for (let i = 2000; i >= -2000; i -= 25) {
      options.push((i / 100).toFixed(2));
    }
    return options;
  }, []);

  // Generate cylinder options from 0.00 to -10.00 in 0.25 steps
  const cylinderOptions = useMemo(() => {
    const options = ['0.00'];
    for (let i = -25; i >= -1000; i -= 25) {
      options.push((i / 100).toFixed(2));
    }
    return options;
  }, []);

  const calculateAL = (flatK, steepK, sphere, cyl) => {
    const meanK = (parseFloat(flatK) + parseFloat(steepK)) / 2;
    const se = parseFloat(sphere) + (parseFloat(cyl || 0) / 2);
    const al = (24.0 * meanK / 7.8) - (se * 0.4);
    return al.toFixed(2);
  };

  const validateAndUpdate = (eye, side) => {
    const flat = parseFloat(eye.flatK);
    const steep = parseFloat(eye.steepK);
    const sphere = parseFloat(eye.sphere);
    const cyl = parseFloat(eye.cyl || 0);

    const setResult = side === 'right' ? setRightResult : setLeftResult;
    const setError = side === 'right' ? setRightError : setLeftError;

    if (isNaN(flat) || isNaN(steep) || isNaN(sphere)) {
      setError('Enter valid values to calculate');
      return;
    }

    if (flat < 6.0 || flat > 10.0 || steep < 6.0 || steep > 10.0) {
      setError('K values must be between 6.00 and 10.00 mm');
      return;
    }

    if (steep > flat) {
      setError('Steep K must be equal to or smaller than Flat K');
      return;
    }

    setError(null);
    const al = calculateAL(flat, steep, sphere, cyl);
    setResult(al);
  };

  const handleRightEyeChange = (field, value) => {
    const updated = { ...rightEye, [field]: value };
    setRightEye(updated);
    validateAndUpdate(updated, 'right');
  };

  const handleLeftEyeChange = (field, value) => {
    const updated = { ...leftEye, [field]: value };
    setLeftEye(updated);
    validateAndUpdate(updated, 'left');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">Axial Length Estimation</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          <p className="text-center mb-6 text-gray-600">
            Estimate axial length for right and left eyes based on keratometry and refraction values.
          </p>

          {/* Eye Cards Container */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Right Eye */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">OD</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Flat K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={Number(rightEye.flatK).toFixed(2)}
                    onChange={(e) => handleRightEyeChange('flatK', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Steep K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={Number(rightEye.steepK).toFixed(2)}
                    onChange={(e) => handleRightEyeChange('steepK', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sphere</label>
                  <select 
                    value={Number(rightEye.sphere).toFixed(2)} 
                    onChange={(e) => handleRightEyeChange('sphere', parseFloat(e.target.value))}
                    size="8"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto"
                  >
                    {sphereOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cylinder</label>
                  <select 
                    value={Number(rightEye.cyl).toFixed(2)} 
                    onChange={(e) => handleRightEyeChange('cyl', parseFloat(e.target.value))}
                    size="8"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto"
                  >
                    {cylinderOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  {rightError ? (
                    <p className="text-red-600 font-semibold text-sm">{rightError}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Estimated Axial Length</p>
                      <p className="text-2xl font-bold text-blue-600">{rightResult} mm</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Left Eye */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">OS</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Flat K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={Number(leftEye.flatK).toFixed(2)}
                    onChange={(e) => handleLeftEyeChange('flatK', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Steep K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={Number(leftEye.steepK).toFixed(2)}
                    onChange={(e) => handleLeftEyeChange('steepK', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sphere</label>
                  <select 
                    value={Number(leftEye.sphere).toFixed(2)} 
                    onChange={(e) => handleLeftEyeChange('sphere', parseFloat(e.target.value))}
                    size="8"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto"
                  >
                    {sphereOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cylinder</label>
                  <select 
                    value={Number(leftEye.cyl).toFixed(2)} 
                    onChange={(e) => handleLeftEyeChange('cyl', parseFloat(e.target.value))}
                    size="8"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto"
                  >
                    {cylinderOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  {leftError ? (
                    <p className="text-red-600 font-semibold text-sm">{leftError}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Estimated Axial Length</p>
                      <p className="text-2xl font-bold text-blue-600">{leftResult} mm</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm italic text-gray-600 mb-6">
            Estimated accuracy ≈ ±0.9 mm vs. optical biometry. Consult your eye care professional for accurate measurement.
          </p>

          {/* Toggle for references (hidden by default) */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowReferences(!showReferences)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
              aria-expanded={showReferences}
            >
              <span>References</span>
              <svg className={`w-4 h-4 transform transition-transform ${showReferences ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* References Section (collapsible) */}
          {showReferences && (
          <div className="p-5 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">References</h2>
            <p className="text-gray-700 mb-4">The axial length estimation formula is based on the following peer-reviewed research.</p>

            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <ul className="list-disc pl-5 space-y-3">
                  <li><a href="https://doi.org/10.1371/journal.pone.0210387" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Comparison of predicted and measured axial length for ophthalmic lens design (PLOS ONE, 2019)</a></li>
                  
                  <li><a href="https://doi.org/10.1016/j.clae.2019.11.005" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Estimation of ocular axial length from conventional optometric measures (Contact Lens and Anterior Eye, 2020)</a></li>
                  
                  <li><a href="https://doi.org/10.1016/j.clae.2020.10.006" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Calculation of ocular axial length from keratometry and refraction (Contact Lens and Anterior Eye, 2021)</a></li>
                  
                  <li><a href="https://doi.org/10.1186/s40662-022-00299-x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Correcting magnification error in foveal avascular zone measurements with estimated axial length (Eye and Vision, 2022)</a></li>
                </ul>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
