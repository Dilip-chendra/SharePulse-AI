import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
  animate?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  tagline,
  className = '',
  animate = true
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.5', gap: 'gap-2.5' },
    md: { icon: 34, text: 'text-lg', badge: 'text-[9px] px-2 py-0.5', gap: 'gap-2.5' },
    lg: { icon: 42, text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5', gap: 'gap-3.5' },
    xl: { icon: 52, text: 'text-3xl', badge: 'text-xs px-3 py-1', gap: 'gap-4' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} ${className} select-none group`}>
      {/* Precision Apex Pulse Catalyst Emblem */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: current.icon, height: current.icon }}
      >
        {/* Ambient Gradient Glow Aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-400 to-emerald-400 blur-[9px] opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
        
        {/* Emblem SVG */}
        <svg 
          width={current.icon} 
          height={current.icon} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            {/* Primary Neon Prismatic Gradient */}
            <linearGradient id="sp-prismatic-apex" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="35%" stopColor="#6366F1" />
              <stop offset="70%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Core Pulse Flare Gradient */}
            <linearGradient id="sp-pulse-flare" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            {/* Deep Obsidian Background */}
            <linearGradient id="sp-obsidian-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0C101C" />
              <stop offset="100%" stopColor="#05070D" />
            </linearGradient>

            {/* Specular Rim Highlight */}
            <linearGradient id="sp-rim-specular" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="sp-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Squircle Container with Precision Chamfer */}
          <rect 
            x="2" 
            y="2" 
            width="44" 
            height="44" 
            rx="13" 
            fill="url(#sp-obsidian-bg)" 
            stroke="url(#sp-prismatic-apex)" 
            strokeWidth="1.75" 
          />

          {/* Inner Specular Rim */}
          <rect 
            x="3.5" 
            y="3.5" 
            width="41" 
            height="41" 
            rx="11.5" 
            fill="none" 
            stroke="url(#sp-rim-specular)" 
            strokeWidth="1" 
          />

          {/* Dynamic Interlocking 'S-Pulse' Path 1 (Ascending Wave) */}
          <path
            d="M12 32C14 32 17 28 20 22C22.5 17 25 15 28 15C32 15 36 18 36 22C36 26 31 29 27 30C23 31 16 31 12 35"
            stroke="url(#sp-prismatic-apex)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#sp-neon-glow)"
          />

          {/* Intersecting Pulse Stream (Descending Counter-Wave) */}
          <path
            d="M36 16C34 16 31 20 28 26C25.5 31 23 33 20 33C16 33 12 30 12 26C12 22 17 19 21 18C25 17 32 17 36 13"
            stroke="url(#sp-pulse-flare)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Center Catalyst Diamond Core */}
          <path
            d="M24 18.5L28.5 24L24 29.5L19.5 24L24 18.5Z"
            fill="#FFFFFF"
            className={animate ? "animate-pulse" : ""}
          />
          <circle cx="24" cy="24" r="2" fill="#38BDF8" />

          {/* Satellite Data Nodes */}
          <circle cx="12" cy="24" r="2" fill="#818CF8" />
          <circle cx="36" cy="24" r="2" fill="#10B981" />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-sans font-bold tracking-tight text-white ${current.text} leading-none flex items-center`}>
              Share<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300 font-extrabold">Pulse</span>
            </span>
            <span className={`inline-flex items-center gap-1 font-sans font-semibold rounded-md bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-cyan-950/90 border border-indigo-500/30 text-indigo-300 ${current.badge} shadow-sm shadow-indigo-950/50`}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI
            </span>
          </div>
          {tagline && (
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
