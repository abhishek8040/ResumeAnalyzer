# Deployment Guide

## Local Development

1. **Clone and setup:**
   ```bash
   git clone https://github.com/abhishek8040/ResumeAnalyzer.git
   cd ResumeAnalyzer
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp env.sample .env
   # Edit .env and add your Hugging Face API key
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

4. **Access the app:**
   Open http://localhost:5000 in your browser

## Production Deployment

### Heroku Deployment

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-resume-analyzer-app
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set HF_API_KEY=your-hugging-face-api-key
   heroku config:set SECRET_KEY=your-production-secret-key
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Render Deployment

1. **Connect GitHub repository to Render**
2. **Set environment variables in Render dashboard:**
   - `HF_API_KEY`: Your Hugging Face API key
   - `SECRET_KEY`: Your production secret key
3. **Deploy automatically on git push**

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HF_API_KEY` | Hugging Face API key | Yes |
| `SECRET_KEY` | Flask secret key | Yes |
| `FLASK_ENV` | Flask environment (development/production) | No |
| `MAX_CONTENT_LENGTH` | Max file upload size (bytes) | No |

## API Endpoints

- `GET /` - Main application page
- `POST /upload` - Upload resume for analysis
- `POST /analyze` - Analyze uploaded resume
- `GET /templates` - Resume template gallery
- `POST /generate` - Generate new resume
- `GET /download/<filename>` - Download generated files

## Troubleshooting

### Common Issues

1. **PDF Generation Fails:**
   - Ensure ReportLab is installed: `pip install reportlab`
   - Check file permissions for `generated_resumes/` directory

2. **Hugging Face API Errors:**
   - Verify API key is correct
   - Check API rate limits
   - Ensure internet connectivity

3. **File Upload Issues:**
   - Check file size limits
   - Ensure uploads directory exists
   - Verify file format (PDF only)

### Performance Optimization

1. **Enable caching for static files**
2. **Use a production WSGI server (Gunicorn)**
3. **Implement rate limiting for API calls**
4. **Add database for user sessions (optional)**

## Security Considerations

1. **Change default SECRET_KEY in production**
2. **Use HTTPS in production**
3. **Implement file upload validation**
4. **Add rate limiting for API endpoints**
5. **Sanitize user inputs to prevent XSS**
