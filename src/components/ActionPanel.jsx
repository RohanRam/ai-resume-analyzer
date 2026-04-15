import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { generateSummary, rewriteBullets } from '../api';
import { toast } from 'sonner';

const ActionPanel = ({ insights, analysisId }) => {
  const [generations, setGenerations] = useState({});
  const [loadingAction, setLoadingAction] = useState(null);

  const handleGenerateSummary = async () => {
    if (!analysisId) return;
    setLoadingAction('summary');
    try {
      const result = await generateSummary(analysisId);
      setGenerations(prev => ({ ...prev, summary: result.summary }));
    } catch (e) {
      alert("Failed to generate summary. Did you set the Gemini API Key?");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRewriteBullets = async () => {
    if (!analysisId) return;
    setLoadingAction('bullets');
    try {
      const result = await rewriteBullets(analysisId);
      setGenerations(prev => ({ ...prev, bullets: result.bullets }));
    } catch (e) {
      alert("Failed to rewrite bullets. Did you set the Gemini API Key?");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="right-section fade-in" style={{ paddingTop: '5.5rem' }}>
      
      <h3>Recommended actions</h3>
      <div className="action-list">
        <div className="action-item" onClick={handleGenerateSummary}>
          <span>{loadingAction === 'summary' ? 'Generating...' : 'Generate tailored summary'}</span>
          <ArrowRight size={14} />
        </div>
        <div className="action-item" onClick={handleRewriteBullets}>
          <span>{loadingAction === 'bullets' ? 'Generating...' : 'Rewrite CV bullets'}</span>
          <ArrowRight size={14} />
        </div>
        <div className="action-item" onClick={() => toast.info("COMING SOON")}>
          <span style={{ color: 'var(--text-secondary)' }}>Reorder portfolio</span>
          <ArrowRight size={14} color="var(--border-color)" />
        </div>
        <div className="action-item" onClick={handleExportPDF}>
          <span>Export PDF</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {(generations.summary || generations.bullets) && (
         <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
             <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✨ AI Generations</h4>
             {generations.summary && (
                 <div style={{ marginBottom: '1rem' }}>
                     <strong style={{ fontSize: '0.8rem' }}>Tailored Summary:</strong>
                     <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{generations.summary}</p>
                 </div>
             )}
             {generations.bullets && (
                 <div>
                     <strong style={{ fontSize: '0.8rem' }}>Rewritten Bullets:</strong>
                     <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{generations.bullets}</p>
                 </div>
             )}
         </div>
      )}

      <h3>Evidence viewer</h3>
      <div className="evidence-box">
        <p style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          "Led design system rollout (tokens, components, documentation) across 3 squads." <span style={{ background: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', display: 'inline-block', fontStyle: 'normal' }}>CV</span>
        </p>
        <p style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          "Case study: Admin dashboard redesign (filters, tables, permissions) — shipped v2 in 6 weeks." <span style={{ background: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', display: 'inline-block', fontStyle: 'normal' }}>Portfolio</span>
        </p>
        <p style={{ color: 'var(--text-primary)' }}>
          "Partnered with PM/Engineering to define scope, run workshops, and reduce rework." <span style={{ background: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', display: 'inline-block', fontStyle: 'normal' }}>CV</span>
        </p>
      </div>

    </div>
  );
};

export default ActionPanel;
