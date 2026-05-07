import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface PianoKeyboardProps {
  highlightedKeys?: string[];
  keyLabels?: Record<string, string>;
  onKeyClick?: (note: string) => void;
  className?: string;
}

const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES = ['C#', 'D#', 'F#', 'G#', 'A#'];

const generateKeys = (startOctave: number, endOctave: number) => {
  const keys: { note: string; type: 'white' | 'black'; octave: number }[] = [];
  for (let oct = startOctave; oct <= endOctave; oct++) {
    for (let i = 0; i < 7; i++) {
      const note = WHITE_NOTES[i];
      keys.push({ note, type: 'white', octave: oct });
      if (i !== 2 && i !== 6) { // E and B don't have sharps
        keys.push({ note: note + '#', type: 'black', octave: oct });
      }
    }
  }
  // Add final C if needed or just return
  return keys.slice(0, 29); // Requested 29 keys total (C3 to something)
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ 
  highlightedKeys = [], 
  keyLabels = {}, 
  className 
}) => {
  const synth = useRef<Tone.PolySynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic piano-like synth
    synth.current = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    return () => {
      synth.current?.dispose();
    };
  }, []);

  const playNote = (note: string) => {
    if (!synth.current) return;
    Tone.start();
    synth.current.triggerAttack(note);
    setActiveNotes(prev => new Set(prev).add(note));
  };

  const stopNote = (note: string) => {
    if (!synth.current) return;
    synth.current.triggerRelease(note);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  };

  const keys = generateKeys(3, 5); // C3 to E5 or similar

  return (
    <div 
      ref={containerRef}
      className={cn("relative flex h-64 overflow-x-auto pb-4 select-none scrollbar-hide bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4", className)}
    >
      <div className="relative flex min-w-max">
        {keys.map((key, idx) => {
          const fullNote = `${key.note}${key.octave}`;
          const isHighlighted = highlightedKeys.includes(fullNote);
          const isActive = activeNotes.has(fullNote);
          const label = keyLabels[fullNote];

          if (key.type === 'white') {
            return (
              <div
                key={fullNote}
                onMouseDown={() => playNote(fullNote)}
                onMouseUp={() => stopNote(fullNote)}
                onMouseLeave={() => isActive && stopNote(fullNote)}
                onTouchStart={(e) => { e.preventDefault(); playNote(fullNote); }}
                onTouchEnd={(e) => { e.preventDefault(); stopNote(fullNote); }}
                className={cn(
                  "relative w-12 h-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 flex items-end justify-center pb-4 transition-colors cursor-pointer rounded-b-lg",
                  isActive && "bg-indigo-100 dark:bg-indigo-200",
                  isHighlighted && !isActive && "bg-amber-100 dark:bg-amber-200 border-amber-400"
                )}
              >
                {isHighlighted && (
                  <div className="absolute top-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                <span className="text-[10px] font-bold text-gray-400 uppercase">{label || key.note}</span>
              </div>
            );
          } else {
            // Find position based on previous white key
            // Black keys are absolutely positioned relative to the row
            const whiteKeyCount = keys.slice(0, idx).filter(k => k.type === 'white').length;
            const leftOffset = (whiteKeyCount * 48) - 14; // 12w-12w ... each white is 48px

            return (
              <div
                key={fullNote}
                onMouseDown={() => playNote(fullNote)}
                onMouseUp={() => stopNote(fullNote)}
                onMouseLeave={() => isActive && stopNote(fullNote)}
                onTouchStart={(e) => { e.preventDefault(); playNote(fullNote); }}
                onTouchEnd={(e) => { e.preventDefault(); stopNote(fullNote); }}
                style={{ left: `${leftOffset}px` }}
                className={cn(
                  "absolute top-0 w-8 h-36 bg-gray-900 dark:bg-black border border-gray-800 z-10 transition-colors cursor-pointer rounded-b-md flex items-end justify-center pb-2",
                  isActive && "bg-indigo-600",
                  isHighlighted && !isActive && "bg-amber-600 border-amber-400"
                )}
              >
                <span className="text-[8px] font-bold text-white uppercase">{label || ""}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
