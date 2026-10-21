import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LogoIcon: React.FC<{ size?: number | string; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="capGrad" x1="120" y1="60" x2="380" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#003EAA" />
        </linearGradient>
        <linearGradient id="headGrad" x1="160" y1="160" x2="352" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2188FF" />
          <stop offset="100%" stopColor="#0055D4" />
        </linearGradient>
        <linearGradient id="bluePageGrad" x1="120" y1="280" x2="250" y2="370" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="#0044CC" />
        </linearGradient>
        <linearGradient id="greenPageGrad" x1="262" y1="280" x2="392" y2="370" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E599" />
          <stop offset="100%" stopColor="#00A86B" />
        </linearGradient>
      </defs>

      {/* Left Headphone Ear */}
      <rect x="135" y="195" width="26" height="55" rx="13" fill="#0055D4" />
      <rect x="140" y="202" width="16" height="41" rx="8" fill="#2188FF" />

      {/* Right Headphone Ear */}
      <rect x="351" y="195" width="26" height="55" rx="13" fill="#0055D4" />
      <rect x="356" y="202" width="16" height="41" rx="8" fill="#2188FF" />

      {/* Robot Head Base Outer */}
      <rect x="150" y="165" width="212" height="142" rx="71" fill="url(#headGrad)" />

      {/* Robot Visor Screen (Navy Blue) */}
      <rect x="172" y="182" width="168" height="106" rx="48" fill="#0B1A30" />

      {/* Friendly Smiling Eyes (Teal/Emerald ^_^) */}
      <path
        d="M 200 236 C 205 218, 225 218, 230 236"
        stroke="#00E599"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 282 236 C 287 218, 307 218, 312 236"
        stroke="#00E599"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Open Book Wings Below Head */}
      {/* Left Blue Pages Layer 2 (Bottom) */}
      <path d="M 248 340 C 200 325, 145 330, 115 348 C 122 360, 175 352, 248 368 Z" fill="#003399" />
      {/* Left Blue Pages Layer 1 (Top) */}
      <path d="M 248 305 C 190 288, 140 295, 122 312 C 125 328, 180 322, 248 340 Z" fill="url(#bluePageGrad)" />

      {/* Right Green Pages Layer 2 (Bottom) */}
      <path d="M 264 340 C 312 325, 367 330, 397 348 C 390 360, 337 352, 264 368 Z" fill="#008855" />
      {/* Right Green Pages Layer 1 (Top) */}
      <path d="M 264 305 C 322 288, 372 295, 390 312 C 387 328, 332 322, 264 340 Z" fill="url(#greenPageGrad)" />

      {/* Graduation Cap (Mortarboard) */}
      {/* Cap Skull Base Underneath */}
      <path d="M 188 152 C 205 168, 307 168, 324 152 L 332 165 C 307 185, 205 185, 180 165 Z" fill="#002D80" />

      {/* Diamond Cap Top */}
      <polygon points="256,68 392,130 256,176 120,130" fill="url(#capGrad)" />
      <polygon points="256,76 376,130 256,170 136,130" fill="#004FCC" opacity="0.4" />

      {/* Cap Center Button */}
      <ellipse cx="256" cy="130" rx="8" ry="6" fill="#002D80" />

      {/* Cap Tassel Ribbon & Bell */}
      <path
        d="M 256 130 C 285 130, 348 142, 354 175"
        stroke="#002D80"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="355" cy="178" r="5" fill="#002D80" />
      <path d="M 353 182 L 348 200 L 362 200 Z" fill="#002D80" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 64,
    hero: 100,
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-4xl sm:text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
    hero: 'text-base sm:text-lg',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <LogoIcon size={iconSizes[size]} />
      </div>

      {showText && (
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-center tracking-tight leading-none">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              LearnMate
            </span>
            <span
              className={`font-black ml-1 text-emerald-500 dark:text-emerald-400 ${textSizes[size]}`}
              style={{ color: '#00D084' }}
            >
              AI
            </span>
          </div>

          {showTagline && (
            <span
              className={`text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5 ${taglineSizes[size]}`}
            >
              Your personal AI learning companion.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
