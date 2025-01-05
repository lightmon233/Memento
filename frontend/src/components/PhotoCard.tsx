import React from 'react';
import { Photo } from '../types';
import { Comment } from '../types';

interface PhotoCardProps {
    photo: Photo;
    comments: Comment[];
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, comments }) => {

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Photo Thumbnail */}
            <div className="relative">
                <img
                    src={photo.url} // Assuming photo has a 'thumbnailUrl' field
                    alt={photo.title} // Assuming photo has a 'title' field
                    className="w-full h-56 object-cover"
                />
            </div>

            {/* Photo Title */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{photo.title}</h3>
            </div>

            {/* Display comments */}
            <div className="p-4">
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
    );
}

export default PhotoCard;