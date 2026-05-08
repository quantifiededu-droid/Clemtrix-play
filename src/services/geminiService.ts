import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface ChordStep {
  chord: string;
  notes: string[];
  description: string;
  role?: string;
}

export interface MelodyStep {
  phrase: string;
  notes: string[];
  description: string;
}

export interface SongBreakdown {
  songName: string;
  artist: string;
  key: string;
  tempo: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progression: ChordStep[];
  melodySteps: MelodyStep[];
  instructionItems: string[];
}

export async function getSongBreakdown(songTitle: string): Promise<SongBreakdown> {
  const prompt = `Analyze the song "${songTitle}" and provide a deep-dive piano tutorial breakdown. 
  Include the key, tempo, and:
  1. A step-by-step chord progression (triads or extensions) with specific notes and the harmonic role of each chord.
  2. A step-by-step breakdown of the main melody or hook, identifying the notes used.
  3. Clear technical instructions for playing it, focusing on hand positioning and transitions.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an world-class piano teacher. 
      Your task is to provide accurate, pedagogical piano tutorials for any song requested.
      Always use Scientific Pitch Notation (e.g., C4, Eb4, G4).
      Break the song down into logical sections (Verse, Chorus) or by phrase.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          songName: { type: Type.STRING },
          artist: { type: Type.STRING },
          key: { type: Type.STRING },
          tempo: { type: Type.NUMBER },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
          progression: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chord: { type: Type.STRING },
                notes: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                description: { type: Type.STRING, description: "How to play this chord technically" },
                role: { type: Type.STRING, description: "The harmonic role (e.g. Tonic, Dominant) or mood it creates" }
              },
              required: ["chord", "notes", "description", "role"]
            }
          },
          melodySteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phrase: { type: Type.STRING, description: "Small melodic fragment" },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING }
              },
              required: ["phrase", "notes", "description"]
            }
          },
          instructionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["songName", "artist", "key", "tempo", "difficulty", "progression", "melodySteps", "instructionItems"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate song breakdown");
  }

  return JSON.parse(response.text.trim());
}
