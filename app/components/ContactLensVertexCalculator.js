'use client';

import { useState, useMemo } from 'react';
import { X, RotateCcw, Calculator } from 'lucide-react';

export default function ContactLensVertexCalculator({ isDark = true, onClose }) {
  // OD values
  const [odSphere, setOdSphere] = useState(-0.25);
  const [odCyl, setOdCyl] = useState(-1.00);
  const [odAxis, setOdAxis] = useState(90);

  // OS values
  const [osSphere, setOsSphere] = useState(0.00);
  const [osCyl, setOsCyl] = useState(0.00);
  const [osAxis, setOsAxis] = useState(90);

  const [vertex, setVertex] = useState(12); // mm
  const [calculated, setCalculated] = useState(false);

  const [kInput, setKInput] = useState(7.80);
  const [kType, setKType] = useState('mm');

  const availableCyls = useMemo(() => [-0.75, -1.25, -1.75, -2.25, -2.75], []);

  // Generate sphere options from -20.00 to +20.00 in 0.25 steps
  const sphereOptions = useMemo(() => {
    const options = [];
    for (let i = -2000; i <= 2000; i += 25) {
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

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setOdSphere(-0.25);
    setOdCyl(-1.00);
    setOdAxis(90);
    setOsSphere(0.00);
    setOsCyl(0.00);
    setOsAxis(90);
    setCalculated(false);
  };

  const odResult = calculated ? computeCL(odSphere, odCyl, odAxis) : null;
  const osResult = calculated ? computeCL(osSphere, osCyl, osAxis) : null;

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

  const odResult = calculated ? computeCL(odSphere, odCyl, odAxis) : null;
  const osResult = calculated ? computeCL(osSphere, osCyl, osAxis) : null;
  const kResult = convertKValue();

  const formatRx = (result) => {
    if (!result) return '';
    if (result.cyl === 0) {
      return `${formatToTwoDecimals(result.sphere)} DS`;
    }
    return `${formatToTwoDecimals(result.sphere)} ${formatToTwoDecimals(result.cyl)} ×${result.axis.toString().padStart(3, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">Spectacle to Contact Lens Prescription</h1>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-8 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          {/* Starting Spectacle Prescription */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Starting Spectacle Prescription</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* OD Column */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-base font-bold text-slate-800 mb-4">OD</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sphere</label>
                    <select 
                      value={odSphere.toFixed(2)} 
                      onChange={(e) => setOdSphere(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sphereOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cylinder</label>
                    <select 
                      value={odCyl.toFixed(2)} 
                      onChange={(e) => setOdCyl(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {cylinderOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Axis</label>
                    <select 
                      value={odAxis.toString().padStart(3, '0')} 
                      onChange={(e) => setOdAxis(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {axisOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* OS Column */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-base font-bold text-slate-800 mb-4">OS</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sphere</label>
                    <select 
                      value={osSphere.toFixed(2)} 
                      onChange={(e) => setOsSphere(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {sphereOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cylinder</label>
                    <select 
                      value={osCyl.toFixed(2)} 
                      onChange={(e) => setOsCyl(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {cylinderOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Axis</label>
                    <select 
                      value={osAxis.toString().padStart(3, '0')} 
                      onChange={(e) => setOsAxis(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {axisOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCalculate}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                <Calculator size={18} />
                Calculate
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          {calculated && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* OD Results */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-base font-bold text-slate-800 mb-4">OD</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Contact Lens Rx</p>
                      <p className="text-lg font-semibold text-slate-800">{formatRx(odResult)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Spherical Equivalent</p>
                      <p className="text-lg font-semibold text-slate-800">{formatToTwoDecimals(odResult.se)} DS</p>
                    </div>
                  </div>
                </div>

                {/* OS Results */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-base font-bold text-slate-800 mb-4">OS</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Contact Lens Rx</p>
                      <p className="text-lg font-semibold text-slate-800">{formatRx(osResult)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Spherical Equivalent</p>
                      <p className="text-lg font-semibold text-slate-800">{formatToTwoDecimals(osResult.se)} DS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cornea Curvature Conversion */}
          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-3">Cornea Curvature Conversion</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-4 p-5 bg-gray-50 rounded-lg">
            <div className="md:col-span-1">
              <label className="block font-bold mb-2 text-slate-700">Input Value:</label>
              <input type="number" step="0.01" value={kInput} onChange={(e) => setKInput(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
            </div>
            <div className="md:col-span-1">
              <label className="block font-bold mb-2 text-slate-700">Convert From:</label>
              <select value={kType} onChange={(e) => setKType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                <option value="mm">mm to Diopters</option>
                <option value="d">Diopters to mm</option>
              </select>
            </div>
            <div className="md:col-span-1 flex items-end">
              <div className="w-full p-3 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-slate-800">Result</h3>
                {kResult ? (
                  <p className="mt-1">{formatToTwoDecimals(kResult.value)} {kResult.unit}</p>
                ) : (
                  <p className="mt-1 text-gray-500">Enter a valid value.</p>
                )}
              </div>
            </div>
          </div>

          {/* Common K Values Table */}
          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-3">Common K Values Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Diopters (D)</th>
                  <th className="border border-gray-300 p-2 text-left bg-gray-100">Radius (mm)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 p-2">{row.D}</td>
                    <td className="border border-gray-300 p-2">{row.mm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
