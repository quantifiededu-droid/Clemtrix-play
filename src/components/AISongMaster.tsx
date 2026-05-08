import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Music, Play, ListOrdered, 
  ChevronRight, Loader2, Pause, RotateCcw, 
  Settings2, Activity, Target, Zap
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Layout';
import { Input } from './ui/Input';
import { getSongBreakdown, SongBreakdown, ChordStep } from '../services/geminiService';
import { PianoKeyboard } from './PianoKeyboard';
import { motion, AnimatePresence } from 'motion/react';
import * as Tone from 'tone';

export function AISongMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState<SongBreakdown | null>(null);
  const [selectedChord, setSelectedChord] = useState<ChordStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Practice Mode State
  const [isPracticing, setIsPracticing] = useState(false);
  const [tempo, setTempo] = useState(80);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [accuracy, setAccuracy] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  
  const practiceInterval = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedChord(null);
    setIsPracticing(false);
    
    try {
      const data = await getSongBreakdown(searchQuery);
      setSongData(data);
      if (data.progression.length > 0) {
        setSelectedChord(data.progression[0]);
        setTempo(data.tempo || 80);
      }
    } catch (err) {
      console.error(err);
      setError("I couldn't analyze that song. Please try another one or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const startPractice = () => {
    if (!songData) return;
    setIsPracticing(true);
    setCurrentStepIndex(0);
    setAccuracy(0);
    setHitCount(0);
    setTotalAttempts(0);
  };

  const stopPractice = () => {
    setIsPracticing(false);
    if (practiceInterval.current) clearInterval(practiceInterval.current);
  };

  // Practice Loop Logic
  useEffect(() => {
    if (isPracticing && songData) {
      const intervalMs = (60 / tempo) * 1000 * 4; // 4 beats per chord
      
      practiceInterval.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          if (next >= songData.progression.length) {
            if (loopEnabled) return 0;
            stopPractice();
            return prev;
          }
          return next;
        });
        
        // Auto-increment attempts for accuracy simulation
        setTotalAttempts(t => t + 1);
      }, intervalMs);
    } else {
      if (practiceInterval.current) clearInterval(practiceInterval.current);
    }

    return () => {
      if (practiceInterval.current) clearInterval(practiceInterval.current);
    };
  }, [isPracticing, tempo, songData, loopEnabled]);

  // Update selected chord based on practice step
  useEffect(() => {
    if (isPracticing && songData) {
      setSelectedChord(songData.progression[currentStepIndex]);
    }
  }, [currentStepIndex, isPracticing, songData]);

  const simulateHit = () => {
    if (!isPracticing) return;
    setHitCount(h => h + 1);
    // Calculated accuracy
    setAccuracy(Math.round(((hitCount + 1) / totalAttempts) * 100));
  };

  return (
    <div className="space-y-8 py-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            AI Song Master
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Enter any song title and artist, and our AI will transcribe the chords and teach you how to play it instantly.
          </p>
        </div>

        {songData && !loading && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={isPracticing ? stopPractice : startPractice}
              className={`px-6 py-6 rounded-full font-black text-lg transition-all shadow-lg hover:shadow-indigo-500/20 ${
                isPracticing ? 'bg-red-500 hover:bg-red-400' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isPracticing ? (
                <><Pause className="w-6 h-6 mr-2" /> Stop Practice</>
              ) : (
                <><Play className="w-6 h-6 mr-2" /> Start Practice Mode</>
              )}
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="e.g. Someone Like You - Adele" 
            className="pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button disabled={loading} type="submit" className="px-8 bg-indigo-600 hover:bg-indigo-500">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-gray-500 animate-pulse font-medium">Analyzing harmonic structure and transcription...</p>
          </motion.div>
        ) : songData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column: Details & Progression */}
            <div className="space-y-6">
              <Card className="p-6 bg-white dark:bg-gray-900 border-none shadow-xl overflow-hidden relative">
                <AnimatePresence>
                  {isPracticing && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 4 }}
                      className="absolute top-0 left-0 right-0 bg-indigo-500 z-20"
                      style={{ 
                        width: `${((currentStepIndex + 1) / songData.progression.length) * 100}%`,
                        transition: 'width 0.1s linear'
                      }}
                    />
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{songData.songName}</h3>
                    <p className="text-gray-500">{songData.artist}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Key: {songData.key}</span>
                    <span className="text-xs font-medium text-gray-400">{songData.tempo} BPM</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                      <Music className="w-4 h-4" />
                      Sequence
                    </div>
                    {isPracticing && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Settings2 className="w-4 h-4 text-gray-400" />
                          <input 
                            type="range" 
                            min="40" 
                            max="180" 
                            value={tempo} 
                            onChange={(e) => setTempo(parseInt(e.target.value))}
                            className="w-24 accent-indigo-600"
                          />
                          <span className="text-xs font-mono font-bold w-12">{tempo} BPM</span>
                        </div>
                        <button 
                          onClick={() => setLoopEnabled(!loopEnabled)}
                          className={`p-1 rounded transition-colors ${loopEnabled ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {songData.progression.map((item, idx) => (
                      <button
                        key={idx}
                        disabled={isPracticing}
                        onClick={() => setSelectedChord(item)}
                        className={`p-4 rounded-xl text-left transition-all border-2 relative ${
                          (isPracticing ? currentStepIndex === idx : selectedChord?.chord === item.chord)
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02] shadow-md z-10' 
                          : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200'
                        }`}
                      >
                        {isPracticing && currentStepIndex === idx && (
                          <motion.div 
                            layoutId="indicator"
                            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-indigo-600 rounded-full"
                          />
                        )}
                        <div className="font-black text-lg">{item.chord}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{item.notes.join(', ')}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {isPracticing && (
                <Card className="p-6 bg-gray-900 text-white border-none shadow-xl overflow-hidden relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <Activity className="w-5 h-5 text-emerald-400" />
                       <span className="text-sm font-bold uppercase tracking-tight">Practice Performance</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-indigo-400">{accuracy}%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Accuracy</div>
                      </div>
                      <div className="h-10 w-[1px] bg-gray-800" />
                      <div className="text-right">
                        <div className="text-2xl font-black">{totalAttempts}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Steps</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-center">
                       <button 
                        onClick={simulateHit}
                        className="group relative w-24 h-24 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-transform active:scale-95 shadow-2xl shadow-indigo-600/40"
                       >
                         <AnimatePresence>
                           {isPracticing && (
                            <motion.div 
                              key={currentStepIndex}
                              initial={{ scale: 0.8, opacity: 1 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: (60 / tempo) * 4, ease: "linear" }}
                              className="absolute inset-0 border-4 border-indigo-400 rounded-full"
                            />
                           )}
                         </AnimatePresence>
                         <Zap className="w-8 h-8 text-white fill-current" />
                       </button>
                    </div>
                    <p className="text-center text-xs text-gray-500">
                      Tap the "Hit" button (or press Space) in rhythm with the pulsing ring to confirm your placement.
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-6 border-none shadow-xl">
                 <div className="flex items-center gap-2 text-sm font-bold text-gray-400 capitalize mb-4">
                    <ListOrdered className="w-4 h-4" />
                    How to Play This Selection
                  </div>
                  <div className="space-y-4">
                    {songData.instructionItems.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
              </Card>
            </div>

            {/* Right Column: Piano Visualizer */}
            <div className="lg:sticky lg:top-32 space-y-6 self-start">
              <Card className="p-8 border-none shadow-2xl bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Music className="w-24 h-24" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                      isPracticing ? 'bg-indigo-600 animate-pulse' : 'bg-gray-800'
                    }`}>
                       {isPracticing ? <Activity className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                       {isPracticing ? "Live Practice" : "Preview Mode"}
                    </div>
                    {isPracticing && (
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                         <Target className="w-3 h-3" />
                         STEP {currentStepIndex + 1}/{songData.progression.length}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <motion.h4 
                      key={selectedChord?.chord}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-4xl font-black text-indigo-400"
                    >
                      {selectedChord?.chord || "Select a chord"}
                    </motion.h4>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{selectedChord?.description || "Click a chord to see how to play it on the piano."}</p>
                  </div>

                  <div className="pt-8 transition-all duration-300">
                     <PianoKeyboard highlightedKeys={selectedChord?.notes} />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedChord?.notes.map(note => (
                      <span key={note} className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-mono border border-gray-700">{note}</span>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600 italic font-serif text-xl">
                  i
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-amber-900 dark:text-amber-100">Practice Goal</h5>
                  <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                    Set the tempo to 50% speed initially. Once you hit 90% accuracy, increase by 10 BPM. This is how pros master repertoire!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
             <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-400">
                <Music className="w-8 h-8" />
             </div>
             <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-gray-100">Ready to master your favorite song?</p>
                <p className="text-sm text-gray-500">Wait is over. Search for a song to begin the session.</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
