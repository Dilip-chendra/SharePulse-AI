import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
  variant?: 'primary' | 'compact' | 'icon' | 'light';
  animate?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  tagline,
  className = '',
  variant = 'primary',
  animate = true,
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.2', gap: 'gap-2' },
    md: { icon: 34, text: 'text-lg', badge: 'text-[9px] px-2 py-0.5', gap: 'gap-2.5' },
    lg: { icon: 42, text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5', gap: 'gap-3.5' },
    xl: { icon: 54, text: 'text-3xl', badge: 'text-xs px-3 py-1', gap: 'gap-4' },
  };

  const current = sizeMap[size];
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center ${current.gap} ${className} select-none group`}>
      {/* Apex Finmark Sigil Icon */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: current.icon, height: current.icon }}
      >
        {/* Ambient Precision Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 blur-[8px] opacity-35 group-hover:opacity-65 transition-opacity duration-300" />

        {/* Vector SVG Mark */}
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-[1.03]"
        >
          <defs>
            {/* Primary Prismatic Wave Gradient */}
            <linearGradient id="sp-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="45%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Counter-Pulse Financial Flow Gradient */}
            <linearGradient id="sp-grad-counter" x1="44" y1="4" x2="4" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Shield Obsidian Gradient */}
            <linearGradient id="sp-grad-shield" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isLight ? "#F8FAFC" : "#0A0E1A"} />
              <stop offset="100%" stopColor={isLight ? "#EDF2F7" : "#04060B"} />
            </linearGradient>

            {/* Precision Rim Stroke */}
            <linearGradient id="sp-grad-rim" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? "0.8" : "0.35"} />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10B981" stopOpacity={isLight ? "0.6" : "0.2"} />
            </linearGradient>

            {/* Crisp Filter Glow */}
            <filter id="sp-sigil-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Faceted Hex-Shield Precision Container */}
          <path
            d="M24 3L43 10V25C43 35.5 35 43.5 24 46C13 43.5 5 35.5 5 25V10L24 3Z"
            fill="url(#sp-grad-shield)"
            stroke="url(#sp-grad-rim)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Interlocking SOW Pulse Wave Stream (Upper Loop) */}
          <path
            d="M13 22C13 16 18 13.5 23 14C27.5 14.5 31 17.5 34 21C36.5 24 37 28 35 32C33 36 28 37 24 36.5C18.5 35.8 14 31 14 26"
            stroke="url(#sp-grad-primary)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sp-sigil-glow)"
          />

          {/* Inner Financial Trajectory Catalyst Curve (Intersecting Flow) */}
          <path
            d="M35 26C35 21 31 18 27 18C23 18 19 21 16 25C14 28 14 31 16 33C18 35 22 35 25 33C29 30.5 34 26 35 21"
            stroke="url(#sp-grad-counter)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Precision Apex Diamond Center Core */}
          <path
            d="M24 19L28 24L24 29L20 24L24 19Z"
            fill="#FFFFFF"
            className={animate ? "animate-pulse" : ""}
          />
          <circle cx="24" cy="24" r="1.8" fill="#06B6D4" />

          {/* Micro Telemetry Convergence Nodes */}
          <circle cx="16" cy="18" r="1.5" fill="#818CF8" />
          <circle cx="32" cy="30" r="1.5" fill="#10B981" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-sans font-extrabold tracking-tight leading-none flex items-center ${current.text} ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              SHARE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">PULSE</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono font-bold rounded-md uppercase tracking-wider ${
                current.badge
              } ${
                isLight
                  ? "bg-slate-100 text-indigo-700 border border-indigo-200"
                  : "bg-slate-900/90 border border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-950"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI
            </span>
          </div>
          {tagline && (
            <span className={`text-[10px] font-medium tracking-wider uppercase mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
