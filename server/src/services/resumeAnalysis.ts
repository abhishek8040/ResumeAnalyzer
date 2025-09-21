import { extractKeywords, extractSkills, extractProjects } from './keywordExtractor';
import { generateSummary } from './summaryGenerator';
import { scoreResume } from '../utils/scoring';
import { compareResumeToJob } from './jobCompare';

export interface AnalyzeOptions {
    jobTitle?: string;
    jobSkills?: string[];
}

export async function analyzeText(text: string, options: AnalyzeOptions = {}) {
    const keywords = extractKeywords(text);
    const skills = extractSkills(text);
    const projects = extractProjects(text);

    const rating = scoreResume(text);
    const summary = generateSummary(text, skills, projects);

    const suggestions = buildSuggestions(text, skills, projects, rating);

    let skillsGap: string[] | undefined;
    if (options.jobTitle || (options.jobSkills && options.jobSkills.length)) {
        const resume = { skills } as any;
        const job = { title: options.jobTitle || 'Target Role', requiredSkills: options.jobSkills || [] } as any;
        skillsGap = compareResumeToJob(resume, job);
    }

    return {
        highlights: { skills, projects, keywords },
        rating,
        summary,
        suggestions,
            skillsGap: skillsGap || [],
            jobTitle: options.jobTitle || undefined,
    };
}

function buildSuggestions(text: string, skills: string[], projects: string[], rating: number) {
    const out: { id: number; text: string }[] = [];
    let id = 1;
    if (!/\bsummary\b/i.test(text)) out.push({ id: id++, text: 'Add a brief professional summary at the top (2 lines).' });
    if (skills.length < 5) out.push({ id: id++, text: 'List at least 5-8 key skills relevant to your target role.' });
    if (projects.length === 0) out.push({ id: id++, text: 'Add 1-2 impact-focused projects with metrics and tech stack.' });
    if (!/\bexperience|work experience\b/i.test(text)) out.push({ id: id++, text: 'Include a Work Experience section with action verbs and results.' });
    if (rating < 7) out.push({ id: id++, text: 'Tighten wording: use active voice and quantify outcomes (e.g., increased X%...).' });
    return out;
}