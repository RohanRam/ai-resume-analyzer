import React from 'react';

const MetricsPanel = ({ scores }) => {
  const metrics = [
    { label: 'Skills', value: scores?.skills || 84 },
    { label: 'Experience', value: scores?.experience || 78 },
    { label: 'Portfolio', value: scores?.portfolio || 86 },
    { label: 'Keywords', value: scores?.keywords || 69 },
    { label: 'Confidence', value: 'High (91%)', isText: true }
  ];

  return (
    <div className="metrics-list fade-in">
      {metrics.map((m, idx) => (
        <div key={idx} className="metric-row">
          <span className="metric-label">{m.label}</span>
          {!m.isText ? (
            <>
              <div className="metric-bar-bg">
                <div 
                  className="metric-bar-fill"
                  style={{ width: `${m.value}%`, backgroundColor: 'var(--primary)' }}
                />
              </div>
              <span className="metric-value">{m.value}</span>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginLeft: '1rem' }}>{m.value}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;
