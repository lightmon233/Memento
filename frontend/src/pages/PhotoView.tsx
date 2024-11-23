import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Photo, Comment } from '../types';
import { CommentSection } from '../components/CommentSection';
import { Heart, Share2 } from 'lucide-react';

export const PhotoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // TODO: Implement API calls to fetch photo and comments
    const fetchPhotoUrl = async (id?: string) => {
      try {
        const response = await fetch(`/api/photos/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch photo: ${response.status}`);
        }
        const photoUrl = await response.text(); // 因为返回的是一个字符串（URL）
        console.log("Photo URL:", photoUrl);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchPhotoUrl(id); // 替换 123 为需要获取的 Photo ID
  }, [id]);

  const handleAddComment = async (content: string) => {
    // TODO: Implement add comment functionality
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