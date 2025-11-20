import React, { useState } from 'react';
import { Duration, NoteData } from '../types';
import { Music2, Play, Trash2, Printer, Eraser, Mic, Loader2, BookOpen, Repeat } from 'lucide-react';
import { generateMelody } from '../services/geminiService';

interface ControlsProps {
  selectedDuration: Duration;
  setSelectedDuration: (d: Duration) => void;
  isRestMode: boolean;
  setRestMode: (b: boolean) => void;
  onPlay: () => void;
  onClear: () => void;
  onUndo: () => void;
  onAddNotes: (notes: NoteData[]) => void;
  onOpenLibrary: () => void;
  onToggleStartRepeat: () => void;
  onToggleEndRepeat: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  selectedDuration,
  setSelectedDuration,
  isRestMode,
  setRestMode,
  onPlay,
  onClear,
  onUndo,
  onAddNotes,
  onOpenLibrary,
  onToggleStartRepeat,
  onToggleEndRepeat
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const notes = await generateMelody(aiPrompt);
      onAddNotes(notes);
      setShowAiModal(false);
      setAiPrompt('');
    } catch (e) {
      alert('Failed to generate melody. Please check your API Key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const DurationButton = ({ d, label }: { d: Duration, label: string }) => (
    <button
      onClick={() => setSelectedDuration(d)}
      className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border transition-all ${
        selectedDuration === d 
          ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-inner' 
          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
      }`}
    >
      <span className="text-xl font-music font-serif italic">{label}</span>
      <span className="text-[10px] uppercase font-bold mt-1">{d}</span>
    </button>
  );

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30 shadow-sm no-print">
      
      {/* Left: Note Entry Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <DurationButton d={Duration.Whole} label="𝅝" />
          <DurationButton d={Duration.Half} label="𝅗𝅥" />
          <DurationButton d={Duration.Quarter} label="𝅘𝅥" />
          <DurationButton d={Duration.Eighth} label="𝅘𝅥𝅮" />
        </div>

        <button
          onClick={() => setRestMode(!isRestMode)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            isRestMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">𝄄</span> {isRestMode ? 'Rest Mode ON' : 'Rest'}
        </button>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        {/* Repeat Controls */}
        <div className="flex items-center gap-1 mr-2 border-r border-gray-200 pr-2">
           <button onClick={onToggleStartRepeat} className="p-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg font-bold font-serif text-lg" title="Start Repeat">
             ||:
           </button>
           <button onClick={onToggleEndRepeat} className="p-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg font-bold font-serif text-lg" title="End Repeat">
             :||
           </button>
        </div>

        <button onClick={onOpenLibrary} className="px-3 py-2 text-gray-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg flex items-center gap-2 transition-colors" title="Open Library">
           <BookOpen size={18} />
           <span className="hidden sm:inline">Library</span>
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <button onClick={onUndo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" title="Undo Last Note">
          <Eraser size={20} />
        </button>
        <button onClick={onClear} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Clear Score">
          <Trash2 size={20} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <button 
          onClick={() => setShowAiModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Music2 size={18} />
          <span>AI Compose</span>
        </button>
      </div>

      {/* Right: Play & Print */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onPlay}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Play size={18} fill="currentColor" />
          <span>Play</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full border border-gray-200 shadow-sm"
          title="Print Score"
        >
          <Printer size={18} />
          <span className="hidden sm:inline">Print</span>
        </button>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Music2 className="text-purple-600" />
              AI Composer
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Describe the melody you want (e.g., "A sad tune in D minor" or "An energetic rising scale").
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-32"
              placeholder="Enter description..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAiModal(false)} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button 
                onClick={handleAiGenerate} 
                disabled={isGenerating || !aiPrompt}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating && <Loader2 className="animate-spin" size={16} />}
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;