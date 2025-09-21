export interface Job {
    title: string;
    company?: string;
    location?: string;
    description?: string;
    requirements?: string[];
    skills?: string[];
    requiredSkills: string[];
    postedDate?: Date;
    applicationLink?: string;
}