'use client'

import Sidebar from '@/app/components/sidebar'; // 사이드바 컴포넌트
import Content from '@/app/components/content'; // 콘텐츠 컴포넌트
import Profile from '@/app/components/profile';
import { useParams } from 'next/navigation';
import { useState, useEffect} from 'react';
import { currentNotes, searchNotes } from '@/action';

export default function NotePage() {
  const {id} = useParams()
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState() //initalize state

  const [mode, setMode] = useState(""); // 모드 상태: "searching"
  const [query, setQuery] = useState(''); // 검색어 상태
  const [results, setResults] = useState([]); // 검색 결과 상태

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await currentNotes();  //DB 에 있는 현재 Note 들 다 들고오기
        setNotes(data);
        setNote(data.find(n => n.id === parseInt(id)))
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    }
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
  
  //처음 렌더링될 때 실행된다.
//sidebar 에 notes state 전달
//Content 에 note state 전달
  return (
    <div className="flex">
      { notes.length && <Sidebar notes={notes} setNotes={setNotes} setMode={setMode} /> }
      {mode === "searching" && (
          <div className = "flex-1 p-4">
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
                      className="p-2 mb-2 border rounded hover:bg-gray-100 cursor-pointer"
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
        )}
      {mode === 'profile' && <Profile />}
      {mode !== 'profile' && mode !== "searching"
      && note && <Content note={note} setNotes={setNotes} /> }
    </div>
  );
}
