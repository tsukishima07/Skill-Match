export type AnalysisResult = {
  success: boolean;
  jobRole?: string;
  jdSource?: string;

  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jdSkills: string[];
  textSimilarity: number;

  suggestions: string[];
};