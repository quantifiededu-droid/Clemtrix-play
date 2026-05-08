import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Music, Play, ListOrdered, 
  ChevronRight, Loader2, Pause, RotateCcw, 
  Settings2, Activity, Target, Zap
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Layout';
import { Input } from './ui/Input';
import { getSongBreakdown, SongBreakdown, ChordStep, MelodyStep } from '../services/geminiService';
import { PianoKeyboard } from './PianoKeyboard';
import { motion, AnimatePresence } from 'motion/react';
import * as Tone from 'tone';

export function AISongMaster() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState<SongBreakdown | null>(null);
  
  // Learning States
  const [activeTab, setActiveTab] = useState<'chords' | 'melody'>(() => {
    return (localStorage.getItem('piano-ai-focus') as 'chords' | 'melody') || 'chords';
  });
  const [selectedChord, setSelectedChord] = useState<ChordStep | null>(null);
  const [selectedMelody, setSelectedMelody] = useState<MelodyStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Practice Mode State
  const [isPracticing, setIsPracticing] = useState(false);
  const [tempo, setTempo] = useState(() => {
    const saved = localStorage.getItem('piano-ai-tempo');
    return saved ? parseInt(saved) : 80;
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loopEnabled, setLoopEnabled] = useState(() => {
    const saved = localStorage.getItem('piano-ai-loop');
    return saved !== null ? saved === 'true' : true;
  });
  const [accuracy, setAccuracy] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  
  const practiceInterval = useRef<NodeJS.Timeout | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('piano-ai-tempo', tempo.toString());
    localStorage.setItem('piano-ai-loop', loopEnabled.toString());
    localStorage.setItem('piano-ai-focus', activeTab);
  }, [tempo, loopEnabled, activeTab]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedChord(null);
    setIsPracticing(false);
    
    try {
      const query = artistName.trim() ? `${songTitle} by ${artistName}` : songTitle;
      const data = await getSongBreakdown(query);
      setSongData(data);
      if (data.progression.length > 0) {
        setSelectedChord(data.progression[0]);
        setTempo(data.tempo || 80);
      }
      if (data.melodySteps.length > 0) {
        setSelectedMelody(data.melodySteps[0]);
      }
      setActiveTab('chords');
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
      const intervalMs = (60 / tempo) * 1000 * 4; // 4 beats per step
      const stepsCount = activeTab === 'chords' ? songData.progression.length : songData.melodySteps.length;
      
      practiceInterval.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          if (next >= stepsCount) {
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
  }, [isPracticing, tempo, songData, loopEnabled, activeTab]);

  // Update selected step based on practice step
  useEffect(() => {
    if (isPracticing && songData) {
      if (activeTab === 'chords') {
        setSelectedChord(songData.progression[currentStepIndex % songData.progression.length]);
      } else {
        setSelectedMelody(songData.melodySteps[currentStepIndex % songData.melodySteps.length]);
      }
    }
  }, [currentStepIndex, isPracticing, songData, activeTab]);

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
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className={`w-12 h-12 p-0 rounded-full border-gray-200 dark:border-gray-700 ${showSettings ? 'bg-indigo-50 text-indigo-600' : ''}`}
            >
              <Settings2 className="w-5 h-5" />
            </Button>
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

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 max-w-2xl p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="md:col-span-5 relative">
          <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Song Title" 
            className="pl-10 h-14"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-4 relative">
          <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Artist (Optional)" 
            className="pl-10 h-14"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>
        <Button disabled={loading} type="submit" className="md:col-span-3 h-14 bg-indigo-600 hover:bg-indigo-500 text-lg font-bold">
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
            key="loading"
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
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Settings Overlay/Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <label className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Tempo Control
                        </label>
                        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/20">
                          <input 
                            type="range" 
                            min="40" 
                            max="180" 
                            value={tempo} 
                            onChange={(e) => setTempo(parseInt(e.target.value))}
                            className="flex-1 accent-indigo-600"
                          />
                          <div className="w-20 text-center">
                            <span className="text-xl font-black text-indigo-600">{tempo}</span>
                            <span className="text-[10px] block font-bold text-gray-400 tracking-widest">BPM</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <label className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Practice Focus
                        </label>
                        <div className="flex gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20 shadow-sm">
                          <button 
                            onClick={() => setActiveTab('chords')}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                              activeTab === 'chords' 
                              ? 'bg-indigo-600 text-white shadow-lg' 
                              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <Music className="w-4 h-4" />
                            Chords
                          </button>
                          <button 
                            onClick={() => setActiveTab('melody')}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                              activeTab === 'melody' 
                              ? 'bg-indigo-600 text-white shadow-lg' 
                              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            Melody
                          </button>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col gap-4">
                        <label className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Loop Settings
                        </label>
                        <button
                          onClick={() => setLoopEnabled(!loopEnabled)}
                          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                            loopEnabled 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500 hover:border-indigo-400'
                          }`}
                        >
                          <RotateCcw className={`w-5 h-5 ${loopEnabled ? 'animate-spin-slow' : ''}`} />
                          {loopEnabled ? 'Loop On' : 'Loop Off'}
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          width: `${((currentStepIndex + 1) / (activeTab === 'chords' ? songData.progression.length : songData.melodySteps.length)) * 100}%`,
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <Music className="w-4 h-4" />
                        {activeTab === 'chords' ? 'Chord Sequence' : 'Melodic Fragments'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeTab === 'chords' ? (
                        songData.progression.map((item, idx) => (
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
                        ))
                      ) : (
                        songData.melodySteps.map((item, idx) => (
                          <button
                            key={idx}
                            disabled={isPracticing}
                            onClick={() => setSelectedMelody(item)}
                            className={`p-4 rounded-xl text-left transition-all border-2 relative ${
                              (isPracticing ? currentStepIndex === idx : selectedMelody?.phrase === item.phrase)
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
                            <div className="font-black text-sm uppercase tracking-tight truncate">{item.phrase}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{item.notes.join(', ')}</div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </Card>

                {isPracticing && (
                  <Card className="p-6 bg-gray-900 text-white border-none shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-bold uppercase tracking-tight">Visual Timing Guide</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-black text-indigo-400">{tempo}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">BPM Pace</div>
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
                          <div className="text-center">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-200">Physically</span>
                            <span className="block text-sm font-black">PLAYED</span>
                          </div>
                        </button>
                      </div>
                      <p className="text-center text-xs text-gray-400 max-w-xs mx-auto">
                        Follow the pulsing ring to keep time on your <span className="text-white font-bold">Physical Keyboard</span>. Use this button to confirm your progress as you play along.
                      </p>
                    </div>
                  </Card>
                )}

                <Card className="p-6 border-none shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 capitalize">
                      <ListOrdered className="w-4 h-4" />
                      Step-by-Step Guide
                    </div>
                    <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase font-mono">
                      {activeTab} mode
                    </div>
                  </div>
                  <div className="space-y-6">
                    {activeTab === 'chords' ? (
                      songData.progression.map((step, idx) => (
                        <div 
                          key={idx} 
                          className={`flex gap-4 group p-3 rounded-2xl transition-all border-2 ${
                            isPracticing && currentStepIndex === idx 
                            ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-900/30 ring-4 ring-indigo-500/10' 
                            : 'border-transparent'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPracticing && currentStepIndex === idx
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                {step.chord}
                              </h5>
                              {step.role && (
                                <span className="text-[10px] font-bold text-indigo-500/70 border border-indigo-200 dark:border-indigo-800 rounded px-1.5 py-0.5 uppercase tracking-widest bg-white dark:bg-gray-900 shadow-sm">
                                  {step.role}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">{step.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {step.notes.map(n => (
                                <span key={n} className="text-[10px] font-black font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400">
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      songData.melodySteps.map((step, idx) => (
                        <div 
                          key={idx} 
                          className={`flex gap-4 group p-3 rounded-2xl transition-all border-2 ${
                            isPracticing && currentStepIndex === idx 
                            ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-900/30' 
                            : 'border-transparent'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPracticing && currentStepIndex === idx
                            ? 'bg-indigo-600 text-white scale-110'
                            : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-widest mb-1">
                              {step.phrase}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              {step.notes.map(n => (
                                <span key={n} className="text-[9px] font-black font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {songData.instructionItems && songData.instructionItems.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">
                        <Sparkles className="w-4 h-4" />
                        Pro Performance Insights
                      </div>
                      <div className="space-y-4">
                        {songData.instructionItems.map((tip, idx) => (
                          <div key={idx} className="flex gap-3 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 transition-colors group">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 group-hover:scale-125 transition-transform" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                          STEP {currentStepIndex + 1}/{activeTab === 'chords' ? songData.progression.length : songData.melodySteps.length}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <motion.h4 
                          key={activeTab === 'chords' ? selectedChord?.chord : selectedMelody?.phrase}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-4xl font-black text-indigo-400"
                        >
                          {activeTab === 'chords' ? (selectedChord?.chord || "Select chord") : (selectedMelody?.phrase || "Select melody")}
                        </motion.h4>
                        {activeTab === 'chords' && selectedChord?.role && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/50">{selectedChord.role}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        {activeTab === 'chords' ? (selectedChord?.description || "Select a chord to learn its structure.") : (selectedMelody?.description || "Select a melodic fragment to see the notes.")}
                      </p>
                    </div>

                    <div className="pt-8 transition-all duration-300">
                      <PianoKeyboard highlightedKeys={activeTab === 'chords' ? selectedChord?.notes : selectedMelody?.notes} />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {(activeTab === 'chords' ? selectedChord?.notes : selectedMelody?.notes)?.map(note => (
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
            </div>
          </motion.div>
        ) : (
          <div key="empty" className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
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
