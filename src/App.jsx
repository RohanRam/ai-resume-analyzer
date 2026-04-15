import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import MainDashboard from './components/MainDashboard';
import LoginModal from './components/LoginModal';
import { analyzeResume, verifySession } from './api';
import { UploadCloud, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSavedJobsInline, setShowSavedJobsInline] = useState(false);

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
      setShowDashboard(false);
      setJobDescription("");
      setResumeFile(null);
      setAnalysisResult(null);
      setShowSavedJobsInline(false);
  };

  if (!showDashboard) {
    return (
      <div className="landing-container fade-in">
        <nav className="landing-nav">
          <div className="nav-brand">
             <img src="/resume4.png" alt="AI Resume" className="brand-logo-img" />
             <span className="brand-text">Resume Analyzer</span>
          </div>
          <div className="nav-actions">
           {user ? (
               <div className="user-profile">
                   <span className="welcome-text">Welcome, <strong>{user.username || user.email}</strong></span>
                   <button onClick={handleLogout} className="btn-outline">Log Out</button>
               </div>
           ) : (
               <button onClick={() => setShowLoginModal(true)} className="btn-outline">Login</button>
           )}
          </div>
        </nav>
      
        <div className="landing-split-layout">
          <div className="landing-hero">
            <div className="pill-badge">✨ Powered by AI</div>
            <h1 className="hero-title">
              Unlock Your <br/>
              <span className="text-gradient">Career Potential</span>
            </h1>
            <p className="hero-subtitle">
              Intelligently match your resume against any job description. Uncover your true score, identify missing skills, and instantly stand out.
            </p>
            <div className="hero-features">
               <div className="feature"><div className="icon-circle">✓</div> Free Analysis</div>
               <div className="feature"><div className="icon-circle">✓</div> Deep Insights</div>
               <div className="feature"><div className="icon-circle">✓</div> Fast Results</div>
            </div>
          </div>
          
          <div className="landing-form-glass">
            <div className="form-head">
              <h2>Start Analyzing</h2>
              <p>Upload your resume and target job.</p>
            </div>
            
            <div className="modern-form">
              <div className="input-group">
                <label>Target Job Description</label>
                <textarea 
                  className="modern-textarea"
                  placeholder="Paste the job requirements here..." 
                  value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Your Resume</label>
                <div className={`modern-dropzone ${resumeFile ? 'has-file' : ''}`}>
                  <UploadCloud size={28} className="drop-icon" />
                  <div className="drop-content">
                    <p className="drop-title">{resumeFile ? resumeFile.name : 'Click or Drag & Drop File'}</p>
                    <p className="drop-sub">Supports .pdf, .txt, .docx</p>
                  </div>
                  <input type="file" accept=".pdf,.txt,.docx" onChange={(e) => { if (e.target.files && e.target.files[0]) setResumeFile(e.target.files[0]); }} />
                </div>
              </div>
              <button 
                onClick={handleAnalyze} 
                disabled={!jobDescription || !resumeFile} 
                className="modern-submit-btn"
              >
                <span>Analyze Match</span>
                <div className="btn-icon"><ArrowRight size={18} /></div>
              </button>
            </div>
          </div>
        </div>
        
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />}
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="app-wrapper fade-in">
      <div className="app-container">
        <TopHeader 
          onBack={() => setShowDashboard(false)} 
          user={user} 
          onLogout={handleLogout} 
          onShowSavedJobs={() => setShowSavedJobsInline(true)}
        />
        <div className="main-content-wrapper">
          <MainDashboard 
            analysisResult={analysisResult} 
            isLoading={isLoading} 
            user={user}
            onRequireLogin={() => setShowLoginModal(true)}
            showSavedJobsInline={showSavedJobsInline}
          />
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
