import os
import json
import requests
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import PyPDF2
import io
from datetime import datetime
import re

# Try to import reportlab for PDF generation
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    print("Warning: ReportLab not available. PDF generation will be limited.")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('generated_resumes', exist_ok=True)

# Hugging Face API configuration
HF_API_KEY = os.getenv('HF_API_KEY', 'your-hf-api-key-here')
HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

def query_huggingface_api(prompt, model="microsoft/DialoGPT-medium"):
    """Query Hugging Face API for resume analysis"""
    try:
        API_URL = f"https://api-inference.huggingface.co/models/{model}"
        headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": 1000,
                "temperature": 0.7,
                "return_full_text": False
            }
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error querying Hugging Face API: {e}")
        return None

def analyze_resume_with_ai(resume_text):
    """Analyze resume using AI and return structured results"""
    
    # Create analysis prompts
    analysis_prompts = {
        "highlights": f"Extract key highlights from this resume: {resume_text[:2000]}",
        "rating": f"Rate this resume from 0-10 and provide brief feedback: {resume_text[:2000]}",
        "suggestions": f"Provide section-wise suggestions for this resume: {resume_text[:2000]}",
        "summary": f"Generate a 2-line professional summary for this resume: {resume_text[:2000]}",
        "skills": f"Extract skills and keywords from this resume: {resume_text[:2000]}"
    }
    
    results = {}
    
    # For demo purposes, we'll use mock data since Hugging Face API might have rate limits
    # In production, you would call the actual API
    results = {
        "highlights": {
            "skills": ["Python", "Flask", "Machine Learning", "Data Analysis", "SQL"],
            "projects": ["Resume Analyzer App", "E-commerce Platform", "Data Visualization Dashboard"],
            "keywords": ["Python", "Flask", "AI", "Machine Learning", "Web Development", "Data Science"]
        },
        "rating": {
            "score": 7.5,
            "feedback": "Good technical skills and project experience. Consider adding more quantifiable achievements and industry-specific keywords."
        },
        "suggestions": {
            "summary": "Add a compelling professional summary highlighting your key achievements and career objectives.",
            "skills": "Organize skills by category (Technical, Soft Skills, Tools) and add proficiency levels.",
            "experience": "Include quantifiable metrics and achievements in your work experience descriptions.",
            "education": "Add relevant coursework, certifications, or academic projects if applicable.",
            "projects": "Provide live links or GitHub repositories for your projects."
        },
        "summary": "Experienced Python developer with expertise in Flask, machine learning, and data analysis. Proven track record of building scalable web applications and implementing AI solutions.",
        "missing_skills": ["Docker", "AWS", "React", "Agile Methodology", "CI/CD"]
    }
    
    return results

def calculate_ats_score(resume_text):
    """Calculate ATS (Applicant Tracking System) readability score"""
    score = 0
    max_score = 100
    
    # Check for common ATS-friendly elements
    if len(resume_text) > 200:
        score += 20  # Adequate length
    
    # Check for contact information
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
        score += 15  # Email present
    
    if re.search(r'\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}', resume_text):
        score += 15  # Phone number present
    
    # Check for section headers
    sections = ['experience', 'education', 'skills', 'summary', 'objective']
    for section in sections:
        if section in resume_text.lower():
            score += 10
    
    # Check for action verbs
    action_verbs = ['developed', 'created', 'implemented', 'managed', 'led', 'designed', 'built']
    for verb in action_verbs:
        if verb in resume_text.lower():
            score += 5
            break
    
    return min(score, max_score)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Extract text from PDF
        with open(file_path, 'rb') as pdf_file:
            resume_text = extract_text_from_pdf(pdf_file)
        
        if resume_text:
            # Analyze resume with AI
            analysis_results = analyze_resume_with_ai(resume_text)
            ats_score = calculate_ats_score(resume_text)
            
            # Store results in session or database
            results = {
                'filename': filename,
                'resume_text': resume_text,
                'analysis': analysis_results,
                'ats_score': ats_score,
                'timestamp': datetime.now().isoformat()
            }
            
            return jsonify(results)
        else:
            return jsonify({'error': 'Could not extract text from PDF'}), 400
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.get_json()
    resume_text = data.get('resume_text', '')
    target_job = data.get('target_job', 'Software Developer')
    
    if not resume_text:
        return jsonify({'error': 'No resume text provided'}), 400
    
    # Analyze resume with AI
    analysis_results = analyze_resume_with_ai(resume_text)
    ats_score = calculate_ats_score(resume_text)
    
    # Add job comparison
    analysis_results['job_comparison'] = {
        'target_job': target_job,
        'missing_skills': analysis_results.get('missing_skills', []),
        'match_percentage': 75  # Mock percentage
    }
    
    return jsonify({
        'analysis': analysis_results,
        'ats_score': ats_score
    })

@app.route('/templates')
def template_gallery():
    return render_template('templates.html')

@app.route('/api/templates')
def api_templates():
    templates = [
        {
            'id': 'modern',
            'name': 'Modern Professional',
            'description': 'Clean and contemporary design perfect for tech roles',
            'preview': '/static/images/template1-preview.png'
        },
        {
            'id': 'classic',
            'name': 'Classic Executive',
            'description': 'Traditional format ideal for corporate positions',
            'preview': '/static/images/template2-preview.png'
        },
        {
            'id': 'creative',
            'name': 'Creative Portfolio',
            'description': 'Eye-catching design for creative professionals',
            'preview': '/static/images/template3-preview.png'
        },
        {
            'id': 'minimal',
            'name': 'Minimal Tech',
            'description': 'Minimalist design focused on technical skills',
            'preview': '/static/images/template4-preview.png'
        }
    ]
    return jsonify(templates)

@app.route('/generate', methods=['POST'])
def generate_resume():
    data = request.get_json()
    template_id = data.get('template_id')
    resume_data = data.get('resume_data')
    
    if not template_id or not resume_data:
        return jsonify({'error': 'Missing template or resume data'}), 400
    
    # Generate resume HTML based on template
    html_content = generate_resume_html(template_id, resume_data)
    
    # Save HTML file
    html_filename = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
    html_path = os.path.join('generated_resumes', html_filename)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Generate PDF
    pdf_filename = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_path = os.path.join('generated_resumes', pdf_filename)
    
    try:
        if REPORTLAB_AVAILABLE:
            # Generate PDF using ReportLab
            if generate_pdf_with_reportlab(resume_data, pdf_path):
                return jsonify({
                    'html_url': f'/download/{html_filename}',
                    'pdf_url': f'/download/{pdf_filename}',
                    'success': True
                })
            else:
                return jsonify({
                    'html_url': f'/download/{html_filename}',
                    'pdf_url': None,
                    'success': True,
                    'message': 'PDF generation failed. HTML version created.'
                })
        else:
            # Fallback: Return HTML only
            return jsonify({
                'html_url': f'/download/{html_filename}',
                'pdf_url': None,
                'success': True,
                'message': 'PDF generation not available. HTML version created.'
            })
    except Exception as e:
        return jsonify({'error': f'PDF generation failed: {str(e)}'}), 500

def generate_pdf_with_reportlab(resume_data, pdf_path):
    """Generate PDF using ReportLab"""
    if not REPORTLAB_AVAILABLE:
        return False
    
    try:
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph(resume_data.get('name', 'Resume'), title_style))
        story.append(Spacer(1, 12))
        
        # Contact info
        contact_style = ParagraphStyle(
            'Contact',
            parent=styles['Normal'],
            fontSize=10,
            alignment=1
        )
        contact_info = f"{resume_data.get('email', '')} | {resume_data.get('phone', '')} | {resume_data.get('location', '')}"
        story.append(Paragraph(contact_info, contact_style))
        story.append(Spacer(1, 20))
        
        # Professional Summary
        if resume_data.get('summary'):
            story.append(Paragraph("Professional Summary", styles['Heading2']))
            story.append(Paragraph(resume_data['summary'], styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Skills
        if resume_data.get('skills'):
            story.append(Paragraph("Skills", styles['Heading2']))
            skills_text = ", ".join(resume_data['skills'])
            story.append(Paragraph(skills_text, styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Experience
        if resume_data.get('experience'):
            story.append(Paragraph("Experience", styles['Heading2']))
            for exp in resume_data['experience']:
                story.append(Paragraph(f"<b>{exp.get('title', '')}</b> - {exp.get('company', '')}", styles['Normal']))
                story.append(Paragraph(f"{exp.get('duration', '')}", styles['Normal']))
                story.append(Paragraph(exp.get('description', ''), styles['Normal']))
                story.append(Spacer(1, 8))
        
        # Education
        if resume_data.get('education'):
            story.append(Paragraph("Education", styles['Heading2']))
            for edu in resume_data['education']:
                story.append(Paragraph(f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}", styles['Normal']))
                story.append(Paragraph(f"{edu.get('year', '')}", styles['Normal']))
                story.append(Spacer(1, 8))
        
        doc.build(story)
        return True
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return False

def generate_resume_html(template_id, resume_data):
    """Generate HTML resume based on template"""
    
    # Escape HTML content to prevent XSS
    def escape_html(text):
        if not text:
            return ""
        return str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#x27;')
    
    name = escape_html(resume_data.get('name', 'Your Name'))
    title = escape_html(resume_data.get('title', 'Professional Title'))
    email = escape_html(resume_data.get('email', 'email@example.com'))
    phone = escape_html(resume_data.get('phone', 'Phone Number'))
    summary = escape_html(resume_data.get('summary', 'Professional summary goes here...'))
    experience = escape_html(resume_data.get('experience', 'Work experience details...'))
    education = escape_html(resume_data.get('education', 'Education details...'))
    skills = resume_data.get('skills', [])
    
    if template_id == 'modern':
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - {name}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
                .resume {{ max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }}
                .name {{ font-size: 2.5em; color: #2c3e50; margin: 0; }}
                .title {{ font-size: 1.2em; color: #7f8c8d; margin: 10px 0; }}
                .contact {{ font-size: 1em; color: #7f8c8d; }}
                .section {{ margin-bottom: 30px; }}
                .section-title {{ font-size: 1.4em; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; }}
                .skills {{ display: flex; flex-wrap: wrap; gap: 10px; }}
                .skill {{ background: #3498db; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; }}
                .experience-item {{ margin-bottom: 20px; }}
                .experience-title {{ font-weight: bold; color: #2c3e50; }}
                .experience-company {{ color: #7f8c8d; }}
                .experience-description {{ margin-top: 5px; line-height: 1.5; }}
            </style>
        </head>
        <body>
            <div class="resume">
                <div class="header">
                    <h1 class="name">{name}</h1>
                    <p class="title">{title}</p>
                    <p class="contact">{email} | {phone}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Professional Summary</h2>
                    <p>{summary}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Skills</h2>
                    <div class="skills">
                        {''.join([f'<span class="skill">{escape_html(skill)}</span>' for skill in skills])}
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Experience</h2>
                    <div class="experience-item">
                        <div class="experience-description">{experience.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    <div class="experience-item">
                        <div class="experience-description">{education.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
    elif template_id == 'classic':
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - {name}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Times New Roman', serif; margin: 0; padding: 20px; background: white; }}
                .resume {{ max-width: 800px; margin: 0 auto; padding: 40px; }}
                .header {{ border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }}
                .name {{ font-size: 2.2em; color: #000; margin: 0; font-weight: bold; }}
                .title {{ font-size: 1.1em; color: #333; margin: 10px 0; }}
                .contact {{ font-size: 0.9em; color: #666; }}
                .section {{ margin-bottom: 25px; }}
                .section-title {{ font-size: 1.2em; color: #000; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 12px; font-weight: bold; }}
                .skills {{ display: flex; flex-wrap: wrap; gap: 8px; }}
                .skill {{ background: #f0f0f0; color: #333; padding: 3px 12px; border-radius: 3px; font-size: 0.85em; border: 1px solid #ccc; }}
                .experience-item {{ margin-bottom: 15px; }}
                .experience-description {{ margin-top: 5px; line-height: 1.4; }}
            </style>
        </head>
        <body>
            <div class="resume">
                <div class="header">
                    <h1 class="name">{name}</h1>
                    <p class="title">{title}</p>
                    <p class="contact">{email} | {phone}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Professional Summary</h2>
                    <p>{summary}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Technical Skills</h2>
                    <div class="skills">
                        {''.join([f'<span class="skill">{escape_html(skill)}</span>' for skill in skills])}
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Professional Experience</h2>
                    <div class="experience-item">
                        <div class="experience-description">{experience.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    <div class="experience-item">
                        <div class="experience-description">{education.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
    elif template_id == 'creative':
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - {name}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }}
                .resume {{ max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 30px rgba(0,0,0,0.2); border-radius: 10px; }}
                .header {{ text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin: -40px -40px 30px -40px; border-radius: 10px 10px 0 0; }}
                .name {{ font-size: 2.8em; margin: 0; font-weight: 300; }}
                .title {{ font-size: 1.3em; margin: 10px 0; opacity: 0.9; }}
                .contact {{ font-size: 1em; opacity: 0.8; }}
                .section {{ margin-bottom: 30px; }}
                .section-title {{ font-size: 1.5em; color: #667eea; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px; }}
                .skills {{ display: flex; flex-wrap: wrap; gap: 10px; }}
                .skill {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 25px; font-size: 0.9em; }}
                .experience-item {{ margin-bottom: 20px; }}
                .experience-description {{ margin-top: 8px; line-height: 1.6; }}
            </style>
        </head>
        <body>
            <div class="resume">
                <div class="header">
                    <h1 class="name">{name}</h1>
                    <p class="title">{title}</p>
                    <p class="contact">{email} | {phone}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">About Me</h2>
                    <p>{summary}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Skills & Expertise</h2>
                    <div class="skills">
                        {''.join([f'<span class="skill">{escape_html(skill)}</span>' for skill in skills])}
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Experience</h2>
                    <div class="experience-item">
                        <div class="experience-description">{experience.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    <div class="experience-item">
                        <div class="experience-description">{education.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
    else:  # minimal template
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - {name}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Helvetica', sans-serif; margin: 0; padding: 20px; background: #fafafa; }}
                .resume {{ max-width: 700px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ margin-bottom: 30px; }}
                .name {{ font-size: 2em; color: #333; margin: 0; font-weight: 300; }}
                .title {{ font-size: 1.1em; color: #666; margin: 5px 0; }}
                .contact {{ font-size: 0.9em; color: #888; }}
                .section {{ margin-bottom: 25px; }}
                .section-title {{ font-size: 1.1em; color: #333; margin-bottom: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }}
                .skills {{ display: flex; flex-wrap: wrap; gap: 6px; }}
                .skill {{ background: #f5f5f5; color: #333; padding: 4px 10px; border-radius: 3px; font-size: 0.8em; }}
                .experience-item {{ margin-bottom: 15px; }}
                .experience-description {{ margin-top: 5px; line-height: 1.4; color: #555; }}
            </style>
        </head>
        <body>
            <div class="resume">
                <div class="header">
                    <h1 class="name">{name}</h1>
                    <p class="title">{title}</p>
                    <p class="contact">{email} | {phone}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Summary</h2>
                    <p>{summary}</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Skills</h2>
                    <div class="skills">
                        {''.join([f'<span class="skill">{escape_html(skill)}</span>' for skill in skills])}
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Experience</h2>
                    <div class="experience-item">
                        <div class="experience-description">{experience.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    <div class="experience-item">
                        <div class="experience-description">{education.replace(chr(10), '<br>')}</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join('generated_resumes', filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404

@app.route('/compare', methods=['POST'])
def compare_resumes():
    data = request.get_json()
    original_score = data.get('original_score', 0)
    new_score = data.get('new_score', 0)
    
    improvement = new_score - original_score
    improvement_percentage = (improvement / original_score * 100) if original_score > 0 else 0
    
    return jsonify({
        'original_score': original_score,
        'new_score': new_score,
        'improvement': improvement,
        'improvement_percentage': round(improvement_percentage, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
