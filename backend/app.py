import os
import io
import json
from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from models import db, Analysis
from auth import auth_bp
from utils.analyzer import analyze_resume
from ai_service import generate_tailored_summary, rewrite_bullets

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration (Defaults to SQLite for local ease)
database_url = os.environ.get('DATABASE_URL', 'sqlite:///local.db')
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+pg8000://", 1)
elif database_url.startswith("postgresql://") and not database_url.startswith("postgresql+pg8000://"):
    database_url = database_url.replace("postgresql://", "postgresql+pg8000://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-dev-key')
jwt = JWTManager(app)

# Initialize Plugins
db.init_app(app)
app.register_blueprint(auth_bp, url_prefix='/api/auth')

with app.app_context():
    db.create_all()

@app.route('/api/analyze', methods=['POST'])
def analyze():
    job_description = request.form.get('jobDescription')
    
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400
        
    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not job_description:
        return jsonify({'error': 'jobDescription is required'}), 400

    try:
        resume_text = ""
        if file.filename.endswith('.pdf'):
            pdf_reader = PdfReader(file)
            for page in pdf_reader.pages:
                resume_text += page.extract_text() + " "
        else:
            resume_text = file.read().decode('utf-8')
    except Exception as e:
        return jsonify({'error': f'Could not read file: {str(e)}'}), 500
        
    analysis_data = analyze_resume(resume_text, job_description)
    if "error" in analysis_data:
        return jsonify(analysis_data), 400
        
    # Save to database
    new_analysis = Analysis(
        job_description=job_description,
        resume_text=resume_text,
        scores_json=json.dumps(analysis_data["scores"]),
        details_json=json.dumps(analysis_data["details"]),
        insights_json=json.dumps(analysis_data["insights"])
    )
    db.session.add(new_analysis)
    db.session.commit()
    
    # Inject the UUID into the response
    analysis_data["id"] = new_analysis.id
    return jsonify(analysis_data)

@app.route('/api/analysis/<uuid>', methods=['GET'])
def get_analysis(uuid):
    analysis = Analysis.query.get(uuid)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
        
    return jsonify({
        "id": analysis.id,
        "role": {
            "title": "Saved Job Match",
            "company": "From Database"
        },
        "scores": json.loads(analysis.scores_json),
        "details": json.loads(analysis.details_json),
        "insights": json.loads(analysis.insights_json)
    })

@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    data = request.json
    analysis_id = data.get('analysisId')
    
    analysis = Analysis.query.get(analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
        
    result = generate_tailored_summary(analysis.resume_text, analysis.job_description)
    return jsonify({"summary": result})

@app.route('/api/rewrite-bullets', methods=['POST'])
def rewrite_bullets_api():
    data = request.json
    analysis_id = data.get('analysisId')
    
    analysis = Analysis.query.get(analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
        
    result = rewrite_bullets(analysis.resume_text, analysis.job_description)
    return jsonify({"bullets": result})

# Needed for Vercel Serverless deployments
if __name__ == '__main__':
    app.run(debug=True, port=5000)
