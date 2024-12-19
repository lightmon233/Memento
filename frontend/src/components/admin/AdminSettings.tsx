import React, { useState } from 'react';
import axios from 'axios';

export const AdminSettings: React.FC = () => {
    const [siteTitle, setSiteTitle] = useState<string>('');
    const [siteDescription, setSiteDescription] = useState<string>('');

    // 获取当前设置
    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/settings');
            setSiteTitle(response.data.title);
            setSiteDescription(response.data.description);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    // 更新设置
    const handleSaveSettings = async () => {
        try {
            await axios.put('/api/settings', { title: siteTitle, description: siteDescription });
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-4">Site Settings</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Site Title</label>
                <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Site Description</label>
                <textarea
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                />
            </div>
            <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
                Save Settings
            </button>
        </div>
    );
};
