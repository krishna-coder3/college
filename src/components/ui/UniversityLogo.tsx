import React from 'react';

interface UniversityLogoProps {
  name?: string;
  subText?: string;
  motto?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'primary';
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  name = 'K.M. UNIVERSITY',
  subText = 'MATHURA',
  motto = 'ज्ञानं परमं बलं',
  size = 'md',
  showText = true,
  className = '',
  theme = 'primary',
}) => {
  const sizeMap = {
    sm: { icon: 36, textTitle: 'text-sm font-bold', textSub: 'text-[10px]' },
    md: { icon: 48, textTitle: 'text-base font-bold', textSub: 'text-xs' },
    lg: { icon: 68, textTitle: 'text-xl font-bold', textSub: 'text-sm' },
    xl: { icon: 96, textTitle: 'text-2xl font-extrabold', textSub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Heraldic University Crest SVG inspired by KM University reference */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-2xl p-1 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-950 shadow-md border border-blue-400/30 overflow-hidden"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mortarboard Cap atop the crest */}
          <polygon
            points="100,10 180,48 100,75 20,48"
            fill="#1E3A8A"
            stroke="#93C5FD"
            strokeWidth="3"
          />
          {/* Mortarboard skullcap base */}
          <path
            d="M50 56 L50 82 C50 98 150 98 150 82 L150 56"
            fill="#172554"
            stroke="#60A5FA"
            strokeWidth="2"
          />
          {/* Cap Tassel */}
          <path
            d="M35 50 Q28 70 28 92"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="28" cy="95" r="4" fill="#F59E0B" />

          {/* Peacock Feather (Mathura Peacock Emblem) at cap center */}
          <ellipse cx="100" cy="38" rx="8" ry="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
          <ellipse cx="100" cy="39" rx="5" ry="9" fill="#0D9488" />
          <ellipse cx="100" cy="40" rx="3" ry="5" fill="#F59E0B" />
          <circle cx="100" cy="41" r="1.5" fill="#1E1B4B" />

          {/* Shield Outline with Golden Border */}
          <path
            d="M40 75 L160 75 L160 130 C160 162 100 185 100 185 C100 185 40 162 40 130 Z"
            fill="#FFFFFF"
            stroke="#1D4ED8"
            strokeWidth="4"
          />
          <path
            d="M46 79 L154 79 L154 128 C154 156 100 178 100 178 C100 178 46 156 46 128 Z"
            fill="#F8FAFC"
            stroke="#D97706"
            strokeWidth="2"
          />

          {/* Open Book in Upper Section of Shield */}
          <path
            d="M62 92 C78 86 98 90 100 96 C102 90 122 86 138 92 L136 108 C120 102 102 105 100 110 C98 105 80 102 64 108 Z"
            fill="#EFF6FF"
            stroke="#2563EB"
            strokeWidth="2"
          />

          {/* Stylized Aspirant Figures Reaching Upward */}
          {/* Central Red spine / flame */}
          <path
            d="M98 100 Q106 115 94 132 Q103 140 100 148"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="102" cy="95" r="4.5" fill="#DC2626" />

          {/* Left Student Figure in Blue */}
          <path
            d="M80 120 C76 132 86 142 94 144"
            stroke="#1D4ED8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="116" r="3.5" fill="#1D4ED8" />

          {/* Right Student Figure in Blue */}
          <path
            d="M120 120 C124 132 114 142 106 144"
            stroke="#1D4ED8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="122" cy="116" r="3.5" fill="#1D4ED8" />

          {/* Golden Laurel Wreath Leaves */}
          <path
            d="M52 144 Q100 162 148 144"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Lower Ribbon Banner with University Foundation */}
          <path
            d="M32 165 L60 156 L140 156 L168 165 L156 178 L100 178 L44 178 Z"
            fill="#1E3A8A"
            stroke="#FBBF24"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="172"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.5"
            fontFamily="sans-serif"
          >
            {subText}
          </text>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`tracking-tight ${currentSize.textTitle} ${
                theme === 'dark'
                  ? 'text-white'
                  : 'text-slate-900 group-hover:text-blue-700'
              }`}
            >
              {name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${currentSize.textSub} ${
                theme === 'dark' ? 'text-blue-200' : 'text-slate-500'
              }`}
            >
              College Helpdesk System
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-[11px] font-medium text-amber-600 italic">
              {motto}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
