import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { allLessons } from '../lib/lessons-data';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card, Badge, ProgressBar } from '../components/ui/Layout';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { HandDiagram } from '../components/HandDiagram';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  Info,
  Lightbulb,
  Keyboard,
  ArrowRight,
  Clock,
  Target,
  Trophy,
  Music,
  Play,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { AISongMaster } from '../components/AISongMaster';

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[lessonIndex];
  const globalOrder = lessonIndex + 1;
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(0);

  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function checkProgress() {
      if (!auth.currentUser || !lessonId) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // Check Access / Premium
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', auth.currentUser.uid)
          .single();
        
        if (lesson.order > 10 && !profile?.is_premium) {
          if (mounted) navigate('/dashboard');
          return;
        }

        // Check Progress
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', auth.currentUser.uid)
          .eq('lesson_id', lessonId)
          .single();

        if (mounted && progressData) {
          setCompleted(progressData.completed);
          if (progressData.metadata?.scrollPos > 100 && !progressData.completed) {
            setLastScrollPos(progressData.metadata.scrollPos);
            setShowResumePrompt(true);
          }
        }
      } catch (error) {
        console.error('Error checking lesson progress:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    setScrolledToEnd(false);
    checkProgress();
    window.scrollTo(0, 0);

    return () => {
      mounted = false;
    };
  }, [lessonId, globalOrder, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      // Track scroll for "Continue" feature
      if (scrollTop > 500 && !completed) {
        saveProgress(scrollTop);
      }

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setScrolledToEnd(true);
      }
    };
    
    let timer: any;
    const debouncedScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(handleScroll, 1000);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timer);
    };
  }, [lessonId, completed]);

  const saveProgress = async (scrollPos: number) => {
    if (!auth.currentUser || !lessonId) return;
    try {
      await supabase.from('progress').upsert({
        user_id: auth.currentUser.uid,
        lesson_id: lessonId,
        metadata: { scrollPos },
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });
    } catch (e) {
      // Slient fail for auto-save
    }
  };

  const handleResume = () => {
    window.scrollTo({ top: lastScrollPos, behavior: 'smooth' });
    setShowResumePrompt(false);
  };

  if (!lesson) return <div>Lesson not found</div>;

  const handleMarkRead = async () => {
    if (!auth.currentUser || !lessonId) return;
    try {
      // Upsert progress with 'read' state in Supabase
      await supabase.from('progress').upsert({
        user_id: auth.currentUser.uid,
        lesson_id: lessonId,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });
      
      navigate(`/lessons/${lessonId}/quiz`);
    } catch (e) {
      console.error('Error marking lesson as read:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 pb-20">
      {/* Resume Prompt Overlay */}
      <AnimatePresence>
        {showResumePrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full"
            >
              <Card className="p-8 text-center border-none shadow-2xl relative overflow-hidden bg-white dark:bg-gray-900">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  We saved your progress in <strong>"{lesson.title}"</strong>. Would you like to continue or start over?
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg font-bold" onClick={handleResume}>
                    Continue where you left off
                  </Button>
                  <Button variant="outline" size="lg" className="w-full py-4" onClick={() => setShowResumePrompt(false)}>
                    Start from the beginning
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <Badge variant="blue">{lesson.skillLevel}</Badge>
            <span className="text-xs text-gray-400 font-medium">Lesson {lesson.order}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24" ref={contentRef}>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-12"
        >
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{lesson.title}</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">{lesson.description}</p>
          </header>

          <div className="space-y-10">
            {lesson.content.map((block, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {block.type === 'goal' && (
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Trophy className="w-24 h-24" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Target className="w-6 h-6 mr-3" />
                      Goal for Today
                    </h3>
                    <div className="prose prose-invert prose-p:text-indigo-100">
                      <ReactMarkdown>{block.content || ''}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {block.type === 'checklist' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                       <CheckCircle2 className="w-4 h-4" />
                       Skills Checklist
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {block.steps?.map((step, idx) => (
                        <label 
                          key={idx}
                          className="flex items-center p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-indigo-500 transition-all group"
                        >
                          <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-600 transition-colors">{step}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === 'text' && (
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400">
                    <ReactMarkdown>{block.content || ''}</ReactMarkdown>
                  </div>
                )}

                {block.type === 'tip' && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 p-6 rounded-r-2xl">
                    <div className="flex items-start">
                      <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-4 flex-shrink-0 mt-1" />
                      <p className="text-indigo-900 dark:text-indigo-100 font-medium">{block.content}</p>
                    </div>
                  </div>
                )}

                {block.type === 'diagram' && (
                  <div className="my-8">
                    <HandDiagram diagramType={block.diagramType!} />
                    <p className="text-center text-xs text-gray-400 mt-2 italic">Figure: {block.diagramType}</p>
                  </div>
                )}

                {block.type === 'piano' && (
                  <div className="space-y-4 my-8">
                    <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                      <Keyboard className="w-5 h-5" />
                      <span className="font-bold">Interactive Practice</span>
                    </div>
                    <PianoKeyboard highlightedKeys={block.highlightedKeys} />
                    {block.content && (
                      <p className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                        {block.content}
                      </p>
                    )}
                  </div>
                )}

                {block.type === 'exercise' && (
                  <Card className="p-8 border-2 border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-6 h-6 mr-3" />
                      Your Exercise
                    </h3>
                    <ul className="space-y-4">
                      {block.steps?.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-4 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-200">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </motion.div>
            ))}

            {lesson.id === 'adv-11' && (
              <AISongMaster />
            )}

            {lesson.practiceSong && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5">
                    <Music className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                      <Music className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Recommended Practice Song</h3>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-amber-900 dark:text-amber-100">{lesson.practiceSong.title}</h4>
                    {lesson.practiceSong.artist && (
                      <p className="text-amber-700 dark:text-amber-400 font-medium">By {lesson.practiceSong.artist}</p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                      {lesson.practiceSong.description}
                    </p>
                  </div>

                  {lesson.practiceSong.guide && (
                    <div className="mt-8 space-y-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-amber-600 uppercase tracking-widest bg-white/50 dark:bg-black/20 w-fit px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/30">
                        <Activity className="w-3 h-3" />
                        Step-by-Step Training
                      </div>

                      <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Visualizer</span>
                          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            Step {activeGuideStep !== null ? activeGuideStep + 1 : '-'}
                          </span>
                        </div>
                        <PianoKeyboard 
                          highlightedKeys={activeGuideStep !== null ? lesson.practiceSong.guide[activeGuideStep].notes : []} 
                        />
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {activeGuideStep !== null && lesson.practiceSong.guide[activeGuideStep].notes.map(n => (
                            <span key={n} className="flex-shrink-0 px-3 py-1 bg-gray-800 rounded-lg text-[10px] font-black font-mono border border-gray-700 text-gray-400">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {lesson.practiceSong.guide.map((step, sIdx) => {
                          const isSelected = activeGuideStep === sIdx;
                          return (
                            <button 
                              key={sIdx}
                              onClick={() => setActiveGuideStep(sIdx)}
                              className={`text-left p-4 rounded-2xl border-2 transition-all relative ${
                                isSelected 
                                ? 'bg-white dark:bg-gray-800 border-amber-500 shadow-lg scale-[1.02] z-10' 
                                : 'bg-white/30 dark:bg-gray-950/20 border-transparent hover:border-amber-200/50'
                              }`}
                            >
                              <div className="flex gap-4">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                                }`}>
                                  {sIdx + 1}
                                </span>
                                <div className="flex-1">
                                  <h5 className="font-black text-sm uppercase tracking-tight mb-1 flex items-center justify-between">
                                    {step.title}
                                    {isSelected && <Play className="w-3 h-3 fill-current text-amber-500" />}
                                  </h5>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{step.instruction}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                         </div>
                         <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 italic font-medium leading-relaxed">
                            Pro Tip: Master each step slowly. Don't move to the next one until you've played the current combination 10 times perfectly on your physical keyboard.
                         </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
            <p className="text-gray-500 mb-2 text-center italic">
              {completed ? "You've already mastered this lesson!" : "Finished reading? Test your knowledge with a quiz."}
            </p>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <Button size="lg" className="w-full md:w-auto min-w-[200px]" onClick={handleMarkRead}>
                {completed ? "Review Quiz" : "Take the Quiz"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              {completed && lessonIndex < allLessons.length - 1 && (
                <Button size="lg" variant="outline" className="w-full md:w-auto min-w-[200px]" onClick={() => navigate(`/lessons/${allLessons[lessonIndex + 1].id}`)}>
                  Next Lesson
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button for Finish */}
      {!scrolledToEnd && !completed && (
        <div className="fixed bottom-8 right-8 z-40">
           <Button size="sm" variant="ghost" className="bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-full" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}>
              Scroll to Quiz
           </Button>
        </div>
      )}
    </div>
  );
}
