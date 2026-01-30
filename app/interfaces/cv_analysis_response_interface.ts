export interface CvAnalysisResponse {
  result: Result;
}

export interface Result {
  drinks: Drink[];
  ai_model: string;
  keywords: Keywords;
  relevantSkill: ScoredSection;
  workExperience: ScoredSection;
  experienceMatch: string;
  overallImpression: ScoredSection;
  contactInformation: ScoredSection;
  professionalSummary: ScoredSection;
  educationAndCertification: ScoredSection;
  consistentAndErrorFreeWriting: SccoredSectionWithActions;
}

export interface Drink {
  name: string;
  score: number;
}

export interface Keywords {
  skills: string[];
  jobTitles: string[];
  careerPaths: string[];
}

export interface ScoredSection {
  score: number | null;
  details: string;
  actionPoints: string[];
  whyItsImportant: string;
}

export interface SccoredSectionWithActions {
  score: number;
  details: string;
  actionPoints: string[];
  whyItsImportant: string;
}
