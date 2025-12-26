import React, { useState, useEffect, useCallback } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

interface NotesProps {
  onClose: () => void;
}

const STORAGE_KEY = 'zos-notes';

const Notes: React.FC<NotesProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed);
      if (parsed.length > 0) {
        setSelectedId(parsed[0].id);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find(n => n.id === selectedId);

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: Date.now() }
        : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedId === id) {
      setSelectedId(notes.find(n => n.id !== id)?.id || null);
    }
  }, [notes, selectedId]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`
                p-3 cursor-pointer border-b border-white/5
                ${selectedId === note.id ? 'bg-yellow-600/30' : 'hover:bg-white/5'}
              `}
            >
              <div className="font-medium truncate">{note.title || 'Untitled'}</div>
              <div className="text-xs text-white/50 mt-1 flex justify-between">
                <span className="truncate flex-1">
                  {note.content.substring(0, 30) || 'No content'}
                </span>
                <span className="ml-2 shrink-0">{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* New Note Button */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={createNote}
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition-colors"
          >
            + New Note
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Title */}
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                value={selectedNote.title}
                onChange={e => updateNote(selectedNote.id, { title: e.target.value })}
                placeholder="Note title"
                className="w-full text-xl font-semibold bg-transparent focus:outline-none placeholder:text-white/30"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                <span>Last edited: {new Date(selectedNote.updatedAt).toLocaleString()}</span>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Content */}
            <textarea
              value={selectedNote.content}
              onChange={e => updateNote(selectedNote.id, { content: e.target.value })}
              placeholder="Start writing..."
              className="flex-1 p-4 bg-transparent resize-none focus:outline-none placeholder:text-white/30 font-mono text-sm leading-relaxed"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
