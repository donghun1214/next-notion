'use client';

import { useState, useEffect } from 'react';
import { searchNotes, currentNotes } from '@/action';
import Sidebar from '../components/sidebar'; // Sidebar 컴포넌트 import

export default function SearchPage() {
    const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await currentNotes();
      setNotes(fetchedNotes);
    };
    fetchNotes();
  }, []);

  const handleSearch = async () => {
    try {
      const s_notes = await searchNotes(query);
      setResults(s_notes);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search notes.');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar notes={notes} setNotes={setNotes} />

      {/* Content Area */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Search Notes</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="mt-2 p-2 bg-black text-white rounded"
          >
            Search
          </button>
        </div>
        <div>
          {results.length > 0 ? (
            <ul>
              {results.map((note) => (
                <li
                  key={note.id}
                  className="p-2 mb-2 border rounded hover:bg-gray-100"
                >
                  <a href={`/note/${note.id}`} className="text-blue-600">
                    {note.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
