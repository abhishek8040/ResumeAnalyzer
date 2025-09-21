#!/usr/bin/env python3
"""
Resume Analyzer - Startup Script
Run this script to start the Resume Analyzer application
"""

import os
import sys
from app import app

def create_directories():
    """Create necessary directories if they don't exist"""
    directories = ['uploads', 'generated_resumes', 'static/images']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import PyPDF2
        import weasyprint
        import requests
        print("✓ All required dependencies are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_reportlab():
    """Check if ReportLab is available for PDF generation"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate
        print("✓ ReportLab is ready for PDF generation")
        return True
    except ImportError as e:
        print(f"✗ ReportLab not available: {e}")
        print("Install ReportLab with: pip install reportlab")
        return False

def main():
    """Main startup function"""
    print("🚀 Starting Resume Analyzer...")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check ReportLab
    if not check_reportlab():
        print("\n⚠️  Warning: PDF generation may not work without ReportLab")
        print("   You can still use the app for analysis and HTML generation")
    
    # Create directories
    create_directories()
    
    # Check environment variables
    hf_api_key = os.getenv('HF_API_KEY')
    if not hf_api_key or hf_api_key == 'your-hugging-face-api-key-here':
        print("\n⚠️  Warning: HF_API_KEY not set or using default value")
        print("   AI analysis will use mock data")
        print("   To enable real AI analysis, set your Hugging Face API key in .env file")
    
    print("\n" + "=" * 50)
    print("🌐 Starting Flask development server...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start Flask app
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n\n👋 Resume Analyzer stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
