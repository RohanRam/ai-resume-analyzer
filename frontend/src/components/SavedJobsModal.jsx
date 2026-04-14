import React, { useEffect, useState } from 'react';
import { X, Briefcase, Calendar, BarChart2 } from 'lucide-react';
import { fetchSavedJobs } from '../api';

const SavedJobsModal = ({ onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchSavedJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '90%', maxWidth: '700px', padding: '2rem' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={24} color="var(--primary)" /> Saved Jobs
        </h2>
        
        {loading && <p>Loading saved jobs...</p>}
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
        
        {!loading && !error && jobs.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't saved any jobs yet.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem' }}>Job Target</th>
                            <th style={{ padding: '1rem', width: '120px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart2 size={16}/> Score</div></th>
                            <th style={{ padding: '1rem', width: '150px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={16}/> Date Saved</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {job.jobName.length > 60 ? job.jobName.substring(0, 60) + '...' : job.jobName}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.9rem',
                                        background: job.overallScore > 75 ? 'rgba(16, 185, 129, 0.1)' : job.overallScore > 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: job.overallScore > 75 ? 'var(--success)' : job.overallScore > 50 ? 'var(--warning)' : 'var(--danger)'
                                    }}>
                                        {job.overallScore}%
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsModal;
