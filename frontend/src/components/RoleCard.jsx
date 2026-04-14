import React from 'react';
import ScoreCircle from './ScoreCircle';

const RoleCard = ({ role, isActive, onClick, score = 0 }) => {
  return (
    <div className={`role-card ${isActive ? 'active' : ''}`} onClick={() => onClick(role)}>
      <div className="role-info">
        <h4>{role.title}</h4>
        <p>{role.company}</p>
      </div>
      <ScoreCircle score={score} size={40} strokeWidth={4} animate={false} />
    </div>
  );
};

export default RoleCard;
