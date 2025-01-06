import React, { useState, useEffect } from 'react';
import { PhotoCard } from '../components/PhotoCard';  // Import the PhotoCard component
import { Photo } from '../types';  // Assuming you have a Photo type defined
import { Comment } from '../types';  // Assuming you have a Comment type defined

export const Explore = () => {
    // State to hold the list of photos
    const [photos, setPhotos] = useState<Photo[]>([]);

    // Fetch photos from a data source (could be an API or mock data)
    useEffect(() => {
        const fetchPhotos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found!");
                return;
            }

            try {
                const response = await fetch('/api/photos/public/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setPhotos(data); // Assume the response includes an array of photos
            } catch (error) {
                console.error("Failed to fetch public photos:", error);
            }
        };

        fetchPhotos();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Explore Photos</h1>

            {/* Display photo cards in a single column */}
            <div className="grid grid-cols-1 gap-6">
                {photos.map((photo) => {
                    console.log(photo.comments);
                    return (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            comments={photo.comments ?? []}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Explore;

