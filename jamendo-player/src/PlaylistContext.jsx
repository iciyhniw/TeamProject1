import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState([]);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
    const [trackToAdd, setTrackToAdd] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            fetchPlaylists();
        }
    }, [auth.currentUser]);

    const fetchPlaylists = async () => {
        try {
            const q = query(collection(db, 'playlists'), where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlaylists(data);
        } catch (err) {
            console.error('Error fetching playlists:', err);
        }
    };

    const addTrackToPlaylist = async (playlistId, track) => {
        try {
            const playlistRef = doc(db, 'playlists', playlistId);
            const playlist = playlists.find(p => p.id === playlistId);
            
            if (!playlist) return;

            const updatedTracks = [...(playlist.tracks || []), track];
            
            await updateDoc(playlistRef, {
                tracks: updatedTracks
            });

            // Оновлюємо локальний стан
            setPlaylists(prevPlaylists => 
                prevPlaylists.map(p => 
                    p.id === playlistId 
                        ? { ...p, tracks: updatedTracks }
                        : p
                )
            );

            setIsAddToPlaylistModalOpen(false);
            setTrackToAdd(null);
        } catch (error) {
            console.error('Error adding track to playlist:', error);
        }
    };

    const value = {
        playlists,
        isAddToPlaylistModalOpen,
        setIsAddToPlaylistModalOpen,
        trackToAdd,
        setTrackToAdd,
        addTrackToPlaylist,
        fetchPlaylists
    };

    return (
        <PlaylistContext.Provider value={value}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
};

export { PlaylistContext };