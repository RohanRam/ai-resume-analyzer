import React from 'react';

const ScoreCircle = ({ score, size = 120, strokeWidth = 8, animate = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  // Force primary color for mockup aesthetic
  let color = 'var(--primary)';
  
  return (
    <div className={`score-container ${animate ? 'fade-in' : ''}`} style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div 
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <span style={{ fontSize: size * 0.25, fontWeight: 'bold', color: 'var(--text-primary)' }}>
          {score}
        </span>
        <span style={{ fontSize: size * 0.1, color: 'var(--text-secondary)' }}>Score</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
