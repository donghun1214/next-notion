'use client';

import { useState } from 'react';
import { updateTitle, updateContent } from '@/action';
import { useParams } from 'next/navigation';
import Mdxeditor from '@/app/components/MdxEditor';

export default function Content({ note, setNotes }) {
  const { id } = useParams()
  const contentId = note.content.id
  // title 과 content 를 state 로 다루자.
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note?.content?.value ?? "");  
  
  // 제목 업데이트 : 즉시 서버 반영하도록
  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);

    try {
      const note = await updateTitle(id, newTitle);
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === note.id ? { ...n, title: newTitle } : n))
      );
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  // 내용 업데이트 : 즉시 서버 반영하도록
  const handleContentChange = async (newContent) => {
    setContent(newContent); 

    try {
      await updateContent(contentId, newContent);  //DB 반영
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };
  //onChange 기능을 통해 바뀔때마다 handleChange 함수가 실행되도록.
  return (
    <div className="flex flex-col p-4 w-full mt-20 ml-10">
      <input
        className="text-4xl font-bold focus:outline mb-8 w-3/4"
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <div className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-300 mec">
        <Mdxeditor
          markdown={content}
          onChange={handleContentChange}
          id={contentId}
        />
      </div>
    </div>
  );
}