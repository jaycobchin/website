'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function VisionSimulatorPage() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      name: 'Glaucoma', 
      desc: 'Loss of peripheral (side) vision' 
    },
    macular: { 
      name: 'Macular Degeneration', 
      desc: 'Loss of central vision while peripheral vision remains' 
    }
  };

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
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDark ? 'text-gray-200' : 'text-gray-700';
  const referenceLinkClass = isDark
    ? 'text-blue-300 hover:text-blue-200 underline underline-offset-2'
    : 'text-blue-700 hover:text-blue-800 underline underline-offset-2';


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

  const applyPresbyopia = (ctx, canvas, severity) => {
    if (severity <= 0) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    
    // Draw blurred image to temp canvas
    tCtx.filter = `blur(${severity / 6.5}px)`;
    tCtx.drawImage(canvas, 0, 0);
    tCtx.filter = 'none';
    
    // Apply gradient mask to temp (keep blurred part at bottom)
    tCtx.globalCompositeOperation = 'destination-in';
    const maskGradient = tCtx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
    maskGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    maskGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    tCtx.fillStyle = maskGradient;
    tCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw masked blurred image over original
    ctx.drawImage(tempCanvas, 0, 0);
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
    const visR = Math.max(1, maxR * (1 - severity / 100));
    const edgeR = visR + Math.max(50, maxR * 0.15);
    
    const grad = ctx.createRadialGradient(centerX, centerY, visR * 0.6, centerX, centerY, edgeR);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.4, `rgba(0,0,0,${Math.min(0.85, severity / 80)})`);
    grad.addColorStop(1, 'rgba(0,0,0,1)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (severity > 30) {
      ctx.filter = `blur(${severity / 20}px)`;
      ctx.globalCompositeOperation = 'multiply';
      const blurEdge = Math.max(visR, 1);
      const grad2 = ctx.createRadialGradient(centerX, centerY, blurEdge, centerX, centerY, maxR);
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
    const blurR = 200 * (severity / 100);
    const opacity = Math.min(0.95, severity / 100);
    
    if (severity > 20) {
      ctx.filter = `blur(${severity / 8}px)`;
      const temp = document.createElement('canvas');
      temp.width = canvas.width;
      temp.height = canvas.height;
      const tCtx = temp.getContext('2d');
      tCtx.drawImage(canvas, 0, 0);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, blurR * 1.2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(temp, 0, 0);
      ctx.restore();
      ctx.filter = 'none';
    }
    
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, blurR * 1.5);
    grad.addColorStop(0, `rgba(150,150,150,${opacity * 0.9})`);
    grad.addColorStop(0.6, `rgba(180,180,180,${opacity * 0.5})`);
    grad.addColorStop(1, 'rgba(200,200,200,0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (severity > 50) {
      const darkGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, blurR * 0.4);
      darkGrad.addColorStop(0, `rgba(100,100,100,${(severity - 50) / 80})`);
      darkGrad.addColorStop(1, 'rgba(100,100,100,0)');
      ctx.fillStyle = darkGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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

      const blurConditions = new Set(['myopia', 'hyperopia']);
      if (blurConditions.has(condition)) {
        ctx.drawImage(img, 0, 0, 800, 600);
        return;
      }

      ctx.drawImage(img, 0, 0, 800, 600);

      if (condition === 'presbyopia') {
        applyPresbyopia(ctx, canvas, severity);
      } else if (condition === 'astigmatism') {
        applyAstigmatism(ctx, canvas, severity);
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
      img.src = '/philosophy_himalaya_scenery.jpeg';
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

  const blurRadius =
    condition === 'myopia'
      ? severity / 8
      : condition === 'hyperopia'
      ? severity / 10
      : 0;

  useEffect(() => {
    loadAndApply();
  }, [condition, severity, imageSource, uploadedImage]);

  const getConditionDescription = (condition) => {
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
  };

  return (
    <main className={`min-h-screen ${textClass} relative overflow-hidden`}>
      {/* Animated gradient background */}
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
            Vision Simulator
          </h1>
          <p className={`text-xl md:text-2xl font-medium ${isDark ? 'text-teal-400' : 'text-teal-600'} mb-6`}>
            Experience different vision conditions
          </p>
          <p className={`text-lg ${mutedTextClass} max-w-3xl`}>
            Visualize how various eye conditions affect sight in real-time. Upload your own image or use our sample to see the world through different perspectives.
          </p>
        </div>

        {/* Tool */}
        <div className="space-y-8">
          <div className={`${cardBgClass} rounded-2xl shadow-2xl p-4 md:p-8`}>
            {/* Main Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Controls */}
              <div className="space-y-6">
                {/* Vision Condition */}
                <div>
                  <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${labelClass}`}>Vision Condition</label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={handleConditionChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none ${inputBgClass}`}
                    >
                      {Object.entries(conditions).map(([key, val]) => (
                        <option key={key} value={key}>{val.name}</option>
                      ))}
                    </select>
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <p className={`text-xs md:text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {conditions[condition].desc}
                  </p>
                </div>

                {/* Severity Slider */}
                {condition !== 'normal' && (
                  <div>
                    <label className={`block text-xs md:text-sm font-bold uppercase tracking-wider mb-2 ${labelClass}`}>
                      Severity: <span className="text-blue-400">{severity}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={severity}
                      onChange={handleSeverityChange}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                    />
                    <div className={`flex justify-between text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className={`flex-1 p-3 rounded-lg transition font-medium border shadow-sm active:scale-95 ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-gray-200'
                        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className={`rounded-xl p-2 md:p-4 flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <canvas
                  ref={canvasRef}
                  className="rounded-lg shadow-lg max-w-full"
                  width={800}
                  height={600}
                  style={{ filter: blurRadius > 0 ? `blur(${blurRadius}px)` : 'none' }}
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

            {/* Toggle for references */}
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

            {/* References Section */}
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
                      <li><a href="https://bjo.bmj.com/content/109/3/362" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global prevalence and projection of myopia (British Journal of Ophthalmology, 2025)</a></li>
                      <li><a href="https://pubmed.ncbi.nlm.nih.gov/37729320/" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global risk factor analysis of myopia onset in children (PubMed, 2023)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Astigmatism</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://journals.lww.com/optvissci/fulltext/2023/03000/epidemiology_and_burden_of_astigmatism__a.7.aspx" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Epidemiology and burden of astigmatism (Optometry and Vision Science, 2023)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Presbyopia</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://doi.org/10.1016/j.ophtha.2018.04.013" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global prevalence of presbyopia (Ophthalmology, 2018)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Cataract</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://www.nature.com/articles/s41433-020-0806-3" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global prevalence of age-related cataract (Eye, 2020)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Glaucoma</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://www.sciencedirect.com/science/article/pii/S0161642014004333" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global prevalence of glaucoma (Ophthalmology, 2014)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Age-Related Macular Degeneration</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(13)70145-1/fulltext" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>Global prevalence of macular degeneration (The Lancet Global Health, 2014)</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>General Resources</h3>
                    <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li><a href="https://www.who.int/publications/i/item/9789241516570" target="_blank" rel="noopener noreferrer" className={referenceLinkClass}>World Health Organization - World Report on Vision (2019)</a></li>
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
