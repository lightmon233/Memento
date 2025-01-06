import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types';
import { Image, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AlbumCardProps {
    album: Album;
    onEdit?: () => void;
    onDeleteAlbum: (albumId: number) => void;
    onUpdateAlbum: (albumId: number, updatedFields: Partial<Album>) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onEdit, onDeleteAlbum, onUpdateAlbum }) => {
    // 使用状态来控制 isPublic 和 allowComments
    const [isPublic, setIsPublic] = useState(album.isPublic ?? false);  // 如果是 undefined 则默认为 false
    // 防止 undefined

    const [allowComments, setAllowComments] = useState(album.allowComments);
    useEffect(() => {
        setIsPublic(album.isPublic);
        setAllowComments(album.allowComments);
    }, [album]);

    // 切换 isPublic 状态
    const toggleIsPublic = () => {
        setIsPublic((prevIsPublic) => {
            const newIsPublic = !prevIsPublic;  // 使用最新的 prevIsPublic 更新状态

            onUpdateAlbum(album.id, { isPublic: newIsPublic });  // 更新父组件
            return newIsPublic;  // 返回更新后的值
        });
    };


    // 切换 allowComments 状态
    const toggleAllowComments = () => {
        const newAllowComments = !allowComments;

        setAllowComments(newAllowComments);
        onUpdateAlbum(album.id, { allowComments: newAllowComments }); // 调用更新专辑的函数
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{album.title}</h3>
                    <div className="flex items-center space-x-1">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="p-1 text-gray-500 hover:text-gray-700"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAlbum(album.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{album.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{album.category.name}</span>
                    <span>{format(new Date(album.createdAt), 'MMM d, yyyy')}</span>
                </div>
            </div>

            {/* Display and toggle isPublic */}
            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500">
                <span>Public: </span>
                <button
                    onClick={toggleIsPublic}
                    className={`px-2 py-1 text-sm font-medium ${isPublic ? 'text-green-500' : 'text-gray-500'} hover:text-gray-700`}
                >
                    {isPublic ? 'Yes' : 'No'}
                </button>
            </div>

            {/* Display and toggle allowComments */}
            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500">
                <span>Allow Comments: </span>
                <button
                    onClick={toggleAllowComments}
                    className={`px-2 py-1 text-sm font-medium ${allowComments ? 'text-green-500' : 'text-gray-500'} hover:text-gray-700`}
                >
                    {allowComments ? 'Yes' : 'No'}
                </button>
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
