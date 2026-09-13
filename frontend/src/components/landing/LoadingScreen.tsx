import React, { useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    // Animate progress bar using requestAnimationFrame for instant start
    let start: number | null = null;
    const duration = 900; // ms

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      if (progressRef.current) {
        progressRef.current.style.width = `${eased * 100}%`;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          setTimeout(onComplete, 100);
        }
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07090E]"
      style={{ fontFamily: 'Geist, sans-serif' }}
    >
      {/* Logo mark */}
      <div className="mb-8 opacity-90">
        <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="load-tile" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D1224" />
              <stop offset="100%" stopColor="#060A14" />
            </linearGradient>
            <linearGradient id="load-wave" x1="6" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#load-tile)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.2" />
          <path
            d="M6 28 L14 28 C15.5 28 16 29 17 33 C18 37 18.5 37 19 34 L22 13 C22.5 10.5 23 9.5 24 9.5 C25 9.5 25.5 10.5 26 13 L28.5 34 C29 37 29.5 37 30.5 33 C31.5 29 32 28 33 28 L42 28"
            stroke="url(#load-wave)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="9.5" r="2.8" fill="#22D3EE" />
          <circle cx="24" cy="9.5" r="1.4" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Status text */}
      <p className="text-xs font-mono tracking-[0.3em] uppercase text-slate-500 mb-6">
        Initializing Intelligence
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{ width: '0%', transition: 'none' }}
        />
      </div>
    </div>
  );
};
