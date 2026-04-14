from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import db, User, SavedJob, Analysis
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
        
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(username=username, email=email, password_hash=hashed.decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify(access_token=access_token, user={"username": username, "email": email}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({"error": "Bad username or password"}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user={"username": user.username, "email": email}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"username": user.username, "email": user.email, "id": user.id}), 200

@auth_bp.route('/save-job', methods=['POST'])
@jwt_required()
def save_job():
    current_user_id = get_jwt_identity()
    data = request.json
    analysis_id = data.get('analysisId')
    
    if not analysis_id:
        return jsonify({"error": "Missing analysisId"}), 400
        
    # Check if already saved
    if SavedJob.query.filter_by(user_id=current_user_id, analysis_id=analysis_id).first():
        return jsonify({"message": "Job already saved"}), 200
        
    saved = SavedJob(user_id=current_user_id, analysis_id=analysis_id)
    db.session.add(saved)
    db.session.commit()
    return jsonify({"message": "Successfully saved job"}), 201

@auth_bp.route('/saved-jobs', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    current_user_id = get_jwt_identity()
    saved_jobs = SavedJob.query.filter_by(user_id=current_user_id).all()
    
    results = []
    for job in saved_jobs:
        analysis = job.analysis
        scores = json.loads(analysis.scores_json)
        # return basic essential info for the table
        job_title = "Saved Job Match"
        if getattr(analysis, 'role', None):
            pass # In future we could extract real role title
        elif analysis.job_description:
            # simple extract
            jd_start = analysis.job_description[:100].split('\n')[0]
            job_title = jd_start if len(jd_start) > 5 else "Saved Job Match"
            
        results.append({
            "id": analysis.id,
            "jobName": job_title,
            "overallScore": scores.get("overall", 0),
            "date": job.created_at.strftime("%Y-%m-%d")
        })
        
    return jsonify(results), 200

