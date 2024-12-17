'use server';
import db from '@/db';

export async function createNote( userId, count ) {
    try {
      const content = await db.content.create({
        data: {
          value: 'I love web programmig'
        }
      })
      const newNote = await db.note.create({
        data: {
          title: `Untitled ${count +1}`,
          contentId: content.id,
          userId: parseInt(userId, 10)
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

export async function currentNotes(userId){
  const notes = await db.note.findMany({
    where: { userId: parseInt(userId, 10) },
    include: {
      content: true,
    },
  });
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

// 노트 삭제 함수
export async function deleteNote(note_id) {
  try {
    // 먼저 Content를 삭제한 뒤 Note를 삭제 (외래 키 관계 때문)
    const note = await db.note.findUnique({
      where: { id: parseInt(note_id) },
    });

    if (!note) throw new Error("Note not found");

    await db.content.delete({
      where: { id: note.contentId },
    });

    await db.note.delete({
      where: { id: parseInt(note_id) },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw new Error("Failed to delete note.");
  }
}

export async function searchNotes(query) {
  try {
    const results = await db.note.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            },
          },
          {
            content: {
              value: {
                contains: query
              },
            },
          },
        ],
      },
      include: {
        content: true, // content 필드도 결과에 포함
      },
    });
    return results
  } catch (error) {
    console.error("Search failed:", error);
    throw new Error("Failed to search notes.");
  }
}

// 프로필 이미지 변경
export async function updateProfileImage(userId, image) {
  try {
    const updatedUser = await db.user.update({
      where: { id: parseInt(userId, 10) }, // userId에 해당하는 사용자 찾기
      data: { profileImage: image }, // profileImage 업데이트
    });

    return updatedUser;
  } catch (error) {
    console.error('Failed to update profile image:', error);
    throw new Error('Failed to update profile image');
  }
}