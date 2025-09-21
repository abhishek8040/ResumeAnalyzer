import { Job } from '../types/job';
import { Resume } from '../types/resume';

/**
 * Compares the skills in a resume against the required skills for a target job title.
 * @param resume - The resume object containing skills.
 * @param job - The job object containing required skills.
 * @returns An array of missing skills.
 */
export function compareResumeToJob(resume: Resume, job: Job): string[] {
    const missingSkills: string[] = [];

    job.requiredSkills.forEach(skill => {
        if (!resume.skills.includes(skill)) {
            missingSkills.push(skill);
        }
    });

    return missingSkills;
}

/**
 * Generates a comparison report between the resume and the job title.
 * @param resume - The resume object.
 * @param job - The job object.
 * @returns A string report of the comparison.
 */
export function generateComparisonReport(resume: Resume, job: Job): string {
    const missingSkills = compareResumeToJob(resume, job);
    const report = `Comparison Report for ${job.title}:\n` +
                   `Missing Skills: ${missingSkills.length > 0 ? missingSkills.join(', ') : 'None'}`;

    return report;
}