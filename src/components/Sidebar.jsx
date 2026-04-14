import React from 'react';
import RoleCard from './RoleCard';

const Sidebar = ({ roles, activeRole, onRoleSelect, roleScores }) => {
  return (
    <div className="sidebar fade-in">
      <div className="sidebar-header">
        <h2>Target Roles</h2>
      </div>
      <div className="role-list">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isActive={activeRole?.id === role.id}
            onClick={onRoleSelect}
            score={roleScores[role.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
