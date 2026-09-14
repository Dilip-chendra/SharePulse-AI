import React, { useEffect, useRef, useState } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrandLogo } from '../common/BrandLogo';

interface FloatingNavProps {
  activeScene: number;
}

const NAV_ITEMS = [
  { label: 'Overview',      sceneIndex: 0, href: '#scene-hero' },
  { label: 'Diagnosis',     sceneIndex: 2, href: '#scene-sow' },
  { label: 'Intelligence',  sceneIndex: 6, href: '#scene-behavior' },
  { label: 'Actions',       sceneIndex: 9, href: '#scene-actions' },
  { label: 'Evidence',      sceneIndex: 14, href: '#scene-finale' },
];

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeScene }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 backdrop-blur-xl border-b ${
        scrolled
          ? 'bg-[#07090E]/95 border-white/[0.08] shadow-2xl shadow-black/50'
          : 'bg-[#07090E]/75 border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('#scene-hero')} className="shrink-0">
            <BrandLogo size="sm" animate={false} />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeScene >= item.sceneIndex && (activeScene < item.sceneIndex + 2 || item.sceneIndex === 7)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sign In */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.04]">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => {
                  // Navigate to dashboard — reload will trigger SignedIn flow
                  window.location.reload();
                }}
                className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-white/[0.04]"
              >
                Dashboard
              </button>
            </SignedIn>

            {/* Open Platform CTA */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-px">
                  <span>Open Platform</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:-translate-y-px"
              >
                <span>Open Platform</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </SignedIn>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                {menuOpen ? (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/[0.06]">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-md transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
