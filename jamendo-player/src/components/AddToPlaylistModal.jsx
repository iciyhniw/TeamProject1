import React from 'react';
import { usePlaylist } from '../PlaylistContext';
import '../styles/AddToPlaylistModal.css';

const AddToPlaylistModal = () => {
    const { 
        playlists, 
        addTrackToPlaylist, 
        isAddToPlaylistModalOpen, 
        trackToAdd, 
        setIsAddToPlaylistModalOpen 
    } = usePlaylist();

    if (!isAddToPlaylistModalOpen || !trackToAdd) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Додати "{trackToAdd.name}" до плейлиста</h2>
                <div className="playlists-list">
                    {playlists.length > 0 ? (
                        playlists.map(playlist => (
                            <div key={playlist.id} className="playlist-item">
                                <span className="playlist-name">{playlist.name}</span>
                                <button 
                                    className="add-button"
                                    onClick={() => addTrackToPlaylist(playlist.id, trackToAdd)}
                                >
                                    Додати
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-playlists">У вас ще немає плейлистів</p>
                    )}
                </div>
                <button 
                    className="close-button"
                    onClick={() => setIsAddToPlaylistModalOpen(false)}
                >
                    Закрити
                </button>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;