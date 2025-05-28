import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AudioPlayer from '../components/AudioPlayer'; // Твій аудіоплеєр, як у Home
import '../styles/Library.css';
import { onAuthStateChanged } from 'firebase/auth';

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [showLikedSongs, setShowLikedSongs] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPlaylists();
        fetchLikedSongs();
      } else {
        navigate('/profile'); // редірект на сторінку входу
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  const fetchPlaylists = async () => {
    try {
      const q = query(collection(db, 'playlists'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylists(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLikedSongs = async () => {
    try {
      const songsCollection = collection(db, 'likedSongs', auth.currentUser.uid, 'songs');
      const snapshot = await getDocs(songsCollection);
      const liked = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLikedSongs(liked);
    } catch (err) {
      console.error(err);
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


  

  return (
    <div className="library-page with-audio-player">
      <h1>Your Library</h1>

      <button className="liked-songs-btn" onClick={() => setShowLikedSongs(!showLikedSongs)}>
        {showLikedSongs ? 'Hide Liked Songs' : 'Show Liked Songs'}
      </button>

      {showLikedSongs && (
        likedSongs.length > 0 ? (
          <div className="track-grid">
            {likedSongs.map(song => (
              <div
                key={song.id}
                className={`track-card ${selectedTrack?.id === song.id ? 'selected' : ''}`}
                onClick={() => setSelectedTrack(song)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="track-image"
                />
                <div className="track-info">
                  <p className="track-name">{song.name}</p>
                  <p className="track-artist">{song.artist_name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No liked songs yet.</p>
        )
      )}

      <h2>Playlists</h2>
          <div className="library-header">
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

      <div className="playlists-grid">
        {playlists.map(pl => (
          <Link key={pl.id} to={`/playlist/${pl.id}`} className="playlist-card">
            <h3>{pl.name}</h3>
            <p>{pl.tracks?.length || 0} tracks</p>
          </Link>
        ))}
      </div>
      <div className="audio-player-wrapper">
        <AudioPlayer track={selectedTrack} />
      </div>
    </div>
  );
};

export default Library;
