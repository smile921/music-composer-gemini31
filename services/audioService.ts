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

const getDurationInSeconds = (duration: Duration, bpm: number): number => {
  const beatLength = 60 / bpm; // Quarter note length
  switch (duration) {
    case Duration.Whole: return beatLength * 4;
    case Duration.Half: return beatLength * 2;
    case Duration.Quarter: return beatLength;
    case Duration.Eighth: return beatLength / 2;
    default: return beatLength;
  }
};

// Metronome State
let metronomeContext: AudioContext | null = null;
let metronomeInterval: number | null = null;

export const startMetronome = (bpm: number) => {
  if (metronomeContext) stopMetronome();
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  metronomeContext = new AudioContext();
  let nextNoteTime = metronomeContext.currentTime;
  const beatLength = 60 / bpm;

  const scheduleClick = (time: number) => {
    if (!metronomeContext) return;
    const osc = metronomeContext.createOscillator();
    const gain = metronomeContext.createGain();
    
    osc.connect(gain);
    gain.connect(metronomeContext.destination);
    
    osc.frequency.value = 1000; // High click
    gain.gain.value = 0.5;
    
    osc.start(time);
    osc.stop(time + 0.05);
    
    // Decay
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  };

  // Lookahead scheduling
  const lookahead = 25.0; // ms
  const scheduleAheadTime = 0.1; // s

  metronomeInterval = window.setInterval(() => {
    if (!metronomeContext) return;
    while (nextNoteTime < metronomeContext.currentTime + scheduleAheadTime) {
      scheduleClick(nextNoteTime);
      nextNoteTime += beatLength;
    }
  }, lookahead);
};

export const stopMetronome = () => {
  if (metronomeInterval !== null) {
    window.clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
  if (metronomeContext) {
    metronomeContext.close();
    metronomeContext = null;
  }
};

export const playMelody = async (notes: NoteData[], bpm: number, withMetronome: boolean = false) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  let currentTime = ctx.currentTime;
  let startTime = currentTime; // Mark start for metronome calculation

  // Play notes
  notes.forEach(note => {
    const noteDuration = getDurationInSeconds(note.duration, bpm);

    if (!note.isRest) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = getFrequency(note.keys[0], note.accidental);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(currentTime);
      
      // Envelope
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.5, currentTime + noteDuration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + noteDuration);

      oscillator.stop(currentTime + noteDuration);
    }

    currentTime += noteDuration;
  });

  // Schedule Metronome Clicks if requested
  if (withMetronome) {
    const beatLength = 60 / bpm;
    const totalDuration = currentTime - startTime;
    let clickTime = startTime;
    
    while (clickTime < startTime + totalDuration + 0.1) { // +0.1 to catch final beat
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = 1000;
      gain.gain.value = 0.3; // Slightly quieter than melody
      
      osc.start(clickTime);
      osc.stop(clickTime + 0.05);
      
      gain.gain.setValueAtTime(0.3, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);
      
      clickTime += beatLength;
    }
  }
};