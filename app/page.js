'use client';
import { SpeedInsights } from "@vercel/speed-insights/next"

import { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Menu, X, Sun, Moon } from 'lucide-react';
import RiskFactorsAnalysis from './components/Risk Factors Analysis.js';
import MyopiaProgressionCalculator from './components/MyopiaProgressionCalculator.js';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedCard, setExpandedCard] = useState(null);
  const [isDark, setIsDark] = useState(true); // Dark mode by default

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const skillsDetail = [
    { 
      title: 'Eye Care', 
      desc: 'Professional & Compassionate',
      detail: 'Providing comprehensive eye examinations with a focus on early detection and prevention. I believe in taking the time to understand each patient\'s unique needs and creating personalized care plans that work for their lifestyle.'
    },
    { 
      title: 'Education', 
      desc: 'Simple & Practical',
      detail: 'Breaking down complex optometry concepts into easy-to-understand information. I create resources and guides that empower both professionals and parents to make informed decisions about eye health.'
    },
    { 
      title: 'Experience', 
      desc: 'Patient-Focused',
      detail: 'Years of hands-on practice have taught me that the best care comes from listening. Every patient interaction is an opportunity to learn and improve how we approach eye health in our community.'
    },
    { 
      title: 'Innovation', 
      desc: 'Making It Fun',
      detail: 'Transforming routine eye checks into engaging experiences, especially for children. Using creative techniques and modern tools to make optometry accessible and enjoyable for everyone.'
    }
  ];

  const projects = [
    { title: 'Risk Factors Analysis', category: 'Parents', color: 'from-teal-500 to-cyan-600', id: 'risk-factors-analysis' },
    { title: 'Myopia Progression Calculator', category: 'Parents', color: 'from-cyan-500 to-blue-600', id: 'progression-calculator' },
    { title: 'Project Three', category: 'Resources', color: 'from-blue-500 to-indigo-600' },
    { title: 'Project Four', category: 'Community', color: 'from-indigo-500 to-teal-600' }
  ];

  const [selectedProject, setSelectedProject] = useState(null);

  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const textLightClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDark ? 'border-white/10' : 'border-gray-200';
  const hoverBorderClass = isDark ? 'hover:border-blue-400/50' : 'hover:border-blue-500/50';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-x-hidden relative transition-colors duration-500`}>
      {/* Animated gradient background */}
      <div className={`fixed inset-0 ${isDark ? 'bg-gradient-animated-dark' : 'bg-gradient-animated-light'} ${isDark ? 'opacity-90' : 'opacity-100'} transition-opacity duration-500`} />

      {/* Mouse-tracking gradient overlay */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(96, 165, 250, 0.3), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? `${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-lg py-4` : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight relative z-10">
            JAYCOB<span className="text-blue-400">.</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10">
            <a href="#philosophy" className="hover:text-blue-400 transition-colors">Philosophy</a>
            <a href="#work" className="hover:text-blue-400 transition-colors">Work</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-10"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-lg`}>
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#philosophy" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Philosophy</a>
              <a href="#work" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Work</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Contact</a>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-32 md:pt-40 relative z-10">
        <div className="max-w-7xl w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-blue-400 text-base md:text-lg tracking-wide">Hello, I am</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  JAYCOB
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    CHIN
                  </span>
                </h1>
              </div>
              
              <p className={`text-base md:text-lg ${textMutedClass} leading-relaxed`}>
                I&apos;m sharing what I know about optometry from my own experiences, hoping to inspire other optometrists in Singapore to do the same for their patients. I share simple tips and show how the skills you&apos;ve learned can become useful &quot;tools&quot; to make optometry more enjoyable (hopefully!).
              </p>

              <p className={`text-sm md:text-base ${textLightClass} leading-relaxed`}>
                I also hope to help parents understand more about eye care so they can better support their kids&apos; eye health. These tips can make eye checks and glasses less scary for your children. Sometimes it can be really fun!
              </p>

              {/* Philosophy Quote */}
              <div className={`pt-4 border-l-4 border-blue-400 pl-4`}>
                <p className={`text-lg md:text-xl font-light italic ${textMutedClass}`}>
                  &quot;The simple act of caring is heroic.&quot;
                </p>
                <p className="text-sm text-blue-400 mt-2">— Edward Albert</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <button className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition-all text-sm md:text-base">
                  View My Work
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <button className={`px-6 py-3 border ${borderClass} hover:border-blue-400 rounded-full transition-all text-sm md:text-base`}>
                  Get In Touch
                </button>
              </div>
            </div>

            {/* Right side - Photo */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Your profile photo */}
                <img 
                  src="/jaycob_chin.jpg"
                  alt="Jaycob Chin - Optometrist"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className={`absolute inset-0 rounded-full border-4 ${borderClass}`} />
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold">
                My Optometry <span className="text-blue-400">Philosophy</span>
              </h2>
              <div className={`space-y-4 ${textMutedClass} text-lg`}>
                <p>
                  I used to ask myself, &quot;how do we (optometrists) keep ourselves updated?&quot;, &quot;what do I have to do in order to provide the best care?&quot; After years of practice, trying different ways, and seeing what really helps children and families, I&apos;ve concluded:
                </p>
                <ul className="space-y-3 pl-6">
                  <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-400 before:font-bold">
                    Pursue the &apos;Gold Standard&apos;, always
                  </li>
                  <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-400 before:font-bold">
                    Adapt and move towards evidence based research
                  </li>
                  <li className="relative before:content-['•'] before:absolute before:-left-6 before:text-blue-400 before:font-bold">
                    Take time to share and learn more from others
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skillsDetail.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                  className={`${expandedCard === index ? 'col-span-2' : ''} p-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'} backdrop-blur-sm rounded-2xl border ${borderClass} ${hoverBorderClass} transition-all hover:scale-105 cursor-pointer`}
                >
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className={textLightClass}>{item.desc}</p>
                  
                  {expandedCard === index && (
                    <div className={`mt-4 pt-4 border-t ${borderClass} ${textMutedClass} text-sm animate-fade-in`}>
                      {item.detail}
                    </div>
                  )}
                  
                  <div className={`mt-3 text-xs text-blue-400 ${expandedCard === index ? '' : 'opacity-70'}`}>
                    {expandedCard === index ? 'Click to close' : 'Click to read more'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Selected <span className="text-blue-400">Work</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group relative h-32 md:h-40 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => project.id && setSelectedProject(project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                  <p className="text-xs uppercase tracking-wider mb-1 opacity-80">{project.category}</p>
                  <h3 className="text-lg md:text-xl font-bold">{project.title}</h3>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myopia Tool Modal */}
      {selectedProject === 'myopia-tool' && (
        <RiskFactorsAnalysis isDark={isDark} onClose={() => setSelectedProject(null)} />
      )}
      {selectedProject === 'progression-calculator' && (
        <MyopiaProgressionCalculator isDark={isDark} onClose={() => setSelectedProject(null)} />
      )}

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Make Eye Care
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              Better Together
            </span>
          </h2>
          <p className={`text-xl ${textMutedClass} mb-12 max-w-2xl mx-auto`}>
            Have questions about eye care? Want to collaborate? Let&apos;s talk about how we can work together to help more people understand the importance of eye health.
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a href="mailto:hello@jaycobchin.com" className={`p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-full border ${borderClass} ${hoverBorderClass} transition-all`}>
              <Mail size={24} />
            </a>
            <a href="#" className={`p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-full border ${borderClass} ${hoverBorderClass} transition-all`}>
              <Github size={24} />
            </a>
            <a href="#" className={`p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-full border ${borderClass} ${hoverBorderClass} transition-all`}>
              <Linkedin size={24} />
            </a>
          </div>

          <button className="group px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 mx-auto transition-all text-lg font-semibold">
            Start a Conversation
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${borderClass} py-8 px-6 relative z-10`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={textLightClass}>© 2026 Jaycob Chin. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className={`${textLightClass} hover:text-blue-400 transition-colors`}>Privacy</a>
            <a href="#" className={`${textLightClass} hover:text-blue-400 transition-colors`}>Terms</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bg-gradient-animated-dark {
          background: linear-gradient(
            -45deg,
            #0f172a,
            #1e293b,
            #1e3a5f,
            #1e293b,
            #0f172a,
            #164e63,
            #1e293b
          );
          background-size: 400% 400%;
          animation: gradient-shift 20s ease infinite;
        }

        .bg-gradient-animated-light {
          background: linear-gradient(
            -45deg,
            #0099ff,
            #0066ff,
            #0088ff,
            #0055ff,
            #0066ff,
            #00aaff,
            #0077ff
          );
          background-size: 400% 400%;
          animation: gradient-shift 20s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
