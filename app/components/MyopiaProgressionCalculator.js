'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Chart from 'chart.js/auto';

export default function MyopiaProgressionCalculator({ isDark = true, onClose }) {
  const [ethnicity, setEthnicity] = useState('Chinese');
  const [gender, setGender] = useState('Female');
  const [currentAge, setCurrentAge] = useState(8);
  const [currentSE, setCurrentSE] = useState(-1.0);
  const [treatment, setTreatment] = useState('Myopia Control Soft Contact Lens');
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [showTable, setShowTable] = useState(false);

  const getEthnicityFactor = (ethnicity) => {
    const factors = {
      'Chinese': 1.0,
      'Malay': 0.85,
      'Indian': 0.70,
      'Caucasian': 0.65,
      'Eurasian': 0.75
    };
    return factors[ethnicity] || 0.8;
  };

  const getReduction = (treatment) => {
    const reductions = {
      'Single Vision Lens': 0,
      'Myopia Control Spectacle Lens': 0.55,
      'Myopia Control Soft Contact Lens': 0.55,
      'Orthokeratology': 0.50,
      'Advanced Orthokeratology': 0.75,
      'Low-dose Atropine (0.05%)': 0.55,
      'No Spectacle Lens and/or Undercorrection': -0.10
    };
    return reductions[treatment] || 0;
  };

  const calculateProgression = (age, se, ethnicityFactor, isMale, reduction) => {
    let ages = [];
    let ses = [];
    let currentAge = age;
    let currentSE = parseFloat(se.toFixed(2));

    while (currentAge <= 18) {
      ages.push(currentAge);
      ses.push(currentSE);

      if (currentAge === 18) break;

      let annualProg = -1.15 
        + (ethnicityFactor * -0.70)
        + (isMale ? 0.08 : 0)
        + (currentAge * 0.10)
        + (currentAge * currentAge * -0.002)
        + (ethnicityFactor * currentAge * 0.035)
        + (currentSE * 0.045);

      annualProg *= (1 - reduction);
      currentSE = parseFloat((currentSE + annualProg).toFixed(2));
      currentAge++;
    }
    return { ages, ses };
  };

  const handleCalculate = () => {
    const ethnicityFactor = getEthnicityFactor(ethnicity);
    const isMale = gender === 'Male';

    const baseline = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, 0);
    const reduction = getReduction(treatment);
    const treated = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, reduction);

    // Prepare table data
    const rows = [];
    for (let i = 0; i < baseline.ages.length; i++) {
      const baselineVal = baseline.ses[i].toFixed(2);
      const treatedVal = treated.ses[i].toFixed(2);
      const diff = (baseline.ses[i] - treated.ses[i]).toFixed(2);
      rows.push({
        age: baseline.ages[i],
        baseline: baselineVal,
        treated: treatedVal,
        diff: diff
      });
    }
    setTableData(rows);
    setChartData({ baseline, treated, treatmentName: treatment });
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  useEffect(() => {
    // create or update chart when chartData changes
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!chartData) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.baseline.ages,
        datasets: [
          {
            label: 'Baseline (Single Vision Lens)',
            data: chartData.baseline.ses,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220,53,69,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: chartData.treatmentName,
            data: chartData.treated.ses,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40,167,69,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Age (years)' } },
          y: {
            title: { display: true, text: 'Myopia Prescription (D)' },
            suggestedMin: Math.min(...chartData.baseline.ses, ...chartData.treated.ses) - 0.5,
            suggestedMax: 0
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">Myopia Progression Calculator</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          <p className="text-center mb-6 text-gray-600">
            Compare expected myopia progression with <strong>no treatment (Single Vision Lens)</strong> vs your <strong>selected treatment</strong> up to age 18.
          </p>

          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6 p-5 bg-gray-50 rounded-lg">
            <div>
              <label className="block font-bold mb-2 text-slate-700">Ethnicity:</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option>Chinese</option>
                <option>Malay</option>
                <option>Indian</option>
                <option>Caucasian</option>
                <option>Eurasian</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2 text-slate-700">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2 text-slate-700">Current Age:</label>
              <select
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2 text-slate-700">Current Prescription:</label>
              <select
                value={currentSE}
                onChange={(e) => setCurrentSE(parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                {Array.from({ length: 40 }, (_, i) => -0.25 - (i * 0.25)).map(val => (
                  <option key={val} value={val}>{val.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold mb-2 text-slate-700">Treatment Option:</label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option>Single Vision Lens</option>
                <option>Myopia Control Spectacle Lens</option>
                <option>Myopia Control Soft Contact Lens</option>
                <option>Orthokeratology</option>
                <option>Advanced Orthokeratology</option>
                <option>Low-dose Atropine (0.05%)</option>
                <option>No Spectacle Lens and/or Undercorrection</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-4 bg-white rounded-lg p-4" style={{ height: 320 }}>
            <canvas ref={canvasRef} />
          </div>

          {/* Toggle for table (hidden by default) - clickable header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
              aria-expanded={showTable}
            >
              <span>Results (summary shown on chart)</span>
              <svg className={`w-4 h-4 transform transition-transform ${showTable ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Results Table (collapsible) */}
          {showTable && tableData && (
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Age</th>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Baseline (Single Vision)</th>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">{treatment}</th>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Progression Slowed</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2">{row.age}</td>
                      <td className="border border-gray-300 p-2">{row.baseline}</td>
                      <td className="border border-gray-300 p-2">{row.treated}</td>
                      <td className="border border-gray-300 p-2">{row.diff > 0 ? '+' : ''}{row.diff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer mb-6 transition-colors"
          >
            Calculate & Compare Progression
          </button>

          <p className="text-sm italic text-gray-600 mb-6">
            Disclaimer: This calculator provides estimates based on averaged data from clinical studies and meta-analyses. Individual progression varies significantly due to genetics, environment, and other factors. This is not medical advice. Always consult an eye care professional.
          </p>
        </div>
      </div>
    </div>
  );
}
