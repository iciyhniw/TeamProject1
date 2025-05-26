import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import '../styles/Library.css';

const Library = () => {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser) {
            fetchPlaylists();
        }
    }, []);

    const fetchPlaylists = async () => {
        if (!auth.currentUser) return;

        try {
            const playlistsRef = collection(db, 'playlists');
            const q = query(playlistsRef, where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const playlistsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setPlaylists(playlistsData);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError('Failed to load playlists');
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            setError('Please log in to create playlists');
            return;
        }

        if (!newPlaylistName.trim()) {
            setError('Please enter a playlist name');
            return;
        }

        try {
            const playlistsRef = collection(db, 'playlists');
            await addDoc(playlistsRef, {
                name: newPlaylistName,
                userId: auth.currentUser.uid,
                tracks: [],
                createdAt: new Date().toISOString()
            });

            setNewPlaylistName('');
            setIsCreating(false);
            fetchPlaylists();
        } catch (error) {
            console.error('Error creating playlist:', error);
            setError('Failed to create playlist');
        }
    };

    const handleLogin = () => {
        navigate('/profile');
    };

    if (!auth.currentUser) {
        return (
            <div className="library-page">
                <div className="library-container">
                    <div className="library-header">
                        <h1>Your Library</h1>
                    </div>
                    <div className="auth-message">
                        <h2>Sign in to create and manage your playlists</h2>
                        <p>Create playlists to organize your favorite tracks and listen to them anytime.</p>
                        <button className="login-button" onClick={handleLogin}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="library-page">
            <div className="library-container">
                <div className="library-header">
                    <h1>Your Library</h1>
                    {!isCreating ? (
                        <button 
                            className="create-playlist-button"
                            onClick={() => setIsCreating(true)}
                        >
                            Create Playlist
                        </button>
                    ) : (
                        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
                            <input
                                type="text"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                placeholder="Enter playlist name"
                                className="playlist-name-input"
                            />
                            <div className="form-buttons">
                                <button type="submit" className="submit-button">
                                    Create
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewPlaylistName('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="playlists-grid">
                    {playlists.map((playlist) => (
                        <Link 
                            to={`/playlist/${playlist.id}`} 
                            key={playlist.id}
                            className="playlist-card"
                        >
                            <div className="playlist-image">
                                <div className="playlist-icon">
                                    <i className="fas fa-music"></i>
                                </div>
                            </div>
                            <div className="playlist-info">
                                <h3>{playlist.name}</h3>
                                <p>{playlist.tracks?.length || 0} tracks</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {playlists.length === 0 && !isCreating && (
                    <div className="no-playlists">
                        <p>You don't have any playlists yet</p>
                        <button 
                            className="create-first-playlist"
                            onClick={() => setIsCreating(true)}
                        >
                            Create your first playlist
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;