'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Chart from 'chart.js/auto';

export default function ProgressionCalculatorPage() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
  const [showReferences, setShowReferences] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme ? savedTheme === 'dark' : true);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const mutedTextClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const accentHeaderDotClass = isDark ? 'text-blue-400' : 'text-blue-600';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const panelBgClass = isDark ? 'bg-slate-700' : 'bg-gray-50';
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDark ? 'text-gray-200' : 'text-gray-700';
  const bodyTextClass = isDark ? 'text-gray-200' : 'text-gray-800';
  const borderClass = isDark ? 'border-slate-600' : 'border-gray-200';
  const referenceLinkClass = isDark
    ? 'text-blue-300 hover:text-blue-200 underline underline-offset-2'
    : 'text-blue-700 hover:text-blue-800 underline underline-offset-2';

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
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!chartData) return;

    const chartTextColor = isDark ? '#e5e7eb' : '#111827';
    const chartGridColor = isDark ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.35)';

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
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 10
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              color: chartTextColor,
              boxWidth: 12,
              padding: 15,
              font: {
                size: 12,
                weight: '500'
              },
              usePointStyle: true,
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDark ? '#fff' : '#111827',
            bodyColor: isDark ? '#ccc' : '#4b5563',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Age (Child)', color: chartTextColor, font: { size: 11 } },
            ticks: { color: chartTextColor, font: { size: 10 } },
            grid: { color: chartGridColor, tickLength: 4 }
          },
          y: {
            title: { display: true, text: 'Myopia (Diopters)', color: chartTextColor, font: { size: 11 } },
            ticks: { color: chartTextColor, font: { size: 10 } },
            grid: { color: chartGridColor, tickLength: 4 },
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
  }, [chartData, isDark]);

  return (
    <main className={`min-h-screen ${textClass} relative overflow-hidden`}>
      {/* Animated gradient background - same as homepage */}
      <div className={`fixed inset-0 ${isDark ? 'bg-gradient-animated-dark' : 'bg-gradient-animated-light'} transition-opacity duration-500`} />

      {/* Mouse-tracking gradient overlay */}
      <div
        className={`fixed inset-0 ${isDark ? 'opacity-20' : 'opacity-5'} pointer-events-none transition-opacity duration-500`}
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(96, 165, 250, 0.3), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/80 border-white/10' 
          : 'bg-white/80 border-gray-200/50 shadow-sm'
        } backdrop-blur-xl border-b ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link 
            href="/" 
            className={`text-2xl font-bold tracking-tight relative z-10 transition-colors ${
              isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
            }`}
            prefetch={true}
          >
            JAYCOB<span className={accentHeaderDotClass}>.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10 font-medium">
            <Link href="/#philosophy" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Approach
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </Link>
            <Link href="/#work-experience" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Work
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </Link>
            <Link href="/#work" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Tools
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </Link>
            <Link href="/#write" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Write
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </Link>
            <Link href="/#contact" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Contact
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 hover:scale-110' 
                  : 'bg-blue-100 hover:bg-blue-200 hover:scale-110'
              } transition-all duration-200 active:scale-95`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-blue-600" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden relative z-10 p-2 rounded-lg ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            } transition-colors`}
          >
           <span className={isDark ? 'text-white' : 'text-gray-900'}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
           </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full ${
            isDark 
              ? 'bg-slate-900/95 border-white/10' 
              : 'bg-white/95 border-gray-200/50 shadow-lg'
          } backdrop-blur-xl border-b`}>
            <div className="px-6 py-6 flex flex-col gap-4 font-medium">
              <Link href="/#philosophy" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Approach</Link>
              <Link href="/#work-experience" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Work</Link>
              <Link href="/#work" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Tools</Link>
              <Link href="/#write" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Write</Link>
              <Link href="/#contact" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Contact</Link>
              
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center p-2.5 rounded-lg border w-fit ${
                  isDark 
                    ? 'border-white/20 hover:bg-white/10' 
                    : 'border-gray-200 hover:bg-gray-50'
                } transition-all mt-2`}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-blue-600" />}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Myopia Progression Calculator
          </h1>
          <p className={`text-xl md:text-2xl font-medium ${isDark ? 'text-teal-400' : 'text-teal-600'} mb-6`}>
            See your child's vision future
          </p>
          <p className={`text-lg ${mutedTextClass} max-w-3xl`}>
            This evidence-based calculator uses ethnicity, age, gender, and current prescription to project myopia progression through age 18. Compare outcomes with different myopia control treatments to make informed decisions about your child's vision care.
          </p>
        </div>

        {/* Tool */}
        <div className="space-y-8">
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-4 md:p-8`}>
            {/* Input Section */}
            <div className={`grid grid-cols-2 gap-x-4 gap-y-5 md:gap-6 mb-6 p-4 md:p-6 ${panelBgClass} rounded-xl border ${borderClass}`}>
              <div className="col-span-1">
                <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ethnicity</label>
                <select
                  value={ethnicity}
                  onChange={(e) => {
                    setEthnicity(e.target.value);
                    const ethnicityFactor = getEthnicityFactor(e.target.value);
                    const isMale = gender === 'Male';
                    const baseline = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, 0);
                    const reduction = getReduction(treatment);
                    const treated = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, reduction);
                    setChartData({ baseline, treated, treatmentName: treatment });
                  }}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${inputBgClass}`}
                >
                  <option>Chinese</option>
                  <option>Malay</option>
                  <option>Indian</option>
                  <option>Caucasian</option>
                  <option>Eurasian</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    const ethnicityFactor = getEthnicityFactor(ethnicity);
                    const isMale = e.target.value === 'Male';
                    const baseline = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, 0);
                    const reduction = getReduction(treatment);
                    const treated = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, reduction);
                    setChartData({ baseline, treated, treatmentName: treatment });
                  }}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${inputBgClass}`}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current Age</label>
                <select
                  value={currentAge}
                  onChange={(e) => {
                    setCurrentAge(e.target.value);
                    const ethnicityFactor = getEthnicityFactor(ethnicity);
                    const isMale = gender === 'Male';
                    const baseline = calculateProgression(parseInt(e.target.value), parseFloat(currentSE), ethnicityFactor, isMale, 0);
                    const reduction = getReduction(treatment);
                    const treated = calculateProgression(parseInt(e.target.value), parseFloat(currentSE), ethnicityFactor, isMale, reduction);
                    setChartData({ baseline, treated, treatmentName: treatment });
                  }}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${inputBgClass}`}
                >
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(age => (
                    <option key={age} value={age}>{age} years</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Prescription</label>
                <select
                  value={currentSE}
                  onChange={(e) => {
                    const newSE = parseFloat(e.target.value);
                    setCurrentSE(newSE);
                    const ethnicityFactor = getEthnicityFactor(ethnicity);
                    const isMale = gender === 'Male';
                    const baseline = calculateProgression(parseInt(currentAge), newSE, ethnicityFactor, isMale, 0);
                    const reduction = getReduction(treatment);
                    const treated = calculateProgression(parseInt(currentAge), newSE, ethnicityFactor, isMale, reduction);
                    setChartData({ baseline, treated, treatmentName: treatment });
                  }}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none ${inputBgClass}`}
                >
                  {Array.from({ length: 40 }, (_, i) => -0.25 - (i * 0.25)).map(val => (
                    <option key={val} value={val}>{val.toFixed(2)} D</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Treatment Option</label>
                <div className="relative">
                  <select
                    value={treatment}
                    onChange={(e) => {
                      setTreatment(e.target.value);
                      const ethnicityFactor = getEthnicityFactor(ethnicity);
                      const isMale = gender === 'Male';
                      const baseline = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, 0);
                      const reduction = getReduction(e.target.value);
                      const treated = calculateProgression(parseInt(currentAge), parseFloat(currentSE), ethnicityFactor, isMale, reduction);
                      setChartData({ baseline, treated, treatmentName: e.target.value });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none ${inputBgClass}`}
                  >
                    <option>Single Vision Lens</option>
                    <option>Myopia Control Spectacle Lens</option>
                    <option>Myopia Control Soft Contact Lens</option>
                    <option>Orthokeratology</option>
                    <option>Advanced Orthokeratology</option>
                    <option>Low-dose Atropine (0.05%)</option>
                    <option>No Spectacle Lens and/or Undercorrection</option>
                  </select>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className={`mb-6 ${panelBgClass} rounded-lg p-2 md:p-4 h-[350px] md:h-[450px] relative`}>
              <canvas ref={canvasRef} />
            </div>

            {/* Toggle for table */}
            <div className="flex items-center justify-between mb-4 border-t pt-4">
              <button
                onClick={() => setShowTable(!showTable)}
                className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                aria-expanded={showTable}
              >
                <span>Results (summary shown on chart)</span>
                <svg className={`w-4 h-4 transform transition-transform ${showTable ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Results Table */}
            {showTable && tableData && (
              <>
                {/* Desktop View Table */}
                <div className={`hidden md:block overflow-x-auto mb-6 ${panelBgClass} rounded-lg border ${borderClass} p-4`}>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Age</th>
                        <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Baseline (Single Vision)</th>
                        <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>{treatment}</th>
                        <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Progression Slowed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, idx) => (
                        <tr key={idx}>
                          <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{row.age}</td>
                          <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{row.baseline}</td>
                          <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{row.treated}</td>
                          <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{row.diff > 0 ? '+' : ''}{row.diff} D</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden space-y-4 mb-6">
                  {tableData.map((row, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${borderClass} ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                         <span className={`font-bold ${bodyTextClass} text-lg`}>Age: {row.age}</span>
                         <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                           Saved: {row.diff} D
                         </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={mutedTextClass}>Baseline (No Treatment):</span>
                          <span className={`font-medium ${isDark ? 'text-red-300' : 'text-red-600'}`}>{row.baseline} D</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mutedTextClass}>With {treatment}:</span>
                          <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{row.treated} D</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className={`text-sm italic ${mutedTextClass} mb-6`}>
              Disclaimer: This calculator provides estimates based on averaged data from clinical studies and meta-analyses. Individual progression varies significantly due to genetics, environment, and other factors. This is not medical advice. Always consult an eye care professional.
            </p>

            {/* Toggle for references */}
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

            {/* References Section */}
            {showReferences && (
              <div className={`p-5 ${panelBgClass} rounded-lg border ${borderClass}`}>
                <h2 className={`text-2xl font-bold ${textClass} mb-3`}>References</h2>
                <p className={`${bodyTextClass} mb-4`}>The estimates in this calculator are derived from the following peer-reviewed studies and meta-analyses. Click the links to view the original sources.</p>

                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>General Reviews & Guidelines</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1167/iovs.66.12.39" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>IMI—Interventions for controlling myopia onset and progression 2025 (IOVS, 2025)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>Myopia Control Spectacle Lenses</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1136/bjo-2025-327629" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Efficacy of spectacle lenses for myopia control: A meta-analysis (BJO, 2025)</a></li>
                      <li><a href="https://doi.org/10.1136/bjophthalmol-2018-313739" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>DIMS spectacle lenses slow myopia progression: 2-year RCT (BJO, 2020)</a></li>
                      <li><a href="https://doi.org/10.1038/s41598-023-32700-7" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Long-term myopia control effect in children wearing DIMS lenses for 6 years (Scientific Reports, 2023)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>Myopia Control Soft Contact Lenses</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1097/OPX.0000000000001410" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>3-year randomized clinical trial of MiSight lenses for myopia control (OVS, 2019)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>Orthokeratology</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1186/s12886-023-03175-x" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Orthokeratology in controlling myopia: A meta-analysis of RCTs (BMC Ophthalmology, 2023)</a></li>
                      <li><a href="https://www.mdpi.com/2227-9067/10/2/402" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Clinical effectiveness of DRL Orthokeratology vs SVS: 2-year study (Children, 2023)</a></li>
                      <li><a href="https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2023.1323851/full" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Efficacy of DRL orthokeratology lens in French children (Frontiers in Medicine, 2024)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>Atropine Treatment</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1016/j.ophtha.2018.05.029" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Low-concentration atropine for myopia progression (LAMP) study (Ophthalmology, 2019)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${labelClass} mb-2`}>Ethnicity & Epidemiology</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                      <li><a href="https://doi.org/10.1111/opo.13401" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Regional/ethnic differences in myopic and non-myopic children (OPO, 2025)</a></li>
                      <li><a href="https://pubmed.ncbi.nlm.nih.gov/8266124/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Race, culture and myopia in Singaporean males (SMJ, 1993)</a></li>
                      <li><a href="https://doi.org/10.1167/iovs.04-0565" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Incidence and progression of myopia in Singaporean school children (IOVS, 2005)</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
