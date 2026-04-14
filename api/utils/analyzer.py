import re

# Comprehensive list of MVP skills for keyword extraction
TECH_SKILLS = [
    "react", "javascript", "css", "html", "vite", "ui", "ux", "responsive", "typescript",
    "python", "flask", "django", "sql", "api", "rest", "node", "database", "docker",
    "fullstack", "frontend", "backend", "agile", "deployment", "integration", "aws",
    "kubernetes", "machine learning", "data science", "nlp", "pandas", "numpy",
    "c++", "java", "spring", "c#", ".net", "azure", "gcp", "devops", "ci/cd",
    "git", "github", "gitlab", "linux", "bash"
]

def extract_skills(text):
    text_lower = text.lower()
    words = set(re.findall(r'\b[\w\.\+#-]+\b', text_lower))
    
    found = []
    # match single words and specific multi-word skills
    for skill in TECH_SKILLS:
        if skill in words or skill in text_lower:
            found.append(skill)
            
    return found

def analyze_resume(resume_text, job_description):
    if not job_description:
        return {"error": "Job description is missing"}

    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()
    
    # Extract skills from JD directly
    jd_skills = extract_skills(job_description)
    
    # If JD doesn't have recognizable skills from our limited list, we just extract some top words
    if not jd_skills:
        words = [w for w in re.findall(r'\b\w+\b', jd_lower) if len(w) > 5]
        # Just grab the top 10 unique words as "keywords"
        from collections import Counter
        most_common = [word for word, _ in Counter(words).most_common(15)]
        jd_skills = most_common

    resume_skills = extract_skills(resume_text)
    
    # If we fell back to generic words for JD, let's just find them in resume text
    if jd_skills and jd_skills[0] not in TECH_SKILLS:
        resume_words = set(re.findall(r'\b\w+\b', resume_lower))
        found_skills = [s for s in jd_skills if s in resume_words]
    else:
        found_skills = [s for s in jd_skills if s in resume_skills]
        
    missing_skills = [s for s in jd_skills if s not in found_skills]

    # Calculate scores MVP
    skill_score = min(100, int((len(found_skills) / len(jd_skills)) * 100)) if jd_skills else 100
    
    # Mock experience and portfolio scores based on keyword presence in resume
    experience_score = 75 if "years" in resume_lower or "experience" in resume_lower else 40
    portfolio_score = 85 if "github" in resume_lower or "portfolio" in resume_lower or "project" in resume_lower else 30

    overall_score = int((skill_score * 0.6) + (experience_score * 0.2) + (portfolio_score * 0.2))

    # Generate MVP insights
    strengths = []
    if skill_score > 70:
        strengths.append(f"Strong match with JD requirements ({len(found_skills)}/{len(jd_skills)} skills matched).")
    if experience_score > 70:
        strengths.append("Experience section highlights relevant keywords.")
    if portfolio_score > 70:
        strengths.append("Portfolio links or project mentions detected.")

    if not strengths:
        strengths.append("Foundational layout detected, but lacks specific matching keywords from JD.")

    suggestions = []
    if missing_skills:
        suggestions.append(f"Consider adding missing keywords from the JD: {', '.join(missing_skills[:5])}")
    if portfolio_score < 50:
        suggestions.append("Add a link to your portfolio or GitHub.")
    if experience_score < 50:
        suggestions.append("Elaborate more on your 'experience' and 'results' instead of just listing duties.")

    return {
        "role": {
            "title": "Custom Job Match",
            "company": "Provided Job Description"
        },
        "scores": {
            "overall": overall_score,
            "skills": skill_score,
            "experience": experience_score,
            "portfolio": portfolio_score,
            "keywords": skill_score # Merged keywords into skills for this MVP
        },
        "details": {
            "foundSkills": found_skills,
            "missingSkills": missing_skills
        },
        "insights": {
            "strengths": strengths,
            "suggestions": suggestions
        }
    }
