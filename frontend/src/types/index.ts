export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Album {
  id: number;
  title: string;
  description: string;
  category: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: number;
  title: string;
  url: string;
  albumId: number;
  userId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  photoId: number;
  userId: number;
  username: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}