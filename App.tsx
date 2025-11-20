import React, { useState, useCallback } from 'react';
import { NoteData, Duration, SongPreset } from './types';
import ScoreCanvas from './components/ScoreCanvas';
import Piano from './components/Piano';
import Controls from './components/Controls';
import LibraryModal from './components/LibraryModal';
import { playMelody } from './services/audioService';
import { FileMusic } from 'lucide-react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(Duration.Quarter);
  const [isRestMode, setRestMode] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [currentSongTitle, setCurrentSongTitle] = useState<string>('');

  const addNote = useCallback((key: string, octave: number, accidental?: string) => {
    const newNote: NoteData = {
      id: Date.now().toString(),
      keys: [`${key}/${octave}`],
      duration: selectedDuration,
      isRest: isRestMode,
      accidental: isRestMode ? undefined : accidental,
    };
    setNotes((prev) => [...prev, newNote]);
  }, [selectedDuration, isRestMode]);

  const handlePianoClick = (key: string, octave: number, accidental?: string) => {
    if (isRestMode) {
      // If rest mode is on, key doesn't matter for pitch, but standard VexFlow rest is usually centered (e.g. b/4)
      const newNote: NoteData = {
        id: Date.now().toString(),
        keys: ['b/4'], // Standard rest position
        duration: selectedDuration,
        isRest: true,
      };
      setNotes((prev) => [...prev, newNote]);
    } else {
      addNote(key, octave, accidental);
    }
  };

  const handleLoadPreset = (preset: SongPreset) => {
    if (notes.length > 0 && !confirm(`Load "${preset.name}"? This will replace your current work.`)) {
      return;
    }
    setNotes(preset.notes);
    setCurrentSongTitle(preset.name);
  };

  const handlePlay = () => {
    playMelody(notes);
  };

  const handleClear = () => {
    if (confirm("Clear all notes?")) {
      setNotes([]);
      setCurrentSongTitle('');
    }
  };

  const handleUndo = () => {
    setNotes((prev) => prev.slice(0, -1));
  };

  const handleAddAiNotes = (newNotes: NoteData[]) => {
    setNotes((prev) => [...prev, ...newNotes]);
    setCurrentSongTitle('AI Composition');
  };

  // Toggle repeat start on the last note
  const handleToggleStartRepeat = () => {
    setNotes((prev) => {
      if (prev.length === 0) return prev;
      const lastNoteIndex = prev.length - 1;
      const updatedNotes = [...prev];
      updatedNotes[lastNoteIndex] = {
        ...updatedNotes[lastNoteIndex],
        hasStartRepeat: !updatedNotes[lastNoteIndex].hasStartRepeat
      };
      return updatedNotes;
    });
  };

  // Toggle repeat end on the last note
  const handleToggleEndRepeat = () => {
    setNotes((prev) => {
      if (prev.length === 0) return prev;
      const lastNoteIndex = prev.length - 1;
      const updatedNotes = [...prev];
      updatedNotes[lastNoteIndex] = {
        ...updatedNotes[lastNoteIndex],
        hasEndRepeat: !updatedNotes[lastNoteIndex].hasEndRepeat
      };
      return updatedNotes;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Header */}
      <header className="bg-ink text-white p-4 shadow-md no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg text-ink">
              <FileMusic size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Maestro</h1>
              <p className="text-xs text-gray-400">Sheet Music Composer</p>
            </div>
          </div>
        </div>
      </header>

      <Controls
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        isRestMode={isRestMode}
        setRestMode={setRestMode}
        onPlay={handlePlay}
        onClear={handleClear}
        onUndo={handleUndo}
        onAddNotes={handleAddAiNotes}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onToggleStartRepeat={handleToggleStartRepeat}
        onToggleEndRepeat={handleToggleEndRepeat}
      />

      {/* Main Workspace */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto print:p-0 print:overflow-visible">
        <div className="max-w-5xl mx-auto print-area">
          <div className="text-center mb-8 hidden print:block">
            <h1 className="text-3xl font-serif font-bold">
              {currentSongTitle || "Musical Score"}
            </h1>
            <p className="text-sm text-gray-500 mt-2">Composed with Maestro</p>
          </div>

          <div className="min-h-[400px] flex flex-col items-center justify-start">
             {notes.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl w-full max-w-2xl no-print">
                 <FileMusic size={48} className="mb-4 opacity-50" />
                 <p className="text-lg font-medium">Your score is empty</p>
                 <p className="text-sm">Use the piano or open the Library to start.</p>
                 <button 
                   onClick={() => setIsLibraryOpen(true)}
                   className="mt-4 text-amber-600 font-semibold hover:underline"
                 >
                   Browse Library
                 </button>
               </div>
             ) : (
                <ScoreCanvas notes={notes} />
             )}
          </div>
        </div>
      </main>

      {/* Footer Piano */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 no-print">
        <Piano onNoteClick={handlePianoClick} />
      </footer>
      
      {/* Spacing for fixed footer */}
      <div className="h-48 no-print" /> 
      
      <LibraryModal 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onLoadSong={handleLoadPreset}
      />
    </div>
  );
};

export default App;