import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import '../styles/PlaylistPage.css';

const PlaylistPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        fetchPlaylist();
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

    const handleRemoveTrack = async (trackId) => {
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
            }
        } catch (error) {
            setError('Failed to remove track: ' + error.message);
        }
    };

    const handlePlayTrack = (track) => {
        // Implement track playing functionality
        console.log('Playing track:', track);
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
            </div>

            <div className="tracks-container">
                {playlist.tracks?.length > 0 ? (
                    <div className="tracks-list">
                        {playlist.tracks.map((track, index) => (
                            <div key={track.id} className="track-item">
                                <div className="track-info" onClick={() => handlePlayTrack(track)}>
                                    <span className="track-number">{index + 1}</span>
                                    <div className="track-details">
                                        <h3>{track.title}</h3>
                                        <p>{track.artist}</p>
                                    </div>
                                </div>
                                <button
                                    className="remove-track-button"
                                    onClick={() => handleRemoveTrack(track.id)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-playlist">
                        <p>This playlist is empty</p>
                        <button onClick={() => navigate('/search')} className="add-tracks-button">
                            Add Tracks
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistPage;
