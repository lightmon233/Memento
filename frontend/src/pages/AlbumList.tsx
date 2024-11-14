import React, { useState } from 'react';
import { Album } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { Plus } from 'lucide-react';

export const AlbumList: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // TODO: Implement API calls and modal functionality

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Albums</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Album
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onEdit={() => {/* TODO: Implement edit functionality */}}
          />
        ))}
      </div>
      {/* TODO: Add create/edit album modal */}
    </div>
  );
};