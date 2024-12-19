import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment } from '../types';
import { Edit, Trash } from 'lucide-react';

export const AdminCommentList: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    // 获取所有评论
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('/api/comments');
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    // 删除评论
    const handleDeleteComment = async (commentId: number) => {
        try {
            await axios.delete(`/api/comments/${commentId}`);
            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-4">Comment Management</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment Content
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {comments.map((comment) => (
                    <tr key={comment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {comment.content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
