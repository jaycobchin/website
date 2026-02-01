'use client';
import { SpeedInsights } from "@vercel/speed-insights/next"

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowRight, Linkedin, Mail, Menu, X, Sun, Moon } from 'lucide-react';
import RiskFactorsAnalysis from './components/RiskFactorsAnalysis.js';
import MyopiaProgressionCalculator from './components/MyopiaProgressionCalculator.js';
import AxialLengthEstimation from './components/AxialLengthEstimation.js';
import VisionSimulator from './components/VisionSimulator.js';
import ContactLensVertexCalculator from './components/ContactLensVertexCalculator.js';
import CorneaCurvatureConverter from './components/CorneaCurvatureConverter.js';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedCard, setExpandedCard] = useState(null);
  const [isDark, setIsDark] = useState(true); // Dark mode by default
  const [selectedProfile, setSelectedProfile] = useState('parents');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageCaption, setSelectedImageCaption] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState('professional');
  const thumbnailRefs = useState([])[0];

  // Map tool IDs to URL paths
  const toolPaths = {
    'risk-factors-analysis': '/tools/risk-factors-analysis',
    'progression-calculator': '/tools/progression-calculator',
    'axial-length-estimation': '/tools/axial-length-estimation',
    'vision-simulator': '/tools/vision-simulator',
    'cl-rx-vertex-calculator': '/tools/cl-rx-vertex-calculator',
    'cornea-curvature-converter': '/tools/cornea-curvature-converter'
  };

  // Reverse mapping for URL to tool ID
  const pathToTool = Object.fromEntries(
    Object.entries(toolPaths).map(([key, value]) => [value, key])
  );

  const galleryImages = [
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/47th SOA Council 2024 & 2025.jpeg', caption: '47th SOA Council 2024 & 2025' },
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/47th SOA Council 2025.JPG', caption: '47th SOA Council 2025' },
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/SOA Conference 2025 with Dr Koh Poh Koon - Ngee Ann Polytechnic Convention Centre.jpeg', caption: 'SOA Conference 2025 with Dr Koh Poh Koon' },
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/Council and Organizing Committee at SOA Conference 2024 - Ngee Ann Polytecnic Convention Centre.jpeg', caption: 'Council and Organizing Committee at SOA Conference 2024' },
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/SOA Conference 2024 Opening Address - Ngee Ann Polytechnic Convetion Centre.jpeg', caption: 'SOA Conference 2024 Opening Address' },
    { url: '/Professional Appointment/SOA Treasurer Dec 2023 - Dec 2025/Dispensing of Spectacles in NorthLight School 2024 - Sponsored by Carl Zeiss Vision Care.jpeg', caption: 'Dispensing of Spectacles in NorthLight School 2024' },
    { url: '/Professional Appointment/SOA Council Member Dec 2020 to Dec 2023/46th SOA Council 2023.jpeg', caption: '46th SOA Council 2023' },
    { url: '/Professional Appointment/SOA Council Member Dec 2020 to Dec 2023/SOA with Guest of Honor - Dr Tan Tuan Lin (Commencement of 4th GOMCC Singapore 2023 - Opening Ceremony.jpeg', caption: 'SOA with Guest of Honor - Dr Tan Tuan Lin' },
    { url: '/Professional Appointment/SOA Council Member Dec 2020 to Dec 2023/Organizing Committee for GOMCC 2023 - Team Photo during gala dinner @ Furama riverside Hotel.jpeg', caption: 'Organizing Committee for GOMCC 2023' },
    { url: '/Professional Appointment/SOA Council Member Dec 2020 to Dec 2023/Lion Dance Team for GOMCC 2023 - Group Photo with SP Lion Dance.jpeg', caption: 'Lion Dance Team for GOMCC 2023' }
  ];

  const communityImages = [
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

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update selected image when carousel index changes
  useEffect(() => {
    if (selectedImage) {
      setSelectedImageCaption(galleryImages[currentImageIndex].caption);
    }
  }, [currentImageIndex, selectedImage, galleryImages]);

  // Sync URL with selected tool on mount and handle URL changes
  useEffect(() => {
    if (pathname === '/') {
      if (selectedProject) {
        setSelectedProject(null);
      }
    } else if (pathToTool[pathname]) {
      if (selectedProject !== pathToTool[pathname]) {
        setSelectedProject(pathToTool[pathname]);
      }
    }
  }, [pathname]);

  // Helper function to open a tool with URL update
  const openTool = (toolId) => {
    setSelectedProject(toolId);
    if (toolPaths[toolId]) {
      window.history.pushState({}, '', toolPaths[toolId]);
    }
  };

  // Helper function to close tool and return to home
  const closeTool = () => {
    setSelectedProject(null);
    window.history.pushState({}, '', '/');
  };

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
    {
      title: 'Risk Factors Analysis',
      category: 'Parents',
      audience: ['parents'],
      color: 'from-teal-500 to-cyan-600',
      id: 'risk-factors-analysis',
      description: 'Interactive tool to assess your child\'s myopia risk factors and receive personalized recommendations based on current research and clinical guidelines.'
    },
    {
      title: 'Myopia Progression Calculator',
      category: 'Parents',
      audience: ['parents'],
      color: 'from-cyan-500 to-blue-600',
      id: 'progression-calculator',
      description: 'Calculate and visualize how myopia may progress over time with and without intervention, helping you make informed decisions about treatment options.'
    },
    {
      title: 'Axial Length Estimation',
      category: 'Optometrists',
      audience: ['optometrists'],
      color: 'from-blue-500 to-indigo-600',
      id: 'axial-length-estimation',
      description: 'Estimate axial length from keratometry and refraction values, a useful clinical tool for optometrists managing myopia progression.'
    },
    {
      title: 'CL Rx Vertex Calculator',
      category: 'Optometrists',
      audience: ['optometrists'],
      color: 'from-indigo-500 to-purple-600',
      id: 'cl-rx-vertex-calculator',
      description: 'Convert spectacle prescriptions to contact lens powers with vertex distance adjustment.'
    },
    {
      title: 'Cornea Curvature Converter',
      category: 'Optometrists',
      audience: ['optometrists'],
      color: 'from-purple-500 to-pink-600',
      id: 'cornea-curvature-converter',
      description: 'Convert between corneal radius (mm) and corneal power (D) with a comprehensive K-value reference table.'
    },
    {
      title: 'Vision Simulator',
      category: 'Parents',
      audience: ['parents'],
      color: 'from-indigo-500 to-teal-600',
      id: 'vision-simulator',
      description: 'Experience different refractive errors and eye conditions. See how myopia, hyperopia, astigmatism, and other conditions affect vision in real-time.'
    }
  ];

  const filteredProjects = selectedProfile === 'all'
    ? projects
    : projects.filter((project) =>
      selectedProfile === 'parents'
        ? project.audience.includes('parents')
        : project.audience.includes('optometrists')
    );

  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const textLightClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDark ? 'border-white/10' : 'border-gray-200';
  const hoverBorderClass = isDark ? 'hover:border-blue-400/50' : 'hover:border-blue-500/50';
  const accentHelloClass = isDark ? 'text-blue-400' : 'text-blue-600';
  const accentChinFromClass = isDark ? 'from-blue-400' : 'from-blue-600';
  const accentChinToClass = isDark ? 'to-purple-600' : 'to-violet-700';
  const accentPhilosophyClass = isDark ? 'text-blue-400' : 'text-indigo-600';
  const accentToolsClass = isDark ? 'text-blue-400' : 'text-sky-600';
  const accentHeaderDotClass = isDark ? 'text-blue-400' : 'text-blue-600';
  const accentQuoteAttributionClass = isDark ? 'text-blue-400' : 'text-sky-600';
  const accentPhilosophyBulletClass = isDark ? 'before:text-blue-400' : 'before:text-indigo-600';
  const accentBetterTogetherFromClass = isDark ? 'from-blue-400' : 'from-blue-600';
  const accentBetterTogetherToClass = isDark ? 'to-cyan-600' : 'to-cyan-700';

  return (
    <div className={`min-h-screen ${textClass} overflow-x-hidden relative transition-colors duration-500`}>
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
          <a href="/" className={`text-2xl font-bold tracking-tight relative z-10 transition-colors ${
            isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
          }`}>
            JAYCOB<span className={accentHeaderDotClass}>.</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10 font-medium">
            <a href="#philosophy" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Philosophy
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="#work-experience" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Work
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="#write" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Write
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="#work" className={`${
              isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'
            } transition-colors relative group`}>
              Tools
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              } transition-all group-hover:w-full`}></span>
            </a>
            <a href="#contact" className={`${
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
              <a href="#philosophy" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Philosophy</a>
              <a href="#work-experience" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Work</a>
              <a href="#write" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Write</a>
              <a href="#work" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Tools</a>
              <a href="#contact" className={`py-2 px-3 rounded-lg ${
                isDark ? 'hover:bg-white/10 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-600'
              } transition-all`} onClick={() => setMenuOpen(false)}>Contact</a>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 p-3 rounded-xl w-full ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-blue-100 hover:bg-blue-200'
                } transition-all mt-2`}
              >
                {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-blue-600" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12 relative z-10">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Content Card */}
          <div className={`relative z-10 p-8 md:p-12 rounded-[3rem] ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white/40 border-white/50'} backdrop-blur-xl border shadow-2xl overflow-hidden group`}>
            {/* Glossy gradient accent */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-sky-400/20'} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none`} />
            
            <div className="relative space-y-8">
              <div className="space-y-2">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  Optometrist & Educator
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                  JAYCOB
                  <br />
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-blue-400 via-indigo-400 to-purple-400' : 'from-blue-600 via-indigo-600 to-purple-600'}`}>
                    CHIN
                  </span>
                </h1>
              </div>

              <div className="space-y-6 text-lg leading-relaxed max-w-xl">
                 <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  I&apos;m sharing what I know about optometry from my own experiences, hoping to inspire other optometrists in Singapore to do the same for their patients.
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  From simple tips to advanced &quot;tools&quot;, I aim to make optometry more enjoyable and help parents support their kids&apos; eye health better.
                </p>
              </div>

              <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/50'} border ${borderClass}`}>
                <p className="text-lg italic font-light opacity-90">
                  &quot;The simple act of caring is heroic.&quot;
                </p>
                <p className={`mt-2 text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>— Edward Albert</p>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Photo */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
              {/* Decorative Rings */}
              <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-blue-500/30' : 'border-blue-400/30'} scale-110 animate-pulse`} />
              <div className={`absolute inset-0 rounded-full border ${isDark ? 'border-indigo-500/20' : 'border-indigo-400/20'} scale-125`} />
              
              {/* Floating Elements */}
              <div className={`absolute -top-4 -right-4 z-20 ${isDark ? 'bg-slate-800' : 'bg-white'} p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms]`}>
                 <span className="text-3xl">👓</span>
              </div>
              <div className={`absolute bottom-8 -left-8 z-20 ${isDark ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-md p-4 rounded-2xl shadow-xl border ${borderClass} flex items-center gap-3`}>
                 <div className="bg-green-100 p-2 rounded-full">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase opacity-60">Status</p>
                   <p className="text-sm font-bold">Accepting Patients</p>
                 </div>
              </div>

              {/* Main Image */}
              <div className={`relative w-full h-full rounded-full overflow-hidden border-8 ${isDark ? 'border-slate-900' : 'border-white'} shadow-2xl`}>
                <img
                  src="/jaycob_chin.jpg"
                  alt="Jaycob Chin"
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="min-h-screen flex items-center px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Side: Content */}
            <div className="order-2 md:order-1 relative">
                <div className={`relative z-10 p-8 md:p-10 rounded-[2.5rem] ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white/40 border-white/50'} backdrop-blur-md border shadow-2xl`}>
                    <div className="space-y-6">
                        
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            My <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>Philosophy</span>
                        </h2>

                        <div className={`text-lg leading-relaxed ${textMutedClass}`}>
                            <p className="mb-6">
                                I often asked myself, &quot;How do we keep ourselves updated?&quot; and &quot;What defines the best care?&quot; Through years of practice and observing what truly benefits families, I&apos;ve arrived at three core pillars:
                            </p>
                        </div>
                        
                        <ul className="space-y-4">
                            {[
                                "Pursue the 'Gold Standard', always",
                                "Adapt and move towards evidence-based research",
                                "Take time to share and learn from others"
                            ].map((item, index) => (
                                <li key={index} className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'}`}>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100/80 text-blue-600'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side: Image */}
            <div className="order-1 md:order-2 w-full relative group">
              <div className={`absolute inset-0 ${isDark ? 'bg-blue-600/30' : 'bg-blue-600/20'} blur-[60px] rounded-full opacity-50 pointer-events-none`} />
              
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 h-[600px]">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60" />
                 <img
                    src="/philosophy_himalaya_scenery.jpeg"
                    alt="Philosophy - Himalaya Scenery"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20">
                     <p className="text-white/80 font-mono text-xs mb-2">INSPIRATION</p>
                     <p className="text-white text-xl font-medium italic">"Nature does not hurry, yet everything is accomplished."</p>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Work Section */}
      < section id="work-experience" className="min-h-screen flex items-center px-6 py-24 relative z-10" >
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-4 mb-16">
            <p className="text-blue-500 font-bold tracking-widest text-sm uppercase">Professional Journey</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              Work
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Clinical Practice Card */}
            <div
              className="group relative p-1 rounded-3xl overflow-hidden cursor-pointer hover-lift"
              onClick={() => setSelectedWork('clinical')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative h-full ${isDark ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-[22px] p-8 flex flex-col justify-between overflow-hidden shadow-lg`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">Work Experience</p>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Clinical Practice</h3>
                  <p className={`text-base ${textMutedClass} leading-relaxed`}>
                    Years of hands-on experience providing comprehensive eye care to diverse patient populations, focusing on myopia management and preventive care strategies.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-2 transition-transform">
                  <span>View clinical experience</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Professional Appointment Card */}
            <div
              className="group relative p-1 rounded-3xl overflow-hidden cursor-pointer hover-lift"
              onClick={() => setSelectedWork('professional')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative h-full ${isDark ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-[22px] p-8 flex flex-col justify-between overflow-hidden shadow-lg`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-4">Work Experience</p>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Professional Appointment</h3>
                  <p className={`text-base ${textMutedClass} leading-relaxed`}>
                    Appointed positions in professional organizations, contributing to standards development and advancing best practices in optometry across the region.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-2 transition-transform">
                  <span>View professional roles</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Community Engagement Card */}
            <div
              className="group relative p-1 rounded-3xl overflow-hidden cursor-pointer hover-lift"
              onClick={() => setSelectedWork('community')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative h-full ${isDark ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-xl rounded-[22px] p-8 flex flex-col justify-between overflow-hidden shadow-lg`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">Work Experience</p>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Community Engagement</h3>
                  <p className={`text-base ${textMutedClass} leading-relaxed`}>
                    Active involvement in community education initiatives, helping raise awareness about eye health and supporting vision care accessibility for all.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform">
                  <span>View community work</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Write Section */}
      < section id="write" className="min-h-screen flex items-center px-6 py-24 relative z-10" >
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-4 mb-16">
            <p className="text-blue-500 font-bold tracking-widest text-sm uppercase">Insights & Thoughts</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              Write
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} hover:border-blue-500/50 transition-all hover-lift flex flex-col justify-between h-full group`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-3">Clinical Notes</p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-500 transition-colors">What I Look For During a Pediatric Eye Check</h3>
                <p className={`text-base ${textMutedClass} leading-relaxed mb-6`}>
                  A practical walkthrough of the key checkpoints that help me spot early issues and reassure parents.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 group-hover:text-blue-500 transition-colors">
                <span>Coming soon</span>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} hover:border-blue-500/50 transition-all hover-lift flex flex-col justify-between h-full group`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-3">Parent Guides</p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-500 transition-colors">Myopia Myths I Hear Every Week</h3>
                <p className={`text-base ${textMutedClass} leading-relaxed mb-6`}>
                  Clearing up the most common misconceptions with research-backed, parent-friendly explanations.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 group-hover:text-purple-500 transition-colors">
                <span>Coming soon</span>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} hover:border-blue-500/50 transition-all hover-lift flex flex-col justify-between h-full group`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 text-teal-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-500 mb-3">Research Digest</p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-teal-500 transition-colors">One Study, Three Takeaways</h3>
                <p className={`text-base ${textMutedClass} leading-relaxed mb-6`}>
                  Quick summaries of evidence-based updates with clear implications for practice and families.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 group-hover:text-teal-500 transition-colors">
                <span>Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Tools Section */}
      < section id="work" className="min-h-screen flex items-center px-6 py-24 relative z-10" >
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-4 mb-16">
            <p className="text-blue-500 font-bold tracking-widest text-sm uppercase">Interactive Resources</p>
            <h2 className="text-5xl md:text-6xl font-bold">
              Useful <span className={accentToolsClass}>Tools</span>
            </h2>
          </div>

          <div className={`inline-flex flex-wrap items-center gap-2 p-2 rounded-2xl backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            {[
              { id: 'all', label: 'All', color: 'bg-slate-400' },
              { id: 'parents', label: 'Parents', color: 'bg-blue-400' },
              { id: 'optometrists', label: 'Optometrists', color: 'bg-indigo-400' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedProfile(tab.id)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3 ${selectedProfile === tab.id
                  ? 'bg-white text-slate-900 shadow-lg scale-100'
                  : isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${tab.color}`} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className={`group relative p-1 rounded-3xl overflow-hidden cursor-pointer hover-lift h-full`}
                onClick={() => project.id && openTool(project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative h-full rounded-[20px] p-8 flex flex-col justify-between border ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-sm group-hover:border-transparent transition-colors`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className={`text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                        {project.category}
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50'} group-hover:bg-white/20 transition-colors`}>
                        <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform duration-300 group-hover:text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{project.title}</h3>
                    <p className={`text-sm ${textMutedClass} leading-relaxed group-hover:text-white/90 transition-colors`}>
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 group-hover:border-white/10">
                    <span className="text-sm font-medium group-hover:text-white transition-colors">
                      {project.id === 'progression-calculator'
                        ? 'Calculate progression'
                        : project.id === 'risk-factors-analysis'
                          ? 'Calculate risk'
                          : project.id === 'vision-simulator'
                            ? 'Try simulator'
                            : project.id === 'cornea-curvature-converter'
                              ? 'Try converter'
                              : project.id === 'axial-length-estimation'
                                ? 'Estimate length'
                                : project.id === 'cl-rx-vertex-calculator'
                                  ? 'Convert power'
                                  : 'Open tool'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors Analysis Modal */}
      {
        selectedProject === 'risk-factors-analysis' && (
          <RiskFactorsAnalysis isDark={isDark} onClose={closeTool} />
        )
      }
      {/* Progression Calculator Modal */}
      {
        selectedProject === 'progression-calculator' && (
          <MyopiaProgressionCalculator isDark={isDark} onClose={closeTool} />
        )
      }
      {/* Axial Length Estimation Modal */}
      {
        selectedProject === 'axial-length-estimation' && (
          <AxialLengthEstimation isDark={isDark} onClose={closeTool} />
        )
      }
      {/* Vision Simulator Modal */}
      {
        selectedProject === 'vision-simulator' && (
          <VisionSimulator isDark={isDark} onClose={closeTool} />
        )
      }

      {/* CL Rx Vertex Calculator Modal */}
      {
        selectedProject === 'cl-rx-vertex-calculator' && (
          <ContactLensVertexCalculator isDark={isDark} onClose={closeTool} />
        )
      }

      {/* Cornea Curvature Converter Modal */}
      {
        selectedProject === 'cornea-curvature-converter' && (
          <CorneaCurvatureConverter isDark={isDark} onClose={closeTool} />
        )
      }

      {/* Work Experience Modals */}
      {
        selectedWork === 'clinical' && (
          <div className={`fixed inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} z-50 overflow-y-auto`}>
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className={`w-full max-w-4xl ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl p-8 relative`} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedWork(null)}
                  className={`absolute top-6 right-6 p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} transition-colors`}
                  aria-label="Close"
                >
                  <X size={24} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-3xl">💼</div>
                  <div>
                    <h1 className="text-3xl font-bold">Clinical Practice</h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      My journey in optometry and vision care
                    </p>
                  </div>
                </div>

                <div className="leading-relaxed overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-8">
                    <img
                      src="/Clinical Practice/jaycob_chin_profile.JPG"
                      alt="Jaycob Chin Profile"
                      className="w-40 h-40 rounded-full object-cover shadow-lg"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-center mb-2">Jaycob Chin, FIAOMC</h2>
                  <p className={`text-center mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Optometrist</p>

                  <div className={`text-center mb-8 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                    <p>M.Sc Optom (Aust), B.Sc Optom (U.S.A.), Dip. Optom (S'pore)</p>
                    <p>Full Registration, Singapore Optometrists and Opticians Board</p>
                    <p>Council Member, Singapore Optometric Association</p>
                    <p>Fellow, American Academy of Orthokeratology and Myopia Control</p>
                  </div>

                  <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-8`}>
                    <p className="mb-6">
                      I am a fully licensed and registered optometrist currently practicing at <a href="https://www.emmevisioncare.com" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer"><strong>EMME Visioncare</strong></a> in HarbourFront Centre, Singapore. With a holistic approach to vision care, I go beyond simply prescribing glasses or contact lenses. I prioritize comprehensive eye examinations that focus on overall eye health and truly understand each patient's unique needs.
                    </p>

                    <p className="mb-6">
                      My educational journey has taken me across Singapore, the United States, and Australia. This strengthens my commitment to personalized eye care. I stay at the forefront of optometric advancements, with a strong emphasis on early prevention and detection of ocular conditions, and pediatric issues like amblyopia. I have a particular passion for myopia control, including orthokeratology, and specialized care in low vision, geriatric patients, and therapeutic contact lenses. Recently, I earned my certification in Evidence-Based Myopia Management from <a href="https://www.unsw.edu.au/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">UNSW</a>, reflecting my dedication to the latest research-driven approaches.
                    </p>

                    <p className="mb-6">
                      Over the years, I have built extensive clinical experience helping patients find tailored vision solutions that fit their lifestyle, work, and daily activities. These include everything from prescription glasses and sunglasses to advanced contact lenses (including hybrid and scleral lenses) and non-surgical therapeutic options. In my practice at <a href="https://www.emmevisioncare.com" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">EMME Visioncare</a>, I conduct thorough eye health assessments, co-manage conditions with other healthcare professionals when needed, and mentor colleagues in complex contact lens fitting.
                    </p>

                    <p className="mb-6">
                      In leadership and educational roles, I have overseen operations, led staff training, contributed to business growth, and served as an Associate Lecturer in <a href="https://www.np.edu.sg/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Ngee Ann Polytechnic</a> while pursuing my Doctor of Optometry degree from <a href="https://www.aston.ac.uk/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Aston University</a>. I also hold a Master's in Clinical Optometry and remain deeply committed to lifelong learning and sharing knowledge.
                    </p>

                    <p>
                      I am driven by a deep commitment to eye health, evidence-based practice, and making quality vision care available to everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        selectedWork === 'professional' && (
          <div className={`fixed inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} z-50 overflow-y-auto`}>
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className={`w-full max-w-4xl ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl p-8 relative`} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedWork(null)}
                  className={`absolute top-6 right-6 p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} transition-colors`}
                  aria-label="Close"
                >
                  <X size={24} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h1 className="text-3xl font-bold">Professional Appointment</h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Leadership and service in optometry
                    </p>
                  </div>
                </div>

                <div className="leading-relaxed overflow-y-auto max-h-[calc(90vh-120px)]">
                  <p className="text-base mb-8">
                    I was nominated to join a professional association in handling optometry matters. It has shown me the big gap between optometrists and other healthcare professionals. I hope that this website that I have created can help the public, parents and fellow healthcare folks better understand what optometrists do as the main primary eye care provider.
                  </p>

                  <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Singapore Optometric Association (SOA)</h3>

                  <div className="space-y-4">
                    <div className={`pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>Council Member</h4>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dec 2025 – Present</p>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Responsible for social media management, driving community growth and engagement.</p>
                    </div>

                    <div className={`pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>Treasurer</h4>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dec 2023 – Dec 2025</p>
                      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Oversee financial operations and governance for the association.</p>
                      <h5 className={`font-bold ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>Student Liaison Officer</h5>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Focused on digital outreach (LinkedIn & Meta platforms). Built and managed social media presence, leading to significant growth: +1K followers on LinkedIn and +2K followers on Meta.</p>
                    </div>

                    <div className={`pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>9th SOA Conference 2024 – Organizing Chair</h4>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Led the organization and execution of the annual conference.</p>
                    </div>

                    <div className={`pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>10th SOA Conference 2025 – Organizing Committee Member</h4>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Contributed to operations and planning for the event.</p>
                    </div>

                    <div className="pb-4">
                      <h4 className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>Council Member</h4>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dec 2020 – Dec 2023</p>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Drove membership growth, produced newsletters, and organized conferences and webinars.</p>
                    </div>
                  </div>

                  {/* Photo Gallery Carousel */}
                  <div className="mt-12">
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Photo Gallery</h3>

                    <div className={`relative flex flex-col items-center gap-6 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'} p-8 rounded-lg`}>
                      {/* Carousel Image */}
                      <div className="relative w-full flex items-center justify-center">
                        <img
                          src={galleryImages[currentImageIndex].url}
                          alt="Gallery image"
                          className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                        />

                        {/* Previous Button */}
                        <button
                          onClick={() => {
                            const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                            setCurrentImageIndex(newIndex);
                            setTimeout(() => thumbnailRefs[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
                          }}
                          className="absolute left-0 ml-4 p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            const newIndex = (currentImageIndex + 1) % galleryImages.length;
                            setCurrentImageIndex(newIndex);
                            setTimeout(() => thumbnailRefs[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
                          }}
                          className="absolute right-0 mr-4 p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Caption */}
                      <p className={`text-lg font-medium text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{galleryImages[currentImageIndex].caption}</p>

                      {/* Thumbnail Preview */}
                      <div className="flex gap-3 justify-start overflow-x-auto pb-2 w-full scrollbar-hide px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {galleryImages.map((image, index) => (
                          <button
                            key={index}
                            ref={(el) => thumbnailRefs[index] = el}
                            onClick={() => {
                              setCurrentImageIndex(index);
                              thumbnailRefs[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            className={`flex-shrink-0 transition-all border-2 rounded-lg overflow-hidden ${index === currentImageIndex ? 'border-blue-500 opacity-100' : `border-${isDark ? 'gray-600' : 'gray-300'} opacity-60 hover:opacity-100`
                              }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-16 h-16 object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Thumbnail Dots */}
                      <div className="flex gap-2 justify-center flex-wrap">
                        {galleryImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-blue-500 w-8' : 'bg-gray-400 hover:bg-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        selectedWork === 'community' && (
          <div className={`fixed inset-0 ${isDark ? 'bg-black/70' : 'bg-black/50'} z-50 overflow-y-auto`}>
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className={`w-full max-w-4xl ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl p-8 relative`} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => { setSelectedWork(null); setCurrentGallery('professional'); setCurrentImageIndex(0); }}
                  className={`absolute top-6 right-6 p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} transition-colors`}
                  aria-label="Close"
                >
                  <X size={24} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-3xl">🤝</div>
                  <div>
                    <h1 className="text-3xl font-bold">Community Engagement</h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Volunteering and giving back to communities in need
                    </p>
                  </div>
                </div>

                <div className="leading-relaxed overflow-y-auto max-h-[calc(90vh-120px)]">
                  <p className="text-base mb-6">
                    I have taken part in volunteer work both locally and overseas.
                  </p>
                  <p className="text-base mb-6">
                    I worked with <a href="https://givingsight.org/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Optometry Giving Sight (OGS)</a> locally to organize full eye checks and provide free spectacles to needy families in Singapore.
                  </p>
                  <p className="text-base mb-8">
                    Overseas, I joined <a href="https://lionsclubs.org.sg/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Lions Club Singapore</a> for eye screening programs in Myanmar, and also worked with <a href="https://www.facebook.com/humanitarianwithlove/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Humanitarian with Love</a> and <a href="https://www.facebook.com/CISACAMBODIA/" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-500'}`} target="_blank" rel="noreferrer">Khmer Sight Foundation</a> to do eye screenings in Cambodia. Those patients in need will be referred for further treatment if necessary. The foundation in Cambodia keeps reaching out to rural areas so people there can get help in time.
                  </p>

                  {/* Photo Gallery Carousel */}
                  <div className="mt-12">
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Photo Gallery</h3>

                    <div className={`relative flex flex-col items-center gap-6 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'} p-8 rounded-lg`}>
                      {/* Carousel Image */}
                      <div className="relative w-full flex items-center justify-center">
                        <img
                          src={communityImages[currentImageIndex].url}
                          alt="Gallery image"
                          className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                        />

                        {/* Previous Button */}
                        <button
                          onClick={() => {
                            const newIndex = (currentImageIndex - 1 + communityImages.length) % communityImages.length;
                            setCurrentImageIndex(newIndex);
                            setTimeout(() => thumbnailRefs[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
                          }}
                          className="absolute left-0 ml-4 p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            const newIndex = (currentImageIndex + 1) % communityImages.length;
                            setCurrentImageIndex(newIndex);
                            setTimeout(() => thumbnailRefs[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
                          }}
                          className="absolute right-0 mr-4 p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Caption */}
                      <p className={`text-lg font-medium text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{communityImages[currentImageIndex].caption}</p>

                      {/* Thumbnail Preview */}
                      <div className="flex gap-3 justify-start overflow-x-auto pb-2 w-full scrollbar-hide px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {communityImages.map((image, index) => (
                          <button
                            key={index}
                            ref={(el) => thumbnailRefs[index] = el}
                            onClick={() => {
                              setCurrentImageIndex(index);
                              thumbnailRefs[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            className={`flex-shrink-0 transition-all border-2 rounded-lg overflow-hidden ${index === currentImageIndex ? 'border-blue-500 opacity-100' : `border-${isDark ? 'gray-600' : 'gray-300'} opacity-60 hover:opacity-100`
                              }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-16 h-16 object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Thumbnail Dots */}
                      <div className="flex gap-2 justify-center flex-wrap">
                        {communityImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-blue-500 w-8' : 'bg-gray-400 hover:bg-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Image Carousel Modal */}
      {
        selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={32} className="text-white" />
            </button>
            <div className="flex flex-col items-center gap-4 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {/* Carousel Container */}
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={galleryImages[currentImageIndex].url}
                  alt="Gallery image"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />

                {/* Previous Button */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-0 ml-4 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-0 mr-4 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Caption */}
              {galleryImages[currentImageIndex].caption && (
                <p className="text-white text-center max-w-2xl text-lg font-medium">{galleryImages[currentImageIndex].caption}</p>
              )}

              {/* Image Counter */}
              <p className="text-white/70 text-sm">{currentImageIndex + 1} / {galleryImages.length}</p>

              {/* Thumbnail Dots */}
              <div className="flex gap-2 justify-center flex-wrap">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }

      {/* Contact Section */}
      <section id="contact" className="min-h-[70vh] flex items-start px-6 pt-28 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Make Eye Care
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentBetterTogetherFromClass} ${accentBetterTogetherToClass}`}>
              Better Together
            </span>
          </h2>
          <p className={`text-xl ${textMutedClass} mb-8 max-w-2xl mx-auto`}>
            Have questions about eye care? Let&apos;s talk about how we can work together to help more people understand the importance of eye health.
          </p>

          <div className="flex justify-center gap-6 mb-6">
            <a href="mailto:chinyanjie@gmail.com" className={`p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-full border ${borderClass} ${hoverBorderClass} transition-all`}>
              <Mail size={24} />
            </a>
            <a href="https://www.linkedin.com/in/jaycob-chin/" target="_blank" rel="noreferrer" className={`p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} rounded-full border ${borderClass} ${hoverBorderClass} transition-all`}>
              <Linkedin size={24} />
            </a>
          </div>
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

    </div >
  );
}
