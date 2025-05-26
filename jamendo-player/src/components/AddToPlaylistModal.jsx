import { useContext } from 'react';
import { PlaylistContext } from '../PlaylistContext';

const AddToPlaylistModal = () => {
    const { playlists, addTrackToPlaylist, isAddToPlaylistModalOpen, trackToAdd, closeAddToPlaylistModal } = useContext(PlaylistContext);

    if (!isAddToPlaylistModalOpen || !trackToAdd) return null;

    return (
        <div className="modal">
            <h2>Add "{trackToAdd.name}" to playlist</h2>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        {playlist.name}
                        <button onClick={() => {
                            addTrackToPlaylist(playlist.id, trackToAdd);
                            closeAddToPlaylistModal();
                        }}>Add</button>
                    </li>
                ))}
            </ul>
            <button onClick={closeAddToPlaylistModal}>Cancel</button>
        </div>
    );
};

export default AddToPlaylistModal;