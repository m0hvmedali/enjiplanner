import { supabase } from '../lib/supabase';
import { StudyPlan, Task } from '../types';
import { INITIAL_PLAN } from '../data';

const LOCAL_STORAGE_KEY = 'cinematic_study_plan_v1';

export const getStudyPlan = async (): Promise<StudyPlan> => {
    if (supabase) {
        try {
            const { data, error } = await supabase.from('study_plans').select('plan').eq('id', 1).single();
            if (!error && data) return data.plan as StudyPlan;
            if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
                console.warn('Supabase plan fetch error:', error);
            }
        } catch (e) {
            console.error('Failed to fetch plan from Supabase:', e);
        }
    }

    // Fallback to LocalStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse local plan:', e);
        }
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

    const updateInList = (list: Task[]) => {
        const task = list.find(t => t.id === taskId);
        if (task) task.isCompleted = isCompleted;
    };

    if (subject.tasks) updateInList(subject.tasks);
    if (subject.sections) {
        subject.sections.forEach(sec => updateInList(sec.tasks));
    }

    // Save to LocalStorage immediately for responsiveness
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlan));

    // Sync to Supabase in background
    if (supabase) {
        try {
            await supabase.from('study_plans').upsert({ id: 1, plan: newPlan, updated_at: new Date().toISOString() });
        } catch (e) {
            console.error('Failed to sync plan to Supabase:', e);
        }
    }

    return newPlan;
};
