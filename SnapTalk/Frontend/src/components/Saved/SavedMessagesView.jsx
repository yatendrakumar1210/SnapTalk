import React, { useState } from 'react';
import { Bookmark, Send, Copy, Trash2, Check } from 'lucide-react';

const SavedMessagesView = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('snaptalk_saved_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Welcome to your Saved Messages space! Store personal notes, links, and code snippets here.', date: new Date().toISOString() }
    ];
  });
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      text: input.trim(),
      date: new Date().toISOString()
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('snaptalk_saved_notes', JSON.stringify(updated));
    setInput('');
  };

  const handleDelete = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('snaptalk_saved_notes', JSON.stringify(updated));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Saved Messages</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Personal cloud storage for notes & links</p>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleAddNote} className="mb-4">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Save a note or link..."
            className="flex-1 bg-transparent px-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <button type="submit" className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {notes.map(n => (
          <div key={n.id} className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <p className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{n.text}</p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-[10px] text-gray-400">
                {new Date(n.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleCopy(n.text, n.id)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Copy Text"
                >
                  {copiedId === n.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SavedMessagesView;
