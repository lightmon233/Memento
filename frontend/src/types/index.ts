export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Album {
  id: number;
  title: string;
  description: string;
  category: Category;
  user: User;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  allowComments: boolean;
}

export interface Photo {
  id: number;
  title: string;
  url: string;
  album: Album;
  user: User;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user: User;
  photoId: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}