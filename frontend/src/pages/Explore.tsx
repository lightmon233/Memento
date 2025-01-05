import React, { useState, useEffect } from 'react';
import { AlbumCard } from '../components/AlbumCard';  // Import the AlbumCard component
import { Album } from '../types'; // Assuming you have an Album type defined

export const Explore = () => {
    // State to hold the list of albums
    const [albums, setAlbums] = useState<Album[]>([]);

    // Fetch albums from a data source (could be an API or mock data)
    useEffect(() => {
        // Mock fetch request (replace with actual fetch from an API)
        const fetchAlbums = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found!");
                return;
            }
            try {
                const response = await fetch('/api/albums/public', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }); // Adjust the URL as needed
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setAlbums(data);
            } catch (error) {
                console.error("Failed to fetch public albums:", error);
            }
        };

        fetchAlbums();
    }, []);

    // Handler for editing an album (can be used for a modal or form to edit)
    const handleEditAlbum = (albumId: number) => {
        console.log(`Edit album with ID: ${albumId}`);
        // Implement your edit logic here
    };

    // Handler for deleting an album
    const handleDeleteAlbum = (albumId: number) => {
        const newAlbums = albums.filter((album) => album.id !== albumId);
        setAlbums(newAlbums);
        console.log(`Deleted album with ID: ${albumId}`);
        // Implement your delete logic here (e.g., make an API call)
    };

    // Handler for updating album data
    const handleUpdateAlbum = (albumId: number, updatedFields: Partial<Album>) => {
        const updatedAlbums = albums.map((album) =>
            album.id === albumId ? { ...album, ...updatedFields } : album
        );
        setAlbums(updatedAlbums);
        console.log(`Updated album with ID: ${albumId}`, updatedFields);
        // Implement your update logic here (e.g., make an API call)
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Explore Albums</h1>

            {/* Display album cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {albums.map((album) => (
                    <AlbumCard
                        key={album.id}
                        album={album}
                        onEdit={() => handleEditAlbum(album.id)}
                        onDeleteAlbum={handleDeleteAlbum}
                        onUpdateAlbum={handleUpdateAlbum}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;
