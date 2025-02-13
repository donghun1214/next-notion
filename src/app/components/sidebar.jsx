'use client';
import { CiStar } from "react-icons/ci";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createNote, deleteNote, toggleFavorite } from '@/action';

export default function Sidebar({ notes, setNotes, setMode}) {
  const { data: session } = useSession();
  const [currentNoteId, setCurrentNoteId] = useState(null);

  useEffect(() => {
    // window.location.pathname을 사용하여 현재 경로에서 노트 ID 추출
    const path = window.location.pathname;
    const noteId = path.split('/note/')[1]
    setCurrentNoteId(noteId);
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 실행

  const handleDeleteNote = async (id) => {
    try {
      // 노트 삭제 요청
      await deleteNote(id);
      // 삭제 후 notes 상태 업데이트
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note.");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const updatedNote = await toggleFavorite(id);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  const sortedNotes = [...notes].sort((a, b) => b.isFavorite - a.isFavorite);


  const handleCreateNote = async () => {
    try {
      const newNote = await createNote(session.user.id, notes.length);
      setNotes((prevNotes) => [...prevNotes, newNote]);
    } catch (error) {
      console.error(error);
      alert('Failed to create a note.');
    }
  };

  return (
    <div className="bg-gray-50 w-64 min-h-screen p-3 font-sans shadow-md">
      {/* Profile Container */}
      <div className="flex items-center justify-between mb-6">
        <div 
        onClick={() => setMode('profile')}
        className="flex items-center gap-3">
          <Image
            src="/profile.jpg"
            alt="profile"
            className="h-12 w-12 object-cover rounded-full"
            width={48}
            height={48}
          />
          <div className="text-base font-bold text-gray-800">Dong Hun</div>
        </div>
        <svg
          role="graphics-symbol"
          viewBox="0 0 24 24"
          className="w-7 h-7 cursor-pointer text-gray-600"
        >
          <g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"
            />
          </g>
        </svg>
      </div>

      {/* Sidebar Menu */}
      <div>
        <div 
        onClick={() => setMode("searching")}
        className="flex items-center py-2 px-4 mb-2 text-sm font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100">
          <svg viewBox="0 0 20 20" className="w-5 h-5 mr-3 text-gray-600">
            <path d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z" />
          </svg>
          Search
        </div>
        <div className="flex items-center py-2 px-4 mb-2 text-sm font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100">
          <svg viewBox="0 0 20 20" className="w-5 h-5 mr-3 text-gray-600">
            <path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5L7.5 10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499L12.5 15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499L11 10.9999H9L9 15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z" />
          </svg>
          Home
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8">
        <div className="px-4 text-xs font-semibold text-gray-500 mb-2 -ml-4">Private</div>
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`flex items-center justify-start py-2 px-4 mb-2 text-sm font-semibold rounded-md hover:bg-gray-100 ${
              note.id.toString() === currentNoteId ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
          >
            <button onClick={() => handleToggleFavorite(note.id)} className="mr-2">
              {note.isFavorite ? (
                <svg viewBox="0 0 20 20" className="w-5 h-5 text-yellow-500">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.176 0l-3.39 2.46c-.784.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.784-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ) : (
                <CiStar className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
              )}
            </button>
            <Link
              href={`/note/${note.id}`}
              className="flex items-center py-2 px-4 pl-0 mb-2 text-sm font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100"
            >
              {note.title}
            </Link>
            
            <button
              onClick={() => handleDeleteNote(note.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-500"
              >
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* New Note Button */}
        <div
          onClick={() => handleCreateNote()}
          className="flex items-center py-2 px-4 mb-2 text-sm font-semibold text-gray-700 rounded-md cursor-pointer hover:bg-gray-100"
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5 mr-3 text-gray-600">
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1z" />
          </svg>
          New Page
        </div>
      </div>
    </div>
  )}