import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types';
import { Image, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface AlbumCardProps {
  album: Album;
  onEdit?: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{album.title}</h3>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{album.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{album.category}</span>
          <span>{format(new Date(album.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
      <Link
        to={`/albums/${album.id}`}
        className="block bg-gray-50 px-4 py-3 text-center text-sm font-medium text-indigo-600 hover:bg-gray-100"
      >
        View Photos
      </Link>
    </div>
  );
};