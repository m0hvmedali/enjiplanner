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
  tasks?: Task[]; // For subjects without section breakdown like English in the prompt
}

export interface StudyPlan {
  subjects: Record<SubjectId, SubjectData>;
}