import React from 'react';
import { Task } from '../types';
import { CheckCircle, Circle, Clock, BookOpen, Smile, MessageCircle, FileText } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  subjectColor: string;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, subjectColor, onToggle }) => {
  const borderColor = task.isCompleted ? 'border-green-500' : 'border-white/10';
  const glow = task.isCompleted ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]';

  return (
    <div className={`relative group bg-cine-card rounded-xl border ${borderColor} ${glow} transition-all duration-300 overflow-hidden flex flex-col md:flex-row`}>
      {/* Image Section */}
      <div className="w-full md:w-48 h-32 md:h-auto relative overflow-hidden shrink-0">
        <img 
          src={task.imageUrl || `https://picsum.photos/seed/${task.id}/400/300`} 
          alt={task.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cine-card to-transparent md:bg-gradient-to-r" />
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-xl font-bold ${task.isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            <span className="flex items-center text-xs text-cine-accent bg-cine-dark/50 px-2 py-1 rounded-full border border-cine-accent/30">
              <Clock size={12} className="mr-1 ml-1" />
              {task.duration}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-gray-300 text-sm flex items-start">
              <BookOpen size={16} className="ml-2 text-gray-500 shrink-0 mt-0.5" />
              <span>{task.content}</span>
            </p>
            {task.method && (
               <p className="text-gray-400 text-xs italic pr-6 border-r-2 border-gray-600">
                الطريقة: {task.method}
               </p>
            )}
            <p className="text-purple-300 text-sm flex items-center">
              <Smile size={16} className="ml-2 shrink-0" />
              <span className="opacity-90">بعد المهمة: {task.feelingAfter}</span>
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/5">
          <button 
            onClick={() => window.open('https://notebooklm.google.com/', '_blank')}
            className="flex items-center text-xs bg-white/5 hover:bg-white/10 text-blue-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <MessageCircle size={14} className="ml-1" />
            Note (AI Chat)
          </button>
          
          <button 
             onClick={() => alert('Links to past exams would open here.')}
             className="flex items-center text-xs bg-white/5 hover:bg-white/10 text-orange-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FileText size={14} className="ml-1" />
            أسئلة سابقة
          </button>

          <button 
            onClick={() => onToggle(task.id)}
            className={`mr-auto flex items-center px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
              task.isCompleted 
              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
              : 'bg-cine-accent/20 text-cine-accent hover:bg-cine-accent/30'
            }`}
          >
            {task.isCompleted ? (
              <>
                <CheckCircle size={16} className="ml-1" />
                تم الانتهاء
              </>
            ) : (
              <>
                <Circle size={16} className="ml-1" />
                بدء المهمة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;