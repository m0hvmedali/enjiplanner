import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_PLAN } from './data';
import { StudyPlan, SubjectId, Task } from './types';
import { getStudyPlan, updateTaskStatus } from './services/supabase';
import TaskCard from './components/TaskCard';
import MotivationalHeader from './components/MotivationalHeader';
import { 
  Home, Book, Atom, Zap, Divide, Menu, X, 
  Filter, ArrowUpDown, CheckCircle2, Circle, Clock, Type, List, LayoutList 
} from 'lucide-react';

// Sidebar Navigation Component
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const location = useLocation();
  const subjects = [
    { id: 'english', icon: Book, label: 'الإنجليزي', color: 'text-blue-400' },
    { id: 'arabic', icon: Book, label: 'العربي', color: 'text-emerald-400' },
    { id: 'chemistry', icon: Atom, label: 'الكيمياء', color: 'text-purple-400' },
    { id: 'physics', icon: Zap, label: 'الفيزياء', color: 'text-rose-400' },
    { id: 'math', icon: Divide, label: 'الرياضيات', color: 'text-orange-400' },
  ];

  const linkClass = (path: string) => `
    flex items-center p-3 mb-2 rounded-xl transition-all duration-200
    ${location.pathname === path 
      ? 'bg-white/10 text-white shadow-lg border-r-4 border-cine-accent' 
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
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-cine-accent to-purple-500 hidden lg:block">
            خطة العباقرة
          </h1>
          <span className="lg:hidden md:block text-2xl">🎓</span>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
            <X />
          </button>
        </div>

        <nav className="px-4 mt-4">
          <Link to="/" className={linkClass('/')} onClick={() => setIsOpen(false)}>
            <Home size={24} className="ml-3 shrink-0" />
            <span className="hidden lg:inline font-semibold">الرئيسية</span>
          </Link>
          <div className="my-4 border-t border-white/10"></div>
          {subjects.map((sub) => (
            <Link key={sub.id} to={`/subject/${sub.id}`} className={linkClass(`/subject/${sub.id}`)} onClick={() => setIsOpen(false)}>
              <sub.icon size={24} className={`ml-3 shrink-0 ${sub.color}`} />
              <span className="hidden lg:inline font-medium">{sub.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

type FilterType = 'all' | 'completed' | 'incomplete';
type SortType = 'default' | 'duration' | 'title';

// Subject Detail Page
const SubjectPage = ({ plan, updateTask }: { plan: StudyPlan, updateTask: (sid: string, tid: string) => void }) => {
  const location = useLocation();
  const subjectId = location.pathname.split('/').pop() as SubjectId;
  const subject = plan.subjects[subjectId];

  // State for filtering and sorting
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('default');

  // Reset filters when changing subjects
  useEffect(() => {
    setFilter('all');
    setSort('default');
  }, [subjectId]);

  if (!subject) return <div className="text-white p-10">المادة غير موجودة</div>;

  const processTasks = (tasks: Task[]) => {
    let result = [...tasks];
    
    // 1. Filter
    if (filter === 'completed') {
      result = result.filter(t => t.isCompleted);
    } else if (filter === 'incomplete') {
      result = result.filter(t => !t.isCompleted);
    }

    // 2. Sort
    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
    } else if (sort === 'duration') {
      result.sort((a, b) => {
        // Parse '30 دقيقة' -> 30. If fails (e.g. 'week'), put it at the end (9999)
        const getVal = (s: string) => {
          const num = parseInt(s);
          return isNaN(num) ? 9999 : num;
        };
        return getVal(a.duration) - getVal(b.duration);
      });
    }

    return result;
  };

  const FilterButton = ({ value, label, icon: Icon }: { value: FilterType, label: string, icon: any }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 transition-all ${
        filter === value 
          ? 'bg-cine-accent text-cine-dark font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );

  const SortButton = ({ value, label, icon: Icon }: { value: SortType, label: string, icon: any }) => (
    <button
      onClick={() => setSort(value)}
      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 transition-all ${
        sort === value 
          ? 'bg-cine-accent text-cine-dark font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="animate-fade-in pb-20">
      {/* Cinematic Hero */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-3xl shadow-2xl mb-8">
        <img src={subject.heroImage} alt={subject.name} className="w-full h-full object-cover opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-t ${subject.color.replace('bg-', 'from-')} to-transparent opacity-90`} />
        <div className="absolute bottom-0 right-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">{subject.name}</h1>
          <p className="text-xl text-gray-200 font-light">{subject.description}</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 mb-8">
        <div className="bg-cine-dark/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Filter Group */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Filter size={12} />
              التصفية
            </div>
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg overflow-x-auto">
              <FilterButton value="all" label="الكل" icon={LayoutList} />
              <FilterButton value="completed" label="مكتملة" icon={CheckCircle2} />
              <FilterButton value="incomplete" label="غير مكتملة" icon={Circle} />
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/10 mx-2"></div>

          {/* Sort Group */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <ArrowUpDown size={12} />
              الترتيب
            </div>
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg overflow-x-auto">
              <SortButton value="default" label="افتراضي" icon={List} />
              <SortButton value="duration" label="المدة" icon={Clock} />
              <SortButton value="title" label="العنوان" icon={Type} />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {subject.sections ? (
          subject.sections.map((section, idx) => {
            const processedTasks = processTasks(section.tasks);
            if (processedTasks.length === 0) return null; // Hide empty sections after filtering
            
            return (
              <div key={idx} className="mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className={`w-2 h-8 ${subject.color.replace('bg-', 'bg-')} rounded-full ml-3`}></span>
                  {section.title}
                  <span className="mr-3 text-sm font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                    {processedTasks.length} مهمة
                  </span>
                </h2>
                <div className="grid gap-4">
                  {processedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      subjectColor={subject.color} 
                      onToggle={(tid) => updateTask(subject.id, tid)} 
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
           <div className="grid gap-4 animate-fade-in">
            {processTasks(subject.tasks || []).length > 0 ? (
              processTasks(subject.tasks || []).map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  subjectColor={subject.color} 
                  onToggle={(tid) => updateTask(subject.id, tid)} 
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <div className="text-gray-500 mb-2 text-4xl">📭</div>
                <p className="text-gray-400">لا توجد مهام تطابق البحث</p>
                <button 
                  onClick={() => setFilter('all')} 
                  className="mt-4 text-cine-accent text-sm hover:underline"
                >
                  عرض كل المهام
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard / Home Page
const Dashboard = ({ plan }: { plan: StudyPlan }) => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  // Mapping based on prompt: Sat(6)=Eng, Sun(0)=Chem, Mon(1)=Math, Tue(2)=Arb, Wed(3)=Phys, Thu(4)=Math, Fri(5)=Phys
  const scheduleMap: Record<number, {id: SubjectId, note: string}> = {
    6: { id: 'english', note: 'مراجعة خفيفة + استيعاب الدرس الجديد' },
    0: { id: 'chemistry', note: 'مذاكرة درس الكيمياء الجديد' },
    1: { id: 'math', note: 'الجديد حسب الدرس' },
    2: { id: 'arabic', note: 'مراجعة + درس العربي الجديد' },
    3: { id: 'physics', note: 'الجديد أولاً' },
    4: { id: 'math', note: 'الجديد حسب الدرس' },
    5: { id: 'physics', note: 'الجديد أولاً (مراجعة الفصل الرابع)' },
  };

  const todaysFocus = scheduleMap[today] || scheduleMap[6]; // Default to Saturday if undefined
  const subject = plan.subjects[todaysFocus.id];

  // Calculate total progress
  let totalTasks = 0;
  let completedTasks = 0;
  Object.values(plan.subjects).forEach(sub => {
    const countTasks = (tasks: any[]) => {
      tasks.forEach(t => { totalTasks++; if(t.isCompleted) completedTasks++; });
    };
    if(sub.tasks) countTasks(sub.tasks);
    if(sub.sections) sub.sections.forEach(s => countTasks(s.tasks));
  });
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-4 md:p-8 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">أهلاً بك أيها العبقري 👋</h1>
        <p className="text-gray-400">اليوم هو يوم إنجاز جديد. تذكر: <span className="text-cine-accent">60% إنجاز هو نجاح باهر.</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Progress Card */}
        <div className="bg-cine-card border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          <h3 className="text-gray-400 mb-2">نسبة إنجازك العام</h3>
          <div className="text-5xl font-bold text-white mb-2">{progress}%</div>
          <p className="text-xs text-gray-500">استمر، أنت تقترب من الهدف!</p>
        </div>

        {/* Today's Focus Card */}
        <Link to={`/subject/${todaysFocus.id}`} className="md:col-span-2 group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-cine-accent transition-colors">
          <img src={subject.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="today" />
          <div className="absolute inset-0 bg-gradient-to-r from-cine-dark via-cine-dark/80 to-transparent" />
          <div className="relative p-6 h-full flex flex-col justify-center">
            <span className="text-cine-accent font-bold tracking-widest text-xs uppercase mb-2">مهمة اليوم الأساسية</span>
            <h2 className="text-3xl font-bold text-white mb-2">{subject.name}</h2>
            <p className="text-gray-300 mb-4">{todaysFocus.note}</p>
            <div className="inline-flex items-center text-white bg-white/10 px-4 py-2 rounded-lg self-start group-hover:bg-cine-accent group-hover:text-black transition-colors">
              ابدأ الآن <Book className="mr-2 w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Access Grid */}
      <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-cine-accent pr-3">كل المواد</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.values(plan.subjects).map(sub => (
          <Link key={sub.id} to={`/subject/${sub.id}`} className="bg-cine-card hover:bg-white/5 border border-white/5 rounded-xl p-4 text-center transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${sub.color} bg-opacity-20`}>
              <span className="text-2xl">
                 {sub.id === 'english' ? '🇬🇧' : sub.id === 'arabic' ? '📜' : sub.id === 'chemistry' ? '🧪' : sub.id === 'physics' ? '⚡' : '📐'}
              </span>
            </div>
            <h4 className="font-semibold text-gray-200">{sub.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [plan, setPlan] = useState<StudyPlan>(INITIAL_PLAN);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStudyPlan();
      setPlan(data);
    };
    loadData();
  }, []);

  const handleTaskUpdate = async (subjectId: string, taskId: string) => {
    // Find current status to toggle
    let currentStatus = false;
    const findStatus = (tasks: any[]) => tasks.find(t => t.id === taskId)?.isCompleted;
    
    const subject = plan.subjects[subjectId as SubjectId];
    if(subject.tasks) currentStatus = findStatus(subject.tasks);
    if(subject.sections) {
      subject.sections.forEach(s => {
        const res = findStatus(s.tasks);
        if(res !== undefined) currentStatus = res;
      });
    }

    const newPlan = await updateTaskStatus(plan, subjectId, taskId, !currentStatus);
    setPlan(newPlan);
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-cine-dark font-sans text-right" dir="rtl">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
           <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-40 bg-cine-card p-2 rounded-full border border-white/10 text-white shadow-lg"
          >
            <Menu size={24} />
          </button>

          <MotivationalHeader />
          
          <Routes>
            <Route path="/" element={<Dashboard plan={plan} />} />
            <Route path="/subject/:id" element={<SubjectPage plan={plan} updateTask={handleTaskUpdate} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;