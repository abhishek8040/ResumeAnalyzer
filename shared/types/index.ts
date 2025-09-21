export type ResumeHighlight = {
    skills: string[];
    projects: string[];
    keywords: string[];
};

export type ResumeRating = {
    clarity: number;
    impact: number;
};

export type ProfessionalSummary = {
    summary: string;
};

export type JobComparison = {
    missingSkills: string[];
    matchedSkills: string[];
};