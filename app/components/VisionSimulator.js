'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Eye } from 'lucide-react';

export default function VisionSimulator({ isDark = true, onClose }) {
  const [condition, setCondition] = useState('normal');
  const [severity, setSeverity] = useState(50);
  const [imageSource, setImageSource] = useState('sample');
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showReferences, setShowReferences] = useState(false);

  const conditions = {
    normal: { 
      name: 'Normal Vision', 
      desc: 'Clear, focused vision' 
    },
    myopia: { 
      name: 'Myopia (Nearsightedness)', 
      desc: 'Difficulty seeing distant objects clearly' 
    },
    hyperopia: { 
      name: 'Hyperopia (Farsightedness)', 
      desc: 'Difficulty seeing close objects clearly' 
    },
    astigmatism: { 
      name: 'Astigmatism', 
      desc: 'Blurred or distorted vision at all distances' 
    },
    presbyopia: { 
      name: 'Presbyopia', 
      desc: 'Age-related difficulty focusing on close objects' 
    },
    cataract: { 
      name: 'Cataract', 
      desc: 'Cloudy or foggy vision with reduced contrast' 
    },
    glaucoma: { 
      name: 'Glaucoma (Tunnel Vision)', 
      desc: 'Loss of peripheral (side) vision' 
    },
    macular: { 
      name: 'Macular Degeneration', 
      desc: 'Loss of central vision while peripheral vision remains' 
    }
  };

  const generateSampleImage = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800;
    tempCanvas.height = 600;
    const tCtx = tempCanvas.getContext('2d');
    
    const gradient = tCtx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#4158D0');
    gradient.addColorStop(0.46, '#C850C0');
    gradient.addColorStop(1, '#FFCC70');
    tCtx.fillStyle = gradient;
    tCtx.fillRect(0, 0, 800, 600);
    
    tCtx.fillStyle = 'white';
    tCtx.font = 'bold 60px Arial';
    tCtx.textAlign = 'center';
    tCtx.fillText('VISION TEST', 400, 150);
    
    tCtx.font = '40px Arial';
    tCtx.fillText('Can you read this?', 400, 250);
    
    tCtx.font = '30px Arial';
    tCtx.fillText('How about this text?', 400, 320);
    
    tCtx.font = '20px Arial';
    tCtx.fillText('And this smaller text?', 400, 370);
    
    tCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 5; i++) {
      tCtx.beginPath();
      tCtx.arc(150 + i * 130, 480, 30, 0, Math.PI * 2);
      tCtx.fill();
    }
    
    return tempCanvas.toDataURL();
  };

  const applyBlur = (ctx, canvas, radius) => {
    if (radius > 0) {
      ctx.filter = `blur(${radius}px)`;
      const temp = document.createElement('canvas');
      temp.width = canvas.width;
      temp.height = canvas.height;
      const tCtx = temp.getContext('2d');
      tCtx.drawImage(canvas, 0, 0);
      ctx.drawImage(temp, 0, 0);
      ctx.filter = 'none';
    }
  };

  const applyAstigmatism = (ctx, canvas, severity) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    
    ctx.filter = `blur(${severity / 15}px)`;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1 + severity / 500, 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
    ctx.filter = 'none';
  };

  const applyCataract = (ctx, canvas, severity) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = severity / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * (1 - factor) + avg * factor + factor * 40;
      data[i + 1] = data[i + 1] * (1 - factor) + avg * factor + factor * 30;
      data[i + 2] = data[i + 2] * (1 - factor) + avg * factor + factor * 20;
    }
    ctx.putImageData(imageData, 0, 0);
    
    if (severity > 20) {
      ctx.filter = `blur(${severity / 20}px)`;
      const temp = document.createElement('canvas');
      temp.width = canvas.width;
      temp.height = canvas.height;
      const tCtx = temp.getContext('2d');
      tCtx.drawImage(canvas, 0, 0);
      ctx.drawImage(temp, 0, 0);
      ctx.filter = 'none';
    }
  };

  const applyGlaucoma = (ctx, canvas, severity) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxR = Math.max(canvas.width, canvas.height);
    // Make tunnel vision more aggressive - shrinks faster and becomes darker
    const visR = maxR * (1 - severity / 100);
    
    const grad = ctx.createRadialGradient(centerX, centerY, visR * 0.8, centerX, centerY, visR * 1.2);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, `rgba(0,0,0,${Math.min(0.7, severity / 100)})`);
    grad.addColorStop(1, 'rgba(0,0,0,1)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add peripheral blur for more realistic effect
    if (severity > 30) {
      ctx.filter = `blur(${severity / 20}px)`;
      ctx.globalCompositeOperation = 'multiply';
      const grad2 = ctx.createRadialGradient(centerX, centerY, visR, centerX, centerY, maxR);
      grad2.addColorStop(0, 'rgba(255,255,255,1)');
      grad2.addColorStop(0.6, 'rgba(128,128,128,1)');
      grad2.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const applyMacular = (ctx, canvas, severity) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const blurR = 150 * (severity / 100);
    
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, blurR);
    grad.addColorStop(0, 'rgba(200,200,200,0.8)');
    grad.addColorStop(1, 'rgba(200,200,200,0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const loadAndApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 800;
      canvas.height = 600;
      ctx.clearRect(0, 0, 800, 600);
      ctx.drawImage(img, 0, 0, 800, 600);

      if (condition === 'myopia') {
        applyBlur(ctx, canvas, severity / 10);
      } else if (condition === 'hyperopia') {
        applyBlur(ctx, canvas, severity / 12);
      } else if (condition === 'astigmatism') {
        applyAstigmatism(ctx, canvas, severity);
      } else if (condition === 'presbyopia') {
        applyBlur(ctx, canvas, severity / 15);
      } else if (condition === 'cataract') {
        applyCataract(ctx, canvas, severity);
      } else if (condition === 'glaucoma') {
        applyGlaucoma(ctx, canvas, severity);
      } else if (condition === 'macular') {
        applyMacular(ctx, canvas, severity);
      }
    };

    if (imageSource === 'upload' && uploadedImage) {
      img.src = uploadedImage;
    } else {
      img.src = generateSampleImage();
    }
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleSeverityChange = (e) => {
    setSeverity(parseInt(e.target.value));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        setImageSource('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleImage = () => {
    setImageSource('sample');
    setUploadedImage(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `vision-${condition}-${severity}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleReset = () => {
    setCondition('normal');
    setSeverity(50);
    setImageSource('sample');
    setUploadedImage(null);
  };

  const bgClass = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDark ? 'text-gray-200' : 'text-gray-700';

  // Apply effect on mount and when condition/severity changes
  useEffect(() => {
    loadAndApply();
  }, [condition, severity, imageSource, uploadedImage]);

  return (
    <div className={`fixed inset-0 ${bgClass} z-50 overflow-y-auto`}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-6xl ${cardBgClass} rounded-2xl shadow-2xl p-8 relative`}>
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
            <Eye size={32} className="text-blue-500" />
            <div>
              <h1 className={`text-3xl font-bold ${textClass}`}>Vision Simulator</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience different vision conditions in real-time</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Controls */}
            <div className="space-y-6">
              {/* Vision Condition */}
              <div>
                <label className={`block text-sm font-semibold ${labelClass} mb-3`}>Vision Condition</label>
                <select
                  value={condition}
                  onChange={handleConditionChange}
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${inputBgClass}`}
                >
                  {Object.entries(conditions).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {conditions[condition].desc}
                </p>
              </div>

              {/* Severity Slider */}
              {condition !== 'normal' && (
                <div>
                  <label className={`block text-sm font-semibold ${labelClass} mb-3`}>
                    Severity: <span className="text-blue-400">{severity}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={severity}
                    onChange={handleSeverityChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              )}

              {/* Image Source Buttons */}
              <div>
                <label className={`block text-sm font-semibold ${labelClass} mb-3`}>Image Source</label>
                <div className="flex gap-3">
                  <button
                    onClick={handleSampleImage}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      imageSource === 'sample'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDark
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Sample Image
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      isDark
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className={`flex-1 p-3 rounded-lg transition font-medium ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className={`rounded-xl p-4 flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-lg max-w-full"
                width={800}
                height={600}
              />
            </div>
          </div>

          {/* About Vision Conditions */}
          <div className={`p-6 ${isDark ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg mb-6`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>About {conditions[condition].name}</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {getConditionDescription(condition)}
            </p>
          </div>

          {/* Disclaimer */}
          <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Note: This simulator is for educational purposes only and does not replace professional eye examinations. Consult an eye care professional for diagnosis and treatment.
          </p>

          {/* Toggle for references (hidden by default) */}
          <div className="flex items-center justify-between mb-4 border-t pt-4">
            <button
              onClick={() => setShowReferences(!showReferences)}
              className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              aria-expanded={showReferences}
            >
              <span>References</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showReferences ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* References Section (collapsible) */}
          {showReferences && (
            <div className={`p-6 ${isDark ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold ${textClass} mb-4`}>References</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                This vision simulator is based on peer-reviewed research on refractive errors and eye conditions.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Myopia and Refractive Errors</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://bjo.bmj.com/content/109/3/362" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global prevalence and projection of myopia (British Journal of Ophthalmology, 2025)</a></li>
                    <li><a href="https://pubmed.ncbi.nlm.nih.gov/37729320/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global risk factor analysis of myopia onset in children (PubMed, 2023)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Astigmatism</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://journals.lww.com/optvissci/fulltext/2023/03000/epidemiology_and_burden_of_astigmatism__a.7.aspx" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Epidemiology and burden of astigmatism (Optometry and Vision Science, 2023)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Presbyopia</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://doi.org/10.1016/j.ophtha.2018.04.013" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global prevalence of presbyopia (Ophthalmology, 2018)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Cataract</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://www.nature.com/articles/s41433-020-0806-3" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global prevalence of age-related cataract (Eye, 2020)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Glaucoma</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://www.sciencedirect.com/science/article/pii/S0161642014004333" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global prevalence of glaucoma (Ophthalmology, 2014)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Age-Related Macular Degeneration</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(13)70145-1/fulltext" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Global prevalence of macular degeneration (The Lancet Global Health, 2014)</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>General Resources</h3>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><a href="https://www.who.int/publications/i/item/9789241516570" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">World Health Organization - World Report on Vision (2019)</a></li>
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

function getConditionDescription(condition) {
  const descriptions = {
    normal: "In normal vision, light rays focus precisely on the retina, allowing for clear vision at all distances. The cornea and lens work together to bend (refract) light rays so they fall exactly on the retina.",
    myopia: "Myopia occurs when the eyeball is too long or the cornea has too much curvature. This causes light rays to focus in front of the retina, resulting in blurred distance vision. Near vision typically remains clear. Myopia usually develops during childhood and can progress through the teen years.",
    hyperopia: "Hyperopia occurs when the eyeball is too short or the cornea has too little curvature. Light focuses behind the retina, making near objects blurry. In mild cases, the eye's lens can compensate, but distance vision may still be affected in severe cases.",
    astigmatism: "Astigmatism results from an irregular curvature of the cornea or lens—more like a football shape than a sphere. This causes light to focus at multiple points instead of one, leading to blurred or distorted vision at all distances. It often causes eyestrain and headaches.",
    presbyopia: "Presbyopia is an age-related condition where the eye's lens gradually loses flexibility. This makes it increasingly difficult to focus on close objects, typically becoming noticeable around age 40–45. Symptoms include difficulty reading small print and needing more light for near tasks.",
    cataract: "A cataract is a clouding of the eye's natural lens, which scatters light entering the eye. This causes foggy, hazy, or dim vision. Other symptoms include increased glare (especially at night), faded colors, and frequent changes in glasses prescription.",
    glaucoma: "Glaucoma is a group of eye diseases that damage the optic nerve, most often due to elevated eye pressure. It typically causes gradual loss of peripheral (side) vision, creating a 'tunnel vision' effect in advanced stages. Early detection is crucial as damage is often irreversible.",
    macular: "Age-related macular degeneration (AMD) affects the macula, the central part of the retina responsible for sharp, detailed vision. It leads to progressive loss of central vision while peripheral vision usually remains intact. This can make reading and recognizing faces difficult."
  };
  return descriptions[condition] || "";
}
