import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allLessons } from '../lib/lessons-data';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card, Badge, ProgressBar } from '../components/ui/Layout';
import { Check, X, Trophy, ArrowRight, RotateCcw, PartyPopper, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

export default function QuizPage() {
  const lessonId = useParams().lessonId;
  const navigate = useNavigate();
  const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[lessonIndex];
  const [currentStep, setCurrentStep] = useState(0); // 0 to questions.length-1, then results
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!lesson) return <div>Lesson not found</div>;

  const currentQuestion = lesson.quizQuestions[currentStep];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < lesson.quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    const finalScore = score;
    const total = lesson.quizQuestions.length;
    const passed = (finalScore / total) >= 0.6; // 3/5+

    if (finalScore === total) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#F59E0B', '#10B981']
      });
    }

    try {
      if (auth.currentUser) {
        // Save Attempt to Supabase
        await supabase.from('quiz_attempts').insert({
          user_id: auth.currentUser.uid,
          lesson_id: lessonId,
          score: finalScore,
          total_questions: total,
          timestamp: new Date().toISOString()
        });

        // Update Progress if passed in Supabase
        if (passed) {
          await supabase.from('progress').upsert({
            user_id: auth.currentUser.uid,
            lesson_id: lessonId,
            completed: true,
            score: finalScore,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,lesson_id' });
        }
      }
    } catch (e) {
      console.error('Error saving quiz results to Supabase:', e);
    } finally {
      setShowResults(true);
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const total = lesson.quizQuestions.length;
    const passed = (score / total) >= 0.6;

    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-center"
        >
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Trophy className={cn("w-12 h-12", passed ? "text-amber-500" : "text-gray-400")} />
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            {score === total ? "Perfect Mastery!" : passed ? "Well Done!" : "Keep Practicing"}
          </h1>
          <p className="text-gray-500 mb-8">
            You scored {score} out of {total} questions correctly.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <Card className="p-6">
              <p className="text-3xl font-bold">{Math.round((score/total)*100)}%</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Score</p>
            </Card>
            <Card className="p-6">
              <p className={cn("text-3xl font-bold", passed ? "text-emerald-500" : "text-gray-400")}>{passed ? "PASSED" : "FAILED"}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Status</p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {passed ? (
              <>
                {lessonIndex < allLessons.length - 1 ? (
                  <Button size="lg" onClick={() => navigate(`/lessons/${allLessons[lessonIndex + 1].id}`)}>
                    Next Lesson
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate('/dashboard')}>
                    Continue to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </>
            ) : null}
            
            <Button size="lg" variant={passed ? "outline" : "primary"} onClick={handleRetake}>
              <RotateCcw className="mr-2 w-5 h-5" />
              Retake Quiz
            </Button>

            <Button variant="outline" size="lg" onClick={() => navigate(`/lessons/${lessonId}`)}>
              Review Lesson
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Question {currentStep + 1} of {lesson.quizQuestions.length}</span>
          <h2 className="text-xl font-bold text-gray-400 mt-1">{lesson.title} Quiz</h2>
        </div>
        <Badge variant="gray">{Math.round(((currentStep) / lesson.quizQuestions.length) * 100)}% Complete</Badge>
      </div>

      <ProgressBar value={currentStep} max={lesson.quizQuestions.length} className="mb-12" />

      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep}
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           exit={{ x: -20, opacity: 0 }}
           transition={{ duration: 0.3 }}
        >
          <Card className="p-8 md:p-12 shadow-xl border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold mb-10 leading-snug">{currentQuestion.question}</h3>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                
                let borderColor = "border-gray-100 dark:border-gray-800";
                let bgColor = "";
                let icon = null;

                if (isAnswered) {
                  if (isCorrect) {
                    borderColor = "border-emerald-500 ring-1 ring-emerald-500";
                    bgColor = "bg-emerald-50 dark:bg-emerald-900/10";
                    icon = <Check className="w-5 h-5 text-emerald-500" />;
                  } else if (isSelected) {
                    borderColor = "border-rose-500 ring-1 ring-rose-500";
                    bgColor = "bg-rose-50 dark:bg-rose-900/10";
                    icon = <X className="w-5 h-5 text-rose-500" />;
                  }
                } else if (isSelected) {
                   borderColor = "border-indigo-600 ring-1 ring-indigo-600";
                   bgColor = "bg-indigo-50/50 dark:bg-indigo-900/10";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full p-6 text-left rounded-2xl border-2 transition-all flex justify-between items-center group",
                      borderColor,
                      bgColor,
                      !isAnswered && !isSelected && "hover:border-indigo-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <span className="text-lg font-medium pr-4">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mr-4">
                      <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-1">Explanation</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                  
                  <div className="mt-10 flex justify-end">
                    <Button size="lg" onClick={handleNext} isLoading={loading}>
                      {currentStep === lesson.quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
