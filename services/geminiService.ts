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

export const suggestChords = async (notes: NoteData[], keySignature: string): Promise<string[]> => {
  if (!ai) {
    throw new Error("API Key not found");
  }

  if (notes.length === 0) return [];

  // Helper to convert duration to numerical beat value
  const getBeatValue = (d: Duration) => {
    switch (d) {
      case Duration.Whole: return 4;
      case Duration.Half: return 2;
      case Duration.Quarter: return 1;
      case Duration.Eighth: return 0.5;
      default: return 1;
    }
  };

  // Convert notes to a text representation grouped by measure
  let melodyText = "";
  let currentMeasure = 1;
  let currentBeats = 0;

  notes.forEach(n => {
    const beats = getBeatValue(n.duration);
    if (currentBeats + beats > 4) {
      currentMeasure++;
      currentBeats = 0;
      melodyText += " | ";
    }
    
    const key = n.isRest ? "Rest" : n.keys[0];
    melodyText += `${key}(${n.duration}) `;
    currentBeats += beats;
  });

  const prompt = `
    I have a melody in the key of ${keySignature}.
    The notes are: "${melodyText}".
    
    Please analyze the harmony and suggest a single chord for each measure.
    Return a JSON array of strings, where each string is the chord symbol (e.g., "Cm", "G7", "Fmaj7") for that measure.
    The array length should match the number of measures (${currentMeasure}).
    If a measure has no clear harmony or is just rests, suggest a fitting chord based on the context or 'N.C.'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error suggesting chords:", error);
    throw error;
  }
};

function isValidDuration(d: string): boolean {
  return ['w', 'h', 'q', '8'].includes(d);
}