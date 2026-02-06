'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function CommunityEngagementPage() {
  const [isDark, setIsDark] = useState(true); // Dark theme by default
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const thumbnailRefs = useRef([]);

  const minSwipeDistance = 50;
  
  const handlePrev = () => {
    const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setTimeout(() => thumbnailRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
  };
  
  const handleNext = () => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setTimeout(() => thumbnailRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
  };
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const galleryImages = [
    { url: '/Community Engagement/Volunteer - Humanitarian with Love (Cambodia)/Humanitarian with Love & Khmer Sight Foundation 2023 - 1.JPG', caption: 'Humanitarian with Love & Khmer Sight Foundation 2023 - 1' },
    { url: '/Community Engagement/Volunteer - Humanitarian with Love (Cambodia)/Humanitarian with Love & Khmer Sight Foundation 2023 - 2.JPG', caption: 'Humanitarian with Love & Khmer Sight Foundation 2023 - 2' },
    { url: '/Community Engagement/Volunteer - Humanitarian with Love (Cambodia)/Humanitarian with Love & Khmer Sight Foundation 2019 (Dr Sean and Dr Huot).JPG', caption: 'Humanitarian with Love & Khmer Sight Foundation 2019' },
    { url: '/Community Engagement/Volunteer - Humanitarian with Love (Cambodia)/Humanitarian with Love & Khmer Sight Foundation 2019 - 1.JPG', caption: 'Humanitarian with Love & Khmer Sight Foundation 2019 - 1' },
    { url: '/Community Engagement/Volunteer - Humanitarian with Love (Cambodia)/Humanitarian with Love & Khmer Sight Foundation 2019 - 2.JPG', caption: 'Humanitarian with Love & Khmer Sight Foundation 2019 - 2' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Myanmar 2019 - 1.JPG', caption: 'Gift of Sight Myanmar 2019 - 1' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Myanmar 2019 - 2.JPG', caption: 'Gift of Sight Myanmar 2019 - 2' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 1.JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - 1' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 2.JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - 2' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 3.JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - 3' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 4.JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - 4' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 5 (Optometrist Team).JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - Optometrist Team' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar 2018 - 7.JPG', caption: 'Gift of Sight Pa-Auk Myanmar 2018 - 7' },
    { url: '/Community Engagement/Volunteer - Gift of Sight by Lions Club Singapore/Gift of Sight Pa-Auk Myanmar - 6.JPG', caption: 'Gift of Sight Pa-Auk Myanmar' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 1.jpeg', caption: 'World Sight Day 2019 - 1' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 2.jpeg', caption: 'World Sight Day 2019 - 2' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 3.jpeg', caption: 'World Sight Day 2019 - 3' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 4.jpeg', caption: 'World Sight Day 2019 - 4' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 5.jpeg', caption: 'World Sight Day 2019 - 5' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 6.jpeg', caption: 'World Sight Day 2019 - 6' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 7.jpeg', caption: 'World Sight Day 2019 - 7' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 8.jpeg', caption: 'World Sight Day 2019 - 8' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 9.jpeg', caption: 'World Sight Day 2019 - 9' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2019 - 10.jpeg', caption: 'World Sight Day 2019 - 10' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 1.jpeg', caption: 'World Sight Day 2018 - 1' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 2.jpeg', caption: 'World Sight Day 2018 - 2' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 3.jpeg', caption: 'World Sight Day 2018 - 3' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 4.jpeg', caption: 'World Sight Day 2018 - 4' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 5.jpeg', caption: 'World Sight Day 2018 - 5' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 6.jpeg', caption: 'World Sight Day 2018 - 6' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 7.jpeg', caption: 'World Sight Day 2018 - 7' },
    { url: '/Community Engagement/Volunteer - OGS Photos/WSD 2018 - 8.jpeg', caption: 'World Sight Day 2018 - 8' }
  ];

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

  const toggleTheme = () => setIsDark(!isDark);

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const accentHeaderDotClass = isDark ? 'text-blue-400' : 'text-blue-600';

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

      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/80 border-white/10' 
          : 'bg-white/80 border-gray-200/50 shadow-sm'
        } backdrop-blur-xl border-b ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className={`text-2xl font-bold tracking-tight relative z-10 transition-colors ${
            isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
          }`}>
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
            {menuOpen ? <X /> : <Menu />}
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
              <a href="/#philosophy" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Approach</a>
              <a href="/#work-experience" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Work</a>
              <a href="/#work" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Tools</a>
              <a href="/#write" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Write</a>
              <a href="/#contact" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Contact</a>
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Community Engagement
          </h1>
          <p className={`text-xl md:text-2xl font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-6`}>
            Advocating for accessible vision care
          </p>
          <p className={`text-lg ${textMutedClass} max-w-3xl`}>
            Passionate about ensuring everyone has access to quality eye care through community education programs and vision health awareness initiatives.
          </p>
        </div>

        {/* Main Content */}
        <div className={`${isDark ? 'bg-slate-900/60 shadow-2xl' : 'bg-white border border-slate-200/80 shadow-lg'} backdrop-blur-xl rounded-3xl p-6 md:p-12 space-y-8`}>
          <p className="text-base">
            I have taken part in volunteer work both locally and overseas.
          </p>
          <p className="text-base">
            I worked with <a href="https://givingsight.org/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-600'}`} target="_blank" rel="noreferrer">Optometry Giving Sight (OGS)</a> locally to organize full eye checks and provide free spectacles to needy families in Singapore.
          </p>
          <p className="text-base">
            Overseas, I joined <a href="https://lionsclubs.org.sg/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-600'}`} target="_blank" rel="noreferrer">Lions Club Singapore</a> for eye screening programs in Myanmar, and also worked with <a href="https://www.facebook.com/humanitarianwithlove/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-600'}`} target="_blank" rel="noreferrer">Humanitarian with Love</a> and <a href="https://www.facebook.com/CISACAMBODIA/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-600'}`} target="_blank" rel="noreferrer">Khmer Sight Foundation</a> to do eye screenings in Cambodia. Those patients in need will be referred for further treatment if necessary. The foundation in Cambodia keeps reaching out to rural areas so people there can get help in time.
          </p>

          {/* Photo Gallery */}
          <div className="mt-12">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Photo Gallery</h2>

            <div className={`relative ${isDark ? 'bg-slate-800/50' : 'bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 shadow-md'} p-4 md:p-12 rounded-2xl`}>
              {/* Main Image */}
              <div 
                className="relative w-full mb-6 px-0 md:px-16 touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="w-full h-[300px] md:h-96 flex items-center justify-center bg-black/5 rounded-lg">
                  <img
                    src={galleryImages[currentImageIndex].url}
                    alt={galleryImages[currentImageIndex].caption}
                    className={`max-w-full max-h-full object-contain rounded-lg shadow-lg ${isDark ? 'ring-1 ring-white/10' : 'ring-1 ring-slate-200/80'}`}
                  />
                </div>

                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full transition-colors shadow-lg z-10 ${
                    isDark 
                      ? 'bg-blue-500/80 hover:bg-blue-600 text-white backdrop-blur-sm' 
                      : 'bg-white/80 text-blue-700 border border-slate-200 hover:bg-blue-50 backdrop-blur-sm'
                  }`}
                >
                  <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full transition-colors shadow-lg z-10 ${
                    isDark 
                      ? 'bg-blue-500/80 hover:bg-blue-600 text-white backdrop-blur-sm' 
                      : 'bg-white/80 text-blue-700 border border-slate-200 hover:bg-blue-50 backdrop-blur-sm'
                  }`}
                >
                  <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Caption */}
              <p className={`text-center text-xs italic mb-6 px-2 md:px-4 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                {galleryImages[currentImageIndex].caption}
              </p>

              {/* Thumbnails */}
              <div className="relative -mx-6 md:-mx-12 px-6 md:px-12">
                <div className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide ${isDark ? '' : 'rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3'}`}>
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      ref={(el) => {
                        thumbnailRefs.current[index] = el;
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all ${
                        currentImageIndex === index 
                          ? `ring-4 ${isDark ? 'ring-blue-500' : 'ring-blue-400/80'} scale-105` 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 ${
                isDark 
                  ? 'bg-sky-600 hover:bg-sky-500 text-white' 
                  : 'bg-sky-500 hover:bg-sky-600 text-white'
              }`}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
