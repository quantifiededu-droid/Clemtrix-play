import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { allLessons, SkillLevel } from '../lib/lessons-data';
import { Button } from '../components/ui/Button';
import { Card, Badge, ProgressBar } from '../components/ui/Layout';
import { useNavigate } from 'react-router-dom';
import { LessonCard } from '../components/LessonCard';
import { 
  Play, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  BookOpen,
  Filter,
  DollarSign,
  ExternalLink,
  Music2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser) return;
      
      try {
        // Fetch User Data from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', auth.currentUser.uid)
          .single();
        
        setUserData(profile);

        // Fetch Progress from Supabase
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', auth.currentUser.uid);

        const progressMap: any = {};
        progressData?.forEach(d => {
          progressMap[d.lesson_id] = d;
        });
        setProgress(progressMap);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const skillLevel = userData?.skill_level || SkillLevel.BEGINNER;
  const filteredLessons = allLessons; // Show full curriculum
  
  const completedCount = Object.values(progress).filter((p: any) => p.completed).length;
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // Global lesson order logic
  const getGlobalOrder = (lessonId: string) => {
    return allLessons.findIndex(l => l.id === lessonId) + 1;
  };

  // Find next lesson globally
  const nextLesson = allLessons.find((l, idx) => {
    if (idx === 0) return !progress[l.id]?.completed;
    const prevId = allLessons[idx-1].id;
    return progress[prevId]?.completed && !progress[l.id]?.completed;
  }) || allLessons[0];

  const handleLessonClick = (lessonId: string) => {
    const globalOrder = getGlobalOrder(lessonId);
    if (globalOrder > 10 && !userData?.is_premium) {
      setSelectedLessonId(lessonId);
      setShowPaywall(true);
      return;
    }
    navigate(`/lessons/${lessonId}`);
  };

  const handleUnlockPremium = async () => {
    if (!auth.currentUser) return;
    // Simulate payment verification for demo
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', auth.currentUser.uid);
    
    if (!error) {
      setUserData({ ...userData, is_premium: true });
      setShowPaywall(false);
      if (selectedLessonId) {
        navigate(`/lessons/${selectedLessonId}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Paywall Overlay */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full"
          >
            <Card className="p-8 border-indigo-500/50 bg-slate-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Music2 className="w-32 h-32 text-indigo-500" />
              </div>
              <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Masterclass Locked</h2>
                <p className="text-slate-400 mb-8">
                  You've reached the end of the free curriculum! Unlock lessons 11-22 to master advanced piano techniques.
                </p>
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-slate-400">Premium Access</span>
                    <span className="text-white font-bold">$2.00</span>
                  </div>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg font-bold rounded-xl flex items-center justify-center gap-2"
                    onClick={() => {
                        window.open('https://paypal.com/paypalme/CasareKumasi', '_blank');
                    }}
                  >
                    Pay with PayPal <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full py-4 border-white/10 text-white hover:bg-white/5" onClick={() => setShowPaywall(false)}>
                    Maybe Later
                  </Button>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    One-time payment for lifetime access
                  </p>
                  <button 
                    onClick={handleUnlockPremium}
                    className="text-[10px] text-indigo-400/50 hover:text-indigo-400 underline"
                  >
                    Demo: Apply Premium Status
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Next Lesson Hero Card (Inspired by Design) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 lg:row-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20"
        >
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex gap-2 mb-4">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                Next Lesson
              </span>
              <Badge variant={skillLevel === 'BEGINNER' ? 'blue' : 'amber'} className="bg-amber-400 text-amber-950 border-none">
                {skillLevel}
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
              {nextLesson?.title || 'Starting your journey'}
            </h2>
            <p className="text-indigo-100/70 max-w-sm text-sm leading-relaxed mb-8">
              {nextLesson?.description || 'Pick up where you left off and master your piano skills.'}
            </p>
            
            <Button 
              size="lg" 
              className="bg-white text-indigo-900 hover:bg-indigo-50 w-fit px-8 py-4 rounded-xl font-bold shadow-xl shadow-black/20"
              onClick={() => handleLessonClick(nextLesson.id)}
            >
              {getGlobalOrder(nextLesson?.id || '') > 10 && !userData?.is_premium ? 'Unlock Premium' : 'Resume Practice'}
            </Button>
          </div>
          
          {/* Decorative Piano Keys Background */}
          <div className="absolute -right-4 -bottom-4 opacity-10 transform -rotate-12 pointer-events-none">
            <Trophy className="w-64 h-64 text-white" />
          </div>
        </motion.div>

        {/* Progress Tracker Card */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
              <Trophy className="w-3 h-3 mr-2 text-amber-500" />
              Overall Progress
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold">{completedCount}</span>
              <span className="text-slate-500 text-lg">/ {totalLessons} Lessons</span>
            </div>
          </div>
          <div className="space-y-4">
            <ProgressBar value={completedCount} max={totalLessons} />
            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              <span>{Math.round(progressPercent)}% Mastered</span>
              <span className="text-emerald-400">Steady Growth</span>
            </div>
          </div>
        </Card>

        {/* Learning Goal Card */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between border-emerald-500/10 bg-emerald-500/5">
          <div className="flex justify-between items-start">
            <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Global Ranking</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>
          <div className="my-4">
            <span className="text-4xl font-bold text-slate-100 italic">"My goal is to {userData?.goal || 'learn'}..."</span>
          </div>
          <p className="text-emerald-500/80 text-xs font-medium">Keep practicing to reach your targets!</p>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-emerald-400 hover:bg-emerald-500/10" onClick={() => navigate('/onboarding')}>
            Update Goals
          </Button>
        </Card>

        {/* Curriculum Content */}
        <div className="col-span-12 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-indigo-500" />
              {skillLevel} Curriculum
            </h2>
            <div className="flex items-center gap-2">
               <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mr-2">{totalLessons} Lessons total</span>
               <Filter className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLessons.map((lesson, index) => {
              const isCompleted = progress[lesson.id]?.completed;
              const isLocked = index > 0 && !progress[filteredLessons[index-1].id]?.completed;
              const nextToLearn = nextLesson?.id === lesson.id;

              return (
                <LessonCard 
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isLocked={isLocked || (getGlobalOrder(lesson.id) > 10 && !userData?.is_premium)}
                  nextToLearn={nextToLearn}
                  onClick={() => !isLocked && handleLessonClick(lesson.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

