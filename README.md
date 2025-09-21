# Resume Analysis App
**#' SIR GIVE ME ! hour Time i am Uploading my new APP on this git.**
## Overview
The Resume Analysis App is a powerful tool designed to help students and professionals enhance their resumes. By leveraging advanced analysis techniques, the app provides insights into resume content, highlights key skills, and offers suggestions for improvement. This tool aims to increase the chances of applicants standing out in the competitive job market.

## Features
- **Resume Upload**: Users can upload their resumes in PDF format for analysis.
- **Highlight Extraction**: The app extracts key skills, projects, and relevant keywords from the uploaded resume.
- **Resume Rating**: Users receive a quick rating (out of 10) for clarity and impact.
- **Improvement Suggestions**: The app provides tailored suggestions for enhancing each section of the resume.
- **Professional Summary Generation**: A concise, two-line professional summary is generated for the top of the resume.
- **Job Title Comparison**: (Optional) Users can compare their resumes against a target job title to identify missing skills.

## Technologies Used
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript
- **Database**: (Optional) MongoDB or any other database for storing user data and analysis results.
- **Testing**: Jest, React Testing Library for frontend; Mocha/Chai for backend.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abhishek8040/ResumeAnalyzer.git
   cd ResumeAnalyzer
   ```
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```
4. Set up environment variables (optional):
   - Copy `.env.example` to `.env` in the `server` directory and adjust values if needed.

## Running the Application
1. Start the server (http://localhost:5000):
   ```bash
   cd server
   npm run dev
   ```
2. Start the client (Vite dev server):
   ```bash
   cd ../client
   npm start
   ```
3. Open the URL printed by Vite (usually `http://localhost:3000`).
   - API requests to `/api/*` are proxied to `http://localhost:5000`.

## Testing
Server (Jest):
```bash
cd server
npm test
```
Client (Vitest + RTL):
```bash
cd client
npm test
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
