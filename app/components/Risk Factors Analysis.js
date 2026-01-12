'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function RiskFactorsAnalysis({ isDark = true, onClose }) {
  const [age, setAge] = useState(8);
  const [gender, setGender] = useState(0);
  const [ethnicity, setEthnicity] = useState(3);
  const [family, setFamily] = useState(0);
  const [refraction, setRefraction] = useState(0.5);
  const [outdoor, setOutdoor] = useState(1.5);
  const [nearwork, setNearwork] = useState(3);
  const [results, setResults] = useState(null);

  const refractionThresholds = {
    1: 2.0, 2: 1.75, 3: 1.5, 4: 1.25, 5: 1.0,
    6: 0.75, 7: 0.5, 8: 0.5, 9: 0.25, 10: 0.25,
    11: 0, 12: 0, 13: -0.25, 14: -0.5, 15: -0.75, 16: -1.0, 17: -1.25
  };

  const ethnicityTexts = ['Caucasian', 'Malay', 'Indian', 'Chinese'];

  const getRiskBadge = (riskLevel) => {
    const riskStyles = {
      'very-low': 'bg-green-600',
      'low': 'bg-green-400',
      'moderate': 'bg-amber-500',
      'high': 'bg-orange-600',
      'very-high': 'bg-red-600'
    };
    return riskStyles[riskLevel] || 'bg-gray-400';
  };

  const calculateRisk = () => {
    const threshold = refractionThresholds[age] || 0;

    // Family History
    const familyPoints = family;
    const familyRisk = family === 0 ? 'very-low' : (family === 1 ? 'moderate' : 'very-high');
    const familyExp = family === 0 ? 'No myopic parents – very low genetic risk.' :
      (family === 1 ? 'One myopic parent – moderate risk (2–3× higher).' : 'Both parents myopic – very high risk (5–6× higher).');

    // Ethnicity
    const ethnicityPoints = ethnicity * 0.67;
    const ethnicityRisk = ethnicity === 0 ? 'very-low' : (ethnicity === 1 ? 'low' : (ethnicity === 2 ? 'moderate' : 'very-high'));
    const ethnicityExp = ethnicityTexts[ethnicity] + ' ethnicity – ' + (ethnicity === 0 ? 'lowest baseline risk.' : (ethnicity === 3 ? 'highest baseline risk (East Asian).' : 'intermediate risk.'));

    // Gender
    const genderPoints = gender;
    const genderRisk = gender === 0 ? 'very-low' : 'moderate';
    const genderExp = gender === 0 ? 'Male – slightly lower risk based on research.' : 'Female – moderately higher risk (RR ~1.28).';

    // Refraction
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

    // Age
    const agePoints = age <= 7 ? 2 : (age <= 10 ? 1.5 : (age <= 13 ? 1 : 0.5));
    const ageRisk = agePoints === 2 ? 'very-high' : (agePoints === 1.5 ? 'high' : (agePoints === 1 ? 'moderate' : 'low'));
    const ageExp = age <= 7 ? 'Very young age – very high potential for early onset/fast progression.' :
      (age <= 10 ? 'Young school age – high risk period.' : (age <= 13 ? 'School age – moderate risk.' : 'Older teen – lower new onset risk.'));

    // Outdoor
    const outdoorPoints = outdoor >= 2.5 ? 0 : (outdoor >= 2 ? 0.5 : (outdoor >= 1 ? 1 : (outdoor >= 0.5 ? 1.5 : 2)));
    const outdoorRisk = outdoorPoints === 0 ? 'very-low' : (outdoorPoints === 0.5 ? 'low' : (outdoorPoints === 1 ? 'moderate' : (outdoorPoints === 1.5 ? 'high' : 'very-high')));
    const outdoorExp = outdoor >= 2.5 ? 'Excellent outdoor time – strongly protective.' :
      (outdoor >= 2 ? 'Good outdoor time – low risk.' : 'Limited outdoors – higher risk.');

    // Nearwork
    const nearworkPoints = nearwork <= 1 ? 0 : (nearwork <= 2 ? 0.5 : (nearwork <= 3 ? 1 : (nearwork <= 4 ? 1.5 : 2)));
    const nearworkRisk = nearworkPoints === 0 ? 'very-low' : (nearworkPoints === 0.5 ? 'low' : (nearworkPoints === 1 ? 'moderate' : (nearworkPoints === 1.5 ? 'high' : 'very-high')));
    const nearworkExp = nearwork <= 1 ? 'Very low near work – strongly protective.' :
      (nearwork <= 2 ? 'Low near work – low added risk.' : 'High near work – high risk.');

    const totalPoints = familyPoints + ethnicityPoints + genderPoints + refractionPoints + agePoints + outdoorPoints + nearworkPoints;

    let overallLevel, overallColor;
    if (totalPoints <= 3) { overallLevel = 'Very Low'; overallColor = 'very-low'; }
    else if (totalPoints <= 6) { overallLevel = 'Low'; overallColor = 'low'; }
    else if (totalPoints <= 9) { overallLevel = 'Moderate'; overallColor = 'moderate'; }
    else if (totalPoints <= 12) { overallLevel = 'High'; overallColor = 'high'; }
    else { overallLevel = 'Very High'; overallColor = 'very-high'; }

    setResults({
      overallLevel,
      overallColor,
      totalPoints,
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold text-slate-800">Profile your Kid's Myopia</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 leading-relaxed text-gray-800 overflow-y-auto max-h-[90vh]">
          <div className="grid gap-5">
        {/* Input Section */}
        <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Profile your Kid's Myopia</h2>
          <p className="text-gray-700 mb-5">Assess myopia risk with easy-to-use inputs for clearer insights using latest research.</p>

          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">Child's Age</label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md font-base bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(y => (
                  <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md font-base bg-white"
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>

            {/* Ethnicity */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md font-base bg-white"
              >
                <option value="0">Caucasian</option>
                <option value="1">Malay</option>
                <option value="2">Indian</option>
                <option value="3">Chinese</option>
              </select>
            </div>

            {/* Family History */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">Number of Myopic Parents</label>
              <select
                value={family}
                onChange={(e) => setFamily(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md font-base bg-white"
              >
                <option value="0">None</option>
                <option value="1">One parent</option>
                <option value="2">Both parents</option>
              </select>
            </div>

            {/* Refraction */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">
                Current Prescription of Your Child (spherical equivalent): <span className="text-blue-600">{refraction >= 0 ? '+' : ''}{refraction.toFixed(2)}</span> D
              </label>
              <input
                type="range"
                min="-6"
                max="4"
                value={refraction}
                onChange={(e) => setRefraction(parseFloat(e.target.value))}
                step="0.25"
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm italic text-gray-600 mt-2">Slide left for minus (myopia), right for plus. Optional – leave at default if unknown.</p>
            </div>

            {/* Outdoor Time */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">
                Daily Outdoor Time: <span className="text-blue-600">{outdoor.toFixed(1)}</span> hours
              </label>
              <input
                type="range"
                min="0"
                max="4"
                value={outdoor}
                onChange={(e) => setOutdoor(parseFloat(e.target.value))}
                step="0.5"
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Near Work */}
            <div>
              <label className="block font-bold mb-2 text-slate-700">
                Daily Near Work (outside school): <span className="text-blue-600">{nearwork.toFixed(1)}</span> hours
              </label>
              <input
                type="range"
                min="0"
                max="8"
                value={nearwork}
                onChange={(e) => setNearwork(parseFloat(e.target.value))}
                step="0.5"
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateRisk}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer text-base transition-colors"
            >
              Calculate Risk
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Child's Myopia Risk Assessment</h2>
            <p className="text-lg mb-4">
              Overall Risk Level: <span className={`font-bold px-3 py-1 rounded text-white inline-block min-w-24 text-center ${getRiskBadge(results.overallColor)}`}>
                {results.overallLevel}
              </span> <span className="ml-3 text-gray-700">(Score: {results.totalPoints.toFixed(1)} / 14)</span>
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Category</th>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Risk Level</th>
                    <th className="border border-gray-300 p-2 text-left bg-gray-100">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {results.riskFactors.map((factor, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2">{factor.category}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`font-bold px-3 py-1 rounded text-white inline-block text-sm ${getRiskBadge(factor.risk)}`}>
                          {factor.risk.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">{factor.exp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm italic text-gray-600">Based on latest research guidelines. Consult an eye care professional for personalized advice.</p>
          </div>
        )}

        {/* What to Do Next */}
        <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">What to Do Next</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Very Low / Low risk:</strong> Minimal concern. It is encouraged to maintain ≥2 hours outdoor time daily and balanced habits. Annual eye exams recommended.</p>
            <p><strong>Moderate risk:</strong> Monitor closely. It is encouraged to increase outdoors to ≥2 hours, reduce near work to &lt;2 hours. Lifestyle changes can help prevent or slow onset.</p>
            <p><strong>High / Very High risk:</strong> Urgent action advised. It is highly encouraged to book a comprehensive eye exam to discuss myopia control options that can slow down progression.</p>
            <p>Early intervention is key to reducing long-term complications like cataracts, glaucoma or retinal issues.</p>
          </div>
        </div>

        {/* References */}
        <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">References</h2>
          <p className="text-gray-700 mb-4">This calculator is based on peer-reviewed research on childhood myopia, categorized by risk factor.</p>

          <h3 className="text-xl font-semibold mb-2">Age Factor</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/27350183/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Age of onset of myopia predicts risk of high myopia in later childhood (PubMed, 2016)</a></li>
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6170055/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Childhood Myopia: Epidemiology, Risk Factors, and Prevention (PMC, 2018)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Gender</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/37729320/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Global risk factor analysis of myopia onset in children: A systematic review and meta-analysis (PubMed, 2023)</a></li>
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11670848/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Evaluation of risk factors for childhood myopia progression (PMC, 2025)</a></li>
            <li><a href="https://www.emro.who.int/emhj-volume-30-2024/volume-30-issue-4/systematic-review-and-meta-analysis-of-the-prevalence-of-myopia-among-school-age-children-in-the-eastern-mediterranean-region.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Systematic review and meta-analysis of the prevalence of myopia among school-age children in the Eastern Mediterranean Region (WHO EMHJ, 2024)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Ethnicity</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4941141/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Global variations and time trends in the prevalence of childhood myopia (PMC, 2016)</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/16809384/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ethnicity-specific prevalences of refractive errors vary in Asian children in neighbouring Malaysia and Singapore (PubMed, 2006)</a></li>
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1857458/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ethnicity‐specific prevalences of refractive errors vary in Asian children (PMC, 2007)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Family History</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2869059/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Early Childhood Refractive Error and Parental History of Myopia as Predictors of Myopia (IOVS, 2010)</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/19737876/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Early childhood refractive error and parental history of myopia as predictors of myopia (PubMed, 2010)</a></li>
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4473431/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Association between parental myopia and the risk of myopia in a child (PMC, 2015)</a></li>
            <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Prescription in Myopia</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6735818/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">IMI – Defining and Classifying Myopia (PMC, 2019)</a></li>
            <li><a href="https://doi.org/10.1371/journal.pone.0167628" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pre- and Postcycloplegic Refractions in Children and Adolescents (PLOS ONE, 2016)</a></li>
            <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Outdoor Time</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/22809757/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">The association between time spent outdoors and myopia in children and adolescents: a systematic review and meta-analysis (PubMed, 2012)</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/28251836/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Time spent in outdoor activities in relation to myopia prevention and control: a meta-analysis and systematic review (PubMed, 2017)</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/31330865/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Dose–Response Relationship of Outdoor Exposure and Myopia Indicators (PubMed, 2019)</a></li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Near Work Habits</h3>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4618477/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">The Association between Near Work Activities and Myopia in Children—A Systematic Review and Meta-Analysis (PMC, 2015)</a></li>
            <li><a href="https://pubmed.ncbi.nlm.nih.gov/39982728/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Digital Screen Time and Myopia: A Systematic Review and Dose-Response Meta-Analysis (PubMed, 2025)</a></li>
            <li><a href="https://iovs.arvojournals.org/article.aspx?articleid=2772539" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">IMI Risk Factors for Myopia (IOVS, 2021)</a></li>
          </ul>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
