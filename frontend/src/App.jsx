import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import MainDashboard from './components/MainDashboard';
import LoginModal from './components/LoginModal';
import { analyzeResume, verifySession } from './api';
import { UploadCloud, ArrowRight } from 'lucide-react';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check session on mount
    const token = localStorage.getItem('token');
    if (token) {
        verifySession()
          .then(data => setUser(data))
          .catch(() => {
              localStorage.removeItem('token');
              setUser(null);
          });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeFile) return;
    if (!user) {
        setShowLoginModal(true);
        return;
    }
    
    setShowDashboard(true);
    setIsLoading(true);
    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Failed to analyze", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData, token) => {
      localStorage.setItem('token', token);
      setUser(userData);
      setShowLoginModal(false);
  };
  
  const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
  };

  if (!showDashboard) {
    return (
      <div className="landing-container fade-in">
        <div className="top-nav-bar" style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
           {user ? (
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Welcome, {user.username || user.email}</span>
                   <button onClick={handleLogout} className="btn btn-secondary">Log Out</button>
               </div>
           ) : (
               <button onClick={() => setShowLoginModal(true)} className="btn btn-secondary">Login</button>
           )}
        </div>
      
        <div className="landing-content" style={{ maxWidth: '800px' }}>
          <div className="landing-header">
            <h1 className="landing-title">AI Resume Analyzer</h1>
            <p className="landing-subtitle">Compare your resume against any job description to discover your true match score and improvement areas.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Target Job Description</label>
              <textarea 
                placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Your Resume</label>
              <div className="resume-upload-zone" style={{ padding: '2rem 1rem' }}>
                <UploadCloud size={40} className="upload-icon" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{resumeFile ? resumeFile.name : 'Click or Drag & Drop'}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>Supports .pdf, .txt, .docx</p>
                </div>
                <input type="file" accept=".pdf,.txt,.docx" onChange={(e) => { if (e.target.files && e.target.files[0]) setResumeFile(e.target.files[0]); }} />
              </div>
            </div>
            <button onClick={handleAnalyze} disabled={!jobDescription || !resumeFile} className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '1rem', opacity: (!jobDescription || !resumeFile) ? 0.5 : 1, width: '100%', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              Analyze Match <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />}
      </div>
    );
  }

  return (
    <div className="app-wrapper fade-in">
      <div className="app-container">
        <TopHeader onBack={() => setShowDashboard(false)} user={user} onLogout={handleLogout} />
        <div className="main-content-wrapper">
          <MainDashboard 
            analysisResult={analysisResult} 
            isLoading={isLoading} 
            user={user}
            onRequireLogin={() => setShowLoginModal(true)}
          />
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;
