export enum Duration {
  Whole = 'w',
  Half = 'h',
  Quarter = 'q',
  Eighth = '8',
}

export interface NoteData {
  id: string;
  keys: string[]; // e.g., ["c/4"]
  duration: Duration;
  isRest?: boolean;
  accidental?: string | null; // '#', 'b', 'n'
  hasStartRepeat?: boolean;
  hasEndRepeat?: boolean;
}

export type SongCategory = 'All' | 'Soundtrack' | 'Classical' | 'Folk' | 'Pop';

export interface SongPreset {
  id: string;
  name: string;
  composer: string;
  category: SongCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  notes: NoteData[];
}

export interface GeminiGeneratedNote {
  key: string;
  octave: number;
  duration: string;
  accidental?: string;
}