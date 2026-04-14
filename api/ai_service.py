import os
import google.generativeai as genai

def _get_model():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-flash')

def generate_tailored_summary(resume_text, job_description):
    model = _get_model()
    if not model:
        return "Gemini API key not configured. Cannot generate live summary."
        
    prompt = f"""
    Act as an expert career coach. Based on the following Job Description and the candidate's Resume Text, 
    write a highly tailored, compelling 3-sentence professional summary for the candidate that highlights 
    their best matching skills and experiences for this specific role.

    JOB DESCRIPTION:
    {job_description[:1000]}

    RESUME TEXT:
    {resume_text[:2000]}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Failed to generate summary: {str(e)}"

def rewrite_bullets(resume_text, job_description):
    model = _get_model()
    if not model:
        return "Gemini API key not configured. Cannot rewrite bullets."
        
    prompt = f"""
    Act as an expert resume writer. Given this Job Description and the candidate's Resume Text,
    give me 3 bullet points that the candidate should add or rewrite in their resume to better 
    highlight their relevant experience for this job. Keep them concise, action-oriented, and impactful.

    JOB DESCRIPTION:
    {job_description[:1000]}

    RESUME TEXT:
    {resume_text[:2000]}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Failed to rewrite bullets: {str(e)}"
