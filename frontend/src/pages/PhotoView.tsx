import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Photo, Comment } from '../types';
import { CommentSection } from '../components/CommentSection';
import { Heart, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhotoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // TODO: Implement API calls to fetch photo and comments
    const fetchPhoto = async (id?: string) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found!");
        return;
      }
      try {
        const response = await fetch(`/api/photos/${id}`, {
          method: 'GET',
          headers: {
            // Authorization是属性名，可加引号也可不加，只有属性名中有特殊字符时才必须要加引号
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch photo: ${response.status}`);
        }
        const photo = await response.json();
        console.log("Photo:", photo);
        setPhoto(photo);
      } catch (error) {
        console.error(error);
      }
    };

    // 获取评论
    const fetchComments = async (photoId: string) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found!");
        return;
      }
      try {
        const response = await fetch(`/api/comments/photo/${photoId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
        const comments = await response.json();
        const commentsWithUserName = comments.map(comment => ({
          ...comment,
          userId: comment.user.username
        }));
        console.log(commentsWithUserName);
        setComments(commentsWithUserName);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPhoto(id); // 替换 123 为需要获取的 Photo ID
    if (id) fetchComments(id);
  }, [id]);

  const handleAddComment = async (content: string) => {
    // TODO: Implement add comment functionality

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found!");
      return;
    }

    // // 解码token中的用户id
    // const tokenPayload = token.split('.')[1];
    // const decodedPayload = JSON.parse(atob(tokenPayload));
    // const userId = decodedPayload.id;

    const requestBody = {
      content: content,
      photoId: id,
      userId: user?.id,
    };

    try {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }
      const addedcomment = await response.json();
      console.log(addedcomment.user.username);
      const commentWithUserName = {
        ...addedcomment,
        userId: addedcomment.user.id
      }
      console.log(commentWithUserName)
      setComments(prevcomments => [...prevcomments, commentWithUserName]);
    } catch (error) {
      console.error(error);
    }
  };

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-[600px] object-contain bg-black"
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{photo.title}</h1>
              <div className="flex space-x-4">
                <button className="flex items-center text-gray-600 hover:text-red-600">
                  <Heart className="h-6 w-6 mr-1" />
                  <span>Like</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-indigo-600">
                  <Share2 className="h-6 w-6 mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <CommentSection comments={comments} onAddComment={handleAddComment} />
          </div>
        </div>
      </div>
  );
};