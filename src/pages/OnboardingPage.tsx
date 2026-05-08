import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { db, auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Layout';
import { GraduationCap, Keyboard, Music2, Trophy, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [skillLevel, setSkillLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!auth.currentUser) {
      setErrorMsg("You must be logged in to save your profile.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      // Save to Supabase profiles table
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          skill_level: skillLevel,
          goal: goal,
          is_premium: false, // Default to false
          updated_at: new Date().toISOString(),
        });
      
      if (upsertError) {
        console.error('Supabase error:', upsertError);
        throw new Error(upsertError.message || "Failed to save profile. Please ensure Supabase tables are set up correctly.");
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error saving profile to Supabase:', err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${s <= step ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'}`} 
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold">Personalize your journey</h1>
          <p className="text-gray-500 mt-2">Help us tailor Clemtrix Play to your needs.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold mb-6 text-center">What's your piano experience?</h2>
              <div className="grid grid-cols-1 gap-4">
                <OptionCard
                  icon={<GraduationCap className="w-6 h-6" />}
                  title="Beginner"
                  description="I have never played or am just starting out."
                  selected={skillLevel === 'BEGINNER'}
                  onClick={() => { setSkillLevel('BEGINNER'); setStep(2); }}
                />
                <OptionCard
                  icon={<Keyboard className="w-6 h-6" />}
                  title="Intermediate"
                  description="I know the basics and can play simple pieces."
                  selected={skillLevel === 'INTERMEDIATE'}
                  onClick={() => { setSkillLevel('INTERMEDIATE'); setStep(2); }}
                />
                <OptionCard
                  icon={<Trophy className="w-6 h-6" />}
                  title="Advanced"
                  description="I can play complex pieces and want to master technique."
                  selected={skillLevel === 'ADVANCED'}
                  onClick={() => { setSkillLevel('ADVANCED'); setStep(2); }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold mb-6 text-center">What is your primary goal?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectableCard
                  icon={<Music2 className="w-6 h-6" />}
                  title="Play songs I love"
                  selected={goal === 'songs'}
                  onClick={() => setGoal('songs')}
                />
                <SelectableCard
                  icon={<Target className="w-6 h-6" />}
                  title="Learn music theory"
                  selected={goal === 'theory'}
                  onClick={() => setGoal('theory')}
                />
                <SelectableCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Improve technique"
                  selected={goal === 'technique'}
                  onClick={() => setGoal('technique')}
                />
                <SelectableCard
                  icon={<GraduationCap className="w-6 h-6" />}
                  title="Teach myself"
                  selected={goal === 'self-taught'}
                  onClick={() => setGoal('self-taught')}
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="pt-8 flex space-x-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={handleComplete} isLoading={loading} disabled={!goal}>
                  Start Learning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OptionCard({ icon, title, description, selected, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className={`p-6 cursor-pointer border-2 transition-all hover:shadow-md ${selected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800'}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
}

function SelectableCard({ icon, title, selected, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className={`p-6 cursor-pointer border-2 transition-all text-center hover:shadow-md ${selected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800'}`}
    >
      <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
    </Card>
  );
}
