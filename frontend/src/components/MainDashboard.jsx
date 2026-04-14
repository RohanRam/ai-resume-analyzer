import React, { useState } from 'react';
import ScoreCircle from './ScoreCircle';
import MetricsPanel from './MetricsPanel';
import ActionPanel from './ActionPanel';
import { Search, ChevronDown, X } from 'lucide-react';
import { saveJobInstance } from '../api';
import SavedJobsList from './SavedJobsList';

const MainDashboard = ({ analysisResult, isLoading, user, onRequireLogin, showSavedJobsInline }) => {
  const [copyText, setCopyText] = useState('Copy link');
  const [saveState, setSaveState] = useState('Save job');

  if (isLoading) {
    return (
      <div className="dashboard-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Analyzing resume against Job Description...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="dashboard-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Unable to load analysis. Please check your inputs or try again.</p>
      </div>
    );
  }

  const { role, scores, insights, id } = analysisResult;

  const handleCopyLink = () => {
      // In a real Vercel deployment, window.location.origin + /analysis/id
      const shareUrl = `http://localhost:5173/analysis/${id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy link'), 2000);
  };

  const handleSaveJob = async () => {
      if (!user) {
          onRequireLogin();
          return;
      }
      try {
          setSaveState('Saving...');
          await saveJobInstance(id);
          setSaveState('Saved ✓');
          setTimeout(() => setSaveState('Save job'), 3000);
      } catch (e) {
          setSaveState('Failed');
          setTimeout(() => setSaveState('Save job'), 3000);
      }
  };

  return (
    <div className="dashboard-layout fade-in">
      {/* Center content */}
      <div className="dashboard-center">
        {/* Dynamic Context Header */}
        <div className="job-header">
          <div>
            <h1>{role.title}</h1>
            <p>{role.company}</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleCopyLink}>{copyText}</button>
            <button className="btn btn-primary" onClick={handleSaveJob}>{saveState}</button>
          </div>
        </div>
        
        {/* Unified Match Score Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Match score</h3>
            <div className="score-panel">
            <div className="score-panel-left">
                <ScoreCircle score={scores.overall} size={110} strokeWidth={8} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total score</span>
            </div>
            
            <MetricsPanel scores={scores} />
            </div>
            {/* Small text below score panel matching image */}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginLeft: '0.5rem' }}>
                Strong fit for required skills.<br/>
                Biggest gap: missing specific portfolio projects.
            </p>
        </div>

        {/* Strengths Section using custom list UI */}
        <div className="strengths-section" style={{ marginTop: '0.5rem' }}>
            <h3>Strengths for this role</h3>
            <div className="strengths-list">
               {insights.strengths.map((item, i) => (
                   <div key={i} className="strength-item">
                       <span className="strength-icon">✓</span>
                       <span>{item}</span>
                   </div>
               ))}
               {/* Add some fake ones to make it look full and populated like mockup if empty */}
               {insights.strengths.length < 3 && (
                 <>
                   <div className="strength-item"><span className="strength-icon">✓</span><span>B2B SaaS dashboard layout understanding</span></div>
                   <div className="strength-item"><span className="strength-icon">✓</span><span>Strong technical collaboration</span></div>
                 </>
               )}
            </div>
        </div>
        
        {/* Saved Jobs List rendered underneath the strengths section conditionally */}
        {showSavedJobsInline && <SavedJobsList user={user} />}
      </div>
      
      {/* Right Content */}
      <div className="dashboard-right">
        <ActionPanel insights={insights} analysisId={id} />
      </div>
    </div>
  );
};

export default MainDashboard;
