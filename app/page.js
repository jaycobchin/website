'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Menu, X } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const skills = [
    { title: 'Eye Care', desc: 'Professional & Compassionate' },
    { title: 'Education', desc: 'Simple & Practical' },
    { title: 'Experience', desc: 'Patient-Focused' },
    { title: 'Innovation', desc: 'Making It Fun' }
  ];

  const projects = [
    { title: 'Project One', category: 'Eye Care Tips', color: 'from-teal-500 to-cyan-600' },
    { title: 'Project Two', category: 'Parent Guides', color: 'from-cyan-500 to-blue-600' },
    { title: 'Project Three', category: 'Resources', color: 'from-blue-500 to-indigo-600' },
    { title: 'Project Four', category: 'Community', color: 'from-indigo-500 to-teal-600' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-animated opacity-90" />

      {/* Mouse-tracking gradient overlay */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(96, 165, 250, 0.3), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight relative z-10">
            JAYCOB<span className="text-blue-400">.</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#work" className="hover:text-blue-400 transition-colors">Work</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
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
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#about" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#work" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Work</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Contact</a>
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
              
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                I&apos;m sharing what I know about optometry from my own experiences, hoping to inspire other optometrists in Singapore to do the same for their patients. I share simple tips and show how the skills you&apos;ve learned can become useful &quot;tools&quot; to make optometry more enjoyable (hopefully!).
              </p>

              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                I also hope to help parents understand more about eye care so they can better support their kids&apos; eye health. These tips can make eye checks and glasses less scary for your children. Sometimes it can be really fun!
              </p>

              {/* Philosophy Quote */}
              <div className="pt-4 border-l-4 border-blue-400 pl-4">
                <p className="text-lg md:text-xl font-light italic text-gray-200">
                  &quot;The simple act of caring is heroic.&quot;
                </p>
                <p className="text-sm text-blue-400 mt-2">— Edward Albert</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <button className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-2 transition-all text-sm md:text-base">
                  View My Work
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <button className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-full transition-all text-sm md:text-base">
                  Get In Touch
                </button>
              </div>
            </div>

            {/* Right side - Photo */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Your profile photo */}
                <img 
                  src="/jaycob_chin_optometrist_profile_photo.jpg"
                  alt="Jaycob Chin - Optometrist"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold">
                About <span className="text-blue-400">Me</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  I am a passionate optometrist who believes in the power of education and care to transform how we approach eye health.
                </p>
                <p>
                  With a focus on making optometry accessible and enjoyable, I create resources that help both professionals and parents understand the importance of eye care in a simple, practical way.
                </p>
                <p>
                  My approach combines clinical expertise with genuine care to help children and families have positive experiences with eye health.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skills.map((item, index) => (
                <div 
                  key={index}
                  className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all hover:scale-105"
                >
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen flex items-center px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Selected <span className="text-blue-400">Work</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm uppercase tracking-wider mb-2 opacity-80">{project.category}</p>
                  <h3 className="text-3xl md:text-4xl font-bold">{project.title}</h3>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Make Eye Care
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
              Better Together
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Have questions about eye care? Want to collaborate? Let&apos;s talk about how we can work together to help more people understand the importance of eye health.
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a href="mailto:hello@jaycobchin.com" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-400/50 transition-all">
              <Mail size={24} />
            </a>
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-400/50 transition-all">
              <Github size={24} />
            </a>
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-400/50 transition-all">
              <Linkedin size={24} />
            </a>
          </div>

          <button className="group px-12 py-5 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-2 mx-auto transition-all text-lg font-semibold">
            Start a Conversation
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2026 Jaycob Chin. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
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

        .bg-gradient-animated {
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}