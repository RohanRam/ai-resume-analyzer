const API_BASE = 'http://127.0.0.1:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchRoles = async () => {
  return []; // deprecated
};

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData, // fetch will set multipart boundaries
  });
  if (!response.ok) throw new Error('Failed to analyze resume');
  return response.json();
};

export const fetchAnalysisById = async (uuid) => {
    const response = await fetch(`${API_BASE}/analysis/${uuid}`);
    if (!response.ok) throw new Error('Analysis not found');
    return response.json();
};

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password})
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, email, password})
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
};

export const verifySession = async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Session invalid');
    return response.json();
};

export const saveJobInstance = async (analysisId) => {
    const response = await fetch(`${API_BASE}/auth/save-job`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getHeaders()
        },
        body: JSON.stringify({analysisId})
    });
    if (!response.ok) throw new Error('Failed to save job');
    return response.json();
};

export const generateSummary = async (analysisId) => {
    const response = await fetch(`${API_BASE}/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({analysisId})
    });
    if (!response.ok) throw new Error('Failed to generate summary');
    return response.json();
};

export const rewriteBullets = async (analysisId) => {
    const response = await fetch(`${API_BASE}/rewrite-bullets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({analysisId})
    });
    if (!response.ok) throw new Error('Failed to rewrite bullets');
    return response.json();
};
