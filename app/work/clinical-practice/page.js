'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function ClinicalPracticePage() {
  const [isDark, setIsDark] = useState(true); // Dark theme by default
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

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
  const accentClass = isDark ? 'text-teal-400' : 'text-teal-600';

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
          <Link href="/" className={`text-2xl font-bold tracking-tight relative z-10 transition-colors ${
            isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
          }`}>
            JAYCOB<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10 font-medium">
            <a href="/#philosophy" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Approach
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="/#work-experience" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Work
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="/#work" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Tools
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="/#write" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Write
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="/#contact" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Contact
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>

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
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-4 md:px-6 py-32">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 order-2 md:order-1">
                <div className="space-y-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                    isDark ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-teal-100 text-teal-700 border border-teal-200'
                  }`}>
                    Professional Profile
                  </span>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    Clinical Practice
                  </h1>
                  <p className={`text-2xl font-medium ${accentClass}`}>
                    Expert care for your child's vision
                  </p>
                </div>
                
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  Specialized experience protecting and managing your child's eye health, with a focus on myopia control and early intervention to safeguard their sight for life.
                </p>

                <a
                  href="https://www.emmevisioncare.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-4 rounded-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-teal-600/50"
                >
                  Visit EMME Visioncare
                </a>
              </div>

              {/* Right: Profile Image */}
              <div className="flex justify-center md:justify-end order-1 md:order-2">
                <div className="relative">
                  <div className={`absolute inset-0 ${isDark ? 'bg-teal-500/20' : 'bg-teal-400/20'} rounded-full blur-3xl`}></div>
                  <img
                    src="/Clinical Practice/jaycob_chin_profile.JPG"
                    alt="Jaycob Chin Profile"
                    className={`relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover shadow-2xl ${
                      isDark ? 'ring-4 ring-teal-500/20' : 'ring-4 ring-teal-400/30'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section className="px-4 md:px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Jaycob Chin, FIAOMC</h2>
              <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Optometrist</p>
              
              <div className={`inline-grid grid-cols-1 gap-3 text-sm ${textMutedClass} ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              } backdrop-blur-sm rounded-2xl p-8 border`}>
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`}></span>
                  M.Sc Optom (Aust), B.Sc Optom (U.S.A.), Dip. Optom (S'pore)
                </p>
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`}></span>
                  Full Registration, Singapore Optometrists and Opticians Board
                </p>
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`}></span>
                  Council Member, Singapore Optometric Association
                </p>
                <p className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`}></span>
                  Fellow, American Academy of Orthokeratology and Myopia Control
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 md:px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-16">
              {/* Section 1 */}
              <div className="space-y-6">
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  I am a fully licensed and registered optometrist currently practicing at <a href="https://www.emmevisioncare.com" className={`font-semibold ${
                    isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'
                  } transition-colors underline ${isDark ? 'decoration-teal-400/30 hover:decoration-teal-400' : 'decoration-teal-600/30 hover:decoration-teal-600'}`} target="_blank" rel="noreferrer">EMME Visioncare</a> in HarbourFront Centre, Singapore. With a holistic approach to vision care, I go beyond simply prescribing glasses or contact lenses. I prioritize comprehensive eye examinations that focus on overall eye health and truly understand each patient's unique needs.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-6">
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  My educational journey has taken me across Singapore, the United States, and Australia. This strengthens my commitment to personalized eye care. I stay at the forefront of optometric advancements, with a strong emphasis on early prevention and detection of ocular conditions, and pediatric issues like amblyopia. I have a particular passion for myopia control, including orthokeratology, and specialized care in low vision, geriatric patients, and therapeutic contact lenses. Recently, I earned my certification in Evidence-Based Myopia Management from <a href="https://www.unsw.edu.au/" className={`font-semibold ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  } transition-colors underline ${isDark ? 'decoration-blue-400/30 hover:decoration-blue-400' : 'decoration-blue-600/30 hover:decoration-blue-600'}`} target="_blank" rel="noreferrer">UNSW</a>, reflecting my dedication to the latest research-driven approaches.
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-6">
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  Over the years, I have built extensive clinical experience helping patients find tailored vision solutions that fit their lifestyle, work, and daily activities. These include everything from prescription glasses and sunglasses to advanced contact lenses (including hybrid and scleral lenses) and non-surgical therapeutic options. In my practice at <a href="https://www.emmevisioncare.com" className={`font-semibold ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                  } transition-colors underline ${isDark ? 'decoration-cyan-400/30 hover:decoration-cyan-400' : 'decoration-cyan-600/30 hover:decoration-cyan-600'}`} target="_blank" rel="noreferrer">EMME Visioncare</a>, I conduct thorough eye health assessments, co-manage conditions with other healthcare professionals when needed, and mentor colleagues in complex contact lens fitting.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-6">
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  In leadership and educational roles, I have overseen operations, led staff training, contributed to business growth, and served as an Associate Lecturer in <a href="https://www.np.edu.sg/" className={`font-semibold ${
                    isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                  } transition-colors underline ${isDark ? 'decoration-purple-400/30 hover:decoration-purple-400' : 'decoration-purple-600/30 hover:decoration-purple-600'}`} target="_blank" rel="noreferrer">Ngee Ann Polytechnic</a> while pursuing my Doctor of Optometry degree from <a href="https://www.aston.ac.uk/" className={`font-semibold ${
                    isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                  } transition-colors underline ${isDark ? 'decoration-purple-400/30 hover:decoration-purple-400' : 'decoration-purple-600/30 hover:decoration-purple-600'}`} target="_blank" rel="noreferrer">Aston University</a>. I also hold a Master's in Clinical Optometry and remain deeply committed to lifelong learning and sharing knowledge.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-6">
                <p className={`text-lg ${textMutedClass} leading-relaxed`}>
                  I am driven by a deep commitment to eye health, evidence-based practice, and making quality vision care available to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6 py-24 pb-32">
          <div className="max-w-4xl mx-auto">
            <div className={`relative overflow-hidden rounded-3xl ${
              isDark 
                ? 'bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border-teal-500/20' 
                : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200'
            } border p-12 text-center backdrop-blur-sm`}>
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-teal-500/10 to-transparent' : 'bg-gradient-to-br from-teal-100/50 to-transparent'}`}></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Ready for Expert Eye Care?</h2>
                <p className={`text-lg ${textMutedClass} max-w-2xl mx-auto`}>
                  Visit EMME Visioncare in HarbourFront Centre, Singapore for a comprehensive eye examination and personalized vision solutions.
                </p>
                <a
                  href="https://www.emmevisioncare.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-10 py-4 rounded-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-teal-600/50"
                >
                  Visit EMME Visioncare
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
