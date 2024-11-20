import React, { useState, useEffect } from 'react';
import { Album } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export const AlbumList: React.FC = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);

  useEffect(() => {
    // Fetch albums from API
    console.log(user);
    if (user && user.id) {
      const fetchAlbums = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found!");
          return;
        }
        try {
          const response = await fetch(`/api/albums/user/${user.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
          setAlbums(data);
        } catch (error) {
          console.error("Failed to fetch albums:", error);
        }
      };
      fetchAlbums();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your albums.</p>
  }

  const handleCreateAlbum = async (album: { title: string; description: string; category: string }) => {
    // Make API call to create album
    const response = await fetch('/api/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(album),
    });
    const newAlbum = await response.json();
    setAlbums([...albums, newAlbum]); // Add the new album to the state
  };

  const handleEditAlbum = async (album: { title: string; description: string; category: string }) => {
    if (albumToEdit) {
      const response = await fetch(`/api/albums/${albumToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(album),
      });
      const updatedAlbum = await response.json();
      setAlbums(albums.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a)));
    }
  };

  const handleOpenEditModal = (album: Album) => {
    setAlbumToEdit(album);
    setShowCreateModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Albums</h1>
        <button
          onClick={() => {
            setAlbumToEdit(null); // Reset any album being edited
            setShowCreateModal(true);
          }}
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
            onEdit={() => handleOpenEditModal(album)}
          />
        ))}
      </div>

      {/* Modal for create/edit album */}
      <Modal
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={albumToEdit ? handleEditAlbum : handleCreateAlbum}
        album={albumToEdit ? { title: albumToEdit.title, description: albumToEdit.description, category: albumToEdit.category } : undefined}
      />
    </div>
  );
};
