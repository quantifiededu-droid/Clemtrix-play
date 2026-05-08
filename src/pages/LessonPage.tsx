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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
        
        if (globalOrder > 10 && !profile?.is_premium) {
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
              <div key={idx}>
                {block.type === 'text' && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-8">
                    {block.content}
                  </p>
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
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center">
            <p className="text-gray-500 mb-6 text-center italic">
              {completed ? "You've already mastered this lesson!" : "Finished reading? Test your knowledge with a quiz."}
            </p>
            <Button size="lg" className="w-full md:w-auto min-w-[240px]" onClick={handleMarkRead}>
              Take the Quiz
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
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
