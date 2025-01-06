import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 如果用户没有认证，显示一个提示
    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    if (!user) {
        return <div>User is Null.</div>;
    }

    const handleAdminRedirect = () => {
        navigate('/admin');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>

            <div className="space-y-4">
                <div>
                    <strong>Username:</strong> {user.username}
                </div>
                <div>
                    <strong>Email:</strong> {user.email}
                </div>
                <div>
                    <strong>Role:</strong> {user.role}
                </div>
                <div>
                    <strong>Account Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* 如果角色是 ADMIN，显示按钮跳转到 /admin */}
            {user.role === 'ADMIN' && (
                <div className="mt-4">
                    <button
                        onClick={handleAdminRedirect}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go to Admin Panel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;

