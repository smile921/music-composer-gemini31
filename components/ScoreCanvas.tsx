import React, { useEffect, useRef } from 'react';
import { 
  StaveNote, 
  Stave, 
  Renderer, 
  Accidental, 
  Barline, 
  Voice, 
  Formatter 
} from 'vexflow';
import { NoteData, Duration } from '../types';

interface ScoreCanvasProps {
  notes: NoteData[];
  keySignature: string;
  suggestedChords?: string[];
}

interface MeasureData {
  notes: StaveNote[];
  startRepeat: boolean;
  endRepeat: boolean;
}

const ScoreCanvas: React.FC<ScoreCanvasProps> = ({ notes, keySignature, suggestedChords = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    containerRef.current.innerHTML = '';

    // Initialize Renderer directly to access resize method reliably
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    
    // Render Logic
    const beatsPerMeasure = 4;
    const noteValueToBeat = (dur: Duration): number => {
      switch (dur) {
        case Duration.Whole: return 4;
        case Duration.Half: return 2;
        case Duration.Quarter: return 1;
        case Duration.Eighth: return 0.5;
        default: return 1;
      }
    };

    let currentMeasureBeats = 0;
    let measures: MeasureData[] = [];
    let currentMeasureNotes: StaveNote[] = [];
    
    let currentMeasureHasStartRepeat = false;
    let currentMeasureHasEndRepeat = false;

    const createVexNote = (n: NoteData): StaveNote => {
      const note = new StaveNote({
        keys: n.keys,
        duration: n.duration + (n.isRest ? 'r' : ''),
        autoStem: true,
        clef: 'treble'
      });
      
      if (n.accidental && !n.isRest) {
        note.addModifier(new Accidental(n.accidental));
      }
      
      return note;
    };

    const pushMeasure = () => {
        measures.push({
            notes: currentMeasureNotes,
            startRepeat: currentMeasureHasStartRepeat,
            endRepeat: currentMeasureHasEndRepeat
        });
        currentMeasureNotes = [];
        currentMeasureBeats = 0;
        currentMeasureHasStartRepeat = false;
        currentMeasureHasEndRepeat = false;
    };

    notes.forEach((n) => {
      const beatValue = noteValueToBeat(n.duration);
      
      if (n.hasStartRepeat) currentMeasureHasStartRepeat = true;
      if (n.hasEndRepeat) currentMeasureHasEndRepeat = true;

      if (currentMeasureBeats + beatValue > beatsPerMeasure) {
         pushMeasure();
         // Re-apply flags to the new measure if the note causing overflow carried them
         // (Simplified logic: Repeat signs stick to the note's measure)
         if (n.hasStartRepeat) currentMeasureHasStartRepeat = true;
         if (n.hasEndRepeat) currentMeasureHasEndRepeat = true;
      }

      try {
        currentMeasureNotes.push(createVexNote(n));
        currentMeasureBeats += beatValue;
      } catch (e) {
        console.error("Invalid note data for VexFlow", n, e);
      }
    });

    if (currentMeasureNotes.length > 0) {
      pushMeasure();
    }

    // If no notes, draw an empty stave
    if (measures.length === 0) {
        const stave = new Stave(10, 40, 300);
        stave.addClef("treble").addTimeSignature("4/4").addKeySignature(keySignature);
        stave.setContext(context).draw();
        renderer.resize(350, 200);
        return;
    }

    // Drawing Layout
    let x = 10;
    let y = 40;
    const measureWidth = 280;
    const stavesPerRow = 3; 
    
    const totalRows = Math.ceil(measures.length / stavesPerRow);
    const height = Math.max(200, totalRows * 150 + 50);
    
    renderer.resize(measureWidth * stavesPerRow + 50, height);

    measures.forEach((measureData, i) => {
      const isFirstInRow = i % stavesPerRow === 0;
      
      if (isFirstInRow && i !== 0) {
        x = 10;
        y += 150;
      }

      const stave = new Stave(x, y, measureWidth);
      
      if (isFirstInRow) {
        stave.addClef("treble").addTimeSignature("4/4");
        stave.addKeySignature(keySignature);
      }

      if (measureData.startRepeat) {
        stave.setBegBarType(Barline.type.REPEAT_BEGIN);
      }
      if (measureData.endRepeat) {
        stave.setEndBarType(Barline.type.REPEAT_END);
      }

      stave.setContext(context).draw();

      // Draw Suggested Chord if available
      if (suggestedChords[i]) {
        context.save();
        context.font = "bold 14px sans-serif";
        context.fillStyle = "#d97706"; // amber-600
        // Position above the stave, slightly offset
        context.fillText(suggestedChords[i], stave.getX() + 10, stave.getY() - 10);
        context.restore();
      }

      if (measureData.notes.length > 0) {
        const voice = new Voice({ numBeats: 4, beatValue: 4 });
        voice.setMode(Voice.Mode.SOFT); 
        voice.addTickables(measureData.notes);

        new Formatter().joinVoices([voice]).format([voice], measureWidth - 50);
        voice.draw(context, stave);
      }

      x += measureWidth;
    });

  }, [notes, keySignature, suggestedChords]);

  return (
    <div className="flex justify-center overflow-x-auto pb-8">
      <div ref={containerRef} className="bg-white shadow-sm border border-gray-200 rounded-sm p-4 print:shadow-none print:border-none print:p-0" />
    </div>
  );
};

export default ScoreCanvas;