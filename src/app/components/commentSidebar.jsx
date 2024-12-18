'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createComment, deleteComment, getComments } from '@/action';

export default function CommentSidebar({ noteId, isOpen, onClose }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    try {
      const comments = await getComments(noteId);
      setComments(comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await createComment(noteId, session.user.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment} className="mt-2 p-2 bg-blue-500 text-white rounded">Add Comment</button>
        </div>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                {comment.userId === session.user.id && (
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:text-red-700">Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}