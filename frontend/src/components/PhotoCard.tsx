import React from 'react';
import { Photo } from '../types';
import { Comment } from '../types';

interface PhotoCardProps {
    photo: Photo;
    comments: Comment[];
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, comments }) => {

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-row w-full h-[280px]"> {/* 设置固定高度 */}
            {/* Photo Thumbnail with Link and Hover Effect */}
            <a 
                href={`/photos/${photo.id}`} 
                className="w-1/2 bg-indigo-300 flex-row"
            >
                <img
                    src={photo.url} // Assuming photo has a 'url' field
                    alt={photo.title} // Assuming photo has a 'title' field
                    className="object-cover size-full transition-transform duration-300 transform hover:scale-105"
                />
            </a>

            {/* Photo Content with Link and Hover Effect */}
            <div className="p-4 w-3/4 flex flex-col h-full">
                <a 
                    href={`/photos/${photo.id}`} 
                    className="block transition-all duration-300 hover:text-indigo-600"
                >
                    <h3 className="text-lg font-semibold text-gray-900 relative group">
                        {photo.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                </a>

                {/* Display userId and createdAt */}
                <div className="mt-2 text-sm text-gray-600">
                    <p><strong>User:</strong> {photo.userId}</p>
                    <p><strong>Created At:</strong> {new Date(photo.createdAt).toLocaleString()}</p>
                </div>

                {/* Display comments */}
                <div className="mt-4 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Comments:</h4>
                    <div>
                        {comments.slice(0, 3).map((comment, index) => (
                            <div key={comment.id} className="mb-2">
                                <p className="text-sm text-gray-600">
                                    <strong>{comment.userId}</strong>: {comment.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* If there are more than 3 comments, show a "See more" link */}
                    {comments.length > 3 && (
                        <a href={`/photos/${photo.id}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                            See more comments
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhotoCard;










