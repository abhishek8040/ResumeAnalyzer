export interface Resume {
    personalInfo: PersonalInfo;
    education: Education[];
    workExperience: WorkExperience[];
    skills: string[];
    projects: Project[];
    summary?: string;
}

export interface PersonalInfo {
    name: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export interface WorkExperience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
}