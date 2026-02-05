'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';

export default function MyopiaGuideArticle() {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const accentHeaderDotClass = isDark ? 'text-blue-400' : 'text-blue-600';

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
        } backdrop-blur-xl border-b ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className={`text-2xl font-bold tracking-tight relative z-10 transition-colors ${
            isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
          }`}>
            JAYCOB<span className={accentHeaderDotClass}>.</span>
          </Link>

          {/* Desktop Menu */}
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
        </div>
      </nav>

      {/* Article Content */}
      <main className="relative z-10 pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Article Header */}
          <header className={`mb-16 p-8 md:p-12 rounded-3xl ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-blue-500/20' 
              : 'bg-gradient-to-br from-blue-100 via-purple-50 to-transparent border border-blue-200'
          }`}>
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase ${
                isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-200 text-blue-700'
              }`}>
                Parent Guide
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300">
              A Parent's Guide to Protecting Your Child's Vision in Singapore
            </h1>
            <p className={`text-lg ${textMutedClass}`}>
              Evidence-based strategies to slow myopia progression and protect your child's long-term eye health
            </p>
          </header>

          {/* Article Body */}
          <div className="max-w-none">
            {/* Introduction */}
            <section className={`mb-12 p-8 md:p-10 rounded-2xl ${
              isDark 
                ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70' 
                : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
            } transition-colors`}>
              <p className="text-lg leading-relaxed mb-4 font-medium">
                As a parent in Singapore, you want the best for your child. You ensure they eat well, do their homework, and get enough sleep. But there's one aspect of their health that often goes unnoticed until it becomes a problem: their eyesight.
              </p>
              <p className="leading-relaxed mb-4">
                Let me share a story from my optometry practice that might sound familiar. Recently, a mother brought her six-year-old daughter in for an eye check. The little girl was squinting at the vision chart, struggling to read even the largest letters. After a comprehensive examination, I discovered she was already -3.50D myopic in both eyes, quite severe for her age. The mother was understandably shocked. "How did this happen so fast?" she asked. "She was fine last year."
              </p>
              <p className="leading-relaxed">
                This isn't an isolated case. As an optometrist practicing here in Singapore, I see this almost daily. And here's something that might surprise you: Singapore has earned the unfortunate title of "Myopia Capital of the World." This isn't just about your child needing glasses, it's about protecting their long-term eye health and preventing serious complications later in life.
              </p>
            </section>

            {/* What Every Singapore Parent Should Know About Myopia */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'}`}>
                  What Every Singapore Parent Should Know
                </span>
              </h2>
              
              <p className="leading-relaxed mb-6 text-base">
                The numbers are concerning, and as a parent, you need to know what we're facing:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className={`p-6 rounded-xl border-t-4 border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800/40' 
                    : 'bg-slate-100'
                }`}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>65%</div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>of children by age 12 have myopia</p>
                </div>
                <div className={`p-6 rounded-xl border-t-4 border-purple-500 ${
                  isDark 
                    ? 'bg-slate-800/40' 
                    : 'bg-slate-100'
                }`}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>83%</div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>by young adulthood</p>
                </div>
                <div className={`p-6 rounded-xl border-t-4 border-amber-500 ${
                  isDark 
                    ? 'bg-slate-800/40' 
                    : 'bg-slate-100'
                }`}>
                  <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>20%</div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>now have high myopia</p>
                </div>
              </div>
              
              <p className="leading-relaxed mb-4 text-base">
                By age 12, approximately 65% of children in Singapore have developed myopia [1]. By young adulthood, this rises to 83% [2] and that's more than eight out of every ten young adults. Even more worrying is that high myopia (severe shortsightedness) is becoming increasingly common. Up to 20% of children now have high myopia, compared to around 10% a decade ago, and children are developing myopia at younger ages than before [3].
              </p>
              
              <div className={`p-6 rounded-xl border-l-4 border-red-500 ${
                isDark 
                  ? 'bg-red-500/10' 
                  : 'bg-red-50'
              }`}>
                <p className="leading-relaxed text-base">
                  <span className={`font-bold ${isDark ? 'text-red-300' : 'text-red-600'}`}>Why This Matters:</span> When myopia starts earlier, there's more time for it to progress, potentially leading to much stronger prescriptions and higher risks of serious eye complications later in life.
                </p>
              </div>
            </section>

            {/* Beyond Glasses */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-red-400 to-pink-400' : 'from-red-600 to-pink-600'}`}>
                  Beyond Glasses: Why Myopia Is More Than Just Blurry Vision
                </span>
              </h2>
              
              <p className="leading-relaxed mb-6 text-base">
                When I tell parents their child has myopia, many respond with, "Well, they'll just need glasses, right?" I understand this reaction, that glasses seem like a simple solution. But there's more to the story, especially when myopia becomes severe.
              </p>
              <p className="leading-relaxed mb-6 text-base font-medium">
                High myopia isn't just an inconvenience; it significantly increases your child's risk of developing serious eye conditions later in life:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className={`p-6 rounded-2xl border-l-4 border-red-500 ${
                  isDark 
                    ? 'bg-gradient-to-r from-red-500/10 to-transparent' 
                    : 'bg-gradient-to-r from-red-100 to-transparent'
                }`}>
                  <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-red-300' : 'text-red-700'}`}>💊 Myopic Macular Degeneration</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    The leading cause of vision loss in highly myopic individuals. As the eyeball elongates excessively, the retina can degenerate, affecting central vision needed for reading and recognizing faces.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-orange-500 ${
                  isDark 
                    ? 'bg-gradient-to-r from-orange-500/10 to-transparent' 
                    : 'bg-gradient-to-r from-orange-100 to-transparent'
                }`}>
                  <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>⚠️ Retinal Detachment</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    The stretching of the eye makes the retina thinner and more prone to tears and detachment. In Singapore, we've even seen cases of pediatric retinal detachment in children with high myopia [4].
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-yellow-500 ${
                  isDark 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' 
                    : 'bg-gradient-to-r from-yellow-100 to-transparent'
                }`}>
                  <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>👁️ Glaucoma & Cataracts</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    High myopia increases the risk of glaucoma (progressive optic nerve disease) and early cataract development, both of which can lead to irreversible vision loss.
                  </p>
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl border-l-4 border-green-500 ${
                isDark 
                  ? 'bg-green-500/10' 
                  : 'bg-green-50'
              }`}>
                <p className="leading-relaxed text-base font-medium">
                  <span className={`${isDark ? 'text-green-300' : 'text-green-700'}`}>✓ The good news?</span> <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>By managing myopia progression now, while your child is young, we can significantly reduce these risks and protect their vision for life.</span>
                </p>
              </div>
            </section>

            {/* Why Is Singapore Facing This Challenge */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-amber-400 to-orange-400' : 'from-amber-600 to-orange-600'}`}>
                  Why Is Singapore Facing This Challenge?
                </span>
              </h2>
              
              <p className="leading-relaxed mb-8 text-base">
                As both an optometrist and a parent in Singapore, I understand the unique pressures our children face. Several factors combine to create our nation's high myopia rates:
              </p>
              
              <div className="space-y-5 mb-8">
                <div className={`p-6 rounded-2xl border-l-4 border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <h3 className={`font-bold text-lg mb-3 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>📚 Academic Intensity</h3>
                  <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Singapore's education system is world-class, but it requires prolonged periods of near work such as reading, writing, and screen time. Research shows that intensive near work is linked to myopia development [5]. While we want our children to excel academically, we also need to balance this with protecting their eye health.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-green-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <h3 className={`font-bold text-lg mb-3 ${isDark ? 'text-green-300' : 'text-green-600'}`}>🌳 Not Enough Outdoor Time</h3>
                  <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    One of the most important findings in myopia research is the protective effect of outdoor time. Natural light exposure and opportunities to look at distant objects help slow myopia development. Current research recommends at least two hours of outdoor time daily [1]. Yet in our busy urban environment, with homework, tuition, and indoor activities, many children get less than 30 minutes outdoors on school days.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-purple-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <h3 className={`font-bold text-lg mb-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>🧬 Genetic Factors</h3>
                  <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Children of East Asian descent have higher myopia rates [6], which means our children may be at higher genetic risk. Combined with environmental factors, this creates a perfect storm for myopia development.
                  </p>
                </div>
              </div>
            </section>

            {/* What Can You Do to Protect Your Child's Vision */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600'}`}>
                  What Can You Do to Protect Your Child's Vision?
                </span>
              </h2>
              
              <div className={`p-6 rounded-2xl mb-8 border-l-4 border-green-500 ${
                isDark 
                  ? 'bg-green-500/10' 
                  : 'bg-green-50'
              }`}>
                <p className="leading-relaxed text-base font-medium">
                  <span className={`${isDark ? 'text-green-300' : 'text-green-700'}`}>💡 The empowering truth:</span> <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>You're not helpless in this situation. There are proven strategies and treatments that can significantly slow myopia progression. As an optometrist, I work with families every day to implement these solutions.</span>
                </p>
              </div>
            </section>

            {/* Simple Lifestyle Changes */}
            <section className="mb-12">
              <h3 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-cyan-400' : 'from-blue-600 to-cyan-600'}`}>
                  Simple Lifestyle Changes That Make a Big Difference
                </span>
              </h3>
              
              <div className="space-y-5 mb-8">
                <div className={`p-6 rounded-2xl border-l-4 border-green-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">🌳</span>
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Prioritize Outdoor Time</h4>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    This is the single most important change you can make. Research confirms that at least two hours of outdoor activity daily can significantly reduce myopia risk [7]. The activity doesn't need to be sports-specific, simply being outdoors in natural light provides the benefit. Consider early morning or evening outdoor play, weekend nature trips, or even outdoor reading sessions.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-amber-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">👁️</span>
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Follow the 20-20-20 Rule</h4>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    For every 20 minutes of close-up work (reading, homework, or screen time), have your child look at something 20 feet away for at least 20 seconds. This simple habit reduces eye strain and gives the focusing system a necessary break.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">💡</span>
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ensure Proper Reading Conditions</h4>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Make sure your child has good lighting for reading and maintains an appropriate distance, at least 30cm from eyes to books or screens. Proper posture and working distance help reduce accommodative stress on the eyes.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-purple-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">📱</span>
                    <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Manage Screen Time Wisely</h4>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    While we can't eliminate screens from modern life, managing total screen time and ensuring regular breaks remains important for eye health. Set daily limits and encourage frequent visual breaks during extended screen use.
                  </p>
                </div>
              </div>
            </section>

            {/* Professional Treatments */}
            <section className="mb-12">
              <h3 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-cyan-400' : 'from-blue-600 to-cyan-600'}`}>
                  Professional Treatments That Slow Myopia Progression
                </span>
              </h3>
              
              <p className="leading-relaxed mb-8 text-base">
                Beyond lifestyle changes, modern optometry offers several evidence-based treatments that can meaningfully slow your child's myopia progression. These aren't experimental as they're backed by solid research and much of it is conducted right here in Singapore.
              </p>

              {/* Spectacle Lenses Card */}
              <div className={`mb-8 p-8 rounded-2xl border-l-4 border-blue-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-500/10 to-slate-800/50' 
                  : 'bg-gradient-to-br from-blue-50 to-slate-50'
              }`}>
                <div className="flex items-start gap-4 mb-4">
                  <span className={`text-3xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>👓</span>
                  <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Myopia Control Spectacle Lenses</h4>
                </div>
                
                <p className="leading-relaxed mb-4 text-sm">
                  If you're hesitant about eye drops or overnight contact lenses, specialized myopia control spectacle lenses offer an excellent non-invasive alternative that your child can wear just like regular glasses.
                </p>
                <p className="leading-relaxed mb-4 text-sm">
                  <span className="font-bold">How They Work:</span> These innovative lenses use special optical designs that provide clear central vision while creating specific peripheral defocus patterns on the retina. This peripheral defocus signals the eye to slow its elongation. The two main technologies available are DIMS (Defocus Incorporated Multiple Segments) lenses and HALT (Highly Aspherical Lenslet Target) lenses, though several other brands are now available globally.
                </p>
                
                <div className={`p-4 rounded-lg mb-4 border-l-2 border-green-500 ${
                  isDark ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <p className="text-sm font-medium">
                    <span className={isDark ? 'text-green-300' : 'text-green-700'}>✓ Effectiveness:</span> These lenses can reduce myopia progression by approximately 30-60% compared to single-vision spectacles [8][9].
                  </p>
                </div>
                
                <p className="text-sm font-bold mb-3">Key Advantages:</p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-blue-300' : 'text-blue-600'}>✓</span>
                    <span>Look nearly identical to regular glasses</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-blue-300' : 'text-blue-600'}>✓</span>
                    <span>Require no special maintenance beyond standard spectacle care</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-blue-300' : 'text-blue-600'}>✓</span>
                    <span>No daily insertion and removal routines like contact lenses</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-blue-300' : 'text-blue-600'}>✓</span>
                    <span>Ideal for younger children (even as young as 6-7 years old)</span>
                  </li>
                </ul>
              </div>

              {/* Ortho-K Card */}
              <div className={`mb-8 p-8 rounded-2xl border-l-4 border-purple-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/10 to-slate-800/50' 
                  : 'bg-gradient-to-br from-purple-50 to-slate-50'
              }`}>
                <div className="flex items-start gap-4 mb-4">
                  <span className={`text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>🌙</span>
                  <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Orthokeratology (Ortho-K)</h4>
                </div>
                
                <p className="leading-relaxed mb-4 text-sm">
                  Orthokeratology, commonly known as Ortho-K, involves wearing specially designed rigid gas-permeable contact lenses overnight that gently reshape the corneal surface while your child sleeps. Think of it like dental braces for the eyes, the lenses apply controlled pressure to temporarily flatten the center of the cornea. When your child removes the lenses in the morning, they can see clearly throughout the day without needing glasses or daytime contact lenses.
                </p>
                
                <div className={`p-4 rounded-lg mb-4 border-l-2 border-green-500 ${
                  isDark ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <p className="text-sm font-medium">
                    <span className={isDark ? 'text-green-300' : 'text-green-700'}>✓ Effectiveness:</span> Ortho-K can reduce myopia progression by approximately 30-60% compared to wearing regular glasses [11].
                  </p>
                </div>
                
                <p className="text-sm font-bold mb-3">Ideal Candidates:</p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-purple-300' : 'text-purple-600'}>•</span>
                    <span>Typically 8-16 years old</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-purple-300' : 'text-purple-600'}>•</span>
                    <span>Myopia between -1.00D to -4.00D</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-purple-300' : 'text-purple-600'}>•</span>
                    <span>Mature hygiene habits and responsibility</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={isDark ? 'text-purple-300' : 'text-purple-600'}>•</span>
                    <span>Strong parental support for daily lens care</span>
                  </li>
                </ul>
                
                <div className={`p-4 rounded-lg border-l-2 border-red-500 ${
                  isDark ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <p className="text-sm font-medium mb-2">
                    <span className={isDark ? 'text-red-300' : 'text-red-700'}>⚠️ Important:</span>
                  </p>
                  <p className="text-sm">
                    While generally safe, meticulous hygiene practices are essential to prevent infections. Regular follow-up appointments with your optometrist are necessary to monitor corneal health.
                  </p>
                </div>
              </div>
            </section>
              </p>
              <p className="leading-relaxed mb-4">
                <strong>The Commitment Required:</strong> Ortho-K requires nightly lens wear, typically 6-8 hours, to maintain the corneal reshaping effect. Missing even one night may cause vision to blur the following day. The daily routine includes carefully inserting and removing lenses, thorough cleaning and disinfection, proper storage, and regular replacement of solutions and cases. Your child will need frequent follow-up visits initially (weekly or bi-weekly), then quarterly check-ups once stabilized. You'll also need to watch for warning signs like redness, pain, light sensitivity, or discharge, which require immediate attention.
              </p>
              <p className="leading-relaxed mb-4">
                Despite these requirements, for motivated families who can commit to the hygiene protocols and regular monitoring, Ortho-K can be an excellent option. Many children love the freedom of not wearing glasses during the day, and parents appreciate the dual benefit of clear vision plus myopia control. The Singapore Optometric Association has published comprehensive Orthokeratology Fitting and Management Guidelines [13] that certified optometrists follow to ensure safe, effective treatment.
              </p>

              <h4 className="text-xl font-bold mb-4 mt-8">Myopia Control Soft Contact Lenses</h4>
              
              <p className="leading-relaxed mb-4">
                For children who are responsible enough for contact lens wear but prefer not to wear lenses overnight, myopia control soft contact lenses offer another excellent option. These are daily wear lenses that combine vision correction with myopia control technology.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>How They Work:</strong> Similar to myopia control spectacles, these soft lenses use special optical designs to create peripheral myopic defocus while maintaining clear central vision. The advantage over spectacles is that the optical treatment moves with the eye, potentially providing more consistent peripheral defocus throughout the day. Available options include dual-focus designs (like MiSight), extended depth of focus designs, and concentric ring designs.
              </p>
              <p className="leading-relaxed mb-4">
                Clinical trials have demonstrated significant efficacy. The MiSight 1 day lens, for example, showed 59% reduction in myopia progression and 52% reduction in axial elongation over 3 years in clinical trials [14]. A 7-year follow-up study confirmed sustained treatment effects, with children who started treatment earlier showing better long-term outcomes [15]. Recent meta-analyses confirm that various soft contact lens designs for myopia control show consistent efficacy, with progression reductions ranging from 30-60% [16].
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Who Are Good Candidates?</strong> These lenses are typically suitable for children aged 8 and older who demonstrate maturity and good hygiene habits, can follow proper insertion and removal techniques, understand the importance of wearing schedules and replacement schedules, and are motivated to wear contact lenses (often for sports, aesthetics, or lifestyle reasons). Parental supervision and support are essential, especially in the first few months.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Daily Wear vs. Ortho-K:</strong> Unlike Ortho-K lenses worn overnight, these soft lenses are worn during the day (typically 10-12 hours) and removed before sleep. Many are available as daily disposables, which eliminates the need for cleaning and storage solutions, reducing infection risk. This can be more convenient for some families, though the ongoing cost of daily disposable lenses may be higher than reusable Ortho-K lenses over time.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Risks to Consider:</strong> While generally safe, soft contact lenses carry similar infection risks to Ortho-K, though the risk is lower with daily disposable lenses compared to reusable lenses. Proper hygiene remains critical: always wash hands before handling lenses, never sleep in lenses not designed for overnight wear, never use water or saliva to wet lenses, replace lenses according to the prescribed schedule, and attend all follow-up appointments. Signs of problems include redness, pain, excessive tearing, light sensitivity, or blurred vision, any of these warrant immediate contact with your eye care provider.
              </p>
              <p className="leading-relaxed mb-4">
                Your optometrist can help determine which myopia control option, spectacles, soft contact lenses, or Ortho-K, best suits your child's needs, lifestyle, and maturity level.
              </p>

              <h4 className="text-xl font-bold mb-4 mt-8">Low-Dose Atropine Eye Drops</h4>
              
              <p className="leading-relaxed mb-4">
                Singapore has actually led the world in atropine myopia research through our landmark ATOM (Atropine for the Treatment of Myopia) studies. Low-dose atropine eye drops (0.01% to 0.05% concentration) can effectively slow myopia progression, reducing progression by 43-67% over two years [17][18].
              </p>
              <p className="leading-relaxed mb-4">
                Long-term safety data from 10-20 year follow-up studies show atropine is safe with no long-term adverse effects [19]. These aren't marginal improvements, they're clinically significant reductions that can help prevent high myopia and its complications.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>What Parents Should Know About Side Effects:</strong> While low-dose atropine is generally well-tolerated, it's important to understand potential side effects. Common short-term effects may include light sensitivity and difficulty focusing on near objects, though these are typically mild at low concentrations. More importantly, parents should be aware of the rebound effect, when treatment is stopped, some children may experience a temporary acceleration in myopia progression. This is why it's crucial to work closely with your eye care professional to develop a long-term management plan, including strategies for eventually tapering off treatment rather than stopping abruptly. Your ophthalmologist will monitor your child regularly to ensure the benefits continue to outweigh any side effects.
              </p>
              <p className="leading-relaxed mb-4">
                Currently, atropine requires a prescription from an ophthalmologist. Your optometrist can refer you if this treatment is appropriate for your child.
              </p>
            </section>

            {/* Singapore's National Efforts */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Singapore's National Efforts: You're Not Alone in This</h2>
              
              <p className="leading-relaxed mb-4">
                Singapore takes childhood myopia seriously. The National Myopia Prevention Programme (NMPP), implemented since 2001, works through two main approaches [1]:
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Public Education:</strong> Raising awareness about myopia risks and prevention, particularly emphasizing outdoor activities as a protective factor.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Vision Screening:</strong> Systematic screening in primary schools conducted annually by the Health Promotion Board for children from Kindergarten 1 to Primary 4 [20].
              </p>
              <p className="leading-relaxed mb-4">
                The programme has shown encouraging results. Myopia prevalence among Primary 1 students decreased to 26% in 2023, down from around 30% in the mid-2000s [20]. Overall primary school myopia rates fell from 37.7% to 29.3% between 2004 and 2015 [1].
              </p>
              <p className="leading-relaxed mb-4">
                However, school screenings are just the starting point. For comprehensive assessment and personalized myopia management, a full optometric examination is essential.
              </p>
            </section>

            {/* Your Action Plan */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-blue-400' : 'from-indigo-600 to-blue-600'}`}>
                  Your Action Plan: Steps to Take Today
                </span>
              </h2>
              
              <p className="leading-relaxed mb-8 text-base font-medium">
                Early intervention makes a tremendous difference. Every year of rapid myopia progression that we prevent is meaningful. Here's what I recommend:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className={`p-6 rounded-2xl border-l-4 border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">👁️</span>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Schedule a Comprehensive Eye Examination</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Book an appointment for your child by age 3-4, even if they show no obvious vision problems. Early baseline measurements allow us to track changes over time and intervene promptly if myopia develops. Don't rely solely on school screenings, comprehensive optometry examinations offer more detailed assessment and earlier detection.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-red-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">📈</span>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Take Progression Seriously</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    If your child's myopia is progressing rapidly (more than -0.50D per year), ask your optometrist about myopia control interventions. The goal isn't just clearer vision now, it's preventing high myopia and its complications later in life.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-green-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">🌞</span>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Make Outdoor Time Non-Negotiable</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    I know our climate is hot and humid. I know academic demands are intense. But two hours of outdoor time daily can make a significant difference in protecting your child's vision. Build it into your family routine as it's one of the most powerful tools you have.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl border-l-4 border-purple-500 ${
                  isDark 
                    ? 'bg-slate-800/40 hover:bg-slate-800/60' 
                    : 'bg-slate-50 hover:bg-slate-100'
                } transition-colors`}>
                  <div className="flex gap-3 items-start mb-3">
                    <span className="text-2xl">👨‍⚕️</span>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Choose a Myopia-Focused Optometrist</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Ask whether they offer myopia control options, attend continuing education in this area, and take detailed measurements beyond basic refraction. An optometrist who stays current with myopia management research can provide the most effective care for your child.
                  </p>
                </div>
              </div>
            </section>

            {/* A Real Success Story */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-600'}`}>
                  A Real Success Story
                </span>
              </h2>
              
              <div className={`p-8 rounded-2xl border-l-4 border-emerald-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-emerald-500/10 to-slate-800/50' 
                  : 'bg-gradient-to-br from-emerald-50 to-slate-50'
              }`}>
                <p className="leading-relaxed mb-6 text-base">
                  Remember that six-year-old girl I mentioned at the beginning? We started her on myopia control spectacle lenses immediately and worked with her parents to increase outdoor time and implement better visual habits.
                </p>
                
                <div className={`p-6 rounded-2xl mb-6 border-l-4 border-green-500 ${
                  isDark 
                    ? 'bg-green-500/10' 
                    : 'bg-green-100/50'
                }`}>
                  <p className="text-base font-bold mb-3">
                    <span className={isDark ? 'text-green-300' : 'text-green-700'}>📊 The Result:</span>
                  </p>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    One year later, her myopia had progressed only <strong>-0.25D</strong> instead of the <strong>-0.75D to -1.00D</strong> we would have expected without intervention. That's a <strong>70-75% reduction in progression</strong> — a remarkable outcome.
                  </p>
                </div>
                
                <p className="leading-relaxed text-base">
                  That might seem like a small difference, but over the course of her childhood, it could mean the difference between moderate myopia and sight-threatening high myopia. This child is now on track for much better long-term eye health.
                </p>
              </div>
            </section>
              </p>
              <p className="leading-relaxed mb-4">
                Her mother recently told me, "I wish I had known about this earlier. But I'm so grateful we're doing something now." And that's exactly the message I want to share with you that it's never too early to start protecting your child's vision.
              </p>
            </section>

            {/* Your Child's Vision Is Worth Protecting */}
            <section className="mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-pink-400 to-rose-400' : 'from-pink-600 to-rose-600'}`}>
                  Your Child's Vision Is Worth Protecting
                </span>
              </h2>
              
              <div className={`space-y-4 mb-8`}>
                <div className={`p-6 rounded-2xl ${
                  isDark 
                    ? 'bg-slate-800/50 border border-slate-700/50' 
                    : 'bg-slate-100 border border-slate-200'
                }`}>
                  <p className="leading-relaxed text-base">
                    Singapore faces a significant challenge with childhood myopia, but we also have access to evidence-based solutions. What we need is awareness and action.
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl ${
                  isDark 
                    ? 'bg-slate-800/50 border border-slate-700/50' 
                    : 'bg-slate-100 border border-slate-200'
                }`}>
                  <p className="leading-relaxed text-base">
                    As a parent, you have more power than you might realize. Simple lifestyle changes, combined with appropriate professional interventions when needed, can make a meaningful difference in your child's long-term eye health.
                  </p>
                </div>
                
                <div className={`p-8 rounded-2xl border-l-4 border-purple-500 ${
                  isDark 
                    ? 'bg-gradient-to-br from-purple-500/10 to-transparent' 
                    : 'bg-gradient-to-br from-purple-100 to-transparent'
                }`}>
                  <p className="leading-relaxed text-base font-medium mb-4">
                    Your child's vision is precious. Their future depends on being able to see clearly, not just now, but for decades to come.
                  </p>
                  <p className="leading-relaxed text-base">
                    By taking action today — whether it's scheduling that eye exam, prioritizing outdoor time, or exploring myopia control treatments — you're investing in their lifelong eye health.
                  </p>
                </div>
              </div>
              
              <div className={`p-8 rounded-2xl border-l-4 border-blue-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-500/10 to-transparent' 
                  : 'bg-gradient-to-br from-blue-100 to-transparent'
              }`}>
                <p className="leading-relaxed text-base mb-4">
                  I became an optometrist to help families like yours. I'm passionate about protecting children's vision and giving parents the knowledge they need to make informed decisions. Together, we can change the trajectory of Singapore's myopia epidemic, one child at a time.
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  Let's protect their vision together.
                </p>
              </div>
            </section>

            {/* References */}
            <section className="mb-12 pt-8 border-t border-slate-700/50">
              <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-cyan-400 to-blue-400' : 'from-cyan-600 to-blue-600'}`}>
                  References
                </span>
              </h2>
              
              <div className={`p-6 rounded-2xl mb-4 ${
                isDark 
                  ? 'bg-slate-800/40' 
                  : 'bg-slate-50'
              }`}>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} font-medium mb-4`}>
                  Evidence-based sources supporting the information in this guide:
                </p>
              </div>
              
              <ol className={`list-decimal pl-6 space-y-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>Karuppiah, V., Wong, L., Tay, V., Ge, X., & Kang, L. L. (2021). School-based programme to address childhood myopia in Singapore. <em>Singapore Medical Journal, 62</em>(2), 63–68. <a href="https://doi.org/10.11622/smedj.2019144" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.11622/smedj.2019144</a></li>
                <li>Ministry of Health Singapore. (2019). Speech by Dr Lam Pin Min, Senior Minister of State for Health, at the opening of the Singapore National Eye Centre's Myopia Centre. <a href="https://www.moh.gov.sg/newsroom/speech-by-dr-lam-pin-min-senior-minister-of-state-for-health-at-the-opening-of-the-singapore-national-eye-centre-s-myopia-centre-16-august-2019/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://www.moh.gov.sg/newsroom/speech-by-dr-lam-pin-min-senior-minister-of-state-for-health-at-the-opening-of-the-singapore-national-eye-centre-s-myopia-centre-16-august-2019/</a></li>
                <li>National University Hospital. (2024). Understanding and preventing high myopia in children. <a href="https://www.nuh.com.sg/health-resources/newsletter/envisioninghealth---changing-lives-one-idea-at-a-time/understanding-and-preventing-high-myopia-in-children" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://www.nuh.com.sg/health-resources/newsletter/envisioninghealth---changing-lives-one-idea-at-a-time/understanding-and-preventing-high-myopia-in-children</a></li>
                <li>Cheong, K.-X., Jiang, Y., Htoon, H. M., Pan, W., Foo, L.-L., Hu, Z., ... & Saw, S.-M. (2025). Characteristics of myopic traction maculopathy in the Aier-SERI High Myopia Adult Cohort Study. <em>Ophthalmology Science, 5</em>(6), Article 100894. <a href="https://doi.org/10.1016/j.xops.2025.100894" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1016/j.xops.2025.100894</a></li>
                <li>McCrann, S., Loughman, J., Butler, J. S., Paudel, N., & Flitcroft, D. I. (2021). Smartphone use as a possible risk factor for myopia. <em>Clinical and Experimental Optometry, 104</em>(1), 35–41. <a href="https://doi.org/10.1111/cxo.13092" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1111/cxo.13092</a></li>
                <li>Xu, L., Ma, Y., Yuan, J., Zhang, Y., Wang, H., Zhang, G., ... & Jonas, J. B. (2024). Global prevalence, trend and projection of myopia in children and adolescents from 1990 to 2050. <em>British Journal of Ophthalmology, 109</em>(3), 362–371. <a href="https://doi.org/10.1136/bjo-2024-325427" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1136/bjo-2024-325427</a></li>
                <li>Sun, Y., Zhao, L., Li, X., & Wang, Y. (2024). Efficacy of outdoor interventions for myopia in children and adolescents: A systematic review and meta-analysis of randomized controlled trials. <em>Frontiers in Public Health, 12</em>, Article 1452567. <a href="https://doi.org/10.3389/fpubh.2024.1452567" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.3389/fpubh.2024.1452567</a></li>
                <li>Lam, C. S. Y., Tang, W. C., Tse, D. Y. Y., Lee, R. P. K., Chun, R. K. M., Hasegawa, K., ... & To, C. H. (2020). Defocus Incorporated Multiple Segments (DIMS) spectacle lenses slow myopia progression: A 2-year randomised clinical trial. <em>British Journal of Ophthalmology, 104</em>(3), 363–368. <a href="https://doi.org/10.1136/bjophthalmol-2018-313739" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1136/bjophthalmol-2018-313739</a></li>
                <li>Shah, R. L. (2024). High myopia: Reviews of myopia control strategies and myopia complications. <em>Ophthalmic and Physiological Optics, 44</em>(5), 1011–1025. <a href="https://doi.org/10.1111/opo.13366" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1111/opo.13366</a></li>
                <li>Lam, C. S. Y., & Zhang, H. Y. (2023). Myopia control spectacle lenses: A narrative review. <em>Japanese Journal of Ophthalmology, 67</em>(2), 337–352. <a href="https://doi.org/10.1007/s10384-023-00985-4" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1007/s10384-023-00985-4</a></li>
                <li>Cho, P., & Cheung, S. W. (2012). Retardation of myopia in Orthokeratology (ROMIO) study: A 2-year randomized clinical trial. <em>Investigative Ophthalmology & Visual Science, 53</em>(11), 7077–7085. <a href="https://doi.org/10.1167/iovs.12-10565" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1167/iovs.12-10565</a></li>
                <li>Bullimore, M. A., Sinnott, L. T., & Jones-Jordan, L. A. (2013). The risk of microbial keratitis with overnight corneal reshaping lenses. <em>Optometry and Vision Science, 90</em>(9), 937–944. <a href="https://doi.org/10.1097/OPX.0b013e31829cac92" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1097/OPX.0b013e31829cac92</a></li>
                <li>Singapore Optometric Association. (2024). Orthokeratology fitting and management guidelines (Ver. 1.0). <a href="https://singaporeoptometricassociation.com/wp-content/uploads/2024/05/SOA-Orthokeratology-Fitting-and-Management-Guideline2024.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://singaporeoptometricassociation.com/wp-content/uploads/2024/05/SOA-Orthokeratology-Fitting-and-Management-Guideline2024.pdf</a></li>
                <li>Chamberlain, P., Peixoto-de-Matos, S. C., Logan, N. S., Ngo, C., Jones, D., & Young, G. (2019). A 3-year randomized clinical trial of MiSight lenses for myopia control. <em>Optometry and Vision Science, 96</em>(8), 556–567. <a href="https://doi.org/10.1097/OPX.0000000000001410" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1097/OPX.0000000000001410</a></li>
                <li>Chamberlain, P., Bradley, A., Arumugam, B., Hammond, D., McNally, J., Logan, N. S., Jones, D., Ngo, C., & Young, G. (2022). Long-term effect of dual-focus contact lenses on myopia progression in children: A 6-year multicenter clinical trial. <em>Optometry and Vision Science, 99</em>(3), 204–212. <a href="https://doi.org/10.1097/OPX.0000000000001858" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1097/OPX.0000000000001858</a></li>
                <li>Sankaridurg, P., Berntsen, D., Bullimore, M., Cho, P., Flitcroft, I., Gawne, T., ... & Wildsoet, C. F. (2023). IMI 2023 Digest. <em>Investigative Ophthalmology & Visual Science, 64</em>(6), Article 7. <a href="https://doi.org/10.1167/iovs.64.6.7" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1167/iovs.64.6.7</a></li>
                <li>Chia, A., Chua, W.-H., Cheung, Y.-B., Wong, W.-L., Lingham, G., Fong, A., & Tan, D. (2012). Atropine for the treatment of childhood myopia: Safety and efficacy of 0.5%, 0.1%, and 0.01% doses (Atropine for the Treatment of Myopia 2). <em>Ophthalmology, 119</em>(2), 347–354. <a href="https://doi.org/10.1016/j.ophtha.2011.07.031" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1016/j.ophtha.2011.07.031</a></li>
                <li>Yam, J. C., Zhang, X. J., Zhang, Y., Yip, B. H. K., Tang, F., Wong, E. S., ... & Pang, C. P. (2023). Effect of low-concentration atropine eyedrops vs placebo on myopia incidence in children: The LAMP2 randomized clinical trial. <em>JAMA, 329</em>(6), 472–481. <a href="https://doi.org/10.1001/jama.2022.24162" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1001/jama.2022.24162</a></li>
                <li>Li, Y., Yip, M., Ning, Y., Chung, J., Toh, A., Leow, C., ... & Ang, M. (2024). Topical atropine for childhood myopia control: The Atropine Treatment Long-term Assessment Study. <em>JAMA Ophthalmology, 142</em>(1), 15–23. <a href="https://doi.org/10.1001/jamaophthalmol.2023.5467" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://doi.org/10.1001/jamaophthalmol.2023.5467</a></li>
                <li>Singapore Ministry of Health. (2025). Speech by Dr Koh Poh Koon at the Singapore Optometric Association Conference. <a href="https://www.moh.gov.sg/newsroom/speech-by-dr-koh-poh-koon--senior-minister-of-state--ministry-of-health--and-ministry-of-manpower--at-the-singapore-optometric-association-conference" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://www.moh.gov.sg/newsroom/speech-by-dr-koh-poh-koon--senior-minister-of-state--ministry-of-health--and-ministry-of-manpower--at-the-singapore-optometric-association-conference</a></li>
              </ol>
            </section>

            {/* About the Author */}
            <section className={`mt-16 p-8 rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-4">About the Author</h2>
              <p className="leading-relaxed mb-4">
                Jaycob Chin, FIAOMC, is an optometrist at EMME Visioncare dedicated to combating childhood myopia. He works to raise awareness about Singapore's myopia epidemic and help parents protect their children's vision.
              </p>
              
              <h2 className="text-xl font-bold mb-4 mt-6">Disclaimer</h2>
              <p className={`text-sm ${textMutedClass} italic`}>
                This article is for educational purposes and does not constitute medical advice. Always consult with a qualified optometrist or ophthalmologist for personalized eye care recommendations.
              </p>
            </section>
          </div>

          {/* Back to Articles */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <Link 
              href="/#write" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all articles
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
