'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function RiskFactorsAnalysis({ isDark = true, onClose, embedded = false }) {
  const [age, setAge] = useState(8);
  const [gender, setGender] = useState(0);
  const [ethnicity, setEthnicity] = useState(3);
  const [family, setFamily] = useState(0);
  const [refraction, setRefraction] = useState(0.5);
  const [outdoor, setOutdoor] = useState(1.5);
  const [nearwork, setNearwork] = useState(3);
  const [results, setResults] = useState(null);
  const [refractionDisplay, setRefractionDisplay] = useState('+0.50');
  const [outdoorDisplay, setOutdoorDisplay] = useState('1.5');
  const [nearworkDisplay, setNearworkDisplay] = useState('3');
  const [showReferences, setShowReferences] = useState(false);

  const handleRefractionChange = (e) => {
    const val = parseFloat(e.target.value);
    setRefraction(val);
    setRefractionDisplay((val >= 0 ? '+' : '') + val.toFixed(2));
  };

  const handleOutdoorChange = (e) => {
    const val = e.target.value;
    setOutdoor(parseFloat(val));
    setOutdoorDisplay(val);
  };

  const handleNearworkChange = (e) => {
    const val = e.target.value;
    setNearwork(parseFloat(val));
    setNearworkDisplay(val);
  };

  const calculateRisk = () => {
    const refractionThresholds = {
      1: 2.0, 2: 1.75, 3: 1.5, 4: 1.25, 5: 1.0,
      6: 0.75, 7: 0.5, 8: 0.5, 9: 0.25, 10: 0.25,
      11: 0, 12: 0, 13: -0.25, 14: -0.5, 15: -0.75, 16: -1.0, 17: -1.25
    };
    const threshold = refractionThresholds[age] || 0;

    let familyPoints = family;
    let familyRisk = family === 0 ? 'very-low' : (family === 1 ? 'moderate' : 'very-high');
    let familyExp = family === 0 ? 'No myopic parents – very low genetic risk.' :
      (family === 1 ? 'One myopic parent – moderate risk (2–3× higher).' : 'Both parents myopic – very high risk (5–6× higher).');

    const ethnicityTexts = ['Caucasian', 'Malay', 'Indian', 'Chinese'];
    let ethnicityPoints = ethnicity * 0.67;
    let ethnicityRisk = ethnicity === 0 ? 'very-low' : (ethnicity === 1 ? 'low' : (ethnicity === 2 ? 'moderate' : 'very-high'));
    let ethnicityExp = ethnicityTexts[ethnicity] + ' ethnicity – ' + (ethnicity === 0 ? 'lowest baseline risk.' : (ethnicity === 3 ? 'highest baseline risk (East Asian).' : 'intermediate risk.'));

    let genderPoints = gender;
    let genderRisk = gender === 0 ? 'very-low' : 'moderate';
    let genderExp = gender === 0 ? 'Male – slightly lower risk based on research.' : 'Female – moderately higher risk (RR ~1.28).';

    let refractionPoints, refractionRisk, refractionExp;
    if (refraction >= threshold + 0.75) {
      refractionPoints = 0;
      refractionRisk = 'very-low';
      refractionExp = `Prescription well above threshold – very low risk.`;
    } else if (refraction >= threshold + 0.25) {
      refractionPoints = 0.5;
      refractionRisk = 'low';
      refractionExp = `Prescription near threshold – low risk.`;
    } else if (refraction >= threshold - 0.25) {
      refractionPoints = 1;
      refractionRisk = 'moderate';
      refractionExp = `Prescription slightly below threshold – moderate risk.`;
    } else if (refraction >= threshold - 0.75) {
      refractionPoints = 1.5;
      refractionRisk = 'high';
      refractionExp = `Prescription below threshold – high risk.`;
    } else {
      refractionPoints = 2;
      refractionRisk = 'very-high';
      refractionExp = `Prescription far below threshold – very high risk.`;
    }

    let agePoints = age <= 7 ? 2 : (age <= 10 ? 1.5 : (age <= 13 ? 1 : 0.5));
    let ageRisk = agePoints === 2 ? 'very-high' : (agePoints === 1.5 ? 'high' : (agePoints === 1 ? 'moderate' : 'low'));
    let ageExp = age <= 7 ? 'Very young age – very high potential for early onset/fast progression.' :
      (age <= 10 ? 'Young school age – high risk period.' : (age <= 13 ? 'School age – moderate risk.' : 'Older teen – lower new onset risk.'));

    let outdoorPoints = outdoor >= 2.5 ? 0 : (outdoor >= 2 ? 0.5 : (outdoor >= 1 ? 1 : (outdoor >= 0.5 ? 1.5 : 2)));
    let outdoorRisk = outdoorPoints === 0 ? 'very-low' : (outdoorPoints === 0.5 ? 'low' : (outdoorPoints === 1 ? 'moderate' : (outdoorPoints === 1.5 ? 'high' : 'very-high')));
    let outdoorExp = outdoor >= 2.5 ? 'Excellent outdoor time – strongly protective.' :
      (outdoor >= 2 ? 'Good outdoor time – low risk.' : 'Limited outdoors – higher risk.');

    let nearworkPoints = nearwork <= 1 ? 0 : (nearwork <= 2 ? 0.5 : (nearwork <= 3 ? 1 : (nearwork <= 4 ? 1.5 : 2)));
    let nearworkRisk = nearworkPoints === 0 ? 'very-low' : (nearworkPoints === 0.5 ? 'low' : (nearworkPoints === 1 ? 'moderate' : (nearworkPoints === 1.5 ? 'high' : 'very-high')));
    let nearworkExp = nearwork <= 1 ? 'Very low near work – strongly protective.' :
      (nearwork <= 2 ? 'Low near work – low added risk.' : 'High near work – high risk.');

    const totalPoints = familyPoints + ethnicityPoints + genderPoints + refractionPoints + agePoints + outdoorPoints + nearworkPoints;

    let overallLevel, overallColor;
    if (totalPoints <= 3) { overallLevel = 'Very Low'; overallColor = 'very-low'; }
    else if (totalPoints <= 6) { overallLevel = 'Low'; overallColor = 'low'; }
    else if (totalPoints <= 9) { overallLevel = 'Moderate'; overallColor = 'moderate'; }
    else if (totalPoints <= 12) { overallLevel = 'High'; overallColor = 'high'; }
    else { overallLevel = 'Very High'; overallColor = 'very-high'; }

    const getRiskBadgeClass = (risk) => {
      const styles = {
        'very-low': 'bg-green-600',
        'low': 'bg-green-400',
        'moderate': 'bg-amber-500',
        'high': 'bg-orange-600',
        'very-high': 'bg-red-600'
      };
      return styles[risk] || 'bg-gray-400';
    };

    setResults({
      overallLevel,
      overallColor,
      totalPoints,
      getRiskBadgeClass,
      riskFactors: [
        { category: 'Age Factor', risk: ageRisk, exp: ageExp },
        { category: 'Gender', risk: genderRisk, exp: genderExp },
        { category: 'Ethnicity', risk: ethnicityRisk, exp: ethnicityExp },
        { category: 'Family History', risk: familyRisk, exp: familyExp },
        { category: 'Prescription in Myopia', risk: refractionRisk, exp: refractionExp },
        { category: 'Outdoor Time', risk: outdoorRisk, exp: `${outdoorExp} (${outdoor}h/day)` },
        { category: 'Near Work Habits', risk: nearworkRisk, exp: `${nearworkExp} (${nearwork}h/day)` }
      ]
    });
  };

  useEffect(() => {
    calculateRisk();
  }, [age, gender, ethnicity, family, refraction, outdoor, nearwork]);

  const getRiskBadgeClass = (risk) => {
    const styles = {
      'very-low': 'bg-green-600',
      'low': 'bg-green-400',
      'moderate': 'bg-amber-500',
      'high': 'bg-orange-600',
      'very-high': 'bg-red-600'
    };
    return styles[risk] || 'bg-gray-400';
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
  const referenceLinkClass = isDark
    ? 'text-blue-300 hover:text-blue-200 underline underline-offset-2'
    : 'text-blue-700 hover:text-blue-800 underline underline-offset-2';

  const containerClass = embedded ? 'w-full' : `fixed inset-0 ${bgClass} z-50 overflow-y-auto`;
  const wrapperClass = embedded ? 'w-full' : 'min-h-screen flex items-center justify-center p-4';
  const cardClass = embedded ? `w-full ${cardBgClass} rounded-2xl shadow-2xl p-8 relative` : `w-full max-w-4xl ${cardBgClass} rounded-2xl shadow-2xl p-8 relative`;
  const contentClass = embedded ? 'leading-relaxed' : 'leading-relaxed overflow-y-auto max-h-[90vh]';

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className={cardClass}>
          {/* Close Button */}
          {!embedded && onClose && (
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-200 ${isDark ? 'hover:bg-slate-700' : ''}`}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          )}

          <div className={contentClass}>

          {/* Input Section */}
          <div className={`space-y-4 mb-6 p-5 ${panelBgClass} rounded-lg`}>
            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>Child's Age</label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className={`w-full p-2 border rounded-md ${inputBgClass}`}
              >
                {Array.from({ length: 17 }, (_, i) => i + 1).map(y => (
                  <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(parseInt(e.target.value))}
                className={`w-full p-2 border rounded-md ${inputBgClass}`}
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(parseInt(e.target.value))}
                className={`w-full p-2 border rounded-md ${inputBgClass}`}
              >
                <option value="0">Caucasian</option>
                <option value="1">Malay</option>
                <option value="2">Indian</option>
                <option value="3">Chinese</option>
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>Number of Myopic Parents</label>
              <select
                value={family}
                onChange={(e) => setFamily(parseInt(e.target.value))}
                className={`w-full p-2 border rounded-md ${inputBgClass}`}
              >
                <option value="0">None</option>
                <option value="1">One parent</option>
                <option value="2">Both parents</option>
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>
                Current Prescription: <span className="text-blue-400">{refractionDisplay}</span> D
              </label>
              <input
                type="range"
                min="-6"
                max="4"
                value={refraction}
                onChange={handleRefractionChange}
                step="0.25"
                className="w-full accent-blue-500"
              />
              <p className={`text-sm italic mt-2 ${mutedTextClass}`}>Slide left for minus (myopia), right for plus. Optional – leave at default if unknown.</p>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>
                Daily Outdoor Time: <span className="text-blue-400">{outdoorDisplay}</span> hours
              </label>
              <input
                type="range"
                min="0"
                max="4"
                value={outdoor}
                onChange={handleOutdoorChange}
                step="0.5"
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${labelClass}`}>
                Daily Near Work (outside school): <span className="text-blue-400">{nearworkDisplay}</span> hours
              </label>
              <input
                type="range"
                min="0"
                max="8"
                value={nearwork}
                onChange={handleNearworkChange}
                step="0.5"
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className={`mb-6 p-5 ${panelBgClass} rounded-lg`}>
              <h2 className={`text-2xl font-bold ${textClass} mb-4`}>Your Child's Myopia Risk Assessment</h2>
              <p className={`text-lg mb-4 ${bodyTextClass}`}>
                Overall Risk Level: <span className={`font-bold px-3 py-1 rounded text-white inline-block ${getRiskBadgeClass(results.overallColor)}`}>
                  {results.overallLevel}
                </span> <span className={`ml-3 ${mutedTextClass}`}>(Score: {results.totalPoints.toFixed(1)} / 14)</span>
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Category</th>
                      <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Risk Level</th>
                      <th className={`border ${borderClass} p-2 text-left ${isDark ? 'bg-slate-600 text-gray-200' : 'bg-gray-100'}`}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.riskFactors.map((factor, idx) => (
                      <tr key={idx}>
                        <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{factor.category}</td>
                        <td className={`border ${borderClass} p-2`}>
                          <span className={`font-bold px-3 py-1 rounded text-white inline-block text-sm ${getRiskBadgeClass(factor.risk)}`}>
                            {factor.risk.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className={`border ${borderClass} p-2 ${bodyTextClass}`}>{factor.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className={`text-sm italic ${mutedTextClass}`}>Based on latest research guidelines. Consult an eye care professional for personalized advice.</p>
            </div>
          )}

          {/* What to Do Next */}
          <div className={`p-5 ${panelBgClass} rounded-lg`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-3`}>What to Do Next</h2>
            <div className={`space-y-3 ${bodyTextClass}`}>
              <p><strong>Very Low / Low risk:</strong> Minimal concern. It is encouraged to maintain ≥2 hours outdoor time daily and balanced habits. Annual eye exams recommended.</p>
              <p><strong>Moderate risk:</strong> Monitor closely. It is encouraged to increase outdoors to ≥2 hours, reduce near work to &lt;2 hours. Lifestyle changes can help prevent or slow onset.</p>
              <p><strong>High / Very High risk:</strong> Urgent action advised. It is highly encouraged to book a comprehensive eye exam to discuss myopia control options that can slow down progression.</p>
              <p>Early intervention is key to reducing long-term complications like cataracts, glaucoma or retinal issues.</p>
            </div>
          </div>

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
              <p className={`${bodyTextClass} mb-4`}>This calculator is based on peer-reviewed research on childhood myopia, categorized by risk factor.</p>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Age Factor</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/27350183/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Age of onset of myopia predicts risk of high myopia in later childhood (PubMed, 2016)</a></li>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6170055/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Childhood Myopia: Epidemiology, Risk Factors, and Prevention (PMC, 2018)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Gender</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/37729320/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global risk factor analysis of myopia onset in children (PubMed, 2023)</a></li>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11670848/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Evaluation of risk factors for childhood myopia progression (PMC, 2025)</a></li>
                    <li><a href="https://www.emro.who.int/emhj-volume-30-2024/volume-30-issue-4/systematic-review-and-meta-analysis-of-the-prevalence-of-myopia-among-school-age-children-in-the-eastern-mediterranean-region.html" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>WHO EMHJ 2024 - Myopia prevalence meta-analysis</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Ethnicity</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4941141/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global variations and time trends in childhood myopia (PMC, 2016)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/16809384/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Ethnicity-specific prevalences in Malaysia and Singapore (PubMed, 2006)</a></li>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1857458/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Ethnicity‐specific prevalences in Asian children (PMC, 2007)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Family History</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2869059/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Early Childhood Refractive Error and Parental History (IOVS, 2010)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/19737876/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Parental history of myopia as predictors (PubMed, 2010)</a></li>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4473431/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Association between parental myopia and risk in child (PMC, 2015)</a></li>
                    <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Prescription in Myopia</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6735818/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>IMI – Defining and Classifying Myopia (PMC, 2019)</a></li>
                    <li><a href="https://doi.org/10.1371/journal.pone.0167628" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Pre/Postcycloplegic Refractions in Children (PLOS ONE, 2016)</a></li>
                    <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Outdoor Time</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/22809757/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Time outdoors and myopia: systematic review (PubMed, 2012)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/28251836/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Outdoor activities and myopia control meta-analysis (PubMed, 2017)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/31330865/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Dose–Response of Outdoor Exposure and Myopia (PubMed, 2019)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${labelClass} mb-2`}>Near Work Habits</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${mutedTextClass}`}>
                    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4618477/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Near Work Activities and Myopia—Systematic Review (PMC, 2015)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/39982728/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Digital Screen Time and Myopia Meta-Analysis (PubMed, 2025)</a></li>
                    <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
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
