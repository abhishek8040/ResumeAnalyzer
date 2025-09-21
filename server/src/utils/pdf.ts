import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import { extractKeywords, extractProjects, extractSkills } from '../services/keywordExtractor';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text || '';
}

export function getHighlightsFromText(text: string): { skills: string[]; projects: string[]; keywords: string[] } {
  const skills = extractSkills(text);
  const projects = extractProjects(text);
  const keywords = extractKeywords(text);
  return { skills, projects, keywords };
}