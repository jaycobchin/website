'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

export default function ContactLensVertexCalculator({ isDark = true, onClose }) {
  const [sphere, setSphere] = useState(0.0);
  const [cyl, setCyl] = useState(0.0);
  const [axis, setAxis] = useState(0);
  const [vertex, setVertex] = useState(12); // mm

  const [kInput, setKInput] = useState(7.80);
  const [kType, setKType] = useState('mm');

  const availableCyls = useMemo(() => [-0.75, -1.25, -1.75, -2.25, -2.75], []);

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

  const computeCL = () => {
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

    const clSe = roundToQuarter(se);
    const roundedAxis = roundAxisTo10(a);

    if (Math.abs(adjCyl) <= 0.5) {
      return {
        type: 'spherical',
        message: `Recommended: Spherical Contact Lens Rx: ${formatToTwoDecimals(clSe)} D (using spherical equivalent for low astigmatism)`,
        se: clSe,
        axis: roundedAxis,
      };
    } else {
      const options = [];
      const closestCyls = getClosestAvailableCyls(adjCyl);
      closestCyls.forEach((selectedCyl, index) => {
        const delta = adjCyl - selectedCyl;
        const compensate = delta / 2;
        const compSphere = adjSphere + compensate;
        const clSphere = roundToQuarter(compSphere);
        const label = closestCyls.length > 1 ? (index === 0 ? 'Option 1 (undercorrect)' : 'Option 2 (overcorrect)') : 'Recommended';
        options.push({ label, sphere: clSphere, cyl: selectedCyl, axis: roundedAxis });
      });
      return { type: 'toric', options, se: clSe };
    }
  };

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

  const clResult = computeCL();
  const kResult = convertKValue();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">CL Rx Vertex Calculator</h1>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          {/* Spectacle to CL Conversion */}
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Spectacle to Contact Lens Conversion</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4 p-5 bg-gray-50 rounded-lg">
            <div>
              <label className="block font-bold mb-2 text-slate-700">Spectacle Sphere (D):</label>
              <input type="number" step="0.25" value={sphere} onChange={(e) => setSphere(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block font-bold mb-2 text-slate-700">Spectacle Cylinder (D, optional):</label>
              <input type="number" step="0.25" value={cyl} onChange={(e) => setCyl(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block font-bold mb-2 text-slate-700">Axis (degrees, if cylinder):</label>
              <input type="number" min="0" max="180" value={axis} onChange={(e) => setAxis(parseInt(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
            </div>
            <div>
              <label className="block font-bold mb-2 text-slate-700">Vertex Distance (mm, default 12):</label>
              <input type="number" value={vertex} min="0" onChange={(e) => setVertex(parseFloat(e.target.value) || 12)} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
            </div>
          </div>

          <div id="clResults" className="p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Results</h3>
            {clResult?.type === 'spherical' && (
              <p>Recommended: Spherical Contact Lens Rx: {formatToTwoDecimals(clResult.se)} D (using spherical equivalent for low astigmatism)</p>
            )}
            {clResult?.type === 'toric' && (
              <div>
                <p className="mb-2">Recommended Toric Contact Lens Options:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {clResult.options.map((opt, idx) => (
                    <li key={idx}>{opt.label}: {formatToTwoDecimals(opt.sphere)} {formatToTwoDecimals(opt.cyl)} x {opt.axis}</li>
                  ))}
                </ul>
              </div>
            )}
            {clResult && (
              <p className="mt-2">Spherical Equivalent: {formatToTwoDecimals(clResult.se)} D</p>
            )}
            <p className="text-sm italic text-gray-600 mt-2">Always verify with professional fitting, over-refraction, and check product availability.</p>
          </div>

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
