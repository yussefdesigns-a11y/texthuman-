
import React from 'react';

interface GaugeProps {
  percentage: number;
  label: string;
  size?: number;
}

const Gauge: React.FC<GaugeProps> = ({ percentage, label, size = 192 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-slate-100 dark:text-slate-700 stroke-current"
          cx="50"
          cy="50"
          fill="transparent"
          r={radius}
          strokeWidth="8"
        />
        <circle
          className="text-primary stroke-current transition-all duration-1000 ease-in-out"
          cx="50"
          cy="50"
          fill="transparent"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-slate-900 tracking-tighter">{percentage}%</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
};

export default Gauge;
