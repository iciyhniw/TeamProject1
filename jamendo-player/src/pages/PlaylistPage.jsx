import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    getDocs
} from 'firebase/firestore';
import AudioPlayer from '../components/AudioPlayer'; // Твій аудіоплеєр
import '../styles/PlaylistPage.css';

const PlaylistPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [likedSongs, setLikedSongs] = useState([]);
    const [showLikedSongs, setShowLikedSongs] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchPlaylist();
                fetchLikedSongs(user.uid);
            } else {
                setError('User not authenticated');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [playlistId]);

    const fetchPlaylist = async () => {
        try {
            const playlistDoc = await getDoc(doc(db, 'playlists', playlistId));
            if (playlistDoc.exists()) {
                setPlaylist(playlistDoc.data());
            } else {
                setError('Playlist not found');
            }
        } catch (error) {
            setError('Failed to fetch playlist: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedSongs = async (uid) => {
        try {
            const songsCollection = collection(db, 'likedSongs', uid, 'songs');
            const snapshot = await getDocs(songsCollection);
            const liked = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLikedSongs(liked);
        } catch (err) {
            console.error('Error fetching liked songs:', err);
        }
    };

    const handleAddTrack = async (song) => {
        if (!playlist?.tracks) return;

        const alreadyAdded = playlist.tracks.some(track => track.id === song.id);
        if (alreadyAdded) return alert('Track already in playlist');

        try {
            const playlistRef = doc(db, 'playlists', playlistId);
            await updateDoc(playlistRef, {
                tracks: arrayUnion(song)
            });
            setPlaylist(prev => ({
                ...prev,
                tracks: [...(prev.tracks || []), song]
            }));
        } catch (error) {
            console.error('Failed to add track:', error);
            setError('Failed to add track: ' + error.message);
        }
    };

    const handleRemoveTrack = async (trackId) => {
        if (!playlist?.tracks) return;

        try {
            const playlistRef = doc(db, 'playlists', playlistId);
            const trackToRemove = playlist.tracks.find(track => track.id === trackId);

            if (trackToRemove) {
                await updateDoc(playlistRef, {
                    tracks: arrayRemove(trackToRemove)
                });

                setPlaylist(prev => ({
                    ...prev,
                    tracks: prev.tracks.filter(track => track.id !== trackId)
                }));

                if (selectedTrack?.id === trackId) {
                    setSelectedTrack(null);
                }
            }
        } catch (error) {
            setError('Failed to remove track: ' + error.message);
        }
    };

    const handlePlayTrack = (track) => {
        setSelectedTrack(track);
    };

    if (loading) {
        return (
            <div className="playlist-page loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlist-page error">
                <div className="error-message">{error}</div>
                <button onClick={() => navigate('/library')} className="back-button">
                    Back to Library
                </button>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-page not-found">
                <h2>Playlist not found</h2>
                <button onClick={() => navigate('/library')} className="back-button">
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="playlist-page">
            <div className="playlist-header">
                <button onClick={() => navigate('/library')} className="back-button">
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <div className="playlist-info">
                    <div className="playlist-icon">
                        <i className="fas fa-music"></i>
                    </div>
                    <div className="playlist-details">
                        <h1>{playlist.name}</h1>
                        <p>{playlist.tracks?.length || 0} tracks</p>
                    </div>
                </div>
                <button onClick={() => setShowLikedSongs(prev => !prev)} className="add-tracks-button">
                    {showLikedSongs ? 'Hide Liked Songs' : 'Add Tracks from Liked'}
                </button>
            </div>

            {showLikedSongs && (
                <div className="liked-songs-list">
                    <h3>Liked Songs</h3>
                    <div className="tracks-list">
                        {likedSongs
                            .filter(song => !playlist.tracks.some(track => track.id === song.id))
                            .map(song => (
                                <div key={song.id} className="track-item">
                                    <div className="track-info">
                                        <img src={song.image || '/default-song.jpg'} alt={song.name} className="track-image" />
                                        <div className="track-text">
                                            <h4>{song.name}</h4>
                                            <p>{song.artist_name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAddTrack(song)} className="add-track-button" title="Add track">
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div className="tracks-container">
                {playlist.tracks?.length > 0 ? (
                    <div className="tracks-list">
                        {playlist.tracks.map((track, index) => (
                            <div key={track.id} className={`track-item ${selectedTrack?.id === track.id ? 'selected' : ''}`}>
                                <div className="track-info" onClick={() => handlePlayTrack(track)} style={{cursor: 'pointer'}}>
                                    <span className="track-number">{index + 1}</span>
                                    <div className="track-details">
                                        <img src={track.image || '/default-song.jpg'} alt={track.name || track.title} className="track-image" />
                                        <div className="track-text">
                                            <h3>{track.title || track.name}</h3>
                                            <p>{track.artist || track.artist_name}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="remove-track-button"
                                    onClick={() => handleRemoveTrack(track.id)}
                                    title="Remove track"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-playlist">
                        <p>This playlist is empty</p>
                    </div>
                )}
            </div>

            {/* Аудіоплеєр внизу сторінки */}
            <AudioPlayer track={selectedTrack} />
        </div>
    );
};

export default PlaylistPage;
