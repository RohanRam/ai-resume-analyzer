import React, { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const TopHeader = ({ onBack, user, onLogout, onShowSavedJobs }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const displayName = user ? (user.username || user.email) : 'User';

  return (
    <div className="top-header" style={{ position: 'relative' }}>
      <div className="header-left">
        {onBack && (
          <button onClick={onBack} style={{ marginRight: '1rem', color: 'var(--text-secondary)' }} title="Back to Upload">
            <ArrowLeft size={20} />
          </button>
        )}
        AI Resume & Portfolio Matcher
      </div>
      
      <div className="header-right">
        <span style={{ fontSize: '0.8rem' }}>Analyzed sources: <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: 4 }}>CV</span></span>
        <span style={{ fontSize: '0.8rem', marginRight: '1rem' }}>Last run: just now</span>
        <div className="profile-pic">
          <img src={`https://ui-avatars.com/api/?name=${displayName}&background=4f46e5&color=fff`} alt="User" style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
            >
                {displayName} <ChevronDown size={14} style={{ marginLeft: 4, color: 'var(--text-secondary)' }} />
            </button>
            
            {showDropdown && user && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', width: '150px', zIndex: 100 }}>
                    <button 
                        onClick={() => { setShowDropdown(false); onShowSavedJobs && onShowSavedJobs(); }} 
                        style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}
                    >
                        Saved Jobs
                    </button>
                    <button 
                        onClick={() => { setShowDropdown(false); onLogout && onLogout(); }} 
                        style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
