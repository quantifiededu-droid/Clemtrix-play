import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface ChordStep {
  chord: string;
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
  instructionItems: string[];
}

export async function getSongBreakdown(songTitle: string): Promise<SongBreakdown> {
  const prompt = `Analyze the song "${songTitle}" and provide a piano tutorial breakdown. 
  Include the key, tempo, and a step-by-step chord progression with specific notes (e.g., C4, E4, G4).
  Provide a list of clear technical instructions for playing it.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert piano teacher and music theorist. 
      Your task is to provide accurate piano tutorials for any song requested.
      Ensure the notes provided are in Scientific Pitch Notation (e.g., C4 for Middle C).
      The harmonic analysis should be simplified for piano learning but remain musically accurate.`,
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
                  items: { type: Type.STRING },
                  description: "Notes in scientific pitch notation like C4, G4"
                },
                description: { type: Type.STRING }
              },
              required: ["chord", "notes", "description"]
            }
          },
          instructionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["songName", "artist", "key", "tempo", "difficulty", "progression", "instructionItems"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate song breakdown");
  }

  return JSON.parse(response.text.trim());
}
