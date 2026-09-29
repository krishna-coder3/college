import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  borderAccent?: 'none' | 'blue' | 'amber' | 'cyan' | 'red' | 'emerald';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  borderAccent = 'none',
  ...props
}) => {
  const accentBorders = {
    none: 'border-slate-200/80',
    blue: 'border-l-4 border-l-blue-600 border-slate-200/80',
    amber: 'border-l-4 border-l-amber-500 border-slate-200/80',
    cyan: 'border-l-4 border-l-cyan-500 border-slate-200/80',
    red: 'border-l-4 border-l-rose-500 border-slate-200/80',
    emerald: 'border-l-4 border-l-emerald-500 border-slate-200/80',
  };

  return (
    <div
      className={`bg-white rounded-2xl border ${accentBorders[borderAccent]} shadow-sm ${
        hoverEffect
          ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 pb-3 border-b border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-500 mt-0.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 pt-3 bg-slate-50/60 rounded-b-2xl border-t border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
