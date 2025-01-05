import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Album } from '../types';
import { Edit, Trash } from 'lucide-react';

export const AdminAlbumList: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);

    // 获取所有专辑
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get('/api/albums');
                setAlbums(response.data);
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        };

        fetchAlbums();
    }, []);

    // 删除专辑
    const handleDeleteAlbum = async (albumId: number) => {
        try {
            await axios.delete(`/api/albums/${albumId}`);
            setAlbums(albums.filter((album) => album.id !== albumId));
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-4">Album Management</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Album Title
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {albums.map((album) => (
                    <tr key={album.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {album.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => handleDeleteAlbum(album.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
