import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
};

export const albumApi = {
  getAlbums: () => api.get('/albums'),
  getAlbum: (id: number) => api.get(`/albums/${id}`),
  createAlbum: (data: { title: string; description: string; category: string }) =>
    api.post('/albums', data),
  updateAlbum: (id: number, data: { title: string; description: string; category: string }) =>
    api.put(`/albums/${id}`, data),
  deleteAlbum: (id: number) => api.delete(`/albums/${id}`),
};

export const photoApi = {
  getPhotos: (albumId: number) => api.get(`/albums/${albumId}/photos`),
  getPhoto: (id: number) => api.get(`/photos/${id}`),
  uploadPhoto: (albumId: number, data: FormData) =>
    api.post(`/albums/${albumId}/photos`, data),
  deletePhoto: (id: number) => api.delete(`/photos/${id}`),
};

export const commentApi = {
  getComments: (photoId: number) => api.get(`/photos/${photoId}/comments`),
  addComment: (photoId: number, content: string) =>
    api.post(`/photos/${photoId}/comments`, { content }),
  deleteComment: (id: number) => api.delete(`/comments/${id}`),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  createCategory: (data: { name: string; description: string }) =>
    api.post('/categories', data),
  updateCategory: (id: number, data: { name: string; description: string }) =>
    api.put(`/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
};