import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoGrid } from '../components/PhotoGrid';
import { Photo } from '../types';
import { Plus } from 'lucide-react';

export const PhotoGridView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [albumName, setAlbumName] = useState<string>('');

  useEffect(() => {
    // 获取相册信息
    const fetchAlbumInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found!");
        return;
      }
      try {
        const response = await fetch(`/api/albums/${id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const albumData = await response.json();
        setAlbumName(albumData.title);
      } catch (error) {
        console.error("Failed to fetch album info:", error);
      }
    }
    // Fetch photos for the album by album ID
    const fetchPhotos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found!");
        return;
      }
      try {
        const response = await fetch(`/api/photos/album/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

    fetchAlbumInfo();
    fetchPhotos();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("albumId", id!);
    formData.append("title", file.name); // 将文件名作为title传递

    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(`/api/photos`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const newPhoto = await response.json();
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload photo:", error);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    console.log("Photo clicked:", photo);
    navigate(`/photos/${photo.id}`);
  }

  const handleDeletePhoto = async (photoId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
      alert("Photo deleted successfully!");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Failed to delete photo.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Photos in Album {albumName || id}</h1>
        <div>
          <label
            htmlFor="photoUpload"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="h-5 w-5 mr-2" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </label>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <PhotoGrid
        photos={photos}
        onPhotoClick={handlePhotoClick}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};
