import { NoteData, Duration } from '../types';

// Frequency map for C3 to B5
const getFrequency = (key: string, accidental?: string | null): number => {
  const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const [noteName, octaveStr] = key.split('/');
  let octave = parseInt(octaveStr, 10);

  let index = notes.indexOf(noteName.toLowerCase());
  
  if (accidental === '#') index += 1;
  if (accidental === 'b') index -= 1;

  // Handle wrap around
  if (index < 0) {
    index += 12;
    octave -= 1;
  } else if (index >= 12) {
    index -= 12;
    octave += 1;
  }

  // A4 = 440Hz. A4 is index 9 in octave 4.
  // MIDI Number calculation: (octave + 1) * 12 + index
  const semitonesFromA4 = ((octave * 12) + index) - ((4 * 12) + 9);
  return 440 * Math.pow(2, semitonesFromA4 / 12);
};

const getDurationInSeconds = (duration: Duration): number => {
  const bpm = 100;
  const beatLength = 60 / bpm; // Quarter note length
  switch (duration) {
    case Duration.Whole: return beatLength * 4;
    case Duration.Half: return beatLength * 2;
    case Duration.Quarter: return beatLength;
    case Duration.Eighth: return beatLength / 2;
    default: return beatLength;
  }
};

export const playMelody = async (notes: NoteData[]) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  let currentTime = ctx.currentTime;

  notes.forEach(note => {
    if (note.isRest) {
      currentTime += getDurationInSeconds(note.duration);
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = getFrequency(note.keys[0], note.accidental);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const noteDuration = getDurationInSeconds(note.duration);

    oscillator.start(currentTime);
    
    // Envelope to avoid clicking
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.5, currentTime + noteDuration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + noteDuration);

    oscillator.stop(currentTime + noteDuration);

    currentTime += noteDuration;
  });
};
