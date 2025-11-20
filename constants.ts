import { Duration, SongPreset } from './types';

export const KEY_SIGNATURES = [
  'C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Am', 'Em', 'Dm'
];

export const PRESETS: SongPreset[] = [
  {
    id: 'got-theme',
    name: "Game of Thrones Theme",
    composer: "Ramin Djawadi",
    category: "Soundtrack",
    difficulty: "Medium",
    keySignature: 'C',
    tempo: 90,
    notes: [
      { id: '1', keys: ['g/4'], duration: Duration.Half },
      { id: '2', keys: ['c/4'], duration: Duration.Half },
      { id: '3', keys: ['e/4'], duration: Duration.Eighth, accidental: 'b' },
      { id: '4', keys: ['f/4'], duration: Duration.Eighth },
      { id: '5', keys: ['g/4'], duration: Duration.Half },
      { id: '6', keys: ['c/4'], duration: Duration.Half },
      { id: '7', keys: ['e/4'], duration: Duration.Eighth, accidental: 'b' },
      { id: '8', keys: ['f/4'], duration: Duration.Eighth },
      { id: '9', keys: ['d/4'], duration: Duration.Half },
      // Riff repeats lower
      { id: '10', keys: ['g/3'], duration: Duration.Half },
      { id: '11', keys: ['c/3'], duration: Duration.Half },
      { id: '12', keys: ['e/3'], duration: Duration.Eighth, accidental: 'b' },
      { id: '13', keys: ['f/3'], duration: Duration.Eighth },
      { id: '14', keys: ['g/3'], duration: Duration.Half },
      { id: '15', keys: ['c/3'], duration: Duration.Half },
      { id: '16', keys: ['e/3'], duration: Duration.Eighth, accidental: 'b' },
      { id: '17', keys: ['f/3'], duration: Duration.Eighth },
      { id: '18', keys: ['d/3'], duration: Duration.Half },
    ]
  },
  {
    id: 'twinkle',
    name: "Twinkle Twinkle Little Star",
    composer: "Traditional",
    category: "Folk",
    difficulty: "Easy",
    keySignature: 'C',
    tempo: 100,
    notes: [
      { id: '1', keys: ['c/4'], duration: Duration.Quarter },
      { id: '2', keys: ['c/4'], duration: Duration.Quarter },
      { id: '3', keys: ['g/4'], duration: Duration.Quarter },
      { id: '4', keys: ['g/4'], duration: Duration.Quarter },
      { id: '5', keys: ['a/4'], duration: Duration.Quarter },
      { id: '6', keys: ['a/4'], duration: Duration.Quarter },
      { id: '7', keys: ['g/4'], duration: Duration.Half },
      { id: '8', keys: ['f/4'], duration: Duration.Quarter },
      { id: '9', keys: ['f/4'], duration: Duration.Quarter },
      { id: '10', keys: ['e/4'], duration: Duration.Quarter },
      { id: '11', keys: ['e/4'], duration: Duration.Quarter },
      { id: '12', keys: ['d/4'], duration: Duration.Quarter },
      { id: '13', keys: ['d/4'], duration: Duration.Quarter },
      { id: '14', keys: ['c/4'], duration: Duration.Half },
    ]
  },
  {
    id: 'ode-to-joy',
    name: "Ode to Joy",
    composer: "Ludwig van Beethoven",
    category: "Classical",
    difficulty: "Easy",
    keySignature: 'C',
    tempo: 120,
    notes: [
      { id: '1', keys: ['e/4'], duration: Duration.Quarter },
      { id: '2', keys: ['e/4'], duration: Duration.Quarter },
      { id: '3', keys: ['f/4'], duration: Duration.Quarter },
      { id: '4', keys: ['g/4'], duration: Duration.Quarter },
      { id: '5', keys: ['g/4'], duration: Duration.Quarter },
      { id: '6', keys: ['f/4'], duration: Duration.Quarter },
      { id: '7', keys: ['e/4'], duration: Duration.Quarter },
      { id: '8', keys: ['d/4'], duration: Duration.Quarter },
      { id: '9', keys: ['c/4'], duration: Duration.Quarter },
      { id: '10', keys: ['c/4'], duration: Duration.Quarter },
      { id: '11', keys: ['d/4'], duration: Duration.Quarter },
      { id: '12', keys: ['e/4'], duration: Duration.Quarter },
      { id: '13', keys: ['e/4'], duration: Duration.Quarter }, 
      { id: '14', keys: ['d/4'], duration: Duration.Eighth },
      { id: '15', keys: ['d/4'], duration: Duration.Half },
    ]
  },
  {
    id: 'fur-elise',
    name: "Fur Elise (Theme)",
    composer: "Ludwig van Beethoven",
    category: "Classical",
    difficulty: "Medium",
    keySignature: 'Am',
    tempo: 140,
    notes: [
      { id: '1', keys: ['e/5'], duration: Duration.Eighth },
      { id: '2', keys: ['d/5'], duration: Duration.Eighth, accidental: '#' },
      { id: '3', keys: ['e/5'], duration: Duration.Eighth },
      { id: '4', keys: ['d/5'], duration: Duration.Eighth, accidental: '#' },
      { id: '5', keys: ['e/5'], duration: Duration.Eighth },
      { id: '6', keys: ['b/4'], duration: Duration.Eighth },
      { id: '7', keys: ['d/5'], duration: Duration.Eighth },
      { id: '8', keys: ['c/5'], duration: Duration.Eighth },
      { id: '9', keys: ['a/4'], duration: Duration.Half },
    ]
  }
];

export const NOTES = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
export const OCTAVES = [3, 4, 5];