
export type SubjectId = 'english' | 'arabic' | 'chemistry' | 'physics' | 'math';

export interface Task {
  id: string;
  title: string;
  duration: string; // e.g., "30 دقيقة"
  content: string;
  method?: string;
  feelingAfter: string;
  notebookLmLink?: string;
  pastExamsLink?: string;
  isCompleted: boolean;
  imageUrl?: string;
}

export interface SubjectData {
  id: SubjectId;
  name: string;
  color: string;
  accentColor: string;
  heroImage: string;
  description: string;
  sections?: {
    title: string;
    tasks: Task[];
  }[];
  tasks?: Task[];
}

export interface StudyPlan {
  subjects: Record<SubjectId, SubjectData>;
}

export type GradeLevel = 'الصف الأول الثانوي' | 'الصف الثاني الثانوي' | 'الصف الثالث الثانوي';

export interface UserProfile {
  name: string;
  grade: GradeLevel;
  pin?: string; // Optinal for Rafeeq compatibility
}

export const DAYS_OF_WEEK = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export interface WeeklySchedule {
  [day: string]: string[];
}

export interface MotivationalMessage {
  text: string;
  source: string;
  category?: 'religious' | 'scientific' | 'philosophical' | 'wisdom';
}

export interface PlanItem {
  time: string;
  task: string;
  method?: string;
  type: 'study' | 'break' | 'sleep' | 'prayer';
}

export interface StudyMethod {
  subject: string;
  methodName: string;
  details: string;
  tools: string[];
}

export interface ResearchConnection {
  point: string;
  source: string;
  evidenceStrength: 'strong' | 'medium' | 'limited';
  type: 'causal' | 'correlational';
  relevance: string;
}

export interface AnalysisResponse {
  summary: {
    accomplishment: string;
    effortType: 'mental' | 'emotional' | 'physical';
    stressLevel: 'low' | 'medium' | 'high';
    analysisText: string;
  };
  webAnalysis: {
    rootCause: string;
    suggestedRemedy: string;
    sources: { title: string; url: string; snippet: string }[];
  };
  motivationalMessage: MotivationalMessage;
  tomorrowPlan: PlanItem[];
  recommendedMethods: StudyMethod[];
  researchConnections: ResearchConnection[];
  psychologicalSupport: {
    message: string;
    technique: string;
  };
  quranicLink: {
    verse: string;
    surah: string;
    behavioralExplanation: string;
  };
  balanceScore: number;
}

export interface VoiceTutorResponse {
  score: number;
  feedback: string;
  missingConcepts: string[];
  correction: string;
}