import React, { useState, useMemo } from 'react';
import { PRESETS } from '../constants';
import { SongPreset, SongCategory } from '../types';
import { Search, Music, X, BookOpen } from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSong: (song: SongPreset) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, onLoadSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SongCategory>('All');

  const categories: SongCategory[] = ['All', 'Classical', 'Soundtrack', 'Folk', 'Pop'];

  const filteredSongs = useMemo(() => {
    return PRESETS.filter(song => {
      const matchesSearch = 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        song.composer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl flex flex-col max-h-[85vh] shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Sheet Music Library</h2>
              <p className="text-sm text-gray-500">Select a piece to start editing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 pb-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or composer..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Song List */}
        <div className="overflow-y-auto flex-1 p-6 pt-2">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Music size={48} className="mx-auto mb-3 opacity-20" />
              <p>No songs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredSongs.map(song => (
                <button
                  key={song.id}
                  onClick={() => {
                    onLoadSong(song);
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-amber-300 hover:bg-amber-50 transition-all group text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-3 rounded-md group-hover:bg-white transition-colors">
                      <Music size={20} className="text-gray-500 group-hover:text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-amber-900">{song.name}</h3>
                      <p className="text-sm text-gray-500">{song.composer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                       song.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                       song.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                       'bg-red-100 text-red-700'
                     }`}>
                       {song.difficulty}
                     </span>
                     <span className="text-xs text-gray-400 hidden sm:block">{song.notes.length} notes</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl text-center text-xs text-gray-400">
           Select a song to load it onto the staff. Current work will be replaced.
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;