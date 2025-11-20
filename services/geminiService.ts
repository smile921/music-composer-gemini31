import { GoogleGenAI, Type } from "@google/genai";
import { Duration, NoteData } from '../types';

const apiKey = process.env.API_KEY || '';

// Safe initialization
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateMelody = async (description: string): Promise<NoteData[]> => {
  if (!ai) {
    throw new Error("API Key not found");
  }

  const prompt = `Create a simple melody based on this description: "${description}". 
  Return only an array of notes. Keep it simple (single notes, no chords). 
  Use keys like 'c', 'd', 'e', 'f', 'g', 'a', 'b'.
  Use octaves 3, 4, or 5.
  Use durations: 'w' (whole), 'h' (half), 'q' (quarter), '8' (eighth).
  If an accidental is needed, use '#' for sharp or 'b' for flat.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING },
              octave: { type: Type.INTEGER },
              duration: { type: Type.STRING },
              accidental: { type: Type.STRING, nullable: true },
            },
            required: ["key", "octave", "duration"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const rawNotes = JSON.parse(jsonText);

    return rawNotes.map((n: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      keys: [`${n.key.toLowerCase()}/${n.octave}`],
      duration: isValidDuration(n.duration) ? n.duration : Duration.Quarter,
      accidental: n.accidental || undefined
    }));
  } catch (error) {
    console.error("Error generating melody:", error);
    throw error;
  }
};

function isValidDuration(d: string): boolean {
  return ['w', 'h', 'q', '8'].includes(d);
}
