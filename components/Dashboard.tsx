
import React, { useState, useEffect } from 'react';
import { AnalysisResponse, MotivationalMessage } from '../types';
import { getFreshInspiration } from '../services/geminiService';
import { Activity, Battery, Moon, Brain, ChevronLeft, Sparkles, Lightbulb, Quote, RefreshCw } from 'lucide-react';

interface DashboardProps {
    lastAnalysis: AnalysisResponse | null;
    onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lastAnalysis, onNavigate }) => {
    const balance = lastAnalysis?.balanceScore || 75;
    const stress = lastAnalysis?.summary.stressLevel || 'low';

    const [inspiration, setInspiration] = useState<MotivationalMessage | null>(null);
    const [loadingQuote, setLoadingQuote] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            setLoadingQuote(true);
            try {
                const freshQuote = await getFreshInspiration();
                setInspiration(freshQuote);
            } catch (error) {
                console.error("Error fetching quote", error);
                if (lastAnalysis?.motivationalMessage) {
                    setInspiration(lastAnalysis.motivationalMessage);
                } else {
                    setInspiration({
                        text: "إن الله لا يضيع أجر من أحسن عملاً.",
                        source: "سورة الكهف",
                        category: "religious"
                    });
                }
            } finally {
                setLoadingQuote(false);
            }
        };

        fetchQuote();
    }, []);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-2 font-sans text-right">
                        لوحة القيادة
                    </h2>
                    <p className="text-slate-500 text-right">نظرة شمولية على توازنك الحيوي والأكاديمي</p>
                </div>
                {!lastAnalysis && (
                    <button
                        onClick={() => onNavigate('daily')}
                        className="bg-cine-accent hover:opacity-90 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cine-accent/20 transform hover:scale-105"
                    >
                        <Sparkles className="w-4 h-4" />
                        ابدأ تحليل اليوم
                    </button>
                )}
            </div>

            {/* Wisdom / Tip of the Day - Dynamic Section */}
            <div className="glass-panel p-6 rounded-[24px] border border-cine-accent/20 bg-gradient-to-r from-cyan-900/10 to-transparent relative overflow-hidden transition-all hover:border-cine-accent/40 min-h-[160px] flex items-center">
                <div className="absolute top-0 left-0 p-4 opacity-5">
                    <Quote className="w-24 h-24 text-cine-accent" />
                </div>

                {loadingQuote ? (
                    <div className="w-full flex justify-center items-center gap-3 text-cine-accent/50 animate-pulse">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>جاري جلب إلهام جديد من أجلك...</span>
                    </div>
                ) : inspiration ? (
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 w-full animate-fade-in">
                        <div className="p-4 bg-cine-accent/10 rounded-full">
                            <Lightbulb className="w-8 h-8 text-cine-accent" />
                        </div>
                        <div className="text-center md:text-right flex-1">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                <h3 className="text-cine-accent text-xs font-bold uppercase tracking-wider">
                                    قبس من النور (متجدد)
                                </h3>
                                {inspiration.category && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                        {inspiration.category}
                                    </span>
                                )}
                            </div>
                            <p className="text-xl md:text-2xl font-serif text-slate-200 leading-relaxed">"{inspiration.text}"</p>
                            <p className="text-sm text-slate-500 mt-2 font-medium">— {inspiration.source}</p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="glass-panel p-6 rounded-[24px] border-t border-t-emerald-500/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> مؤشر التوازن
                        </div>
                        <div className="text-3xl font-bold text-white mb-4">{balance}%</div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${balance}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border-t border-t-blue-500/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" /> الحالة الذهنية
                        </div>
                        <div className="text-2xl font-bold text-white capitalize">{lastAnalysis?.summary.effortType || 'متزن'}</div>
                        <div className="text-[10px] text-slate-500 mt-2">بناءً على آخر تقييم</div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border-t border-t-purple-500/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Moon className="w-4 h-4" /> النوم المثالي
                        </div>
                        <div className="text-2xl font-bold text-white">8.5 <span className="text-sm font-normal text-slate-500">ساعة</span></div>
                        <div className="text-[10px] text-slate-500 mt-2">توصيات AAP</div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-[24px] border-t border-t-blue-500/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cine-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <div className="text-cine-accent text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Battery className="w-4 h-4" /> مؤشر الضغط
                        </div>
                        <div className={`text-2xl font-bold capitalize ${stress === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {stress === 'low' ? 'منخفض' : stress === 'medium' ? 'متوسط' : 'مرتفع'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-2">يتطلب مراقبة مستمرة</div>
                    </div>
                </div>
            </div>

            {lastAnalysis ? (
                <div className="glass-panel p-8 md:p-10 rounded-[30px] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cine-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 text-right">
                            <span className="w-2 h-2 bg-cine-accent rounded-full animate-pulse"></span>
                            ملخص التوجيه الأخير
                        </h3>
                        <p className="text-slate-300 leading-loose mb-8 font-serif text-lg max-w-3xl border-r-2 border-white/10 pr-6 text-right">
                            {lastAnalysis.summary.analysisText.substring(0, 250)}...
                        </p>
                        <button onClick={() => onNavigate('report')} className="text-cine-accent hover:opacity-80 text-sm font-bold flex items-center gap-2 group mr-auto">
                            قراءة التوجيه الكامل
                            <span className="bg-cine-accent/10 p-1 rounded-full group-hover:bg-cine-accent/20 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-[30px] opacity-60">
                    <p className="text-slate-400 font-light">لا توجد بيانات تحليل لليوم بعد</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
