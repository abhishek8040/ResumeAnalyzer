export function generateSummary(text: string, skills: string[] = [], projects: string[] = []): string {
    const lead = inferTitleOrRole(text);
    const topSkills = skills.slice(0, 5);
    const proj = projects.slice(0, 2);

    const parts: string[] = [];
    parts.push(`${lead} with strengths in ${topSkills.length ? topSkills.join(', ') : 'core problem-solving and collaboration'}.`);
    if (proj.length) parts.push(`Built ${proj.join('; ')} leveraging impact and measurable outcomes.`);
    return parts.join(' ').slice(0, 300);
}

function inferTitleOrRole(text: string) {
    if (/\b(data scientist|machine learning engineer)\b/i.test(text)) return 'Data-focused professional';
    if (/\b(frontend|react|ui)\b/i.test(text)) return 'Frontend engineer';
    if (/\b(backend|node|api|microservices)\b/i.test(text)) return 'Backend engineer';
    if (/\b(full[- ]?stack)\b/i.test(text)) return 'Full‑stack engineer';
    if (/\b(devops|cloud|sre)\b/i.test(text)) return 'DevOps/Cloud engineer';
    return 'Results-driven professional';
}