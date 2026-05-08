export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LessonContentBlock {
  type: 'text' | 'diagram' | 'piano' | 'exercise' | 'tip' | 'goal' | 'checklist';
  content?: string;
  diagramType?: 'posture' | 'fingerNumbers' | 'thumbCrossing' | 'cPositionRight' | 'cPositionLeft' | 'wristRotation';
  highlightedKeys?: string[];
  steps?: string[];
}

export interface PracticeGuideStep {
  title: string;
  notes: string[];
  instruction: string;
}

export interface PracticeSong {
  title: string;
  artist?: string;
  description?: string;
  guide?: PracticeGuideStep[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  skillLevel: SkillLevel;
  order: number;
  estimatedMinutes: number;
  content: LessonContentBlock[];
  quizQuestions: QuizQuestion[];
  practiceSong?: PracticeSong;
}

export const lessons: Lesson[] = [
  // BEGINNER
  {
    id: 'beg-1',
    title: 'Piano Lesson 1 — Meet the Keyboard',
    description: 'Recognize the musical alphabet, find all the C notes, and understand patterns.',
    skillLevel: SkillLevel.BEGINNER,
    order: 1,
    estimatedMinutes: 10,
    content: [
      { type: 'goal', content: 'By the end of today, you should:\n- Recognize the musical alphabet,\n- Find all the C notes on a keyboard,\n- And understand how keys repeat.' },
      { type: 'text', content: '### 1. The Musical Alphabet\nMusic only uses 7 letter names:\n\n**A B C D E F G**\n\nThen it repeats again:\n**A B C D E F G A B C...**\n\nUnlike school alphabets, music keeps cycling.' },
      { type: 'text', content: '### 2. Understanding the Keyboard Pattern\nLook closely at a keyboard. You’ll notice black keys come in groups:\n- **2 black keys**\n- then **3 black keys**\n- then repeats.' },
      { type: 'tip', content: 'This pattern helps you find every note on the piano.' },
      { type: 'text', content: '### 3. Finding the Note C\nThe note C is the white key immediately before the group of 2 black keys.\n\nEvery keyboard has many Cs. Find:\n- Low C\n- Middle C\n- High C' },
      { type: 'piano', highlightedKeys: ['C4'], content: 'This is Middle C. Try to locate it on your screen or keyboard.' },
      { type: 'checklist', steps: ['Find every group of 2 black keys', 'Press the white key to the left of each group (C)', 'Notice how they sound higher or lower', 'Identify Middle C (the one closest to you)'] },
      { type: 'exercise', steps: ['Using your right hand thumb: Find a C', 'Press it slowly 10 times', 'Count aloud: 1, 2, 3, 4', 'Switch to your left hand thumb and repeat.'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'What are the 7 music letters?', options: ['A-G', 'A-Z', 'C-J', '1-7'], correctAnswer: 0, explanation: 'The musical alphabet uses A, B, C, D, E, F, and G.' },
      { id: 'q2', question: 'How do black keys appear on the keyboard?', options: ['Groups of 2 and 3', 'Randomly', 'Groups of 1 and 4', 'They are all the same'], correctAnswer: 0, explanation: 'Black keys always repeat in a 2-3 group pattern.' },
      { id: 'q3', question: 'How do you find the note C?', options: ['After 3 black keys', 'Before 2 black keys', 'Before 3 black keys', 'Middle of 2 black keys'], correctAnswer: 1, explanation: 'C is the white key to the left of the group of 2 black keys.' },
      { id: 'q4', question: 'Is rhythm important in piano playing?', options: ['No', 'Sometimes', 'Yes, it is vital', 'Only for drums'], correctAnswer: 2, explanation: 'Rhythm is the foundation of music and timing.' }
    ],
    practiceSong: {
      title: "C Exploration",
      artist: "Pianist Academy",
      description: "A simple exercise to find all the C's on the keyboard.",
      guide: [
        { 
          title: "The Middle C Anchor", 
          notes: ["C4"], 
          instruction: "Locate the Middle C by finding the group of 2 black keys in the center. Play it with your thumb." 
        },
        { 
          title: "Low C Reach", 
          notes: ["C3"], 
          instruction: "Move your left hand down to find the C one octave below. Use your pinky." 
        },
        { 
          title: "High C Reach", 
          notes: ["C5"], 
          instruction: "Move your right hand up to find the C one octave above. Use your pinky." 
        },
        { 
          title: "The Full Octave Scan", 
          notes: ["C2", "C3", "C4", "C5", "C6"], 
          instruction: "Scan the entire keyboard from bottom to top, pressing every C you can find. Say 'C' out loud every time." 
        }
      ]
    }
  },
  {
    id: 'beg-2',
    title: 'Sitting Posture & Hand Position',
    description: 'Learn the proper way to sit and position your hands.',
    skillLevel: SkillLevel.BEGINNER,
    order: 2,
    estimatedMinutes: 8,
    content: [
      { type: 'goal', content: 'Master the "Pianist\'s Stance" for injury-free playing and maximum control.' },
      { type: 'text', content: 'Proper posture is essential to prevent injury and play with more expression. Sit on the front half of the bench with your feet flat on the floor.' },
      { type: 'diagram', diagramType: 'posture' },
      { type: 'checklist', steps: ['Sit on front half of bench', 'Feet flat on floor', 'Shoulders relaxed', 'Arms parallel to floor'] },
      { type: 'text', content: 'Your fingers should be curved as if you are holding a small orange. This avoids "collapsing" joints which makes playing harder.' },
      { type: 'diagram', diagramType: 'fingerNumbers' },
      { type: 'tip', content: 'Remember your finger numbers: 1 is the thumb, 2 is index, 3 is middle, 4 is ring, and 5 is the pinky.' },
      { type: 'exercise', steps: ['Place your hand flat on a table', 'Scratch the table toward you to curve your fingers', 'Keep your wrist level', 'Check that every finger tip is touching the surface.'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which finger is labeled number 1?', options: ['Index', 'Middle', 'Pinky', 'Thumb'], correctAnswer: 3, explanation: 'In piano fingering, 1 is always the thumb.' },
      { id: 'q2', question: 'How should your fingers be shaped while playing?', options: ['Flat', 'Straight', 'Curved', 'Tense'], correctAnswer: 2, explanation: 'Fingers should be curved for strength and agility.' },
      { id: 'q3', question: 'Where should your feet be?', options: ['Crossed', 'Flat on the floor', 'On the pedals at all times', 'Tucked under the bench'], correctAnswer: 1, explanation: 'Feet should be flat on the floor for balance.' },
      { id: 'q4', question: 'Which finger is number 5?', options: ['Thumb', 'Ring', 'Middle', 'Pinky'], correctAnswer: 3, explanation: 'The pinky finger is designated as number 5.' },
      { id: 'q5', question: 'What is the "holding an orange" analogy for?', options: ['Bench height', 'Hand position', 'Arm length', 'Key pressure'], correctAnswer: 1, explanation: 'It describes the curved, relaxed shape your hands should take.' }
    ],
    practiceSong: {
      title: "The Balanced Hand",
      artist: "Academy Original",
      description: "Focus on your hand shape, not just the notes.",
      guide: [
        {
          title: "Setup the Curve",
          notes: ["C4"],
          instruction: "Place your thumb on C. Make sure your other fingers are curved like you're holding an orange."
        },
        {
          title: "The Bridge Check",
          notes: ["C4", "G4"],
          instruction: "Press C (1) and G (5) together. Check if your wrist is level and not dipping."
        },
        {
          title: "Symmetric Fall",
          notes: ["C4", "D4", "E4", "F4", "G4"],
          instruction: "Let each finger drop onto its key individually. Don't let your knuckles collapse!"
        }
      ]
    }
  },
  {
    id: 'beg-3',
    title: 'Your First 5 Notes',
    description: 'C D E F G with the right hand.',
    skillLevel: SkillLevel.BEGINNER,
    order: 3,
    estimatedMinutes: 10,
    content: [
      { type: 'goal', content: 'Play your first 5-note sequence with perfect finger control.' },
      { type: 'text', content: 'Let\'s start playing! Place your right hand thumb (1) on Middle C. Your other fingers will naturally fall on D, E, F, and G.' },
      { type: 'diagram', diagramType: 'cPositionRight' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'E4', 'F4', 'G4'], content: 'Play each note slowly from C up to G and back down.' },
      { type: 'checklist', steps: ['Thumb on Middle C', 'Curved fingers', 'Play C-D-E-F-G 5 times', 'Play G-F-E-D-C 5 times'] },
      { type: 'exercise', steps: ['Play C-D-E-F-G with fingers 1-2-3-4-5.', 'Play G-F-E-D-C with fingers 5-4-3-2-1.', 'Try "random" order: C (1), E (3), G (5).', 'Try stepping: C (1), D (2), C (1), E (3).'] },
      { type: 'tip', content: 'Keep your thumb on its side, not flat. This gives it more agility.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which finger plays "E" in the C major position?', options: ['1 (Thumb)', '2 (Index)', '3 (Middle)', '4 (Ring)'], correctAnswer: 2, explanation: 'In the right hand C position, finger 3 is on E.' },
      { id: 'q2', question: 'Which note is directly next to C?', options: ['E', 'D', 'F', 'B'], correctAnswer: 1, explanation: 'D is the white key directly to the right of C.' },
      { id: 'q3', question: 'What finger plays "G" in the right hand C position?', options: ['3', '4', '5', '1'], correctAnswer: 2, explanation: 'Finger 5 (pinky) plays G in this position.' },
      { id: 'q4', question: 'What is the pattern of notes taught in this lesson?', options: ['A-B-C-D-E', 'C-D-E-F-G', 'G-F-E-D-C', 'C-E-G'], correctAnswer: 1, explanation: 'This lesson focuses on the first five notes starting from C.' },
      { id: 'q5', question: 'If your thumb is on C, where is your 4th finger?', options: ['D', 'E', 'F', 'G'], correctAnswer: 2, explanation: 'F is the fourth note in the sequence.' }
    ],
    practiceSong: {
      title: "The Hand Dance",
      artist: "Academy Original",
      description: "A coordination exercise for your first five notes.",
      guide: [
        {
          title: "Thumb Anchor",
          notes: ["C4"],
          instruction: "Start with your thumb (1) on Middle C. Hold it for 4 beats."
        },
        {
          title: "Walking Up",
          notes: ["C4", "D4", "E4", "F4", "G4"],
          instruction: "Play each note from C to G slowly using fingers 1-2-3-4-5."
        },
        {
          title: "The Jump",
          notes: ["C4", "E4", "G4"],
          instruction: "Skip notes to play C, E, and G. This builds finger independence in fingers 1, 3, and 5."
        },
        {
          title: "The Roll Down",
          notes: ["G4", "F4", "E4", "D4", "C4"],
          instruction: "Reverse the scale, walking back down from G to C using fingers 5-4-3-2-1."
        }
      ]
    }
  },
  {
    id: 'beg-4',
    title: 'Left Hand Basics',
    description: 'C D E F G with the left hand.',
    skillLevel: SkillLevel.BEGINNER,
    order: 4,
    estimatedMinutes: 10,
    content: [
      { type: 'goal', content: 'Gain confidence with your left hand positioning.' },
      { type: 'text', content: 'Now for the left hand. This time, your pinky (5) starts on C (an octave below Middle C), and your thumb (1) ends on G.' },
      { type: 'diagram', diagramType: 'cPositionLeft' },
      { type: 'piano', highlightedKeys: ['C3', 'D3', 'E3', 'F3', 'G3'], content: 'Play C-D-E-F-G with your left hand.' },
      { type: 'checklist', steps: ['Pinky on C3', 'Relaxed wrist', 'Thumb on G3', 'Smooth transitions'] },
      { type: 'exercise', steps: ['Play C up to G using fingers 5-4-3-2-1.', 'Play G down to C using fingers 1-2-3-4-5.', 'Focus on keeping fingers 4 and 5 strong and not "clicking" flat.'] },
      { type: 'tip', content: 'Your left hand usually plays the "Bass" or foundation of the music.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'In the left hand, which finger plays "C"?', options: ['1 (Thumb)', '3 (Middle)', '5 (Pinky)', 'Index'], correctAnswer: 2, explanation: 'The left hand start C with finger 5.' },
      { id: 'q2', question: 'Which left hand finger plays "G"?', options: ['1 (Thumb)', '2', '3', '5'], correctAnswer: 0, explanation: 'The thumb (1) plays G in the left hand C position.' },
      { id: 'q3', question: 'Is left hand fingering different from right hand?', options: ['Yes, it is reversed', 'No, it is identical', 'Only the thumb is different', 'Only the pinky is different'], correctAnswer: 0, explanation: 'The fingers are numbered the same, but they map to different notes in music.' },
      { id: 'q4', question: 'Which finger plays "E" in the left hand?', options: ['1', '2', '3', '4'], correctAnswer: 2, explanation: 'Finger 3 (middle) plays E in the left hand C position.' },
      { id: 'q5', question: 'What is the goal of practicing the left hand?', options: ['To play faster', 'To build hand independence', 'To learn high notes', 'To ignore the right hand'], correctAnswer: 1, explanation: 'Practicing both hands separately builds the foundation for playing together.' }
    ],
    practiceSong: {
      title: "Left Hand Odyssey",
      artist: "Academy Original",
      description: "Build strength in your 'weaker' hand.",
      guide: [
        {
          title: "The Bass Anchor",
          notes: ["C3"],
          instruction: "Place your LH pinky (5) on C3. This is the foundation of your hand position."
        },
        {
          title: "Climbing the Ladder",
          notes: ["C3", "D3", "E3", "F3", "G3"],
          instruction: "Walk up from C to G using fingers 5-4-3-2-1. Keep the pulse steady."
        },
        {
          title: "The Descent",
          notes: ["G3", "F3", "E3", "D3", "C3"],
          instruction: "Walk back down from G to C using fingers 1-2-3-4-5. Watch finger 4 specifically!"
        }
      ]
    }
  },
  {
    id: 'beg-5',
    title: 'Reading Basic Music Notation',
    description: 'Treble Clef, Bass Clef, and basic notes.',
    skillLevel: SkillLevel.BEGINNER,
    order: 5,
    estimatedMinutes: 12,
    content: [
      { type: 'goal', content: 'Read the language of music and translate it to your fingers.' },
      { type: 'text', content: 'Music is written on a staff of 5 lines and 4 spaces. The Treble Clef is used for higher notes (right hand), and the Bass Clef is for lower notes (left hand).' },
      { type: 'text', content: '### Understanding Rhythm\nNotes tell you **when** to play and **how long** to hold:' },
      { type: 'checklist', steps: ['Quarter Note: 1 beat (filled circle with stem)', 'Half Note: 2 beats (hollow circle with stem)', 'Whole Note: 4 beats (hollow circle, no stem)'] },
      { type: 'tip', content: 'Middle C is the "bridge" between the two staffs. It sits on its own little line.' },
      { type: 'exercise', steps: ['Clap a steady 1-2-3-4 beat.', 'Now clap Quarter notes: CLAP CLAP CLAP CLAP.', 'Now clap Half notes: CLAP (2) CLAP (4).', 'Now clap a Whole note: CLAP (2, 3, 4).'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which clef is usually played by the right hand?', options: ['Bass Clef', 'Alto Clef', 'Treble Clef', 'Tenor Clef'], correctAnswer: 2, explanation: 'The Treble Clef signals higher pitches.' },
      { id: 'q2', question: 'How many beats does a "Whole Note" get?', options: ['1', '2', '3', '4'], correctAnswer: 3, explanation: 'A whole note typically lasts for 4 beats.' },
      { id: 'q3', question: 'What is the staff?', options: ['The piano bench', 'The 5 lines and 4 spaces music is written on', 'A type of piano key', 'The name of the composer'], correctAnswer: 1, explanation: 'The staff is the foundation of musical notation.' },
      { id: 'q4', question: 'How many beats does a "Quarter Note" get?', options: ['1', '2', '3', '4'], correctAnswer: 0, explanation: 'A quarter note equals 1 beat.' },
      { id: 'q5', question: 'Which clef is for lower notes?', options: ['Treble', 'Bass', 'Middle', 'C-Clef'], correctAnswer: 1, explanation: 'The Bass Clef is used for the lower range of the piano.' }
    ],
    practiceSong: {
      title: "The Staff Step",
      artist: "Academy Original",
      description: "Translate notes from the page to the keys.",
      guide: [
        {
          title: "Quarter Note Pulse",
          notes: ["C4", "C4", "C4", "C4"],
          instruction: "Play C four times. Imagine each note is a filled circle with a stem (Quarter Note)."
        },
        {
          title: "Half Note Hold",
          notes: ["D4", "D4"],
          instruction: "Play D twice, holding each for two counts (1-2, 3-4). This is the hollow circle with a stem."
        },
        {
          title: "Whole Note Resonance",
          notes: ["E4"],
          instruction: "Play E once and hold for all 4 beats. Imagine the big hollow circle with no stem."
        }
      ]
    }
  },
  {
    id: 'beg-6',
    title: 'Simple Melodies',
    description: 'Play "Mary Had a Little Lamb".',
    skillLevel: SkillLevel.BEGINNER,
    order: 6,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Connect notes together into a recognizable song.' },
      { type: 'text', content: 'Let\'s play a song! "Mary Had a Little Lamb" uses E, D, and C. Here are the finger numbers: 3 2 1 2 3 3 3 ... 2 2 2 ... 3 5 5' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'E4', 'G4'], content: 'Play E (3), D (2), C (1), D (2), E (3), E (3), E (3).' },
      { type: 'checklist', steps: ['Play the first 7 notes', 'Keep your hand in character (curved)', 'Try to play without looking at your hand', 'Maintain a steady speed'] },
      { type: 'exercise', steps: ['Step 1: Sing the melody aloud.', 'Step 2: Play RH fingers 3-2-1.', 'Step 3: Play "Hot Cross Buns": 3-2-1, 3-2-1, 1111, 2222, 3-2-1.'] },
      { type: 'tip', content: 'Legato means "smoothly connected." Try to let one note go just as you press the next.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'What is the starting note for "Mary Had a Little Lamb"?', options: ['C', 'D', 'E', 'G'], correctAnswer: 2, explanation: 'The song starts on E (finger 3).' },
      { id: 'q2', question: 'What sequence of finger numbers represents "Hot Cross Buns"?', options: ['1-2-3', '3-2-1', '5-4-3', '1-1-1'], correctAnswer: 1, explanation: 'Hot Cross Buns uses a descending 3-2-1 pattern.' },
      { id: 'q3', question: 'Which note is repeated three times in the first line of Mary Had a Little Lamb?', options: ['C', 'D', 'E', 'G'], correctAnswer: 2, explanation: 'The melody goes "E D C D E E E".' },
      { id: 'q4', question: 'How many notes are used in these simple melodies?', options: ['3', '5', '8', '12'], correctAnswer: 0, explanation: 'These specifically use just 3 notes (C, D, E).' },
      { id: 'q5', question: 'What should you do if you make a mistake?', options: ['Stop forever', 'Start again slowly', 'Play louder', 'Skip the song'], correctAnswer: 1, explanation: 'Slow practice is the key to accuracy.' }
    ],
    practiceSong: {
      title: "Twinkle Twinkle Little Star",
      artist: "Traditional",
      description: "Practice your 5-finger position with this classic melody.",
      guide: [
        {
          title: "The Opening Phrase",
          notes: ["C4", "C4", "G4", "G4"],
          instruction: "Play C twice with your thumb (1), then jump your pinky (5) to G and play that twice."
        },
        {
          title: "Continuing Up",
          notes: ["A4", "A4", "G4"],
          instruction: "Use your A (will require a slight shift or use finger 5) and then back to G (finger 4 or 5)."
        },
        {
          title: "Descending Steps",
          notes: ["F4", "F4", "E4", "E4", "D4", "D4", "C4"],
          instruction: "Walk down finger by finger: 4-4, 3-3, 2-2, 1. Keep it steady!"
        },
        {
          title: "The Middle Bridge",
          notes: ["G4", "G4", "F4", "F4", "E4", "E4", "D4"],
          instruction: "Start on G (5) and move down to D. Repeat this sequence twice for the middle section."
        }
      ]
    }
  },
  {
    id: 'beg-7',
    title: 'Both Hands Together',
    description: 'Coordination drills for both hands.',
    skillLevel: SkillLevel.BEGINNER,
    order: 7,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Play with both hands simultaneously without confusion.' },
      { type: 'text', content: 'Playing with both hands at the same time is the biggest challenge for beginners. Start by playing C with both hands simultaneously.' },
      { type: 'piano', highlightedKeys: ['C3', 'C4'], content: 'Play C with LH finger 5 and RH finger 1 together.' },
      { type: 'checklist', steps: ['RH finger 1 on Middle C', 'LH finger 5 on Bass C', 'Press both at the exact same time', 'Check: are both hands still curved?'] },
      { type: 'exercise', steps: ['Exercise 1: Press C in both hands.', 'Exercise 2: Play C-D-E-F-G in both hands together.', 'Exercise 3: Play C-E-G (skip notes) in both hands.'] },
      { type: 'tip', content: 'Go slowly! If it\'s too hard, play one hand while the other hand just rests on the keys.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'What is the key to playing both hands together?', options: ['Playing as fast as possible', 'Practicing slowly', 'Only looking at the right hand', 'Using only your thumbs'], correctAnswer: 1, explanation: 'Slowness allows your brain to process two separate movements.' },
      { id: 'q2', question: 'Which fingers play "C" together in C position?', options: ['1 and 1', '5 and 1', '1 and 5', '5 and 5'], correctAnswer: 1, explanation: 'LH 5 and RH 1 play C concurrently.' },
      { id: 'q3', question: 'What is a good strategy if coordination is too difficult?', options: ['Give up', 'Play one hand at a time', 'Close your eyes', 'Skip the lesson'], correctAnswer: 1, explanation: 'Mastering each hand separately is a necessary step.' },
      { id: 'q4', question: 'Which finger is RH 1?', options: ['Thumb', 'Pinky', 'Middle', 'Index'], correctAnswer: 0, explanation: 'RH 1 is the right thumb.' },
      { id: 'q5', question: 'Which finger is LH 5?', options: ['Thumb', 'Pinky', 'Index', 'Middle'], correctAnswer: 1, explanation: 'LH 5 is the left pinky.' }
    ],
    practiceSong: {
      title: "Symmetry Test",
      artist: "Academy Original",
      description: "Master the simultaneous press.",
      guide: [
        {
          title: "The Double C",
          notes: ["C3", "C4"],
          instruction: "Press LH 5 and RH 1 at the EXACT same time. Listen for a single, unified sound."
        },
        {
          title: "Parallel Motion",
          notes: ["C3", "C4", "D3", "D4", "E3", "E4", "F3", "F4", "G3", "G4"],
          instruction: "Walk up both hands together. LH uses 5-4-3-2-1 while RH uses 1-2-3-4-5."
        },
        {
          title: "Contrary Motion (Expansion)",
          notes: ["C3", "C4", "B2", "D4", "A2", "E4"],
          instruction: "Try moving them apart: RH goes up while LH goes down. This is the real coordination test!"
        }
      ]
    }
  },
  {
    id: 'beg-8',
    title: 'Beginner Capstone: Ode to Joy',
    description: 'Play a simplified version of Beethoven\'s classic.',
    skillLevel: SkillLevel.BEGINNER,
    order: 8,
    estimatedMinutes: 20,
    content: [
      { type: 'goal', content: 'Apply everything you\'ve learned to play a world-famous melody.' },
      { type: 'text', content: 'Congratulations! You\'ve reached a major milestone. Your test piece is "Ode to Joy".' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'E4', 'F4', 'G4'], content: 'RH Fingers: 3 3 4 5 5 4 3 2 1 1 2 3 3 2 2' },
      { type: 'checklist', steps: ['Rhyme the melody names: E E F G G F E D', 'Play Rh melody slowly', 'Maintain curved hand position', 'Keep a steady beat'] },
      { type: 'exercise', steps: ['Step 1: Practice the first 4 notes (E E F G).', 'Step 2: Practice the reversal (G F E D).', 'Step 3: Add a LH C note (finger 5) on the very first note of the song.'] },
      { type: 'tip', content: 'Take a deep breath and keep your shoulders relaxed. You got this!' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Who composed Ode to Joy?', options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], correctAnswer: 2, explanation: 'It is part of Beethoven\'s 9th Symphony.' },
      { id: 'q2', question: 'What is the starting finger for Ode to Joy (RH)?', options: ['1', '2', '3', '5'], correctAnswer: 2, explanation: 'The piece starts on E (finger 3).' }
    ],
    practiceSong: {
      title: "Ode to Joy",
      artist: "Beethoven",
      description: "Beethoven's masterpiece. Focus on rhythmic precision.",
      guide: [
        {
          title: "The Main Theme Start",
          notes: ["E4", "E4", "F4", "G4"],
          instruction: "Use fingers 3-3-4-5. Start on E and climb up to G."
        },
        {
          title: "The Theme Reversal",
          notes: ["G4", "F4", "E4", "D4"],
          instruction: "Walk back down from G to D using fingers 5-4-3-2."
        },
        {
          title: "Closing the First Line",
          notes: ["C4", "C4", "D4", "E4"],
          instruction: "Start from C and step up to E using fingers 1-1-2-3."
        },
        {
          title: "The Final Resolution",
          notes: ["E4", "D4", "D4"],
          instruction: "End the phrase on E then D-D (3-2-2). Almost there!"
        }
      ]
    }
  },
  {
    id: 'beg-9',
    title: 'All Major Triads (White Keys)',
    description: 'Learn C, D, E, F, G, A, and B Major.',
    skillLevel: SkillLevel.BEGINNER,
    order: 9,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Identify and play all the white-key major triads.' },
      { type: 'text', content: 'A major triad consists of a Root, a Major Third (4 half steps), and a Perfect Fifth (7 half steps).' },
      { type: 'piano', highlightedKeys: ['C4', 'E4', 'G4'], content: 'C Major: White-White-White (C, E, G)' },
      { type: 'piano', highlightedKeys: ['F4', 'A4', 'C5'], content: 'F Major: White-White-White (F, A, C)' },
      { type: 'piano', highlightedKeys: ['G4', 'B4', 'D5'], content: 'G Major: White-White-White (G, B, D)' },
      { type: 'checklist', steps: ['Play C Major', 'Play F Major', 'Play G Major', 'Maintain a firm hand shape'] },
      { type: 'exercise', steps: ['Step 1: Place fingers 1-3-5 on C-E-G. Press together.', 'Step 2: Move the same shape to F-A-C.', 'Step 3: Move to G-B-D.', 'Step 4: Now try D, E, and A (they have a black key in the middle!).'] },
      { type: 'tip', content: 'Shape your hand like a "claw" so all three notes hit at the exact same moment.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which notes make up an F Major triad?', options: ['F-A-C', 'F-G-A', 'F-Ab-C', 'F-Bb-D'], correctAnswer: 0, explanation: 'F Major is F, A, and C.' }
    ],
    practiceSong: {
      title: "The Major Walk",
      artist: "Academy Original",
      description: "Exercise your white-key major triads.",
      guide: [
        {
          title: "C Major Start",
          notes: ["C4", "E4", "G4"],
          instruction: "Play C-E-G. Start with a firm, unified press."
        },
        {
          title: "The Jump to F",
          notes: ["F4", "A4", "C5"],
          instruction: "Jump your hand up to F-A-C. Keep the same 1-3-5 shape."
        },
        {
          title: "The Turn to G",
          notes: ["G4", "B4", "D5"],
          instruction: "Slide up one more note to G-B-D. Keep the fingers curved."
        }
      ]
    }
  },
  {
    id: 'beg-10',
    title: 'All Minor Triads (White Keys)',
    description: 'Learn Cm, Dm, Em, Fm, Gm, Am, and Bm.',
    skillLevel: SkillLevel.BEGINNER,
    order: 10,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Understand the "sad" quality of minor chords and how they differ from major.' },
      { type: 'text', content: 'To change a Major triad to a Minor one, simply lower the middle note (the third) by one half-step.' },
      { type: 'piano', highlightedKeys: ['C4', 'Eb4', 'G4'], content: 'C Minor: C - Eb - G' },
      { type: 'piano', highlightedKeys: ['A4', 'C5', 'E5'], content: 'A Minor: A - C - E (All white keys)' },
      { type: 'checklist', steps: ['Play C Major', 'Lower finger 3 to Eb', 'Listen to the change in "mood"', 'Try it with D Major to D Minor'] },
      { type: 'exercise', steps: ['Exercise 1: Toggle between C Major and C Minor 5 times.', 'Exercise 2: Play the "all white" minor chords: Am, Dm, Em.', 'Exercise 3: Try B minor (it has a F#!).'] },
      { type: 'tip', content: 'Minor chords are often used to convey emotion, tension, or mystery.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'How do you turn a Major chord into a Minor chord?', options: ['Lower the root', 'Raise the fifth', 'Lower the third by a half-step', 'Play it louder'], correctAnswer: 2, explanation: 'Flattening the third creates the minor quality.' }
    ],
    practiceSong: {
      title: "The Minor Shadow",
      artist: "Academy Original",
      description: "Explore the mood of minor chords.",
      guide: [
        {
          title: "A Minor (The Sad Relative)",
          notes: ["A3", "C4", "E4"],
          instruction: "Play the all-white A Minor triad. Notice the somber sound."
        },
        {
          title: "D Minor (The Gentle Path)",
          notes: ["D4", "F4", "A4"],
          instruction: "Move to D Minor. It has a similar 'white-key' shape to Am."
        },
        {
          title: "E Minor (The Dark Edge)",
          notes: ["E4", "G4", "B4"],
          instruction: "Finally, play E Minor. It's the brightest of the minor chords."
        }
      ]
    }
  },
  {
    id: 'beg-11',
    title: 'Major & Minor: The Difference',
    description: 'Ear training and theory for chord qualities.',
    skillLevel: SkillLevel.BEGINNER,
    order: 11,
    estimatedMinutes: 10,
    content: [
      { type: 'goal', content: 'Instantly recognize if a chord is Major or Minor by ear and structure.' },
      { type: 'text', content: 'Major chords often sound "happy" or "bright". Minor chords often sound "sad" or "dark".' },
      { type: 'text', content: '### The Theory Secret\n- **Major:** 4 half-steps then 3 half-steps.\n- **Minor:** 3 half-steps then 4 half-steps.' },
      { type: 'checklist', steps: ['Count intervals for C Major (C to E is 4 steps)', 'Count intervals for C Minor (C to Eb is 3 steps)', 'Identify the "mood" shift'] },
      { type: 'exercise', steps: ['Play any white key.', 'Build a Major triad (count 4, then 3).', 'Now make it Minor (lower the middle note).', 'Repeat for 3 different keys.'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which chord quality is often described as "bright"?', options: ['Minor', 'Diminished', 'Major', 'Suspended'], correctAnswer: 2, explanation: 'Major chords have a bright, stable sound.' }
    ],
    practiceSong: {
      title: "Modal Shift",
      artist: "Academy Original",
      description: "Direct side-by-side comparison.",
      guide: [
        {
          title: "C Major (Bright)",
          notes: ["C4", "E4", "G4"],
          instruction: "Play C Major. Hold it and listen to the 'happy' quality."
        },
        {
          title: "C Minor (Dark)",
          notes: ["C4", "Eb4", "G4"],
          instruction: "Change only the middle note to Eb. Hear the instant shift to a 'sad' sound."
        },
        {
          title: "The Rapid Swap",
          notes: ["C4", "E4", "G4", "C4", "Eb4", "G4"],
          instruction: "Toggle between them every 2 beats. This trains your ears and fingers together."
        }
      ]
    }
  },
  {
    id: 'beg-12',
    title: 'Black Key Major Chords',
    description: 'Db, Eb, Gb, Ab, Bb major triads.',
    skillLevel: SkillLevel.BEGINNER,
    order: 12,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Master the hand shapes for chords starting on black keys.' },
      { type: 'text', content: 'These chords require your hand to move deeper into the keyboard (between the black keys) to reach the white notes.' },
      { type: 'piano', highlightedKeys: ['Db4', 'F4', 'Ab4'], content: 'Db Major: Black-White-Black (Db, F, Ab)' },
      { type: 'piano', highlightedKeys: ['Eb4', 'G4', 'Bb4'], content: 'Eb Major: Black-White-Black (Eb, G, Bb)' },
      { type: 'piano', highlightedKeys: ['Gb4', 'Bb4', 'Db5'], content: 'Gb Major: All Black Keys (Gb, Bb, Db)' },
      { type: 'checklist', steps: ['Play Db Major', 'Play Eb Major', 'Play Gb Major', 'Notice the different "feel" of these keys'] },
      { type: 'exercise', steps: ['Step 1: Find the group of 2 black keys.', 'Step 2: Place finger 1 on Db, 3 on F, 5 on Ab.', 'Step 3: Press firmly. Repeat for Eb and Ab chords.'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which notes are in Bb Major?', options: ['Bb-D-F', 'Bb-Db-F', 'B-D-F#', 'Bb-Eb-G'], correctAnswer: 0, explanation: 'Bb, D, and F form Bb Major.' }
    ],
    practiceSong: {
      title: "Ebony & Ivory",
      artist: "Academy Original",
      description: "Mixing colors on the keyboard.",
      guide: [
        {
          title: "Bb Major (Flat Key)",
          notes: ["Bb3", "D4", "F4"],
          instruction: "Play Bb with your thumb. D and F are white keys. 1-3-5 fingers."
        },
        {
          title: "Db Major (Wide Stretch)",
          notes: ["Db4", "F4", "Ab4"],
          instruction: "Black-White-Black. This is a common hand shape for many pop songs."
        },
        {
          title: "Gb Major (Pure Black)",
          notes: ["Gb4", "Bb4", "Db5"],
          instruction: "Only black keys! Notice how high your hand sits on the keyboard."
        }
      ]
    }
  },
  {
    id: 'beg-13',
    title: 'Black Key Minor Chords',
    description: 'Dbm, Ebm, Gbm, Abm, Bbm triads.',
    skillLevel: SkillLevel.BEGINNER,
    order: 13,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Complete your knowledge of the 12 minor triads.' },
      { type: 'text', content: 'Just like white key chords, we flatten the third to make these minor. Often a black key becomes a white key, or vice-versa.' },
      { type: 'piano', highlightedKeys: ['Bb3', 'Db4', 'F4'], content: 'Bb Minor: Bb - Db - F' },
      { type: 'piano', highlightedKeys: ['Eb4', 'Gb4', 'Bb4'], content: 'Eb Minor: Eb - Gb - Bb' },
      { type: 'checklist', steps: ['Start with Bb Major', 'Flatten the D to Db', 'Listen for the Bb Minor sound', 'Repeat for Ebm and Abm'] },
      { type: 'exercise', steps: ['Find Ebm (Eb-Gb-Bb).', 'Find Bbm (Bb-Db-F).', 'Find Abm (Ab-Cb-Eb). Hint: Cb is the same as the B key!'] },
      { type: 'tip', content: 'Don\'t worry about the names too much yet; focus on the finger shapes and the sound.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Dark Keys",
      artist: "Academy Original",
      description: "Minor chords starting on black keys.",
      guide: [
        {
          title: "Bb Minor (The Cool Chord)",
          notes: ["Bb3", "Db4", "F4"],
          instruction: "Play Bb-Db-F. Notice the Bb and Db are both black keys close together."
        },
        {
          title: "Eb Minor (Lush Sound)",
          notes: ["Eb4", "Gb4", "Bb4"],
          instruction: "All black keys! Eb-Gb-Bb. It's the minor version of Gb major."
        }
      ]
    }
  },
  { id: 'beg-14',
    title: 'Sharps & Flats (Key Signatures)',
    description: 'Understanding why we have different keys.',
    skillLevel: SkillLevel.BEGINNER,
    order: 14,
    estimatedMinutes: 12,
    content: [
      { type: 'goal', content: 'Understand the "road map" at the beginning of a piece of music.' },
      { type: 'text', content: 'A Sharp (#) raises a note. A Flat (b) lowers it. A Key Signature tells you which notes are permanently changed for the whole song.' },
      { type: 'text', content: '### Why we have keys\nEvery Major key follows the same "W-W-H-W-W-W-H" pattern. To keep this pattern, we must use black keys.' },
      { type: 'checklist', steps: ['C Major has 0 sharps', 'G Major has 1 sharp (F#)', 'F Major has 1 flat (Bb)', 'Identify these at the start of a staff'] },
      { type: 'exercise', steps: ['Play a G volume using only white keys. Sounds weird?', 'Now play G with F# instead of F. There it is!'] },
      { type: 'tip', content: 'The order of sharps is always: F C G D A E B. (Fat Cats Go Down Alleys Eating Birds).' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Key Signature Quest",
      artist: "Academy Original",
      description: "Visualizing sharps and flats in motion.",
      guide: [
        {
          title: "G Major (The Sharp Key)",
          notes: ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
          instruction: "Play a scale from G to G, but make sure to use F# (the black key) instead of F."
        },
        {
          title: "F Major (The Flat Key)",
          notes: ["F4", "G4", "A4", "Bb4", "C5", "D5", "E5", "F5"],
          instruction: "Play a scale from F to F, but use Bb instead of B. Notice the different 'feel'."
        }
      ]
    }
  },
  { id: 'beg-15',
    title: 'Common Chord Progressions',
    description: 'The I, IV, V, and vi chords.',
    skillLevel: SkillLevel.BEGINNER,
    order: 15,
    estimatedMinutes: 15,
    content: [
      { type: 'goal', content: 'Unlock the secret to playing 90% of your favorite radio songs.' },
      { type: 'text', content: 'Most pop songs use just 4 repeating chords. We number them based on their position in the scale (I, IV, V, vi).' },
      { type: 'checklist', steps: ['I (1st) - Home chord', 'IV (4th) - The "away" chord', 'V (5th) - The "tension" chord', 'vi (6th) - The "emotional" minor chord'] },
      { type: 'piano', highlightedKeys: ['C4', 'F4', 'G4', 'A4'], content: 'In C Major, these are: C, F, G, and Am.' },
      { type: 'exercise', steps: ['Step 1: Play C Major (I).', 'Step 2: Play F Major (IV).', 'Step 3: Play G Major (V).', 'Step 4: Play A Minor (vi).'] },
      { type: 'tip', content: 'This progression is so common it\'s often called the "Axis of Awesome" progression.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Axis Bridge",
      artist: "Academy Original",
      description: "Learn to identify the number of each chord.",
      guide: [
        {
          title: "The I and V (Home and Away)",
          notes: ["C4", "E4", "G4", "G3", "B3", "D4"],
          instruction: "Alternate between C (I) and G (V). This is the 'Call and Response' of music."
        },
        {
          title: "The IV and vi (Pathways)",
          notes: ["F3", "A3", "C4", "A3", "C4", "E4"],
          instruction: "Practice moving between F (IV) and Am (vi). Both share the note C!"
        }
      ]
    }
  },
  { id: 'beg-16',
    title: 'Graduation: The 4 Chord Song',
    description: 'Play a simplified accompaniment to thousands of songs.',
    skillLevel: SkillLevel.BEGINNER,
    order: 16,
    estimatedMinutes: 20,
    content: [
      { type: 'goal', content: 'Master the C - G - Am - F progression fluently.' },
      { type: 'text', content: 'This is the ultimate beginner goal. Once you can play these four chords smoothly, you can play thousands of songs.' },
      { type: 'checklist', steps: ['Smooth chord changes', 'No pauses between transitions', 'Consistent sound across all notes', 'Steady rhythm (4 beats each)'] },
      { type: 'exercise', steps: ['Step 1: Set a very slow metronome.', 'Step 2: Play C (4 beats), G (4 beats), Am (4 beats), F (4 beats).', 'Step 3: Repeat 10 times without stopping.', 'Step 4: Try it with your Left Hand playing the root note while your Right Hand plays the chord.'] },
      { type: 'tip', content: 'Congratulations, Pianist! You have graduated from the Beginner curriculum. You now have the tools to learn almost any pop song foundations.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The 4 Chord Anthem",
      artist: "Academy Original",
      description: "Master the progression that defines modern music.",
      guide: [
        {
          title: "Step 1: C Major Foundation",
          notes: ["C4", "E4", "G4"],
          instruction: "Play the C Major chord. Keep your wrist loose and fingers curved (1-3-5)."
        },
        {
          title: "Step 2: The Shift to G",
          notes: ["G3", "B3", "D4"],
          instruction: "Move your whole hand down to find G. This is the 'V' chord. Hold it for 4 beats."
        },
        {
          title: "Step 3: The Relative Minor (Am)",
          notes: ["A3", "C4", "E4"],
          instruction: "Move slightly up to A Minor. This adds the emotional depth to the sequence."
        },
        {
          title: "Step 4: The Subdominant (F)",
          notes: ["F3", "A3", "C4"],
          instruction: "End on F Major. This chord 'pulls' back to C. Practice switching from F back to C."
        },
        {
          title: "The Full Loop",
          notes: ["C4", "E4", "G4", "G3", "B3", "D4", "A3", "C4", "E4", "F3", "A3", "C4"],
          instruction: "Play C-G-Am-F. Keep a steady 4-beat rhythm for each chord. Don't stop between changes!"
        }
      ]
    }
  }
];

const moreLessons: Lesson[] = [
  // INTERMEDIATE
  { id: 'int-1', title: 'Scales Mastery (2 Octaves)', description: 'Expanded scale technique and crossover speed.', skillLevel: SkillLevel.INTERMEDIATE, order: 1, estimatedMinutes: 15, content: [
      { type: 'goal', content: 'Play a C major scale across two full octaves without stopping.' },
      { type: 'text', content: 'To play two octaves, the thumb passes under finger 3, then later under finger 4. This technique is called "Thumb Under".' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'], content: 'RH Fingering: 1 2 3 - 1 2 3 4 - 1 2 3 - 1 2 3 4 5' },
      { type: 'checklist', steps: ['Thumb cross after finger 3', 'Thumb cross after finger 4', 'Smooth hand shift', 'Even volume on every note'] },
      { type: 'exercise', steps: ['Step 1: Play C-D-E, then tuck thumb to F.', 'Step 2: Play F-G-A-B, then tuck thumb to C (next octave).', 'Step 3: Connect all notes 1-2-3-1-2-3-4-1...'] },
      { type: 'tip', content: 'Keep your thumb moving early—don\'t wait until you need it to start the "tuck".' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'In a 2-octave scale, which finger does the thumb pass under second?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: 'The finger pattern is 123, then 1234.' }
    ],
    practiceSong: {
      title: "The Scale Runner",
      artist: "Technical Study",
      description: "Master the fluid thumb-under technique across 2 octaves.",
      guide: [
        {
          title: "The First Octave",
          notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
          instruction: "Play 1-2-3, then tuck thumb to F. Finish the octave with 1-2-3-4-5."
        },
        {
          title: "The Thumb Pass (Linking)",
          notes: ["E4", "F4", "G4"],
          instruction: "Focus on the moment finger 3 plays E and the thumb sneaks under to hit F. It should be invisible!"
        },
        {
          title: "The 2-Octave Turn",
          notes: ["B4", "C5", "D5"],
          instruction: "Instead of finishing on finger 5 at C5, tuck your thumb under C5 to continue the climb."
        },
        {
          title: "The Full Climb",
          notes: ["C4", "C5", "C6"],
          instruction: "Connect everything: 1-2-3-1-2-3-4-1-2-3-1-2-3-4-5. Keep your arm moving laterally."
        }
      ]
    }
  },
  { id: 'int-2', title: 'Inversions & Voice Leading', description: 'Changing chord positions for smoother transitions.', skillLevel: SkillLevel.INTERMEDIATE, order: 2, estimatedMinutes: 20, content: [
      { type: 'goal', content: 'Move between C, F, and G chords without moving your whole hand across the keyboard.' },
      { type: 'text', content: 'Root position: C-E-G. 1st Inversion: E-G-C. 2nd Inversion: G-C-E. By using inversions, you can keep your hand in one place while changing chords.' },
      { type: 'piano', highlightedKeys: ['E4', 'G4', 'C5'], content: 'C Major 1st Inversion (E-G-C)' },
      { type: 'checklist', steps: ['Identify chord notes', 'Find the closest inversion', 'Keep common notes held down', 'Move other fingers the shortest distance'] },
      { type: 'exercise', steps: ['Step 1: Play C Major (C-E-G).', 'Step 2: Move to F Major 2nd Inv (C-F-A). Notice C stayed the same!', 'Step 3: Move back to C Major.', 'Step 4: Move to G Major 1st Inv (B-D-G).'] },
      { type: 'tip', content: 'Voice leading makes your chord transitions sound professional and melodic.' }
    ],
    quizQuestions: [
      { id: 'q1', question: 'What is it called when the 3rd of the chord is on the bottom?', options: ['Root Position', '1st Inversion', '2nd Inversion', '3rd Inversion'], correctAnswer: 1, explanation: '1st inversion moves the root to the top.' }
    ],
    practiceSong: {
      title: "The Static Hand",
      artist: "Academy Original",
      description: "Change chords with minimal movement.",
      guide: [
        {
          title: "C Major Root",
          notes: ["C4", "E4", "G4"],
          instruction: "Play C-E-G. This is your home base."
        },
        {
          title: "F Major (2nd Inversion)",
          notes: ["C4", "F4", "A4"],
          instruction: "Keep your thumb on C! Just move fingers 3 and 5 to F and A."
        },
        {
          title: "The Pivot",
          notes: ["C4", "E4", "G4", "C4", "F4", "A4"],
          instruction: "Alternate between C and F. Notice how little your hand actually moves."
        }
      ]
    }
  },
  { id: 'int-3', title: 'Seventh Chords (Major/Minor 7)', description: 'Adding the "jazz" color to your triads.', skillLevel: SkillLevel.INTERMEDIATE, order: 3, estimatedMinutes: 15, content: [
      { type: 'goal', content: 'Understand the construction of Cmaj7 and Cm7.' },
      { type: 'text', content: 'A seventh chord adds a fourth note to the triad. A Major 7th uses the 7th note of the major scale (e.g., B in C Major).' },
      { type: 'piano', highlightedKeys: ['C4', 'E4', 'G4', 'B4'], content: 'C Major 7: C - E - G - B' },
      { type: 'piano', highlightedKeys: ['C4', 'Eb4', 'G4', 'Bb4'], content: 'C Minor 7: C - Eb - G - Bb' },
      { type: 'checklist', steps: ['Start with a triad', 'Add the 7th note of the scale', 'Is it a Major 7 or Minor 7 interval?', 'Check your finger spacing'] },
      { type: 'exercise', steps: ['Step 1: Play C triad.', 'Step 2: Add B (Cmaj7).', 'Step 3: Flatten E and B (Cm7).', 'Step 4: Repeat for Gmaj7 and Gm7.'] }
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which note is added to a C triad to make it Cmaj7?', options: ['Bb', 'A', 'B', 'C#'], correctAnswer: 2, explanation: 'B is the natural 7th in the C major scale.' }
    ],
    practiceSong: {
      title: "Smooth Jazz 7ths",
      artist: "Academy Grooves",
      description: "Learn to love the sophisticated sound of the Major 7th.",
      guide: [
        {
          title: "The C Major 7 Build",
          notes: ["C4", "E4", "G4", "B4"],
          instruction: "Start with a C triad (1-2-4) and add your pinky (5) to the B. It sounds like a dream!"
        },
        {
          title: "The F Major 7 Shift",
          notes: ["F4", "A4", "C5", "E5"],
          instruction: "Shift your whole hand up to F. Same 1-2-4-5 shape. Notice how lush it sounds."
        },
        {
          title: "The Dreamy Loop",
          notes: ["C4", "E4", "G4", "B4", "F4", "A4", "C5", "E5"],
          instruction: "Alternate between Cmaj7 and Fmaj7. Keep your wrist loose and let the notes ring out."
        }
      ]
    }
  },
  { id: 'int-4', title: 'Dominant 7th Chords', description: 'The tension-filled G7 chord.', skillLevel: SkillLevel.INTERMEDIATE, order: 4, estimatedMinutes: 15, content: [
      { type: 'goal', content: 'Master the "pull" of the dominant 7th chord.' },
      { type: 'text', content: 'Dominant 7th chords (like G7) are filled with tension that wants to resolve back to the "Home" chord. It is built with a Major triad + a Minor 7th.' },
      { type: 'piano', highlightedKeys: ['G4', 'B4', 'D5', 'F5'], content: 'G7 = G-B-D-F' },
      { type: 'checklist', steps: ['Play G Major chord', 'Add F (the flat 7)', 'Listen to the "unstable" sound', 'Resolve it to C Major'] },
      { type: 'exercise', steps: ['Step 1: Play G7 (G-B-D-F).', 'Step 2: Notice the B and F are just a half-step away from C and E.', 'Step 3: Play G7 then C Major. This is the V7-I cadence.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The V7 Resolution",
      artist: "Academy Original",
      description: "Master the most important change in music.",
      guide: [
        {
          title: "G7 Tension",
          notes: ["G3", "B3", "D4", "F4"],
          instruction: "Play G7. Feel the tension between the B and F notes."
        },
        {
          title: "The Release (C Major)",
          notes: ["C4", "E4", "G4"],
          instruction: "Move both B and F inward to C and E. Ahhh, relief!"
        }
      ]
    }
  },
  { id: 'int-5', title: 'Sus2 & Sus4 Chords', description: 'Open, ambiguous sounds.', skillLevel: SkillLevel.INTERMEDIATE, order: 5, estimatedMinutes: 15, content: [
      { type: 'text', content: 'Suspended chords replace the 3rd with either the 2nd or the 4th note of the scale.' },
      { type: 'piano', highlightedKeys: ['C4', 'F4', 'G4'], content: 'Csus4 - a very common resolution chord.' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'G4'], content: 'Csus2 - an open, modern sound.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Suspended Animation",
      artist: "Academy Original",
      description: "The sound of modern rock and pop.",
      guide: [
        {
          title: "Csus4 to C",
          notes: ["C4", "F4", "G4", "C4", "E4", "G4"],
          instruction: "Play Csus4, then resolve finger 4 down to finger 3 (E). Classic!"
        },
        {
          title: "Csus2 (Floating)",
          notes: ["C4", "D4", "G4"],
          instruction: "Play Csus2. Notice how it feels like it's 'hanging' in mid-air."
        }
      ]
    }
  },
  { id: 'int-6', title: 'The Circle of Fifths', description: 'The ultimate map of music.', skillLevel: SkillLevel.INTERMEDIATE, order: 6, estimatedMinutes: 20, content: [
      { type: 'text', content: 'The Circle of Fifths shows the relationship between the 12 keys of the chromatic scale. Moving clockwise adds a sharp; moving counter-clockwise adds a flat.' },
      { type: 'tip', content: 'C has zero sharps. G has one (F#). D has two (F#, C#).' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Fifth Lap",
      artist: "Academy Original",
      description: "Travel around the circle.",
      guide: [
        {
          title: "C to G",
          notes: ["C4", "E4", "G4", "G4", "B4", "D5"],
          instruction: "Moving clockwise. C (0 sharps) to G (1 sharp)."
        },
        {
          title: "C to F",
          notes: ["C4", "E4", "G4", "F4", "A4", "C5"],
          instruction: "Moving counter-clockwise. C (0 flats) to F (1 flat)."
        }
      ]
    }
  },
  { id: 'int-7', title: 'Syncopated Rhythms', description: 'Playing between the beats.', skillLevel: SkillLevel.INTERMEDIATE, order: 7, estimatedMinutes: 15, content: [
      { type: 'goal', content: 'Play an "off-beat" rhythm without losing the steady pulse.' },
      { type: 'text', content: 'Syncopation involves accenting the "and" of the beat (1 & 2 & 3 & 4 &).' },
      { type: 'exercise', steps: ['Clap 1, 2, 3, 4.', 'Tap your foot and play a note ONLY on the "&" counts.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Off-Beat Groove",
      artist: "Academy Original",
      description: "Train your internal clock.",
      guide: [
        {
          title: "Beat vs Off-Beat",
          notes: ["C4", "C4", "C4", "C4"],
          instruction: "Play on beat 1, then the 'and' of 2, then boat 4. 1... &... 4."
        },
        {
          title: "The Syncopated Chord",
          notes: ["C4", "E4", "G4"],
          instruction: "Tap your foot at a steady pace. Play the chord ONLY when your foot is in the air."
        }
      ]
    }
  },
  { id: 'int-8', title: 'Transposition Basics', description: 'Moving a song to a different key.', skillLevel: SkillLevel.INTERMEDIATE, order: 8, estimatedMinutes: 20, content: [
      { type: 'text', content: 'Transposition means shifting every note of a song by the same interval to play it in a higher or lower key.' },
      { type: 'tip', content: 'This is useful for fitting a song to a singer\'s vocal range.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Moving Key",
      artist: "Academy Original",
      description: "Shift a simple melody up.",
      guide: [
        {
          title: "Original (C Major)",
          notes: ["C4", "D4", "E4"],
          instruction: "Play C-D-E. This is our theme."
        },
        {
          title: "Transposed (D Major)",
          notes: ["D4", "E4", "F#4"],
          instruction: "Shift everything up 2 half-steps. C becomes D, D becomes E, E becomes F#."
        }
      ]
    }
  },
  { id: 'int-9', title: 'Relative Minor Keys', description: 'C Major and A Minor Connection.', skillLevel: SkillLevel.INTERMEDIATE, order: 9, estimatedMinutes: 15, content: [
      { type: 'text', content: 'Every Major key has a Relative Minor key that shares the same key signature. To find it, go down 3 half-steps from the Major root.' },
      { type: 'piano', highlightedKeys: ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'], content: 'A Minor Scale (Shares all white keys with C Major)' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Parallel Walk",
      artist: "Academy Original",
      description: "Experience the sharing of notes.",
      guide: [
        {
          title: "C Major Scale Ascent",
          notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
          instruction: "The happy, bright version."
        },
        {
          title: "A Minor Scale Ascent",
          notes: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
          instruction: "The exact same notes, but starting on A. Now it's mysterious!"
        }
      ]
    }
  },
  { id: 'int-10', title: 'Intermediate Piece: Moonlight Sonata (Excerpts)', description: 'Beethoven\'s moody masterpiece.', skillLevel: SkillLevel.INTERMEDIATE, order: 10, estimatedMinutes: 25, content: [
      { type: 'goal', content: 'Master the triplets in the right hand while keeping the bass steady.' },
      { type: 'text', content: 'The first movement of Moonlight Sonata uses constant triplets (groups of 3). Practice keeping the top note of the RH louder than the inner notes.' },
      { type: 'piano', highlightedKeys: ['C#3', 'G#3', 'C#4', 'E4'], content: 'Opening chord: C# Minor' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Imagine",
      artist: "John Lennon",
      description: "Practice those broken chords with this iconic song.",
      guide: [
        {
          title: "The C Major Pattern",
          notes: ["C4", "E4", "G4"],
          instruction: "Play the C triad rhythmically. Use fingers 1-3-5. Feel the pulse."
        },
        {
          title: "Transition to F",
          notes: ["F4", "A4", "C5"],
          instruction: "Shift your hand up to F. Use the same 1-3-5 shape."
        },
        {
          title: "The Iconic C-Cmaj7-F Walk",
          notes: ["C4", "E4", "G4", "B4", "F4", "A4", "C5"],
          instruction: "Notice the melody descends from C to B. Keep your thumb anchored on C."
        }
      ]
    }
  },
  { id: 'int-11', title: 'Advanced Dynamics', description: 'pp to ff and subtle phrasing.', skillLevel: SkillLevel.INTERMEDIATE, order: 11, estimatedMinutes: 15, content: [
      { type: 'goal', content: 'Gain total control over the volume of your touch.' },
      { type: 'text', content: 'Dynamic markings tell you how loud or soft to play:\n- **pp** (Pianissimo): Very soft\n- **p** (Piano): Soft\n- **mf** (Mezzo-forte): Medium loud\n- **f** (Forte): Loud\n- **ff** (Fortissimo): Very loud' },
      { type: 'checklist', steps: ['Play as soft as possible without being silent', 'Play as loud as possible without banging', 'Execute a "Crescendo" (getting louder)', 'Execute a "Diminuendo" (getting softer)'] },
      { type: 'exercise', steps: ['Step 1: Play 5-note scale very softly (pp).', 'Step 2: Repeat starting soft and getting very loud (crescendo).', 'Step 3: Repeat starting loud and getting very soft (decrescendo).'] },
      { type: 'tip', content: 'Dynamics are the "colors" of music. Without them, even the best piece sounds robotic.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Echo Valley",
      artist: "Academy Original",
      description: "Train your dynamic touch.",
      guide: [
        {
          title: "The Loud Call (f)",
          notes: ["C4", "E4", "G4"],
          instruction: "Play the chord firmly and loud. Imagine it filling a room."
        },
        {
          title: "The Soft Echo (p)",
          notes: ["C4", "E4", "G4"],
          instruction: "Immediately play it again as softly as possible. Like a ghost of the first chord."
        }
      ]
    }
  },
  { id: 'int-12', title: 'Pedal Control', description: 'Legato pedaling and resonance.', skillLevel: SkillLevel.INTERMEDIATE, order: 12, estimatedMinutes: 20, content: [
      { type: 'goal', content: 'Learn "Syncopated Pedaling" to create a smooth, connected sound.' },
      { type: 'text', content: 'The sustain (right) pedal is used to connect notes. The secret is to "clear" the pedal exactly when you play the next chord.' },
      { type: 'checklist', steps: ['Play chord', 'Press pedal immediately after', 'Hold pedal while moving hand', 'Lift pedal AS the next chord is played', 'Press again immediately after'] },
      { type: 'exercise', steps: ['Exercise 1: Play C chord. Add pedal.', 'Exercise 2: Move to G chord. Lift/Press pedal at the exact moment of playing G.', 'Exercise 3: Practice this "hand-foot" coordination slowly.'] },
      { type: 'tip', content: 'Never lift your foot at the same time as your hand. The foot always cleanses AFTER the new note is struck.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Singing Pedal",
      artist: "Classic Flow",
      description: "Master the art of syncopated pedaling.",
      guide: [
        {
          title: "The First Connection",
          notes: ["C4", "E4", "G4"],
          instruction: "Play the C triad. AFTER the notes sound, press the pedal down and hold."
        },
        {
          title: "The Clean Transition",
          notes: ["G3", "B3", "D4"],
          instruction: "Play the G triad. AT THE SAME INSTANT, lift your foot and immediately press the pedal back down. This 'cleans' the sound."
        },
        {
          title: "The Flowing Bridge",
          notes: ["A3", "C4", "E4", "F3", "A3", "C4"],
          instruction: "Transition through Am and F, repeating the pedal 'clean' for every single chord change. No overlap, no silence!"
        }
      ]
    }
  },
  { id: 'adv-1', title: 'Scales (Parallel & Contrary)', description: 'High-speed technical coordination.', skillLevel: SkillLevel.ADVANCED, order: 1, estimatedMinutes: 25, content: [
      { type: 'goal', content: 'Play two-hand scales moving in opposite directions with perfect synchronization.' },
      { type: 'text', content: 'Contrary motion scales are harder to coordinate but great for hand independence. RH moves up while LH moves down.' },
      { type: 'piano', highlightedKeys: ['C4', 'D4', 'E4', 'F4', 'G4', 'E3', 'D3', 'C3'], content: 'Start both thumbs on Middle C. RH moves up, LH moves down.' },
      { type: 'checklist', steps: ['Synchronized thumb tucks', 'Even weight in both hands', 'Matching articulation (legato vs staccato)', 'Increasing tempo incrementally'] },
      { type: 'exercise', steps: ['Step 1: Start on Middle C.', 'Step 2: RH plays 1-2-3 while LH plays 1-2-3 downward.', 'Step 3: Reach one octave and return to the center.', 'Step 4: Repeat for all 12 major keys.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Mirror Dance",
      artist: "Classical Technical",
      description: "Master the coordination of hands moving in opposite directions.",
      guide: [
        {
          title: "The Symmetrical Start",
          notes: ["C4"],
          instruction: "Place both thumbs on Middle C. This is your mirror point."
        },
        {
          title: "Expanding Out",
          notes: ["B3", "D4", "A3", "E4", "G3", "F4"],
          instruction: "Slowly move LH down (1-2-3) while RH moves up (1-2-3). They are mirrors of each other!"
        },
        {
          title: "The Double Tuck",
          notes: ["F3", "G4"],
          instruction: "Both thumbs must tuck under to G3 and F4 simultaneously. This is the hardest part. Breathe!"
        }
      ]
    }
  },
  { id: 'adv-2', title: '9th, 11th, & 13th Chords', description: 'Extended jazz harmony.', skillLevel: SkillLevel.ADVANCED, order: 2, estimatedMinutes: 25, content: [
      { type: 'goal', content: 'Incorporate lush, colorful extensions into your standard chord voicings.' },
      { type: 'text', content: 'Extended chords go beyond the 7th to add complex textures. A 9th is the 2nd note an octave up; an 11th is the 4th; a 13th is the 6th.' },
      { type: 'piano', highlightedKeys: ['C4', 'E4', 'G4', 'Bb4', 'D5'], content: 'C Dominant 9th (C9): Root-3rd-5th-b7th-9th' },
      { type: 'checklist', steps: ['Identify the scale degrees (9, 11, 13)', 'Decide which notes to omit (often the 5th)', 'Experiment with "Open" vs "Closed" voicings', 'Listen for the "harmonic color" shift'] },
      { type: 'exercise', steps: ['Step 1: Play a Cmaj7.', 'Step 2: Add the D above (Cmaj9).', 'Step 3: Move to G7 and add the A above (G9).'] },
      { type: 'tip', content: 'In jazz, the 5th is usually the first note to be omitted because it adds the least "color".' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Lush Extension",
      artist: "Academy Jazz",
      description: "Experiment with the color of 9th and 13th chords.",
      guide: [
        {
          title: "The C Major 9 Reach",
          notes: ["C4", "E4", "G4", "B4", "D5"],
          instruction: "Play a Cmaj7 and then stretch your pinky up to the D an octave above. Hold it and feel the jazz!"
        },
        {
          title: "Dominant 13 (The Funky V)",
          notes: ["G3", "F4", "B4", "E5"],
          instruction: "Play this G13 voicing. It omits the 5th for a cleaner sound. Very professional!"
        }
      ]
    }
  },
  { id: 'adv-3', title: 'Modal Interchange', description: 'Borrowing chords from parallel scales.', skillLevel: SkillLevel.ADVANCED, order: 3, estimatedMinutes: 20, content: [
      { type: 'goal', content: 'Expand your harmonic palette by borrowing "colors" from other scales.' },
      { type: 'text', content: 'Modal interchange is the use of chords from a parallel mode. Most common is borrowing from the parallel minor (e.g., using Fm in the key of C Major).' },
      { type: 'checklist', steps: ['Identify parallel minor chords', 'Find the bVI and bVII chords', 'Maintain smooth voice leading', 'Use for emotional emphasis'] },
      { type: 'exercise', steps: ['Step 1: Play C - F - G - C.', 'Step 2: Replace F with Fm (from C Minor scale).', 'Step 3: Listen to the "borrowed" melancholy sound.'] },
      { type: 'tip', content: 'The "Minor IV" (iv) chord is a classic songwriting secret for emotional transitions.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Borrowed Mood",
      artist: "Academy Original",
      description: "Use chords from the minor scale in a major song.",
      guide: [
        {
          title: "The Major IV (Sunny)",
          notes: ["F4", "A4", "C5"],
          instruction: "Play F Major. It's the standard, bright choice."
        },
        {
          title: "The Minor iv (Emotional)",
          notes: ["F4", "Ab4", "C5"],
          instruction: "Now play F Minor. This 'borrowed' chord is one of the most powerful moves in music."
        }
      ]
    }
  },
  { id: 'adv-4', title: 'Stride Piano Techniques', description: 'Ragtime and jazz LH patterns.', skillLevel: SkillLevel.ADVANCED, order: 4, estimatedMinutes: 30, content: [
      { type: 'goal', content: 'Master the high-energy jumping left hand pattern used in stride and ragtime.' },
      { type: 'text', content: 'Stride technique involves the left hand jumping between a low bass note (usually on beats 1 and 3) and a chord in the middle register (usually on beats 2 and 4).' },
      { type: 'checklist', steps: ['Accurate LH jumps', 'Steady "walking" pulse', 'Syncopated RH melodies', 'Light touch on the middle chords'] },
      { type: 'exercise', steps: ['Step 1: Play a low C on beat 1.', 'Step 2: Jump your LH to a C Major chord on beat 2.', 'Step 3: Repeat for beats 3 and 4 with a low G.', 'Step 4: Keep it steady as a heartbeat.'] },
      { type: 'tip', content: 'Don\'t look at the keyboard! Stride mastery comes from feel and spatial awareness.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Classic Stride Blues",
      artist: "Jazz Standard",
      description: "Master the 'Oom-Pah' left hand jump.",
      guide: [
        {
          title: "The Bass Landing",
          notes: ["C2"],
          instruction: "Hit a low C with your pinky (5). Make it firm and short (staccato)."
        },
        {
          title: "The Mid-Register Jump",
          notes: ["C3", "E3", "G3"],
          instruction: "Instantly jump your hand up to the C triad in the middle. Play it lightly on beat 2."
        },
        {
          title: "The Full Walk",
          notes: ["C2", "C3", "E3", "G3", "G1", "G2", "B2", "D3"],
          instruction: "Alternate Low C -> Chord -> Low G -> Chord. It should feel like your hand is bouncing on a trampoline!"
        }
      ]
    }
  },
  { id: 'adv-5', title: 'Advanced Arpeggios', description: 'Crossing hands and wide intervals.', skillLevel: SkillLevel.ADVANCED, order: 5, estimatedMinutes: 20, content: [
      { type: 'goal', content: 'Play flowing arpeggios that span the entire keyboard with speed and grace.' },
      { type: 'text', content: 'Advanced arpeggios require hand crossing and "arm-weight" shifting to sustain velocity across multiple octaves.' },
      { type: 'checklist', steps: ['No "bumps" during hand crossovers', 'Rotation in the wrist', 'Consistent volume across the keyboard', 'Using the pedal for extra resonance'] },
      { type: 'exercise', steps: ['Step 1: Play C-E-G (LH) -> C-E-G (RH).', 'Step 2: Cross LH over RH to play the next C.', 'Step 3: Continue upward in a "waterfall" pattern.', 'Step 4: Breathe through the movement.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Prelude in C Major",
      artist: "J.S. Bach",
      description: "The ultimate arpeggio piece.",
      guide: [
        {
          title: "The Flowing Pattern",
          notes: ["C4", "E4", "G4", "C5", "E5"],
          instruction: "Play each note individually from bottom to top. Let them ring out together (pedal!)."
        },
        {
          title: "Harmonic Shift",
          notes: ["C4", "D4", "A4", "D5", "F5"],
          instruction: "Follow the arpeggio pattern for the second measure. Keep the rhythm perfectly even."
        }
      ]
    }
  },
  { id: 'adv-6', title: 'Composition: Motif Development', description: 'Create your own original piece.', skillLevel: SkillLevel.ADVANCED, order: 6, estimatedMinutes: 40, content: [
      { type: 'goal', content: 'Transform a simple musical idea into a full, satisfying composition.' },
      { type: 'text', content: 'A motif is a short musical idea. Learn how to repeat, vary, and expand it using techniques like inversion, retrograde, and sequence.' },
      { type: 'checklist', steps: ['Establish a clear 3-5 note motif', 'Vary the rhythm', 'Change the intervals', 'Develop a "Call and Response" structure'] },
      { type: 'exercise', steps: ['Step 1: Compose a 4-note melody.', 'Step 2: Play it starting on a different note (sequence).', 'Step 3: Play it upside down (inversion).', 'Step 4: Combine these variants into a 16-bar piece.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Your Motif",
      artist: "You!",
      description: "Turn 4 notes into a song.",
      guide: [
        {
          title: "The First Idea",
          notes: ["C4", "E4", "D4", "G4"],
          instruction: "Play these 4 notes. This is your seed."
        },
        {
          title: "The Sequential Variant",
          notes: ["D4", "F4", "E4", "A4"],
          instruction: "Now play the same 'shape' but starting one note higher. You're composing!"
        }
      ]
    }
  },
  { id: 'adv-7', title: 'Transcription Skills', description: 'Writing down what you hear.', skillLevel: SkillLevel.ADVANCED, order: 7, estimatedMinutes: 30, content: [
      { type: 'goal', content: 'Translate sounds from your head or speakers directly into musical notation.' },
      { type: 'text', content: 'Transcription builds the ultimate connection between your ear and your hands. Start with simple melodies and gradually add bass and harmony.' },
      { type: 'checklist', steps: ['Find the key of the song first', 'Listen for the "Bass line"', 'Isolate the melody rhythm', 'Fill in the middle voices'] },
      { type: 'exercise', steps: ['Step 1: Pick a nursery rhyme.', 'Step 2: Find the starting note by trial and error.', 'Step 3: Sketch it out on paper or software.', 'Step 4: Check your accuracy against the real sheet music.'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Ear Trainer",
      artist: "Academy Original",
      description: "Match the melody by ear.",
      guide: [
        {
          title: "The Mystery Note",
          notes: ["G4"],
          instruction: "Find 'G' on your keyboard without looking. Listen to the pitch in your head first."
        },
        {
          title: "The Mystery Interval",
          notes: ["C4", "G4"],
          instruction: "Play C, then guess the second note. It's a 5th higher! Experience the distance."
        }
      ]
    }
  },
  { id: 'adv-8', title: 'Performance Psychology', description: 'Overcoming stage fright.', skillLevel: SkillLevel.ADVANCED, order: 8, estimatedMinutes: 20, content: [
      { type: 'goal', content: 'Develop the mental resilience to perform at your best, even when nervous.' },
      { type: 'text', content: 'Stage fright is a physical reaction. Use visualization, deep breathing, and "mock performances" to train your brain to handle pressure.' },
      { type: 'checklist', steps: ['Controlled breathing', 'Positive visualization', 'Focus on the "story" of the music', 'Routine preparation'] },
      { type: 'exercise', steps: ['Step 1: Set up a camera to record yourself (simulated pressure).', 'Step 2: Perform your piece without stopping for mistakes.', 'Step 3: Analyze the video for areas of tension.'] },
      { type: 'tip', content: 'Mistakes happen to everyone. The professional is the one who keeps playing with a smile.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "The Zen Performance",
      artist: "Academy Original",
      description: "Practice performing under self-imposed pressure.",
      guide: [
        {
          title: "The Deep Breath Press",
          notes: ["C4", "E4", "G4", "C5"],
          instruction: "Inhale, then play this chord as you exhale. Focus only on the sound, not your nerves."
        }
      ]
    }
  },
  { id: 'adv-9', title: 'Mastering the Hanon Exercises', description: 'Peak finger independence.', skillLevel: SkillLevel.ADVANCED, order: 9, estimatedMinutes: 45, content: [
      { type: 'goal', content: 'Build virtuoso-level speed, strength, and agility in all ten fingers.' },
      { type: 'text', content: 'The "Virtuoso Pianist" by Hanon has been the standard for centuries. Focus on high lifting of the fingers and perfectly even rhythm.' },
      { type: 'checklist', steps: ['Relaxed wrists at high speeds', 'Independent finger movement', 'Increasing tempo with a metronome', 'Avoiding fatigue and tension'] },
      { type: 'exercise', steps: ['Step 1: Play Exercise No. 1 slowly at 60bpm.', 'Step 2: Focus on the "weak" fingers (4 and 5).', 'Step 3: Transpose the exercise to different keys.'] },
      { type: 'tip', content: '10 minutes of Hanon daily is more effective than 2 hours once a week.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Hanon No. 1",
      artist: "C.L. Hanon",
      description: "The essential finger strength exercise.",
      guide: [
        {
          title: "Rising Sequence",
          notes: ["C4", "E4", "F4", "G4", "A4", "G4", "F4", "E4"],
          instruction: "Play this pattern starting on C. Keep your fingers high and your touch even."
        },
        {
          title: "The Shift to D",
          notes: ["D4", "F4", "G4", "A4", "B4", "A4", "G4", "F4"],
          instruction: "Repeat the exact same shape starting on D. Continue up the keyboard!"
        }
      ]
    }
  },
  { id: 'adv-10', title: 'Advanced Piece: Chopin Waltz', description: 'Elegant and technical romanticism.', skillLevel: SkillLevel.ADVANCED, order: 10, estimatedMinutes: 60, content: [
      { type: 'goal', content: 'Master the rubato, phrasing, and technical flourishes of the Romantic era.' },
      { type: 'text', content: 'Chopin requires a delicate balance of "solid" left hand rhythm and "free" right hand melody. This is called Rubato.' },
      { type: 'checklist', steps: ['Precise "Oom-pah-pah" LH', 'Flowing RH runs', 'Dynamic "Shading"', 'Grace notes executed lightly'] },
      { type: 'exercise', steps: ['Step 1: Practice the LH alone until it is an automatic pulse.', 'Step 2: Practice the RH chromatic runs slowly.', 'Step 3: Focus on the transitions between sections.'] },
      { type: 'tip', content: 'Listen to recordings by Rubinstein or Horowitz to hear how they handle the phrasing.' }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "Chopin Waltz (Excerpt)",
      artist: "Frédéric Chopin",
      description: "Practice the elegant triplet runs.",
      guide: [
        {
          title: "The Triplet Flourish",
          notes: ["G4", "A4", "B4", "C5", "D5", "E5"],
          instruction: "Play these notes in groups of three very quickly and lightly (Rubato!)."
        },
        {
          title: "The LH Waltz Beat",
          notes: ["C2", "G3", "C4", "E4"],
          instruction: "Root (C2) followed by two quick chords (G-C-E). Oom-pah-pah!"
        }
      ]
    }
  },
  { id: 'adv-11', title: 'AI Song Master: Arrangement', description: 'Using AI to create full covers.', skillLevel: SkillLevel.ADVANCED, order: 11, estimatedMinutes: 30, content: [
      { type: 'goal', content: 'Use AI as a creative partner to create unique arrangements of your favorite songs.' },
      { type: 'text', content: 'Let our AI help you arrange songs. Provide a melody, and the AI can suggest chord substitutions, bass lines, and rhythmic patterns.' },
      { type: 'checklist', steps: ['Select a song melody', 'Choose a desired style (Jazz, Classical, Pop)', 'Review AI chord suggestions', 'Refine the arrangement for physical playability'] },
      { type: 'exercise', steps: ['Step 1: Input "Twinkle Twinkle".', 'Step 2: Ask for a "Lush Jazz" version.', 'Step 3: Analyze the 9th and 13th chords the AI suggests.', 'Step 4: Practice playing the result!'] }
    ],
    quizQuestions: [],
    practiceSong: {
      title: "AI Jazz Twinkle",
      artist: "AI Collaboration",
      description: "A re-harmonized classic.",
      guide: [
        {
          title: "The Jazz Start",
          notes: ["C4", "E4", "G4", "B4"],
          instruction: "Instead of a simple C, play a Cmaj7 for 'Twinkle'. So much more flavor!"
        },
        {
          title: "The Substituted Bridge",
          notes: ["A3", "C4", "E4", "G4"],
          instruction: "Play Am7 instead of F. The AI suggests this to add sophistication."
        }
      ]
    }
  },
];

export const allLessons = [...lessons, ...moreLessons];
// Note: I will only export 'allLessons' and use it in the app.
