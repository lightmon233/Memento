import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PhotoGrid } from '../components/PhotoGrid';
import { Photo } from '../types';

export const PhotoGridView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch photos for the album by album ID
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/albums/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Photos in Album {id}</h1>
      <div className="mb-4">
        <label
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
          htmlFor="photoUpload"
        >
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
      <PhotoGrid
        photos={photos}
        onPhotoClick={(photo) => {
          console.log("Photo clicked:", photo);
          // Add any additional logic for clicking a photo
        }}
      />
    </div>
  );
};
