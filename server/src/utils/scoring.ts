export function scoreResume(resume: string): number {
    // Placeholder scoring logic based on clarity and impact
    let score = 0;

    // Example scoring criteria
    if (resume.includes("skills")) score += 3;
    if (resume.includes("projects")) score += 3;
    if (resume.includes("experience")) score += 4;

    // Normalize score to a scale of 10
    return Math.min(score, 10);
}

export function evaluateClarity(resume: string): string {
    // Placeholder clarity evaluation logic
    const clarityKeywords = ["clear", "concise", "organized"];
    const foundKeywords = clarityKeywords.filter(keyword => resume.includes(keyword));

    if (foundKeywords.length > 2) {
        return "Excellent clarity";
    } else if (foundKeywords.length === 2) {
        return "Good clarity";
    } else {
        return "Needs improvement in clarity";
    }
}