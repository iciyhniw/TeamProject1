import { createContext, useState } from 'react';

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState([]);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
    const [trackToAdd, setTrackToAdd] = useState(null);

    const createPlaylist = (name, iconFile) => {
        const iconUrl = `/icons/${iconFile.name}`; // Simulate icon upload
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            iconUrl,
            tracks: [],
        };
        setPlaylists([...playlists, newPlaylist]);
    };

    const addTrackToPlaylist = (playlistId, track) => {
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === playlistId) {
                if (!playlist.tracks.some(t => t.id === track.id)) {
                    return { ...playlist, tracks: [...playlist.tracks, track] };
                }
            }
            return playlist;
        }));
    };

    const openAddToPlaylistModal = (track) => {
        setTrackToAdd(track);
        setIsAddToPlaylistModalOpen(true);
    };

    const closeAddToPlaylistModal = () => {
        setIsAddToPlaylistModalOpen(false);
        setTrackToAdd(null);
    };

    return (
        <PlaylistContext.Provider value={{
            playlists,
            createPlaylist,
            addTrackToPlaylist,
            isAddToPlaylistModalOpen,
            trackToAdd,
            openAddToPlaylistModal,
            closeAddToPlaylistModal,
        }}>
            {children}
        </PlaylistContext.Provider>
    );
};