import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AlbumList } from './pages/AlbumList';
import { PhotoView } from './pages/PhotoView';
import { AdminDashboard } from './pages/AdminDashboard';
import { PhotoGridView } from './pages/PhotoGridView.tsx';
import { Explore } from './pages/Explore.tsx';
import { Profile } from './pages/Profile.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/photos/:id" element={<PhotoView />} />
            <Route path="/albums/:id" element={<PhotoGridView />}></Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={<AlbumList />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;