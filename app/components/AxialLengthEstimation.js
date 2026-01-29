'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import CustomSelect from './CustomSelect';

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

  const bgClass = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const panelBgClass = isDark ? 'bg-slate-700' : 'bg-gray-50';
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDark ? 'text-gray-200' : 'text-gray-700';
  const mutedTextClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const bodyTextClass = isDark ? 'text-gray-200' : 'text-gray-800';
  const borderClass = isDark ? 'border-slate-600' : 'border-gray-200';

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
    <div className={`fixed inset-0 ${bgClass} z-50 overflow-y-auto`}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-5xl ${cardBgClass} rounded-2xl shadow-2xl p-8 relative`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-200 ${isDark ? 'hover:bg-slate-700' : ''}`}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">🧭</div>
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Axial Length Estimation</h1>
              <p className={`text-sm ${mutedTextClass}`}>
                Estimate axial length for right and left eyes based on keratometry and refraction values.
              </p>
            </div>
          </div>

          <div className="leading-relaxed overflow-y-auto max-h-[90vh]">

          {/* Eye Cards Container */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Right Eye */}
            <div className={`${panelBgClass} rounded-lg border ${borderClass} p-6`}>
              <h2 className={`text-lg font-bold ${textClass} mb-4`}>OD</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Flat K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={rightEye.flatK}
                    onChange={(e) => handleRightEyeChange('flatK', e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleRightEyeChange('flatK', val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Steep K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={rightEye.steepK}
                    onChange={(e) => handleRightEyeChange('steepK', e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleRightEyeChange('steepK', val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Sphere</label>
                  <CustomSelect
                    value={Number(rightEye.sphere).toFixed(2)}
                    onChange={(val) => handleRightEyeChange('sphere', parseFloat(val))}
                    options={sphereOptions}
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Cylinder</label>
                  <CustomSelect
                    value={Number(rightEye.cyl).toFixed(2)}
                    onChange={(val) => handleRightEyeChange('cyl', parseFloat(val))}
                    options={cylinderOptions}
                    isDark={isDark}
                  />
                </div>

                <div className={`mt-6 p-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${borderClass}`}>
                  {rightError ? (
                    <p className="text-red-400 font-semibold text-sm">{rightError}</p>
                  ) : (
                    <>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Estimated Axial Length</p>
                      <p className="text-2xl font-bold text-blue-400">{rightResult} mm</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Left Eye */}
            <div className={`${panelBgClass} rounded-lg border ${borderClass} p-6`}>
              <h2 className={`text-lg font-bold ${textClass} mb-4`}>OS</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Flat K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={leftEye.flatK}
                    onChange={(e) => handleLeftEyeChange('flatK', e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleLeftEyeChange('flatK', val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Steep K (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="6.00"
                    max="10.00"
                    value={leftEye.steepK}
                    onChange={(e) => handleLeftEyeChange('steepK', e.target.value)}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleLeftEyeChange('steepK', val.toFixed(2));
                    }}
                    className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Sphere</label>
                  <CustomSelect
                    value={Number(leftEye.sphere).toFixed(2)}
                    onChange={(val) => handleLeftEyeChange('sphere', parseFloat(val))}
                    options={sphereOptions}
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${labelClass} mb-2`}>Cylinder</label>
                  <CustomSelect
                    value={Number(leftEye.cyl).toFixed(2)}
                    onChange={(val) => handleLeftEyeChange('cyl', parseFloat(val))}
                    options={cylinderOptions}
                    isDark={isDark}
                  />
                </div>

                <div className={`mt-6 p-4 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${borderClass}`}>
                  {leftError ? (
                    <p className="text-red-400 font-semibold text-sm">{leftError}</p>
                  ) : (
                    <>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Estimated Axial Length</p>
                      <p className="text-2xl font-bold text-blue-400">{leftResult} mm</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className={`text-sm italic ${mutedTextClass} mb-6`}>
            Estimated accuracy ≈ ±0.9 mm vs. optical biometry. Consult your eye care professional for accurate measurement.
          </p>

          {/* Toggle for references (hidden by default) */}
          <div className="flex items-center justify-between mb-4 border-t pt-4">
            <button
              onClick={() => setShowReferences(!showReferences)}
              className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
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
          <div className={`p-5 ${panelBgClass} rounded-lg border ${borderClass}`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-3`}>References</h2>
            <p className={`${bodyTextClass} mb-4`}>The axial length estimation formula is based on the following peer-reviewed research.</p>

            <div className={`space-y-4 text-sm ${mutedTextClass}`}>
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
    </div>
  );
}
