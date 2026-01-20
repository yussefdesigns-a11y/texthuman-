
export enum AppView {
  ANALYZE = 'ANALYZE',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY'
}

export interface Protocol {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionHint: string;
  icon: string;
}

export interface AnalysisMetric {
  label: string;
  value: number; // 0 to 100
  status: 'Low' | 'Medium' | 'High' | 'Very Low' | 'Good' | 'Poor' | 'Advanced' | 'Standard' | 'Simple';
}

export interface SentenceAnalysis {
  text: string;
  aiLikelihood: number; // 0 to 100
  reason: string;
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface AnalysisResult {
  humanPercentage: number;
  aiPercentage: number;
  perplexity: AnalysisMetric;
  burstiness: AnalysisMetric;
  readability: AnalysisMetric;
  complexity: {
    vocabularyRichness: number;
    structuralVariety: number;
    gradeLevel: string;
  };
  wordFrequency: WordFrequency[];
  verdict: string;
  verdictDescription: string;
  sentences: SentenceAnalysis[];
  wordCount: number;
  charCount: number;
}

export interface HumanizedResult {
  text: string;
  improvements: Improvement[];
  humanizationScore: number;
}

export interface Improvement {
  icon: string;
  title: string;
  description: string;
}

export interface AIHighlight {
  phrase: string;
  reason: string;
}

export interface SavedRecord {
  id: string;
  timestamp: number;
  originalText: string;
  analysis: AnalysisResult;
  humanized?: HumanizedResult;
  tone?: string;
}
