import React from 'react';
import { Card, Badge } from './ui/Layout';
import { Play, Lock, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonCardProps {
  lesson: any;
  isCompleted: boolean;
  isLocked: boolean;
  nextToLearn: boolean;
  onClick: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  isCompleted, 
  isLocked, 
  nextToLearn, 
  onClick 
}) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-6 cursor-pointer group transition-all relative overflow-hidden border-white/5",
        isLocked && "opacity-40 cursor-not-allowed",
        !isLocked && "hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
        nextToLearn && "ring-2 ring-indigo-500/50 bg-indigo-500/5"
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          isLocked ? "bg-slate-800 text-slate-600" : "bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
        )}>
          {isLocked ? <Lock className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </div>
        {isCompleted && (
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight">{lesson.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{lesson.description}</p>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <Clock className="w-3 h-3 mr-1.5 opacity-50" />
          {lesson.estimatedMinutes}m
        </div>
        <span className="text-[10px] text-slate-600 font-black tracking-tighter">LP-{lesson.order.toString().padStart(2, '0')}</span>
      </div>

      {nextToLearn && (
        <div className="absolute top-2 right-2">
          <Badge variant="blue" className="px-2 py-0.5 text-[8px]">Current</Badge>
        </div>
      )}
    </Card>
  );
};
