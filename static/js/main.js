// Main JavaScript file for Resume Analyzer
// Global variables
let currentAnalysis = null;
let currentResumeData = null;
let chartInstances = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeUpload();
    initializeModals();
    initializeCharts();
    initializeTooltips();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Upload functionality
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
}

function handleFileUpload(file) {
    // Validate file type
    if (!file.type.includes('pdf')) {
        showNotification('Please upload a PDF file', 'error');
        return;
    }
    
    // Validate file size (16MB max)
    const maxSize = 16 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('File size must be less than 16MB', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Show progress
    showUploadProgress();
    
    // Upload file
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        currentAnalysis = data;
        currentResumeData = data;
        displayResults(data);
        showNotification('Resume analyzed successfully!', 'success');
    })
    .catch(error => {
        console.error('Upload error:', error);
        showNotification('Upload failed: ' + error.message, 'error');
        resetUpload();
    });
}

function showUploadProgress() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadProgress) uploadProgress.style.display = 'block';
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 85) progress = 85;
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }, 200);
    
    // Store interval ID for cleanup
    window.uploadProgressInterval = progressInterval;
}

function resetUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
    
    // Clear progress interval
    if (window.uploadProgressInterval) {
        clearInterval(window.uploadProgressInterval);
    }
}

// Results display
function displayResults(data) {
    // Update score
    updateScore(data.analysis.rating.score, data.analysis.rating.feedback);
    
    // Update ATS score
    updateATSScore(data.ats_score);
    
    // Update highlights
    updateHighlights(data.analysis.highlights);
    
    // Update suggestions
    updateSuggestions(data.analysis.suggestions);
    
    // Update summary
    updateSummary(data.analysis.summary);
    
    // Show modal
    showModal('resultsModal');
    
    // Reset upload area
    resetUpload();
}

function updateScore(score, feedback) {
    const scoreElement = document.getElementById('overallScore');
    const feedbackElement = document.getElementById('scoreFeedback');
    
    if (scoreElement) {
        animateNumber(scoreElement, 0, score, 1000);
    }
    
    if (feedbackElement) {
        feedbackElement.textContent = feedback;
    }
}

function updateATSScore(score) {
    const atsFill = document.getElementById('atsFill');
    const atsPercentage = document.getElementById('atsPercentage');
    
    if (atsFill) {
        setTimeout(() => {
            atsFill.style.width = score + '%';
        }, 500);
    }
    
    if (atsPercentage) {
        animateNumber(atsPercentage, 0, score, 1000, '%');
    }
}

function updateHighlights(highlights) {
    updateSkillsList(highlights.skills);
    updateProjectsList(highlights.projects);
    updateKeywordsList(highlights.keywords);
}

function updateSkillsList(skills) {
    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
        skillsList.innerHTML = skills.map(skill => 
            `<span class="skill-tag">${escapeHtml(skill)}</span>`
        ).join('');
    }
}

function updateProjectsList(projects) {
    const projectsList = document.getElementById('projectsList');
    if (projectsList) {
        projectsList.innerHTML = projects.map(project => 
            `<div class="project-item">${escapeHtml(project)}</div>`
        ).join('');
    }
}

function updateKeywordsList(keywords) {
    const keywordsList = document.getElementById('keywordsList');
    if (keywordsList) {
        keywordsList.innerHTML = keywords.map(keyword => 
            `<span class="keyword-tag">${escapeHtml(keyword)}</span>`
        ).join('');
    }
}

function updateSuggestions(suggestions) {
    const accordion = document.getElementById('suggestionsAccordion');
    if (!accordion) return;
    
    accordion.innerHTML = Object.entries(suggestions).map(([section, suggestion]) => `
        <div class="suggestion-item">
            <div class="suggestion-header">
                <h4>${capitalizeFirst(section)}</h4>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="suggestion-content">
                <p>${escapeHtml(suggestion)}</p>
            </div>
        </div>
    `).join('');
    
    // Add accordion functionality
    initializeAccordion();
}

function updateSummary(summary) {
    const summaryElement = document.getElementById('generatedSummary');
    if (summaryElement) {
        summaryElement.textContent = summary;
    }
}

// Modal functionality
function initializeModals() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Action buttons
    const viewTemplatesBtn = document.getElementById('viewTemplates');
    if (viewTemplatesBtn) {
        viewTemplatesBtn.addEventListener('click', () => {
            showModal('templateModal');
            loadTemplates();
        });
    }
    
    const generateResumeBtn = document.getElementById('generateResume');
    if (generateResumeBtn) {
        generateResumeBtn.addEventListener('click', generateResume);
    }
    
    const analyzeJobMatchBtn = document.getElementById('analyzeJobMatch');
    if (analyzeJobMatchBtn) {
        analyzeJobMatchBtn.addEventListener('click', analyzeJobMatch);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Template functionality
function loadTemplates() {
    fetch('/api/templates')
    .then(response => response.json())
    .then(templates => {
        const grid = document.getElementById('templatesGrid');
        if (grid) {
            grid.innerHTML = templates.map(template => `
                <div class="template-card" data-template-id="${template.id}">
                    <div class="template-preview">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3>${escapeHtml(template.name)}</h3>
                    <p>${escapeHtml(template.description)}</p>
                    <button class="btn btn-primary select-template" data-template-id="${template.id}">
                        Select Template
                    </button>
                </div>
            `).join('');
            
            // Add click handlers
            document.querySelectorAll('.select-template').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const templateId = e.target.getAttribute('data-template-id');
                    selectTemplate(templateId);
                });
            });
        }
    })
    .catch(error => {
        console.error('Error loading templates:', error);
        showNotification('Error loading templates', 'error');
    });
}

function selectTemplate(templateId) {
    if (!currentResumeData) {
        showNotification('Please upload a resume first', 'warning');
        return;
    }
    
    const resumeData = extractResumeData();
    
    showModal('templateSelectionModal');
    document.getElementById('templateSelectionModal').setAttribute('data-template-id', templateId);
    
    // Pre-fill form with extracted data
    prefillResumeForm(resumeData);
}

function extractResumeData() {
    // Extract data from current analysis
    const analysis = currentAnalysis?.analysis || {};
    const highlights = analysis.highlights || {};
    
    return {
        name: 'John Doe', // This would be extracted from the resume text
        title: 'Software Developer',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        summary: analysis.summary || 'Professional summary will be generated here...',
        skills: highlights.skills || [],
        experience: 'Software Developer at Tech Corp (2020-2023)\n• Developed web applications using Python and Flask\n• Implemented machine learning solutions\n• Collaborated with cross-functional teams',
        education: 'Bachelor of Computer Science, University of Technology (2016-2020)\n• Relevant coursework: Data Structures, Algorithms, Machine Learning'
    };
}

function prefillResumeForm(data) {
    const fields = {
        'resumeName': data.name,
        'resumeTitle': data.title,
        'resumeEmail': data.email,
        'resumePhone': data.phone,
        'resumeSummary': data.summary,
        'resumeSkills': Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
        'resumeExperience': data.experience,
        'resumeEducation': data.education
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    });
}

function generateResumeWithTemplate() {
    const templateId = document.getElementById('templateSelectionModal').getAttribute('data-template-id');
    
    const resumeData = {
        name: document.getElementById('resumeName').value,
        title: document.getElementById('resumeTitle').value,
        email: document.getElementById('resumeEmail').value,
        phone: document.getElementById('resumePhone').value,
        summary: document.getElementById('resumeSummary').value,
        skills: document.getElementById('resumeSkills').value.split(',').map(s => s.trim()).filter(s => s),
        experience: document.getElementById('resumeExperience').value,
        education: document.getElementById('resumeEducation').value
    };
    
    // Validate required fields
    if (!resumeData.name || !resumeData.title || !resumeData.email) {
        showNotification('Please fill in all required fields (Name, Title, Email)', 'warning');
        return;
    }
    
    // Show loading
    const generateBtn = document.getElementById('generateWithTemplate');
    if (generateBtn) {
        const originalText = generateBtn.textContent;
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        
        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template_id: templateId,
                resume_data: resumeData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showDownloadLinks(data);
                showNotification('Resume generated successfully!', 'success');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error generating resume: ' + error.message, 'error');
        })
        .finally(() => {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        });
    }
}

function showDownloadLinks(data) {
    const modal = document.getElementById('templateSelectionModal');
    const downloadSection = document.createElement('div');
    downloadSection.className = 'download-section';
    downloadSection.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Resume Generated Successfully!</h3>
        </div>
        <div class="download-buttons">
            <a href="${data.html_url}" class="btn btn-secondary" download>
                <i class="fas fa-file-code"></i> Download HTML
            </a>
            <a href="${data.pdf_url}" class="btn btn-primary" download>
                <i class="fas fa-file-pdf"></i> Download PDF
            </a>
        </div>
        <div class="next-steps">
            <p>You can now use this resume to apply for jobs or upload it back to our analyzer for further improvements!</p>
        </div>
    `;
    
    // Clear form and add download section
    const form = modal.querySelector('.template-selection-form');
    if (form) {
        form.style.display = 'none';
    }
    modal.querySelector('.modal-body').appendChild(downloadSection);
}

// Job analysis
function analyzeJobMatch() {
    const targetJob = document.getElementById('targetJob');
    if (!targetJob) return;
    
    const jobTitle = targetJob.value.trim();
    if (!jobTitle) {
        showNotification('Please enter a target job title', 'warning');
        return;
    }
    
    // Mock job analysis (in real app, this would call an API)
    const missingSkills = ['Docker', 'AWS', 'React', 'Agile', 'CI/CD'];
    const matchPercentage = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    const missingSkillsDiv = document.getElementById('missingSkills');
    if (missingSkillsDiv) {
        missingSkillsDiv.innerHTML = `
            <div class="match-info">
                <h4>Match with "${escapeHtml(jobTitle)}": ${matchPercentage}%</h4>
                <div class="missing-skills-list">
                    <h5>Missing Skills:</h5>
                    ${missingSkills.map(skill => `<span class="missing-skill">${escapeHtml(skill)}</span>`).join('')}
                </div>
            </div>
        `;
    }
}

// Resume generation
function generateResume() {
    if (!currentResumeData) {
        showNotification('Please upload a resume first', 'warning');
        return;
    }
    
    showModal('templateModal');
    loadTemplates();
}

// Accordion functionality
function initializeAccordion() {
    document.querySelectorAll('.suggestion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Chart functionality
function initializeCharts() {
    // Initialize any charts if needed
    // This can be expanded for keyword density analysis, etc.
}

// Utility functions
function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltip functionality if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);
