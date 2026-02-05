'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClinicalExperience() {
  const [isDark, setIsDark] = useState(false);

  // Check for dark mode
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark !== isDark) {
      setIsDark(prefersDark);
    }
  }

  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const mutedClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const accentClass = isDark ? 'text-teal-400' : 'text-teal-600';

  return (
    <main className={`min-h-screen ${bgClass} ${textClass}`}>
      {/* Navigation */}
      <nav className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} sticky top-0 z-40 backdrop-blur-md ${isDark ? 'bg-black/50' : 'bg-white/50'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity w-fit">
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 md:px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <img
              src="/Clinical Practice/jaycob_chin_profile.JPG"
              alt="Jaycob Chin"
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <div>
              <h1 className="text-5xl font-bold mb-2">Jaycob Chin, FIAOMC</h1>
              <p className={`text-xl ${accentClass} font-medium mb-4`}>Expert care for your child's vision</p>
              <p className={mutedClass}>Optometrist | Singapore</p>
            </div>
          </div>

          {/* Credentials */}
          <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-6 mb-12`}>
            <h2 className="text-xl font-bold mb-4">Credentials & Qualifications</h2>
            <ul className={`space-y-2 ${mutedClass}`}>
              <li>• M.Sc Optom (Aust), B.Sc Optom (U.S.A.), Dip. Optom (S'pore)</li>
              <li>• Full Registration, Singapore Optometrists and Opticians Board</li>
              <li>• Fellow, American Academy of Orthokeratology and Myopia Control</li>
              <li>• Council Member, Singapore Optometric Association</li>
              <li>• Evidence-Based Myopia Management Certification (UNSW)</li>
              <li>• Doctor of Optometry (Aston University)</li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-4">Clinical Practice</h2>
              <p className={mutedClass}>
                I am a fully licensed and registered optometrist currently practicing at{' '}
                <a href="https://www.emmevisioncare.com" target="_blank" rel="noreferrer" className={`font-semibold ${accentClass} hover:opacity-80 transition-opacity`}>
                  EMME Visioncare
                </a>{' '}
                in HarbourFront Centre, Singapore. With a holistic approach to vision care, I go beyond simply prescribing glasses or contact lenses. I prioritize comprehensive eye examinations that focus on overall eye health and truly understand each patient's unique needs.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Education & Expertise</h2>
              <p className={mutedClass}>
                My educational journey has taken me across Singapore, the United States, and Australia. This strengthens my commitment to personalized eye care. I stay at the forefront of optometric advancements, with a strong emphasis on early prevention and detection of ocular conditions, and pediatric issues like amblyopia. I have a particular passion for myopia control, including orthokeratology, and specialized care in low vision, geriatric patients, and therapeutic contact lenses. Recently, I earned my certification in Evidence-Based Myopia Management from{' '}
                <a href="https://www.unsw.edu.au/" target="_blank" rel="noreferrer" className={`font-semibold ${accentClass} hover:opacity-80 transition-opacity`}>
                  UNSW
                </a>
                , reflecting my dedication to the latest research-driven approaches.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Services & Solutions</h2>
              <p className={mutedClass}>
                Over the years, I have built extensive clinical experience helping patients find tailored vision solutions that fit their lifestyle, work, and daily activities. These include everything from prescription glasses and sunglasses to advanced contact lenses (including hybrid and scleral lenses) and non-surgical therapeutic options. In my practice at{' '}
                <a href="https://www.emmevisioncare.com" target="_blank" rel="noreferrer" className={`font-semibold ${accentClass} hover:opacity-80 transition-opacity`}>
                  EMME Visioncare
                </a>
                , I conduct thorough eye health assessments, co-manage conditions with other healthcare professionals when needed, and mentor colleagues in complex contact lens fitting.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Leadership & Teaching</h2>
              <p className={mutedClass}>
                In leadership and educational roles, I have overseen operations, led staff training, contributed to business growth, and served as an Associate Lecturer in{' '}
                <a href="https://www.np.edu.sg/" target="_blank" rel="noreferrer" className={`font-semibold ${accentClass} hover:opacity-80 transition-opacity`}>
                  Ngee Ann Polytechnic
                </a>{' '}
                while pursuing my Doctor of Optometry degree from{' '}
                <a href="https://www.aston.ac.uk/" target="_blank" rel="noreferrer" className={`font-semibold ${accentClass} hover:opacity-80 transition-opacity`}>
                  Aston University
                </a>
                . I also hold a Master's in Clinical Optometry and remain deeply committed to lifelong learning and sharing knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">My Commitment</h2>
              <p className={mutedClass}>
                I am driven by a deep commitment to eye health, evidence-based practice, and making quality vision care available to everyone. My approach combines clinical expertise with a genuine passion for improving patient outcomes and advancing the field of optometry.
              </p>
            </section>
          </div>

          {/* CTA Section */}
          <div className={`mt-16 p-8 rounded-lg ${isDark ? 'bg-teal-900/20 border border-teal-700/30' : 'bg-teal-50 border border-teal-200'}`}>
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Expert Eye Care?</h3>
            <p className={`${mutedClass} mb-6`}>
              Visit EMME Visioncare in HarbourFront Centre, Singapore for a comprehensive eye examination and personalized vision solutions.
            </p>
            <a
              href="https://www.emmevisioncare.com"
              target="_blank"
              rel="noreferrer"
              className={`inline-block px-6 py-3 rounded-lg font-semibold ${isDark ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-600 hover:bg-teal-700'} text-white transition-colors`}
            >
              Visit EMME Visioncare
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
