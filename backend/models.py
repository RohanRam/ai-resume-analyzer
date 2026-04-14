from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    saved_jobs = db.relationship('SavedJob', backref='user', lazy=True)

class Analysis(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_description = db.Column(db.Text, nullable=False)
    resume_text = db.Column(db.Text, nullable=False)
    
    # JSON strings or nested structures. For SQLite/Postgres compatibility we use Text for generic JSON dumps.
    scores_json = db.Column(db.Text, nullable=False)
    details_json = db.Column(db.Text, nullable=False)
    insights_json = db.Column(db.Text, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SavedJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    analysis_id = db.Column(db.String(36), db.ForeignKey('analysis.id'), nullable=False)
    
    analysis = db.relationship('Analysis')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
