import unittest
import os
import tempfile
from app import app, allowed_file, extract_text_from_pdf, calculate_ats_score

class ResumeAnalyzerTestCase(unittest.TestCase):
    """Test cases for Resume Analyzer application"""
    
    def setUp(self):
        """Set up test client and configuration"""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        # Create temporary directories
        self.upload_dir = tempfile.mkdtemp()
        self.generated_dir = tempfile.mkdtemp()
        self.app.config['UPLOAD_FOLDER'] = self.upload_dir
        
    def tearDown(self):
        """Clean up after tests"""
        # Clean up temporary directories
        import shutil
        shutil.rmtree(self.upload_dir, ignore_errors=True)
        shutil.rmtree(self.generated_dir, ignore_errors=True)
    
    def test_allowed_file(self):
        """Test file extension validation"""
        self.assertTrue(allowed_file('resume.pdf'))
        self.assertTrue(allowed_file('document.PDF'))
        self.assertFalse(allowed_file('resume.docx'))
        self.assertFalse(allowed_file('resume.txt'))
        self.assertFalse(allowed_file('resume'))
    
    def test_calculate_ats_score(self):
        """Test ATS score calculation"""
        # Test with good resume content
        good_resume = """
        John Doe
        Software Developer
        john.doe@email.com
        (555) 123-4567
        
        EXPERIENCE
        Software Developer at Tech Corp (2020-2023)
        - Developed web applications using Python and Flask
        - Implemented machine learning solutions
        - Led a team of 5 developers
        
        EDUCATION
        Bachelor of Computer Science, University of Technology (2016-2020)
        
        SKILLS
        Python, Flask, Machine Learning, SQL, Git
        """
        
        score = calculate_ats_score(good_resume)
        self.assertGreater(score, 50)  # Should have a decent score
        
        # Test with poor resume content
        poor_resume = "short"
        score = calculate_ats_score(poor_resume)
        self.assertLess(score, 30)  # Should have a low score
    
    def test_home_page(self):
        """Test home page loads correctly"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Resume Analyzer', response.data)
    
    def test_templates_page(self):
        """Test templates page loads correctly"""
        response = self.client.get('/templates')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Resume Templates', response.data)
    
    def test_api_templates(self):
        """Test templates API endpoint"""
        response = self.client.get('/api/templates')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        
        # Check template structure
        template = data[0]
        self.assertIn('id', template)
        self.assertIn('name', template)
        self.assertIn('description', template)
    
    def test_upload_without_file(self):
        """Test upload endpoint without file"""
        response = self.client.post('/upload')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('error', data)
    
    def test_analyze_without_data(self):
        """Test analyze endpoint without data"""
        response = self.client.post('/analyze', json={})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('error', data)
    
    def test_generate_without_data(self):
        """Test generate endpoint without data"""
        response = self.client.post('/generate', json={})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('error', data)
    
    def test_compare_scores(self):
        """Test score comparison functionality"""
        response = self.client.post('/compare', json={
            'original_score': 5.0,
            'new_score': 8.0
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        
        self.assertEqual(data['original_score'], 5.0)
        self.assertEqual(data['new_score'], 8.0)
        self.assertEqual(data['improvement'], 3.0)
        self.assertEqual(data['improvement_percentage'], 60.0)

if __name__ == '__main__':
    # Run tests
    unittest.main(verbosity=2)
