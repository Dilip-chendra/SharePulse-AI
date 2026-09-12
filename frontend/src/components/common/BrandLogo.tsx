import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
  variant?: 'primary' | 'compact' | 'icon' | 'light';
  animate?: boolean;
}

/**
 * SharePulse AI — World-Class Brand Logo
 *
 * Icon: A premium ECG/market-pulse waveform on a dark rounded-square tile.
 *       Flat line → sharp downward dip → soaring spike apex (glowing cyan node)
 *       → flat line. Gradient: indigo-blue → electric cyan.
 *       Identical mark used for favicon.svg.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  tagline,
  className = '',
  variant = 'primary',
  animate = true,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base',  badge: 'text-[9px] px-1.5 py-0.5', gap: 'gap-2' },
    md: { icon: 36, text: 'text-lg',    badge: 'text-[9px] px-2 py-0.5',   gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-2xl',   badge: 'text-xs px-2.5 py-0.5',    gap: 'gap-3.5' },
    xl: { icon: 56, text: 'text-3xl',   badge: 'text-xs px-3 py-1',         gap: 'gap-4' },
  };

  const current = sizeMap[size];
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center ${current.gap} ${className} select-none group`}>

      {/* ── Icon Mark ─────────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: current.icon, height: current.icon }}
      >
        {/* Soft ambient glow behind the tile */}
        <div
          className="absolute inset-0 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, #4F46E5 0%, #06B6D4 60%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />

        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-[1.04]"
        >
          <defs>
            {/* Dark tile background gradient */}
            <linearGradient id="sp-tile-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={isLight ? '#F1F5F9' : '#0D1224'} />
              <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#060A14'} />
            </linearGradient>

            {/* Pulse waveform gradient — indigo → cyan */}
            <linearGradient id="sp-wave-grad" x1="6" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#6366F1" />
              <stop offset="55%"  stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Apex glow filter */}
            <filter id="sp-apex-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Tile inner-shadow / depth filter */}
            <filter id="sp-tile-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5"
                floodColor={isLight ? '#94A3B8' : '#000000'} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ── Rounded-square tile ── */}
          <rect
            x="2" y="2" width="44" height="44" rx="11"
            fill="url(#sp-tile-bg)"
            stroke={isLight ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)'}
            strokeWidth="1.2"
            filter="url(#sp-tile-shadow)"
          />

          {/*
            ── Pulse waveform path ──
            Baseline y=28.
            Starts at left (6,28) → flat → dip down to (17,34) → sharp climb to apex (24,10)
            → drop to (30,33) → flat out to right (42,28).
            Smooth cubic bezier curves give it organic premium feel.
          */}
          <path
            d="M6 28 L14 28 C15.5 28 16 29 17 33 C18 37 18.5 37 19 34 L22 13 C22.5 10.5 23 9.5 24 9.5 C25 9.5 25.5 10.5 26 13 L28.5 34 C29 37 29.5 37 30.5 33 C31.5 29 32 28 33 28 L42 28"
            stroke="url(#sp-wave-grad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Apex glow node (glowing cyan dot at spike peak) ── */}
          <circle
            cx="24" cy="9.5" r="2.8"
            fill="#22D3EE"
            filter="url(#sp-apex-glow)"
            className={animate ? 'animate-pulse' : ''}
          />
          {/* Inner bright core */}
          <circle cx="24" cy="9.5" r="1.4" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ── Wordmark ───────────────────────────────────────────────────────── */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-sans font-extrabold tracking-tight leading-none ${current.text} ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Share
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-cyan-400">
                Pulse
              </span>
            </span>

            {/* AI badge */}
            <span
              className={`inline-flex items-center gap-1 font-mono font-bold rounded-md uppercase tracking-widest ${
                current.badge
              } ${
                isLight
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 shadow-sm shadow-indigo-950'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${animate ? 'animate-pulse' : ''}`}
              />
              AI
            </span>
          </div>

          {tagline && (
            <span
              className={`text-[10px] font-medium tracking-widest uppercase mt-0.5 ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
