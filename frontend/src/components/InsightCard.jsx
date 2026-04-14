import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const InsightCard = ({ title, items, type = 'success' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`insight-card ${type}`}>
      <div className="insight-title">
        {type === 'success' ? <CheckCircle size={16} color="var(--success)" /> : <AlertCircle size={16} color="var(--primary)" />}
        {title}
      </div>
      <ul className="insight-list">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightCard;
