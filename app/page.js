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
    { title: 'Design', desc: 'Creative & Intuitive' },
    { title: 'Development', desc: 'Modern & Scalable' },
    { title: 'Strategy', desc: 'Data-Driven' },
    { title: 'Innovation', desc: 'Future-Focused' }
  ];

  const projects = [
    { title: 'Project One', category: 'Web Design', color: 'from-blue-500 to-purple-600' },
    { title: 'Project Two', category: 'Development', color: 'from-purple-500 to-pink-600' },
    { title: 'Project Three', category: 'Branding', color: 'from-pink-500 to-red-600' },
    { title: 'Project Four', category: 'UI/UX', color: 'from-red-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight">
            JAYCOB<span className="text-blue-500">.</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#work" className="hover:text-blue-400 transition-colors">Work</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
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
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl w-full">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-blue-400 text-lg md:text-xl tracking-wide">Hello, I am</p>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                JAYCOB
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  CHIN
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">
              Creative developer & designer crafting digital experiences that blend innovation with elegance.
            </p>

            <div className="flex flex-wrap gap-4 pt-8">
              <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-2 transition-all">
                View My Work
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-full transition-all">
                Get In Touch
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold">
                About <span className="text-blue-500">Me</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  I am a passionate creator who believes in the power of design and technology to transform ideas into reality.
                </p>
                <p>
                  With a focus on clean aesthetics and functional design, I build digital products that not only look beautiful but also deliver exceptional user experiences.
                </p>
                <p>
                  My approach combines creative thinking with technical expertise to solve complex problems in elegant ways.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skills.map((item, index) => (
                <div 
                  key={index}
                  className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all hover:scale-105"
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
      <section id="work" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Selected <span className="text-blue-500">Work</span>
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
      <section id="contact" className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Create Something
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Amazing Together
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s talk about how we can work together to bring your ideas to life.
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a href="mailto:hello@jaycobchin.com" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-500/50 transition-all">
              <Mail size={24} />
            </a>
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-500/50 transition-all">
              <Github size={24} />
            </a>
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-blue-500/50 transition-all">
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
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2026 Jaycob Chin. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
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
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}