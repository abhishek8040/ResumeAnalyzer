// Simple keyword/skills extraction heuristics

const SKILL_DICTIONARY = [
    // Programming languages
    'javascript','typescript','python','java','c++','c#','ruby','go','rust','php','swift','kotlin','scala','perl','r',
    // Web
    'react','angular','vue','svelte','next.js','node.js','express','nestjs','graphql','rest','html','css','sass','less','tailwind',
    // Data/ML
    'sql','mysql','postgresql','mongodb','redis','dynamodb','elasticsearch','kafka','spark','hadoop','pandas','numpy','tensorflow','pytorch','scikit-learn',
    // DevOps & Cloud
    'docker','kubernetes','aws','gcp','azure','terraform','ansible','jenkins','circleci','github actions',
    // Testing
    'jest','mocha','chai','cypress','playwright','vitest',
    // Mobile
    'react native','flutter','android','ios',
    // Tools
    'git','jira','confluence','figma','postman',
    // Soft skills / general
    'leadership','communication','collaboration','agile','scrum','mentoring','stakeholder management'
];

const WORD_SPLIT = /[^a-zA-Z0-9+.#]+/g;

export function extractKeywords(text: string): string[] {
    const lc = text.toLowerCase();
    const words = lc.split(WORD_SPLIT).filter(Boolean);
    const freq: Record<string, number> = {};
    for (const w of words) {
        if (w.length < 3) continue;
        freq[w] = (freq[w] || 0) + 1;
    }
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([w]) => w);
}

export function extractSkills(text: string): string[] {
    const lc = text.toLowerCase();
    const found = new Set<string>();
    for (const skill of SKILL_DICTIONARY) {
        const pattern = new RegExp(`(^|[^a-zA-Z])${escapeRegex(skill)}([^a-zA-Z]|$)`, 'i');
        if (pattern.test(lc)) found.add(normalizeSkill(skill));
    }
    return Array.from(found).sort();
}

export function extractProjects(text: string): string[] {
    // Naive extraction: look for lines under a "Projects" section or lines starting with •, -, or numbered lists
    const lines = text.split(/\r?\n/);
    const results: string[] = [];
    let inProjects = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (/^projects?\b[:]?/i.test(line)) {
            inProjects = true;
            continue;
        }
        if (inProjects && /^\s*[A-Z][A-Za-z0-9 _\-]{2,}$/.test(line)) {
            // Likely a project title
            results.push(line.replace(/[:•\-]+$/, '').trim());
            continue;
        }
        if (/^(•|-|\d+[.)])\s+/.test(line)) {
            // Bullet which may denote a project or achievement; take first sentence up to 120 chars
            const snippet = line.replace(/^(•|-|\d+[.)])\s+/, '').trim();
            if (snippet.length > 0) results.push(snippet.slice(0, 120));
        }
        // Exit heuristic if another section starts
        if (inProjects && /^\s*(experience|education|skills|certifications|summary)\b/i.test(line)) {
            inProjects = false;
        }
    }
    // Deduplicate and keep top 5
    return Array.from(new Set(results)).slice(0, 5);
}

function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSkill(s: string) {
    // Capitalize common cases
    const map: Record<string, string> = {
        'javascript': 'JavaScript',
        'typescript': 'TypeScript',
        'python': 'Python',
        'java': 'Java',
        'c++': 'C++',
        'c#': 'C#',
        'react': 'React',
        'node.js': 'Node.js',
        'next.js': 'Next.js',
        'graphql': 'GraphQL',
        'html': 'HTML',
        'css': 'CSS',
        'aws': 'AWS',
        'gcp': 'GCP',
        'azure': 'Azure',
        'sql': 'SQL',
        'mongodb': 'MongoDB',
        'postgresql': 'PostgreSQL',
        'docker': 'Docker',
        'kubernetes': 'Kubernetes',
        'git': 'Git'
    };
    const lc = s.toLowerCase();
    return map[lc] || s.replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
}