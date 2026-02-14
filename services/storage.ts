
import { supabase } from '../lib/supabase';
import { WeeklySchedule, AnalysisResponse, UserProfile } from '../types';

const getUserKey = (username: string) => `user_${username.trim().toLowerCase()}`;

export const saveUserProfile = (profile: UserProfile): void => {
    localStorage.setItem(`rafeeq_user_${profile.name}`, JSON.stringify(profile));
    localStorage.setItem('rafeeq_current_user_name', profile.name);
};

export const getLastUser = (): UserProfile | null => {
    const name = localStorage.getItem('rafeeq_current_user_name');
    if (!name) return null;
    const profile = localStorage.getItem(`rafeeq_user_${name}`);
    return profile ? JSON.parse(profile) : null;
};

export const logoutUser = () => {
    localStorage.removeItem('rafeeq_current_user_name');
};

export const getSchedule = async (username: string): Promise<WeeklySchedule | null> => {
    const userKey = getUserKey(username);

    if (supabase) {
        try {
            const { data } = await supabase
                .from('schedules')
                .select('data')
                .eq('user_id', userKey)
                .single();

            if (data) {
                localStorage.setItem(`rafeeq_schedule_${username}`, JSON.stringify(data.data));
                return data.data as WeeklySchedule;
            }
        } catch (e) {
            console.warn('Supabase fetch failed, falling back to local.', e);
        }
    }

    const local = localStorage.getItem(`rafeeq_schedule_${username}`);
    return local ? JSON.parse(local) : null;
};

export const saveSchedule = async (username: string, schedule: WeeklySchedule): Promise<void> => {
    const userKey = getUserKey(username);
    localStorage.setItem(`rafeeq_schedule_${username}`, JSON.stringify(schedule));

    if (supabase) {
        try {
            await supabase
                .from('schedules')
                .upsert({
                    user_id: userKey,
                    data: schedule,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
        } catch (e) {
            console.error('Failed to sync schedule to Supabase', e);
        }
    }
};

export interface DailyEntry {
    reflection: string;
    analysis: AnalysisResponse | null;
}

export const getDailyEntry = async (username: string, dateKey: string = new Date().toISOString().split('T')[0]): Promise<DailyEntry | null> => {
    const userKey = getUserKey(username);

    if (supabase) {
        try {
            const { data } = await supabase
                .from('daily_entries')
                .select('reflection, analysis')
                .eq('user_id', userKey)
                .eq('date', dateKey)
                .single();

            if (data) {
                localStorage.setItem(`rafeeq_reflection_${username}`, data.reflection || '');
                if (data.analysis) {
                    localStorage.setItem(`rafeeq_analysis_${username}`, JSON.stringify(data.analysis));
                }
                return {
                    reflection: data.reflection || '',
                    analysis: data.analysis
                };
            }
        } catch (e) {
            console.warn('Supabase entry fetch failed', e);
        }
    }

    const reflection = localStorage.getItem(`rafeeq_reflection_${username}`) || '';
    const analysisRaw = localStorage.getItem(`rafeeq_analysis_${username}`);
    const analysis = analysisRaw ? JSON.parse(analysisRaw) : null;

    return { reflection, analysis };
};

export const saveDailyEntry = async (username: string, reflection: string, analysis: AnalysisResponse | null): Promise<void> => {
    const userKey = getUserKey(username);
    const dateKey = new Date().toISOString().split('T')[0];

    localStorage.setItem(`rafeeq_reflection_${username}`, reflection);
    if (analysis) {
        localStorage.setItem(`rafeeq_analysis_${username}`, JSON.stringify(analysis));
    } else {
        localStorage.removeItem(`rafeeq_analysis_${username}`);
    }

    if (supabase) {
        try {
            await supabase
                .from('daily_entries')
                .upsert({
                    user_id: userKey,
                    date: dateKey,
                    reflection: reflection,
                    analysis: analysis
                }, { onConflict: 'user_id, date' });
        } catch (e) {
            console.error('Failed to sync entry to Supabase', e);
        }
    }
};
