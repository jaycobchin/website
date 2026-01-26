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
    'cl-rx-vertex-calculator': '/tools/cl-rx-vertex-calculator'
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

  // Sync URL with selected tool on mount
  useEffect(() => {
    if (pathname && pathToTool[pathname]) {
      setSelectedProject(pathToTool[pathname]);
    }
  }, []);

  // Update URL when tool is selected
  useEffect(() => {
    if (selectedProject && toolPaths[selectedProject]) {
      router.push(toolPaths[selectedProject]);
    } else if (!selectedProject && pathname !== '/') {
      // Only push to home if we're clearing a tool and not already on home
      if (pathname.startsWith('/tools/')) {
        router.push('/');
      }
    }
  }, [selectedProject]);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      if (pathname === '/') {
        setSelectedProject(null);
      } else if (pathToTool[pathname]) {
        setSelectedProject(pathToTool[pathname]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname]);

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
      description: 'Convert spectacle prescriptions to contact lens powers with vertex distance adjustment; includes K conversions and common K values.'
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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? `${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-lg py-2` : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold tracking-tight relative z-10">
            JAYCOB<span className="text-blue-400">.</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 relative z-10">
            <a href="#philosophy" className="hover:text-blue-400 transition-colors">Philosophy</a>
            <a href="#work-experience" className="hover:text-blue-400 transition-colors">Work</a>
            <a href="#write" className="hover:text-blue-400 transition-colors">Write</a>
            <a href="#work" className="hover:text-blue-400 transition-colors">Tools</a>
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
              <a href="#work-experience" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Work</a>
              <a href="#write" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Write</a>
              <a href="#work" className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>Tools</a>
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
      <section className="min-h-screen flex items-center justify-center px-6 pt-16 md:pt-20 relative z-10">
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
              <div className={`flex gap-4 mt-12`}>
                <div className={`border-l-4 border-blue-400 pt-1`}></div>
                <div>
                  <p className={`text-lg md:text-xl font-light italic ${textMutedClass}`}>
                    &quot;The simple act of caring is heroic.&quot;
                  </p>
                  <p className="text-sm text-blue-400 mt-2">— Edward Albert</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <a href="#work-experience" className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition-all text-sm md:text-base">
                  View My Work
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </a>
                <a href="#contact" className={`px-6 py-3 border ${borderClass} hover:border-blue-400 rounded-full transition-all text-sm md:text-base`}>
                  Get In Touch
                </a>
              </div>
            </div>

            {/* Right side - Photo */}
            <div className="flex justify-center md:justify-center items-start md:items-start -mt-12 md:-mt-16">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Your profile photo */}
                <img 
                  src="/jaycob_chin.jpg"
                  alt="Jaycob Chin - Optometrist"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className={`absolute inset-0 rounded-full border-4 ${borderClass}`} />
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
                My <span className="text-blue-400">Philosophy</span>
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

            <div className="w-full">
              <img 
                src="/philosophy_himalaya_scenery.jpeg" 
                alt="Philosophy - Himalaya Scenery" 
                className="w-full h-96 object-cover rounded-2xl border shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work-experience" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Work
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Clinical Practice Card */}
            <div 
              className="group relative p-8 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedWork('clinical')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-white">
                <p className="text-xs uppercase tracking-wider mb-2 opacity-90">Work Experience</p>
                <h3 className="text-xl font-bold mb-4">Clinical Practice</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Years of hands-on experience providing comprehensive eye care to diverse patient populations, focusing on myopia management and preventive care strategies.
                </p>
                <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Click to open</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Professional Appointment Card */}
            <div 
              className="group relative p-8 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedWork('professional')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-white">
                <p className="text-xs uppercase tracking-wider mb-2 opacity-90">Work Experience</p>
                <h3 className="text-xl font-bold mb-4">Professional Appointment</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Appointed positions in professional organizations, contributing to standards development and advancing best practices in optometry across the region.
                </p>
                <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Click to open</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Community Engagement Card */}
            <div 
              className="group relative p-8 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedWork('community')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-white">
                <p className="text-xs uppercase tracking-wider mb-2 opacity-90">Work Experience</p>
                <h3 className="text-xl font-bold mb-4">Community Engagement</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Active involvement in community education initiatives, helping raise awareness about eye health and supporting vision care accessibility for all.
                </p>
                <div className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Click to open</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Write Section */}
      <section id="write" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Write
          </h2>
          <p className={`text-lg ${textMutedClass} max-w-3xl mb-12`}>
            Short, practical posts about optometry, myopia management, and day-to-day clinic insights. This is where I share reflections, explain complex topics simply, and document lessons learned.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl border ${borderClass} ${isDark ? 'bg-white/5' : 'bg-white'} hover:border-blue-400/50 transition-all`}>
              <p className="text-xs uppercase tracking-wider text-blue-400 mb-2">Clinical Notes</p>
              <h3 className="text-xl font-bold mb-3">What I Look For During a Pediatric Eye Check</h3>
              <p className={`text-sm ${textLightClass} leading-relaxed mb-4`}>
                A practical walkthrough of the key checkpoints that help me spot early issues and reassure parents.
              </p>
              <span className={`text-xs ${textLightClass}`}>Coming soon</span>
            </div>

            <div className={`p-8 rounded-2xl border ${borderClass} ${isDark ? 'bg-white/5' : 'bg-white'} hover:border-blue-400/50 transition-all`}>
              <p className="text-xs uppercase tracking-wider text-blue-400 mb-2">Parent Guides</p>
              <h3 className="text-xl font-bold mb-3">Myopia Myths I Hear Every Week</h3>
              <p className={`text-sm ${textLightClass} leading-relaxed mb-4`}>
                Clearing up the most common misconceptions with research-backed, parent-friendly explanations.
              </p>
              <span className={`text-xs ${textLightClass}`}>Coming soon</span>
            </div>

            <div className={`p-8 rounded-2xl border ${borderClass} ${isDark ? 'bg-white/5' : 'bg-white'} hover:border-blue-400/50 transition-all`}>
              <p className="text-xs uppercase tracking-wider text-blue-400 mb-2">Research Digest</p>
              <h3 className="text-xl font-bold mb-3">One Study, Three Takeaways</h3>
              <p className={`text-sm ${textLightClass} leading-relaxed mb-4`}>
                Quick summaries of evidence-based updates with clear implications for practice and families.
              </p>
              <span className={`text-xs ${textLightClass}`}>Coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen flex items-center px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Useful <span className="text-blue-400">Tools</span>
          </h2>

          <div className={`inline-flex items-center gap-1 mb-10 px-1 py-1 rounded-full backdrop-blur-sm shadow-md shadow-black/10 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-100 border border-gray-200/40'}`}>
            <button
              onClick={() => setSelectedProfile('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedProfile === 'all'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : isDark
                    ? 'text-white/80 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              All
            </button>
            <button
              onClick={() => setSelectedProfile('parents')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedProfile === 'parents'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : isDark
                    ? 'text-white/80 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-300" />
              Parents
            </button>
            <button
              onClick={() => setSelectedProfile('optometrists')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedProfile === 'optometrists'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : isDark
                    ? 'text-white/80 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-indigo-300" />
              Optometrists
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105`}
                onClick={() => project.id && setSelectedProject(project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 text-white">
                  <p className="text-xs uppercase tracking-wider mb-2 opacity-90">{project.category}</p>
                  <h3 className="text-xl font-bold mb-4">{project.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click to open tool</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors Analysis Modal */}
      {selectedProject === 'risk-factors-analysis' && (
        <RiskFactorsAnalysis isDark={isDark} onClose={() => { setSelectedProject(null); router.push('/'); }} />
      )}
      {/* Progression Calculator Modal */}
      {selectedProject === 'progression-calculator' && (
        <MyopiaProgressionCalculator isDark={isDark} onClose={() => { setSelectedProject(null); router.push('/'); }} />
      )}
      {/* Axial Length Estimation Modal */}
      {selectedProject === 'axial-length-estimation' && (
        <AxialLengthEstimation isDark={isDark} onClose={() => { setSelectedProject(null); router.push('/'); }} />
      )}
      {/* Vision Simulator Modal */}
      {selectedProject === 'vision-simulator' && (
        <VisionSimulator isDark={isDark} onClose={() => { setSelectedProject(null); router.push('/'); }} />
      )}

      {/* CL Rx Vertex Calculator Modal */}
      {selectedProject === 'cl-rx-vertex-calculator' && (
        <ContactLensVertexCalculator isDark={isDark} onClose={() => { setSelectedProject(null); router.push('/'); }} />
      )}

      {/* Work Experience Modals */}
      {selectedWork === 'clinical' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedWork(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
              <h1 className="text-2xl font-bold text-slate-800">Clinical Practice</h1>
              <button
                onClick={() => setSelectedWork(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-8 leading-relaxed text-gray-800">
              {/* Profile Photo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="/Clinical Practice/jaycob_chin_profile.JPG" 
                  alt="Jaycob Chin Profile" 
                  className="w-40 h-40 rounded-full object-cover shadow-lg"
                />
              </div>

              <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Jaycob Chin, FIAOMC</h2>
              <p className="text-center text-gray-600 mb-2 text-sm">Optometrist</p>
              
              <div className="text-center mb-8 text-sm text-gray-700 space-y-1">
                <p>M.Sc Optom (Aust), B.Sc Optom (U.S.A.), Dip. Optom (S'pore)</p>
                <p>Full Registration, Singapore Optometrists and Opticians Board</p>
                <p>Council Member, Singapore Optometric Association</p>
                <p>Fellow, American Academy of Orthokeratology and Myopia Control</p>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <p className="text-gray-800 mb-6">
                  I am a fully licensed and registered optometrist currently practicing at <a href="https://www.emmevisioncare.com" className="text-blue-700 underline" target="_blank" rel="noreferrer"><strong>EMME Visioncare</strong></a> in HarbourFront Centre, Singapore. With a holistic approach to vision care, I go beyond simply prescribing glasses or contact lenses. I prioritize comprehensive eye examinations that focus on overall eye health and truly understand each patient's unique needs.
                </p>

                <p className="text-gray-800 mb-6">
                  My educational journey has taken me across Singapore, the United States, and Australia. This strengthens my commitment to personalized eye care. I stay at the forefront of optometric advancements, with a strong emphasis on early prevention and detection of ocular conditions, and pediatric issues like amblyopia. I have a particular passion for myopia control, including orthokeratology, and specialized care in low vision, geriatric patients, and therapeutic contact lenses. Recently, I earned my certification in Evidence-Based Myopia Management from <a href="https://www.unsw.edu.au/" className="text-blue-700 underline" target="_blank" rel="noreferrer">UNSW</a>, reflecting my dedication to the latest research-driven approaches.
                </p>

                <p className="text-gray-800 mb-6">
                  Over the years, I have built extensive clinical experience helping patients find tailored vision solutions that fit their lifestyle, work, and daily activities. These include everything from prescription glasses and sunglasses to advanced contact lenses (including hybrid and scleral lenses) and non-surgical therapeutic options. In my practice at <a href="https://www.emmevisioncare.com" className="text-blue-700 underline" target="_blank" rel="noreferrer">EMME Visioncare</a>, I conduct thorough eye health assessments, co-manage conditions with other healthcare professionals when needed, and mentor colleagues in complex contact lens fitting.
                </p>

                <p className="text-gray-800 mb-6">
                  In leadership and educational roles, I have overseen operations, led staff training, contributed to business growth, and served as an Associate Lecturer in <a href="https://www.np.edu.sg/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Ngee Ann Polytechnic</a> while pursuing my Doctor of Optometry degree from <a href="https://www.aston.ac.uk/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Aston University</a>. I also hold a Master's in Clinical Optometry and remain deeply committed to lifelong learning and sharing knowledge.
                </p>

                <p className="text-gray-800">
                  I am driven by a deep commitment to eye health, evidence-based practice, and making quality vision care available to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedWork === 'professional' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedWork(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
              <h1 className="text-2xl font-bold text-slate-800">Professional Appointment</h1>
              <button
                onClick={() => setSelectedWork(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-8 leading-relaxed text-gray-800">
              <p className="text-base mb-8 text-gray-800">
                I was nominated to join a professional association in handling optometry matters. It has shown me the big gap between optometrists and other healthcare professionals. I hope that this website that I have created can help the public, parents and fellow healthcare folks better understand what optometrists do as the main primary eye care provider.
              </p>

              <h3 className="text-2xl font-bold mb-6 text-blue-900">Singapore Optometric Association (SOA)</h3>
              
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <h4 className="font-bold text-slate-700 text-lg">Council Member</h4>
                  <p className="text-sm text-gray-600 mb-2">Dec 2025 – Present</p>
                  <p className="text-gray-700">Responsible for social media management, driving community growth and engagement.</p>
                </div>

                <div className="pb-4 border-b">
                  <h4 className="font-bold text-slate-700 text-lg">Treasurer</h4>
                  <p className="text-sm text-gray-600 mb-2">Dec 2023 – Dec 2025</p>
                  <p className="text-gray-700 mb-4">Oversee financial operations and governance for the association.</p>
                  <h5 className="font-bold text-slate-700">Student Liaison Officer</h5>
                  <p className="text-gray-700">Focused on digital outreach (LinkedIn & Meta platforms). Built and managed social media presence, leading to significant growth: +1K followers on LinkedIn and +2K followers on Meta.</p>
                </div>

                <div className="pb-4 border-b">
                  <h4 className="font-bold text-slate-700 text-lg">9th SOA Conference 2024 – Organizing Chair</h4>
                  <p className="text-gray-700">Led the organization and execution of the annual conference.</p>
                </div>

                <div className="pb-4 border-b">
                  <h4 className="font-bold text-slate-700 text-lg">10th SOA Conference 2025 – Organizing Committee Member</h4>
                  <p className="text-gray-700">Contributed to operations and planning for the event.</p>
                </div>

                <div className="pb-4">
                  <h4 className="font-bold text-slate-700 text-lg">Council Member</h4>
                  <p className="text-sm text-gray-600 mb-2">Dec 2020 – Dec 2023</p>
                  <p className="text-gray-700">Drove membership growth, produced newsletters, and organized conferences and webinars.</p>
                </div>
              </div>

              {/* Photo Gallery Carousel */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">Photo Gallery</h3>
                
                <div className="relative flex flex-col items-center gap-6 bg-gray-50 p-8 rounded-lg">
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
                  <p className="text-lg font-medium text-slate-800 text-center">{galleryImages[currentImageIndex].caption}</p>
                  
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
                        className={`flex-shrink-0 transition-all border-2 rounded-lg overflow-hidden ${
                          index === currentImageIndex ? 'border-blue-500 opacity-100' : 'border-gray-300 opacity-60 hover:opacity-100'
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
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-blue-500 w-8' : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedWork === 'community' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => { setSelectedWork(null); setCurrentGallery('professional'); setCurrentImageIndex(0); }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
              <h1 className="text-2xl font-bold text-slate-800">Community Engagement</h1>
              <button
                onClick={() => { setSelectedWork(null); setCurrentGallery('professional'); setCurrentImageIndex(0); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-8 leading-relaxed text-gray-800">
              <p className="text-base mb-6 text-gray-800">
                I have taken part in volunteer work both locally and overseas.
              </p>
              <p className="text-base mb-6 text-gray-800">
                I worked with <a href="https://givingsight.org/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Optometry Giving Sight (OGS)</a> locally to organize full eye checks and provide free spectacles to needy families in Singapore.
              </p>
              <p className="text-base mb-8 text-gray-800">
                Overseas, I joined <a href="https://lionsclubs.org.sg/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Lions Club Singapore</a> for eye screening programs in Myanmar, and also worked with <a href="https://www.facebook.com/humanitarianwithlove/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Humanitarian with Love</a> and <a href="https://www.facebook.com/CISACAMBODIA/" className="text-blue-700 underline" target="_blank" rel="noreferrer">Khmer Sight Foundation</a> to do eye screenings in Cambodia. Those patients in need will be referred for further treatment if necessary. The foundation in Cambodia keeps reaching out to rural areas so people there can get help in time.
              </p>

              {/* Photo Gallery Carousel */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">Photo Gallery</h3>
                
                <div className="relative flex flex-col items-center gap-6 bg-gray-50 p-8 rounded-lg">
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
                  <p className="text-lg font-medium text-slate-800 text-center">{communityImages[currentImageIndex].caption}</p>
                  
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
                        className={`flex-shrink-0 transition-all border-2 rounded-lg overflow-hidden ${
                          index === currentImageIndex ? 'border-blue-500 opacity-100' : 'border-gray-300 opacity-60 hover:opacity-100'
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
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-blue-500 w-8' : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Carousel Modal */}
      {selectedImage && (
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
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="min-h-[70vh] flex items-start px-6 pt-28 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Make Eye Care
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
