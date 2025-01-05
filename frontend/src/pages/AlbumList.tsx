import React, { useState, useEffect } from 'react';
import { AlbumCard } from '../components/AlbumCard';
import { Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Album } from '../types';

export const AlbumList: React.FC = () => {
  const { user, isAuthenticated } = useAuth(); // 在组件内部使用 useAuth 获取用户信息
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);

  // Fetch albums when user changes or initially
  useEffect(() => {
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
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          setAlbums(data);
        } catch (error) {
          console.error("Failed to fetch albums:", error);
        }
      };
      fetchAlbums();
    }
  }, [user]); // Re-fetch when user changes

  const handleCreateAlbum = async (album: { title: string; description: string; category: string }) => {
    if (!user || !user.id) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found!");
        return;
      }
      const requestBody = {
        ...album,
        userId: user.id,
      };
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Failed to create album: ${response.status}`);
      }
      const newAlbum: Album = await response.json();
      setAlbums([...albums, newAlbum]);
    } catch (error) {
      console.error("Error creating album:", error);
    }
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

  const handleUpdateAlbum = async (albumId: number, updatedFields: Partial<Album>) => {
    if (!user || !user.id) {
      console.error("User is not logged in.");
      return;
    }

    console.log("Current User ID:", user?.id);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found!");
      return;
    }
    const userId = user.id;
    try {
      console.log(`Updating album with ID: ${albumId}`);
      console.log('Sending PUT request with data:', updatedFields);
      const response = await fetch(`/api/albums/${albumId}/settings?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      const updatedAlbum = await response.json();
      setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
              album.id === updatedAlbum.id ? updatedAlbum : album
          )
      );
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (!isAuthenticated) {
      console.error("User is not authenticated.");
      return;
    }



    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found!");
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      console.log("Deleting album:", albumId, "for user:", userId);

      const response = await fetch(`/api/albums/${albumId}?userId=${userId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumId));
      alert("Album deleted successfully!");
    } catch (error) {
      console.error("Failed to delete album:", error);
      alert("Failed to delete album.");
    }
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
                  onEdit={() => setAlbumToEdit(album)}
                  onDeleteAlbum={handleDeleteAlbum}
                  onUpdateAlbum={handleUpdateAlbum}
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

export default AlbumList;
