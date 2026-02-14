import { createClient } from '@supabase/supabase-js';
import { StudyPlan, Task } from '../types';
import { INITIAL_PLAN } from '../data';

// Configuration: If keys are missing, we fallback to local storage mode
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || '';

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_KEY;

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

// Mock database interactions using LocalStorage if Supabase is not present
const LOCAL_STORAGE_KEY = 'cinematic_study_plan_v1';

export const getStudyPlan = async (): Promise<StudyPlan> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('study_plans').select('*').single();
    if (!error && data) return data.plan;
  }

  // Fallback
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return INITIAL_PLAN;
};

export const updateTaskStatus = async (
  currentPlan: StudyPlan,
  subjectId: string,
  taskId: string,
  isCompleted: boolean
): Promise<StudyPlan> => {
  
  // Deep clone to avoid mutation issues
  const newPlan = JSON.parse(JSON.stringify(currentPlan)) as StudyPlan;
  
  const subject = newPlan.subjects[subjectId as keyof typeof newPlan.subjects];
  
  // Helper to find and update task
  const updateInList = (list: Task[]) => {
    const task = list.find(t => t.id === taskId);
    if (task) task.isCompleted = isCompleted;
  };

  if (subject.tasks) {
    updateInList(subject.tasks);
  }
  
  if (subject.sections) {
    subject.sections.forEach(sec => updateInList(sec.tasks));
  }

  // Save
  if (isSupabaseConfigured && supabase) {
    // Determine user ID or use a fixed ID for single user app
    await supabase.from('study_plans').upsert({ id: 1, plan: newPlan });
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlan));
  }

  return newPlan;
};