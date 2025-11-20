import React from 'react';
import { OCTAVES } from '../constants';

interface PianoProps {
  onNoteClick: (key: string, octave: number, accidental?: string) => void;
}

const Piano: React.FC<PianoProps> = ({ onNoteClick }) => {
  const renderKey = (note: string, octave: number, isBlack: boolean, leftOffset: number) => {
    const keyId = `${note}/${octave}`;
    
    if (isBlack) {
      return (
        <button
          key={keyId + '-sharp'}
          onClick={() => onNoteClick(note, octave, '#')}
          className="absolute w-8 h-24 bg-ink hover:bg-gray-700 rounded-b-md z-10 border border-black shadow-md active:bg-black active:scale-95 transition-transform"
          style={{ left: `${leftOffset}px` }}
        >
          <span className="absolute bottom-2 w-full text-center text-[10px] text-white pointer-events-none">{note}#{octave}</span>
        </button>
      );
    }

    return (
      <button
        key={keyId}
        onClick={() => onNoteClick(note, octave)}
        className="relative w-12 h-40 bg-white hover:bg-gray-50 border border-gray-300 rounded-b-md z-0 shadow-sm active:bg-gray-200 active:scale-95 transition-transform flex items-end justify-center pb-2"
      >
        <span className="text-xs text-gray-400 font-semibold">{note.toUpperCase()}{octave}</span>
      </button>
    );
  };

  // Generate keyboard layout
  const keys = [];
  let xPos = 0;
  const whiteKeyWidth = 48; // w-12 is 3rem = 48px

  // We will render octaves
  for (const octave of OCTAVES) {
    // C
    keys.push(renderKey('c', octave, false, 0));
    keys.push(renderKey('c', octave, true, xPos + 32)); // C#
    xPos += whiteKeyWidth;
    
    // D
    keys.push(renderKey('d', octave, false, 0));
    keys.push(renderKey('d', octave, true, xPos + 32)); // D#
    xPos += whiteKeyWidth;

    // E
    keys.push(renderKey('e', octave, false, 0));
    xPos += whiteKeyWidth;

    // F
    keys.push(renderKey('f', octave, false, 0));
    keys.push(renderKey('f', octave, true, xPos + 32)); // F#
    xPos += whiteKeyWidth;

    // G
    keys.push(renderKey('g', octave, false, 0));
    keys.push(renderKey('g', octave, true, xPos + 32)); // G#
    xPos += whiteKeyWidth;

    // A
    keys.push(renderKey('a', octave, false, 0));
    keys.push(renderKey('a', octave, true, xPos + 32)); // A#
    xPos += whiteKeyWidth;

    // B
    keys.push(renderKey('b', octave, false, 0));
    xPos += whiteKeyWidth;
  }

  return (
    <div className="relative h-44 overflow-x-auto flex select-none bg-gray-800 p-2 rounded-t-lg border-t-4 border-amber-600 shadow-2xl">
      <div className="flex relative">
         {keys}
      </div>
    </div>
  );
};

export default Piano;
