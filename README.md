# Resume Analyzer - AI-Powered Resume Analysis Web App
<br>
**# LIVE DEMO 🚗 : https://resumeanalyzer-b0qu.onrender.com/ #** 
<br>
Click ☝️ this site and wait for 10 sec to load this app.
<br>
A comprehensive Flask-based web application that uses AI to analyze resumes, provide feedback, and generate professional resume templates. Built with Flask, Hugging Face API, and modern web technologies.

## 🚀 Features

### Core Features
- **PDF Resume Upload & Parsing** - Upload PDF resumes and extract text using PyPDF2
- **AI-Powered Analysis** - Uses Hugging Face Inference API for intelligent resume analysis
- **Comprehensive Scoring** - Overall resume score (0-10) with detailed feedback
- **ATS Readability Score** - Checks resume compatibility with Applicant Tracking Systems
- **Section-wise Suggestions** - Detailed recommendations for each resume section
- **Professional Summary Generation** - AI-generated 2-line professional summaries
- **Job Match Analysis** - Compare resume against target job requirements

### Advanced Features
- **Resume Template Gallery** - 4 professional ATS-friendly resume templates
- **Resume Regeneration** - Generate new resumes using selected templates
- **PDF Export** - Download resumes as professional PDFs
- **Before/After Comparison** - Compare original vs improved resume scores
- **Keyword Density Analysis** - Visual analysis of resume keywords
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI/ML**: Hugging Face Inference API
- **PDF Processing**: PyPDF2, ReportLab
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Charts**: Chart.js (for future enhancements)

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- ReportLab (for PDF generation)
- Hugging Face API key

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/abhishek8040/ResumeAnalyzer.git
cd ResumeAnalyzer
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install WeasyPrint System Dependencies

**macOS:**
```bash
brew install cairo pango gdk-pixbuf libffi
```

**Ubuntu/Debian:**
```bash
sudo apt-get install libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev
```

**Windows:**
1. Install GTK+ from: https://www.gtk.org/download/windows.php
2. Add GTK+ to your PATH

### 5. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Hugging Face API Configuration
HF_API_KEY=your-hugging-face-api-key-here

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads
```

### 6. Get Hugging Face API Key
1. Visit [Hugging Face](https://huggingface.co/)
2. Create an account and sign in
3. Go to Settings > Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token and add it to your `.env` file

### 7. Create Required Directories
```bash
mkdir uploads
mkdir generated_resumes
```

### 8. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
resumeanalyzer/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── .env.example          # Environment variables template
├── templates/            # Jinja2 HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   └── templates.html    # Template gallery
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── main.js       # JavaScript functionality
│   └── images/           # Images and icons
├── uploads/              # Uploaded PDF files
└── generated_resumes/    # Generated resume files
```

## 🔧 API Endpoints

### File Upload & Analysis
- `POST /upload` - Upload and analyze PDF resume
- `POST /analyze` - Analyze resume text with AI

### Resume Generation
- `GET /templates` - Template gallery page
- `GET /api/templates` - Get available templates (JSON)
- `POST /generate` - Generate resume with selected template
- `GET /download/<filename>` - Download generated files

### Comparison & Analysis
- `POST /compare` - Compare before/after resume scores

## 🎨 Resume Templates

### 1. Modern Professional
- Clean, contemporary design
- Perfect for tech roles
- ATS-friendly layout
- Blue color scheme

### 2. Classic Executive
- Traditional corporate format
- Ideal for executive positions
- Professional typography
- Black and white design

### 3. Creative Portfolio
- Eye-catching design
- Perfect for creative professionals
- Gradient backgrounds
- Modern layout

### 4. Minimal Tech
- Minimalist design
- Focus on technical skills
- Clean typography
- Light color scheme

## 🔍 How It Works

### 1. Resume Upload
- User uploads a PDF resume
- System extracts text using PyPDF2
- File is validated for size and format

### 2. AI Analysis
- Extracted text is sent to Hugging Face API
- AI analyzes content for:
  - Skills and keywords
  - Project highlights
  - Overall quality score
  - ATS compatibility
  - Improvement suggestions

### 3. Results Display
- Interactive results page shows:
  - Overall score with feedback
  - ATS readability score
  - Extracted highlights
  - Section-wise suggestions
  - AI-generated summary

### 4. Template Selection
- User chooses from 4 professional templates
- Form is pre-filled with extracted data
- Customizable fields for personalization

### 5. Resume Generation
- Selected template is applied
- Content is formatted and styled
- PDF is generated using pdfkit
- Files are available for download

## 🚀 Deployment

### Heroku Deployment
1. Create a `Procfile`:
```
web: python app.py
```

2. Add to `requirements.txt`:
```
gunicorn==20.1.0
```

3. Deploy to Heroku:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Docker Deployment
1. Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

2. Build and run:
```bash
docker build -t resume-analyzer .
docker run -p 5000:5000 resume-analyzer
```

## 🔧 Configuration

### Environment Variables
- `HF_API_KEY` - Your Hugging Face API key
- `FLASK_ENV` - Flask environment (development/production)
- `SECRET_KEY` - Flask secret key for sessions
- `MAX_CONTENT_LENGTH` - Maximum file upload size (bytes)
- `UPLOAD_FOLDER` - Directory for uploaded files

### Customization
- Modify `static/css/style.css` for styling changes
- Update `templates/` for layout modifications
- Add new resume templates in `generate_resume_html()` function
- Customize AI analysis prompts in `analyze_resume_with_ai()`

## 🐛 Troubleshooting

### Common Issues

**1. PDF Generation Fails**
- Ensure WeasyPrint system dependencies are installed
- Check file permissions for generated_resumes directory
- Verify WeasyPrint can import properly: `python -c "import weasyprint"`

**2. Hugging Face API Errors**
- Verify API key is correct and has proper permissions
- Check API rate limits and quotas

**3. File Upload Issues**
- Ensure uploads directory exists and is writable
- Check file size limits (16MB default)

**4. Template Not Loading**
- Verify all static files are in correct directories
- Check browser console for JavaScript errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for AI models and API
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [PyPDF2](https://pypdf2.readthedocs.io/) for PDF processing
- [pdfkit](https://pypi.org/project/pdfkit/) for PDF generation
- [Font Awesome](https://fontawesome.com/) for icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information
4. Contact the development team

---

**Happy Resume Building! 🚀**
