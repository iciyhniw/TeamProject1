import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistContext } from '../PlaylistContext';

const Library = () => {
    const { playlists, createPlaylist } = useContext(PlaylistContext);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [iconFile, setIconFile] = useState(null);
    const navigate = useNavigate();

    const handleCreatePlaylist = () => {
        if (playlistName && iconFile) {
            createPlaylist(playlistName, iconFile);
            setPlaylistName('');
            setIconFile(null);
            setShowCreateForm(false);
        }
    };

    return (
        <div className="library-page">
            <h1>Library</h1>
            <button onClick={() => setShowCreateForm(true)}>Create New Playlist</button>
            {showCreateForm && (
                <div className="create-playlist-form">
                    <input
                        type="text"
                        placeholder="Playlist Name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) => setIconFile(e.target.files[0])}
                    />
                    <button onClick={handleCreatePlaylist}>Create</button>
                    <button onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
            )}
            <div className="playlists">
                {playlists.map(playlist => (
                    <div
                        key={playlist.id}
                        className="playlist-item"
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                        <img src={playlist.iconUrl} alt={playlist.name} />
                        <p>{playlist.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;