import { analyzeText } from '../src/services/resumeAnalysis';
import { extractKeywords } from '../src/services/keywordExtractor';
import { generateSummary } from '../src/services/summaryGenerator';

describe('Analysis services', () => {
  const SAMPLE = `
  Summary
  Full-stack engineer experienced in React, Node.js, and AWS. Built analytics dashboards.
  Skills: JavaScript, TypeScript, React, Node.js, AWS, PostgreSQL
  Projects: Inventory System, Chat App
  Experience: Developed REST APIs and improved performance by 30%.
  `;

  it('analyzes text and returns highlights, summary, and rating', async () => {
    const result = await analyzeText(SAMPLE, { jobSkills: ['React', 'GraphQL'] });
    expect(result).toHaveProperty('highlights');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('rating');
    expect(Array.isArray(result.highlights.skills)).toBe(true);
  });

  it('extracts keywords from text', () => {
    const kws = extractKeywords(SAMPLE);
    expect(Array.isArray(kws)).toBe(true);
    expect(kws.length).toBeGreaterThan(0);
  });

  it('generates a short summary', () => {
    const s = generateSummary(SAMPLE);
    expect(typeof s).toBe('string');
    expect(s.length).toBeGreaterThan(10);
  });
});