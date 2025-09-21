export type ResumeHighlight = {
    skills: string[];
    projects: string[];
    keywords: string[];
};

// Server returns a single numeric rating out of 10
export type ResumeRating = number;

// Server returns summary as a plain string
export type ProfessionalSummary = string;

export type SuggestionItem = { id: number; text: string };

export type AnalysisResult = {
    highlights: ResumeHighlight;
    rating: ResumeRating;
    suggestions: SuggestionItem[];
    summary: ProfessionalSummary;
    skillsGap?: string[];
    jobTitle?: string;
};