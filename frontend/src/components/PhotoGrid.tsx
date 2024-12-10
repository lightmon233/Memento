import React from 'react';
import { Photo } from '../types';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onDeletePhoto: (photoId: number) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, onDeletePhoto }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group cursor-pointer"
          onClick={() => onPhotoClick(photo)}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="text-white text-center">
              <h3 className="text-lg font-semibold mb-2">{photo.title}</h3>
              <div className="flex items-center justify-center space-x-4">
                <span className="flex items-center">
                  <Heart className="h-5 w-5 mr-1" />
                  <span>123</span>
                </span>
                <span className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span>45</span>
                </span>
              </div>
            </div>
          </div>
          {/* 添加删除按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              onDeletePhoto(photo.id);
            }}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
          >
            <Trash2 className="h-5 w-5"/>
          </button>
        </div>
      ))}
    </div>
  );
};