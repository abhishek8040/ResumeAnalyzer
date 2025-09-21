export type Resume = {
    name: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
    projects: Project[];
    experience: Experience[];
    education: Education[];
};

export type Project = {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
};

export type Experience = {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
};

export type Education = {
    degree: string;
    institution: string;
    graduationYear: number;
};

export type Job = {
    title: string;
    requiredSkills: string[];
    description: string;
};