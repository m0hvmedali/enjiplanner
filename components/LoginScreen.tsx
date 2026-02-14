
import React, { useState } from 'react';
import { GradeLevel, UserProfile } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface LoginScreenProps {
    onLogin: (profile: UserProfile) => void;
}

const GRADE_LEVELS: GradeLevel[] = [
    'الصف الأول الثانوي',
    'الصف الثاني الثانوي',
    'الصف الثالث الثانوي'
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState<GradeLevel>(GRADE_LEVELS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin({ name: name.trim(), grade });
        }
    };

    return (
        <div className="min-h-screen bg-cine-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cine-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="glass-panel w-full max-w-md p-8 rounded-[30px] border border-white/10 relative z-10 shadow-2xl shadow-black/50 animate-fade-in text-right">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-cine-accent/10 to-blue-900/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                        <Logo className="w-16 h-16" />
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                        مرحباً بك في رفيق
                    </h1>
                    <p className="text-slate-500 font-light">مساحتك الشخصية للنمو والإنجاز</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">الاسم</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="أدخل اسمك..."
                            className="glass-input w-full px-5 py-4 rounded-xl text-slate-200 outline-none text-lg placeholder-slate-600 text-right"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">المرحلة الدراسية</label>
                        <div className="relative">
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                                className="glass-input w-full px-5 py-4 rounded-xl text-slate-200 outline-none text-lg appearance-none cursor-pointer text-right"
                            >
                                {GRADE_LEVELS.map(g => (
                                    <option key={g} value={g} className="bg-cine-dark text-slate-200 py-2">{g}</option>
                                ))}
                            </select>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <ArrowRight className="w-5 h-5 rotate-90" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cine-accent hover:opacity-90 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cine-accent/20 flex items-center justify-center gap-2 mt-4"
                    >
                        <Sparkles className="w-5 h-5" />
                        ابدأ رحلتك
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
