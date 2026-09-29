import React from 'react';

interface HeroWaveProps {
  className?: string;
  fillColor?: string;
}

export const HeroWave: React.FC<HeroWaveProps> = ({
  className = '',
  fillColor = '#f8fafc',
}) => {
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <path
          d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
