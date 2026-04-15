# 🚀 AI Resume & Portfolio Matcher

A sleek, enterprise-grade mock-up of an AI-powered Resume Analyzer. This application intelligentally extracts details from uploaded resumes and cross-references them against targeted job descriptions to calculate objective match scores, pinpoint skill gaps, and provide actionable improvements using the Google Gemini AI.

![Landing Page Demo](/public/resume4.png)

## ✨ Core Features

*   **📄 Intelligent Parsing:** Seamlessly upload `.pdf`, `.docx`, or `.txt` resumes. The backend utilizes `PyPDF2` to accurately extract full-text elements.
*   **🧠 Deep AI Matching:** Powered by the **Google Gemini API**, the platform acts as an expert technical recruiter, providing detailed breakdowns of where your experience meets (or misses) the mark.
*   **📊 Visual Score Matrix:** Review a granular dashboard displaying multiple grading criteria: Overall Score, Skills Match, Experience Level, and Formatting.
*   **✍️ AI Writing Assistant:** Includes a dynamic **Action Panel** that can generate a completely tailored professional summary or automatically rewrite your CV bullet points to better appeal to the target job description.
*   **🔐 Private Saved Dashboards:** Secure User Authentication (via `Flask-JWT-Extended` & `bcrypt`) allows registered users to save their job match reports mapped tightly via PostgreSQL/SQLite schemas.
*   **📱 Modern UI/UX:** Built with a stunning glassmorphic UI, responsive split-pane landing screens, gradient typographies, and smooth micro-animations.

## 🛠️ Technology Stack

**Frontend Framework:**
*   **React 19** + **Vite**
*   **Styling:** Pure Vanilla CSS (Vars, Glassmorphism, Micro-interactions)
*   **Icons & Notifications:** `lucide-react`, `sonner`

**Backend API:**
*   **Python Flask**
*   **Database ORM:** `Flask-SQLAlchemy` (SQLite for local / PostgreSQL for Prod)
*   **Security:** `Flask-JWT-Extended`, `bcrypt`
*   **AI Integration:** `google-generativeai` (Gemini Flash Models)
*   **File Parsing:** `PyPDF2`

## ⚙️ Local Development Setup

Follow these instructions to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/RohanRam/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Configure Environment Variables
Navigate to the `api/` directory and create a `.env` file containing your secret keys.
```env
# /api/.env
JWT_SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=sqlite:///local.db
```

### 3. Start the Backend (Flask)
We recommend using a Python virtual environment.
```bash
cd api
python -m venv venv

# Activate venv (Windows):
.\venv\Scripts\activate
# Activate venv (Mac/Linux):
source venv/bin/activate

pip install -r requirements.txt
python index.py
```
> The Flask server will start running on `http://127.0.0.1:5000`

### 4. Start the Frontend (Vite)
Open a totally new terminal window in the root directory of the project.
```bash
npm install
npm run dev
```
> The Vite frontend will start running on `http://localhost:5173`

## ☁️ Deployment

This project is built to be deployed seamlessly to Vercel via the included `vercel.json` configuration file, utilizing Vercel's Python Serverless functions for the `api/index.py` endpoints and normal static rendering for the Vite React bundle.

## 📄 License & Copyright

&copy; 2026 Rohan Ram. All rights reserved.
