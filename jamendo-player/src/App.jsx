import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import './styles/CommonFile.css'
import Profile from "./pages/Profile";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import Library from './pages/Library';
import PlaylistPage from './pages/PlaylistPage';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './components/AuthContext';
import { PlaylistProvider } from './PlaylistContext';

const App = () => {
    const [user, setUser] = useState(null); // 🔹 Додаємо стан користувача

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // 🔄 оновлення користувача при вході/виході
        });

        return () => unsubscribe(); // очистка слухача
    }, []);
    return(
        <Router>
            <AuthProvider>
                <PlaylistProvider>
                    <div className="app">
                        <Navbar user={user} />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                        <AddToPlaylistModal />
                    </div>
                </PlaylistProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;