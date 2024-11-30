'use client'

import Sidebar from '@/app/components/sidebar'; // 사이드바 컴포넌트
import Content from '@/app/components/content'; // 콘텐츠 컴포넌트
import { useParams } from 'next/navigation';
import { useState, useEffect} from 'react';
import { currentNotes } from '@/action';

export default function NotePage() {
  const {id} = useParams()
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState() //initalize state

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
  }, []); //처음 렌더링될 때 실행된다.
//sidebar 에 notes state 전달
//Content 에 note state 전달
  return (
    <div className="flex">
      { notes.length && <Sidebar notes={notes}/> }
      { note && <Content note={note} setNotes={setNotes} /> }
    </div>
  );
}
