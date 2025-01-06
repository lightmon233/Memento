import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface CommentSectionProps {
    comments: Comment[];
    onAddComment: (content: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
                                                                  comments,
                                                                  onAddComment,
                                                              }) => {
    const [newComment, setNewComment] = useState('');
    const { isAuthenticated } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await onAddComment(newComment);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="mb-6">
          <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Add a comment..."
              rows={3}
          />
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Post Comment
                    </button>
                </form>
            )}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{comment.user.username}</span>
                            <span className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
              </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};