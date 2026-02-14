import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_PLAN } from './data';
import { StudyPlan, SubjectId, Task, UserProfile, WeeklySchedule, AnalysisResponse } from './types';
import { getStudyPlan, updateTaskStatus } from './services/planService';
import { getLastUser, saveUserProfile, getSchedule, getDailyEntry, saveDailyEntry } from './services/storage';
import { analyzeDayAndPlan } from './services/geminiService';

// Original Enji Components
import TaskCard from './components/TaskCard';
import MotivationalHeader from './components/MotivationalHeader';

// New Rafeeq Components
import Dashboard from './components/Dashboard';
import AnalysisDisplay from './components/AnalysisDisplay';
import FocusMode from './components/FocusMode';
import VoiceRecap from './components/VoiceRecap';
import ScheduleManager from './components/ScheduleManager';
import ResourcesLibrary from './components/ResourcesLibrary';
import LoginScreen from './components/LoginScreen';
import { Logo } from './components/Logo';

import {
  Home, Book, Atom, Zap, Divide, Menu, X,
  Filter, ArrowUpDown, CheckCircle2, Circle, Clock, Type, List, LayoutList,
  Flame, Mic2, LayoutDashboard, Calendar as CalendarIcon, Library, LogOut
} from 'lucide-react';

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen, onLogout }: { isOpen: boolean, setIsOpen: (v: boolean) => void, onLogout: () => void }) => {
  const location = useLocation();
  const subjects = [
    { id: 'english', icon: Book, label: 'الإنجليزي', color: 'text-blue-400' },
    { id: 'arabic', icon: Book, label: 'العربي', color: 'text-emerald-400' },
    { id: 'chemistry', icon: Atom, label: 'الكيمياء', color: 'text-purple-400' },
    { id: 'physics', icon: Zap, label: 'الفيزياء', color: 'text-rose-400' },
    { id: 'math', icon: Divide, label: 'الرياضيات', color: 'text-orange-400' },
  ];

  const mainLinks = [
    { path: '/', icon: LayoutDashboard, label: 'لوحة القيادة' },
    { path: '/focus', icon: Flame, label: 'وضع التركيز' },
    { path: '/recap', icon: Mic2, label: 'المعلم الصوتي' },
    { path: '/schedule', icon: CalendarIcon, label: 'الجدول الأسبوعي' },
    { path: '/resources', icon: Library, label: 'مكتبة المصادر' },
  ];

  const linkClass = (path: string) => `
    flex items-center p-3 mb-2 rounded-xl transition-all duration-200
    ${location.pathname === path
      ? 'bg-cine-accent/10 text-cine-accent shadow-lg border-r-4 border-cine-accent'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-cine-dark border-l border-white/10 z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:w-20 lg:w-64
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 hidden lg:block" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-cine-accent to-purple-500 hidden lg:block">
              رفيق & Enji
            </h1>
          </div>
          <span className="lg:hidden md:block text-2xl"><Logo className="w-10 h-10" /></span>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
            <X />
          </button>
        </div>

        <nav className="px-4 mt-4 h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
          {mainLinks.map(link => (
            <Link key={link.path} to={link.path} className={linkClass(link.path)} onClick={() => setIsOpen(false)}>
              <link.icon size={22} className="ml-3 shrink-0" />
              <span className="hidden lg:inline font-semibold">{link.label}</span>
            </Link>
          ))}

          <div className="my-6 border-t border-white/10 flex items-center justify-center">
            <span className="bg-cine-dark px-2 -mt-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest hidden lg:block">المواد الدراسية</span>
          </div>

          {subjects.map((sub) => (
            <Link key={sub.id} to={`/subject/${sub.id}`} className={linkClass(`/subject/${sub.id}`)} onClick={() => setIsOpen(false)}>
              <sub.icon size={22} className={`ml-3 shrink-0 ${sub.color}`} />
              <span className="hidden lg:inline font-medium">{sub.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-cine-dark">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-colors group"
          >
            <LogOut size={22} className="ml-3 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

type FilterType = 'all' | 'completed' | 'incomplete';
type SortType = 'default' | 'duration' | 'title';

// Subject Detail Page (Preserved from Enji)
const SubjectPage = ({ plan, updateTask }: { plan: StudyPlan, updateTask: (sid: string, tid: string) => void }) => {
  const location = useLocation();
  const subjectId = location.pathname.split('/').pop() as SubjectId;
  const subject = plan.subjects[subjectId];

  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('default');

  useEffect(() => {
    setFilter('all');
    setSort('default');
  }, [subjectId]);

  if (!subject) return <div className="text-white p-10">المادة غير موجودة</div>;

  const processTasks = (tasks: Task[]) => {
    let result = [...tasks];
    if (filter === 'completed') result = result.filter(t => t.isCompleted);
    else if (filter === 'incomplete') result = result.filter(t => !t.isCompleted);
    if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
    else if (sort === 'duration') result.sort((a, b) => (parseInt(a.duration) || 9999) - (parseInt(b.duration) || 9999));
    return result;
  };

  const FilterButton = ({ value, label, icon: Icon }: { value: FilterType, label: string, icon: any }) => (
    <button onClick={() => setFilter(value)} className={`px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 transition-all ${filter === value ? 'bg-cine-accent text-cine-dark font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
      <Icon size={14} /> <span>{label}</span>
    </button>
  );

  const SortButton = ({ value, label, icon: Icon }: { value: SortType, label: string, icon: any }) => (
    <button onClick={() => setSort(value)} className={`px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 transition-all ${sort === value ? 'bg-cine-accent text-cine-dark font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
      <Icon size={14} /> <span>{label}</span>
    </button>
  );

  return (
    <div className="animate-fade-in pb-20 text-right">
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-3xl shadow-2xl mb-8">
        <img src={subject.heroImage} alt={subject.name} className="w-full h-full object-cover opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-t ${subject.color.replace('bg-', 'from-')} to-transparent opacity-90`} />
        <div className="absolute bottom-0 right-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2">{subject.name}</h1>
          <p className="text-xl text-gray-200 font-light">{subject.description}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 mb-8 flex flex-col md:flex-row-reverse gap-4 justify-between items-center glass-panel p-4 rounded-xl">
        <div className="flex gap-2">
          <FilterButton value="all" label="الكل" icon={LayoutList} />
          <FilterButton value="completed" label="مكتملة" icon={CheckCircle2} />
          <FilterButton value="incomplete" label="غير" icon={Circle} />
        </div>
        <div className="flex gap-2">
          <SortButton value="default" label="افتراضي" icon={List} />
          <SortButton value="duration" label="المدة" icon={Clock} />
          <SortButton value="title" label="العنوان" icon={Type} />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {subject.sections ? subject.sections.map((section, idx) => (
          <div key={idx} className="mb-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-start flex-row-reverse">
              <span className={`w-2 h-8 ${subject.color.replace('bg-', 'bg-')} rounded-full ml-3`}></span>
              {section.title}
            </h2>
            <div className="grid gap-4">
              {processTasks(section.tasks).map(task => (
                <TaskCard key={task.id} task={task} subjectColor={subject.color} onToggle={(tid) => updateTask(subject.id, tid)} />
              ))}
            </div>
          </div>
        )) : (
          <div className="grid gap-4">
            {processTasks(subject.tasks || []).map(task => (
              <TaskCard key={task.id} task={task} subjectColor={subject.color} onToggle={(tid) => updateTask(subject.id, tid)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Daily Input View (Venting Phase)
const DailyInputView = ({ onAnalyze }: { onAnalyze: (reflection: string) => void }) => {
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    setLoading(true);
    await onAnalyze(reflection);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-right">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white mb-2">فضفض لرفيقك</h2>
        <p className="text-slate-500">احكي اللي في قلبك عن يومك، مذاكرتك، تعبك، أو حتى فرحتك..</p>
      </div>
      <div className="glass-panel p-8 rounded-[30px] border border-white/5 space-y-6">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="كان يومي مليء بالتحديات، بدأت بـ..."
          className="glass-input w-full h-80 p-6 rounded-2xl text-lg leading-loose outline-none resize-none text-right"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !reflection.trim()}
          className="w-full bg-cine-accent hover:opacity-90 text-black font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {loading ? 'جاري التحليل العميق...' : 'حلل يومي ودبر لي خطتي'}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [plan, setPlan] = useState<StudyPlan>(INITIAL_PLAN);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getLastUser());
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({ "الأحد": [], "الاثنين": [], "الثلاثاء": [], "الأربعاء": [], "الخميس": [], "الجمعة": [], "السبت": [] });
  const [reflection, setReflection] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const dbPlan = await getStudyPlan();
      setPlan(dbPlan);

      if (userProfile) {
        const schedule = await getSchedule(userProfile.name);
        if (schedule) setWeeklySchedule(schedule);

        const entry = await getDailyEntry(userProfile.name);
        if (entry) {
          setReflection(entry.reflection);
          setLastAnalysis(entry.analysis);
        }
      }
      setLoading(false);
    };
    init();
  }, [userProfile]);

  const handleTaskUpdate = async (subjectId: string, taskId: string) => {
    let currentStatus = false;
    const findStatus = (tasks: any[]) => tasks.find(t => t.id === taskId)?.isCompleted;
    const subject = plan.subjects[subjectId as SubjectId];
    if (subject.tasks) currentStatus = findStatus(subject.tasks);
    if (subject.sections) subject.sections.forEach(s => { const res = findStatus(s.tasks); if (res !== undefined) currentStatus = res; });
    const newPlan = await updateTaskStatus(plan, subjectId, taskId, !currentStatus);
    setPlan(newPlan);
  };

  const handleLogin = (profile: UserProfile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('rafeeq_current_user_name');
      setUserProfile(null);
      window.location.hash = '#/';
    }
  };

  const handleAnalyze = async (text: string) => {
    if (!userProfile) return;
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayName = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][tomorrow.getDay()];

      const res = await analyzeDayAndPlan(text, weeklySchedule, dayName, userProfile.grade);
      setLastAnalysis(res);
      setReflection(text);
      await saveDailyEntry(userProfile.name, text, res);
      window.location.hash = '#/report';
    } catch (e: any) {
      if (e?.message === 'QUOTA_EXCEEDED') {
        alert('استنفدت حصة الذكاء الاصطناعي (Quota Exceeded). يرجى المحاولة لاحقاً أو مراجعة إعدادات الـ API.');
      } else {
        alert('فشل التحليل. تأكد من اتصالك بالإنترنت ومفتاح الـ API.');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cine-dark flex items-center justify-center text-cine-accent">
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-20 h-20 animate-pulse" />
        <p className="text-sm font-bold tracking-widest uppercase">جاري التحميل...</p>
      </div>
    </div>
  );

  if (!userProfile) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-cine-dark font-sans text-right" dir="rtl">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />

        <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-40 bg-cine-card p-2 rounded-full border border-white/10 text-white shadow-lg"
          >
            <Menu size={24} />
          </button>

          <MotivationalHeader />

          <div className="px-4 md:px-8 py-6">
            <Routes>
              <Route path="/" element={<Dashboard lastAnalysis={lastAnalysis} onNavigate={(v) => window.location.hash = `#/${v}`} />} />
              <Route path="/daily" element={<DailyInputView onAnalyze={handleAnalyze} />} />
              <Route path="/report" element={lastAnalysis ? <AnalysisDisplay data={lastAnalysis} /> : <DailyInputView onAnalyze={handleAnalyze} />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/recap" element={<VoiceRecap gradeLevel={userProfile.grade} />} />
              <Route path="/schedule" element={<ScheduleManager schedule={weeklySchedule} setSchedule={setWeeklySchedule} />} />
              <Route path="/resources" element={<ResourcesLibrary />} />
              <Route path="/subject/:id" element={<SubjectPage plan={plan} updateTask={handleTaskUpdate} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
