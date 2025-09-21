import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    HF_API_KEY = os.getenv('HF_API_KEY', 'your-hugging-face-api-key-here')
    HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    
    # Allowed file extensions
    ALLOWED_EXTENSIONS = {'pdf'}
    
    # Resume templates configuration
    RESUME_TEMPLATES = {
        'modern': {
            'name': 'Modern Professional',
            'description': 'Clean and contemporary design perfect for tech roles',
            'color_scheme': 'blue'
        },
        'classic': {
            'name': 'Classic Executive',
            'description': 'Traditional format ideal for corporate positions',
            'color_scheme': 'black'
        },
        'creative': {
            'name': 'Creative Portfolio',
            'description': 'Eye-catching design for creative professionals',
            'color_scheme': 'gradient'
        },
        'minimal': {
            'name': 'Minimal Tech',
            'description': 'Minimalist design focused on technical skills',
            'color_scheme': 'gray'
        }
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
