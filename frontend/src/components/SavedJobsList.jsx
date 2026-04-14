import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, BarChart2 } from 'lucide-react';
import { fetchSavedJobs } from '../api';

const SavedJobsList = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
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
  }, [user]);

  if (!user) return null;

  return (
    <div className="saved-jobs-section" style={{ marginTop: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Briefcase size={20} color="var(--primary)" /> Saved Jobs History
        </h3>
        
        {loading && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Loading saved jobs...</p>}
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
        
        {!loading && !error && jobs.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You haven't saved any jobs yet.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
            <div style={{ overflowX: 'auto', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '0.75rem 1rem' }}>Job Target</th>
                            <th style={{ padding: '0.75rem 1rem', width: '100px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart2 size={14}/> Score</div></th>
                            <th style={{ padding: '0.75rem 1rem', width: '120px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> Saved</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {job.jobName.length > 40 ? job.jobName.substring(0, 40) + '...' : job.jobName}
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ 
                                        padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem',
                                        background: job.overallScore > 75 ? 'rgba(16, 185, 129, 0.1)' : job.overallScore > 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: job.overallScore > 75 ? 'var(--success)' : job.overallScore > 50 ? 'var(--warning)' : 'var(--danger)'
                                    }}>
                                        {job.overallScore}%
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{job.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default SavedJobsList;
