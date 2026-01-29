'use client';

import { useState, useMemo } from 'react';
import { X, RotateCcw, Calculator } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function ContactLensVertexCalculator({ isDark = true, onClose }) {
  // OD values
  const [odSphere, setOdSphere] = useState(0.00);
  const [odCyl, setOdCyl] = useState(0.00);
  const [odAxis, setOdAxis] = useState(180);

  // OS values
  const [osSphere, setOsSphere] = useState(0.00);
  const [osCyl, setOsCyl] = useState(0.00);
  const [osAxis, setOsAxis] = useState(180);

  const [vertex, setVertex] = useState(12); // mm

  const availableCyls = useMemo(() => [-0.75, -1.25, -1.75, -2.25, -2.75], []);

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

  // Generate axis options from 1 to 180
  const axisOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 180; i++) {
      options.push(i.toString().padStart(3, '0'));
    }
    return options;
  }, []);

  const vertexCorrect = (power, vertexDistMeters) => {
    return power / (1 - vertexDistMeters * power);
  };

  const roundToQuarter = (value) => Math.round(value * 4) / 4;
  const formatToTwoDecimals = (value) => Number(value).toFixed(2);

  const roundAxisTo10 = (a) => {
    if (a === null || a === undefined || a === '') return 180;
    let rounded = Math.round(a / 10) * 10;
    if (rounded >= 180) rounded = 180;
    if (rounded === 0) rounded = 180;
    return rounded;
  };

  const transposeToMinusCyl = (s, c, a) => {
    if (c > 0) {
      s = s + c;
      c = -c;
      a = (a + 90) % 180;
    }
    return { sphere: s, cyl: c, axis: a };
  };

  const getClosestAvailableCyls = (targetCyl) => {
    if (Math.abs(targetCyl) < 0.75) return [];

    let minDiff = Infinity;
    let closests = [];
    for (let avail of availableCyls) {
      const diff = Math.abs(targetCyl - avail);
      if (diff < minDiff) {
        minDiff = diff;
        closests = [avail];
      } else if (diff === minDiff) {
        closests.push(avail);
      }
    }
    if (targetCyl < availableCyls[availableCyls.length - 1]) {
      closests = [availableCyls[availableCyls.length - 1]];
    }
    closests.sort((a, b) => Math.abs(a) - Math.abs(b));
    return closests;
  };

  const computeCL = (sphere, cyl, axis) => {
    let s = parseFloat(sphere);
    let c = parseFloat(cyl) || 0;
    let a = parseInt(axis) || 0;
    const vMeters = (parseFloat(vertex) || 12) / 1000;

    ({ sphere: s, cyl: c, axis: a } = transposeToMinusCyl(s, c, a));

    let adjSphere, adjCyl, se;
    if (c !== 0) {
      const meridian1 = s + c; // along axis +90
      const meridian2 = s; // along axis
      const adjMeridian1 = vertexCorrect(meridian1, vMeters);
      const adjMeridian2 = vertexCorrect(meridian2, vMeters);
      adjSphere = Math.max(adjMeridian1, adjMeridian2);
      adjCyl = adjMeridian1 + adjMeridian2 - 2 * adjSphere;
      se = adjSphere + adjCyl / 2;
    } else {
      adjSphere = vertexCorrect(s, vMeters);
      adjCyl = 0;
      se = adjSphere;
    }

    const clSphere = roundToQuarter(adjSphere);
    const clCyl = roundToQuarter(adjCyl);
    const clSe = roundToQuarter(se);
    const roundedAxis = roundAxisTo10(a);

    return {
      sphere: clSphere,
      cyl: clCyl,
      axis: roundedAxis,
      se: clSe
    };
  };



  const odResult = computeCL(odSphere, odCyl, odAxis);
  const osResult = computeCL(osSphere, osCyl, osAxis);

  const formatRx = (result) => {
    if (!result) return '';
    if (result.cyl === 0) {
      return `${formatToTwoDecimals(result.sphere)} DS`;
    }
    return `${formatToTwoDecimals(result.sphere)} ${formatToTwoDecimals(result.cyl)} ×${result.axis.toString().padStart(3, '0')}`;
  };

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
        <div className={`w-full max-w-4xl ${cardBgClass} rounded-2xl shadow-2xl p-8 relative`}>
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-200 ${isDark ? 'hover:bg-slate-700' : ''}`}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">👓</div>
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Spectacle to Contact Lens Prescription</h1>
              <p className={`text-sm ${mutedTextClass}`}>
                Convert spectacle Rx to contact lens power with vertex distance adjustment.
              </p>
            </div>
          </div>

          <div className="leading-relaxed overflow-y-auto max-h-[90vh]">
          {/* Starting Spectacle Prescription */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${textClass} mb-6`}>Initial Spectacles Prescription</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* OD Column */}
              <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                <h3 className={`text-base font-bold ${textClass} mb-4`}>OD</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Sphere</label>
                    <CustomSelect
                      value={odSphere.toFixed(2)}
                      onChange={(val) => setOdSphere(parseFloat(val))}
                      options={sphereOptions}
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Cylinder</label>
                    <CustomSelect
                      value={odCyl.toFixed(2)}
                      onChange={(val) => setOdCyl(parseFloat(val))}
                      options={cylinderOptions}
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Axis</label>
                    <select 
                      value={odAxis.toString().padStart(3, '0')} 
                      onChange={(e) => setOdAxis(parseInt(e.target.value))}
                      className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      {axisOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* OS Column */}
              <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                <h3 className={`text-base font-bold ${textClass} mb-4`}>OS</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Sphere</label>
                    <CustomSelect
                      value={osSphere.toFixed(2)}
                      onChange={(val) => setOsSphere(parseFloat(val))}
                      options={sphereOptions}
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Cylinder</label>
                    <CustomSelect
                      value={osCyl.toFixed(2)}
                      onChange={(val) => setOsCyl(parseFloat(val))}
                      options={cylinderOptions}
                      isDark={isDark}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Axis</label>
                    <select 
                      value={osAxis.toString().padStart(3, '0')} 
                      onChange={(e) => setOsAxis(parseInt(e.target.value))}
                      className={`w-full p-3 border rounded-lg ${inputBgClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      {axisOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Results */}
          {
            <div className="mb-8">
              <h2 className={`text-xl font-bold ${textClass} mb-6`}>Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* OD Results */}
                <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                  <h3 className={`text-base font-bold ${textClass} mb-4`}>OD</h3>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Contact Lens Rx</p>
                      <p className={`text-lg font-semibold ${bodyTextClass}`}>{formatRx(odResult)}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Spherical Equivalent</p>
                      <p className={`text-lg font-semibold ${bodyTextClass}`}>{formatToTwoDecimals(odResult.se)} DS</p>
                    </div>
                  </div>
                </div>

                {/* OS Results */}
                <div className={`${panelBgClass} p-6 rounded-lg border ${borderClass}`}>
                  <h3 className={`text-base font-bold ${textClass} mb-4`}>OS</h3>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Contact Lens Rx</p>
                      <p className={`text-lg font-semibold ${bodyTextClass}`}>{formatRx(osResult)}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedTextClass} mb-1`}>Spherical Equivalent</p>
                      <p className={`text-lg font-semibold ${bodyTextClass}`}>{formatToTwoDecimals(osResult.se)} DS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    </div>
  );
}
