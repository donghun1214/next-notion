'use server';

import db from '@/db';

export async function createNote( count ) {
    try {
      const content = await db.content.create({
        data: {
          value: 'hello'
        }
      })
      const newNote = await db.note.create({
        data: {
          title: `Untitled ${count +1}`,
          contentId: content.id
        }
      })

      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw new Error('Failed to create note');
    }
}

export async function updateTitle(note_id, changedTitle) 
{
  try {
    const res = await db.note.update({
      where: { id: parseInt(note_id) },
      data: { title: changedTitle },
    }); 
    return res
  } catch (error) {
    console.error("Failed to update title:", error);
    throw new Error("Failed to update title");
  }
}

export async function updateContent(content_id, newContent) {
  try {
    const res = await db.content.update({
      where: { id: parseInt(content_id) }, // note_id 로 content table 접근
      data: { value: newContent }, 
    });
    return res
  } catch (error) {
    console.error("Failed to update content:", error);
    throw new Error("Failed to update content");
  }
}

export async function findOneNote(note_id){
  const note = await db.note.findUnique({
    where: { id: parseInt(note_id,10) }
  });
  return note;
}

export async function currentNotes(){
  const notes = await db.note.findMany({
    include: {
      content: true
    }
  })
  return notes
}

// 회원가입 함수
export async function registerUser(username, password) {
  try {
    const user = await db.user.create({
      data: { username, password },
    });
    return user;
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Failed to register user.");
  }
}

// 로그인 함수
export async function loginUser(username, password) {
  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Failed to login.");
  }
}
